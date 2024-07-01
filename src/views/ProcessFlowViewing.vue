
<template>
    
    <div class="row shadow mx-auto bg-light p-1">
        <div class="col-11">
        </div>
        <div class="col-1 float-end">
            <button class="btn btn-outline-dark btn-sm float-end" id="delete" @click="DestroyFlow(flow_main_id)" :disabled="flow_status === 'Posted'">
                <span class="material-symbols-outlined align-bottom">
                    delete
                </span>
            </button> 
        </div>
        <div class="col-1 p-1">
            <label for="">Flow ID:</label>
            <input type="text" class="form-control" v-model="flow_main_id" disabled>
        </div>
        <div class="col-1 p-1">
            <label for="" class="fs-6">Flow Type:</label>
            <select name="" id="" class="form-select" v-model="flow_type" disabled>
                <option value="Manual">Manual</option>
                <option value="Auto">Auto</option>
            </select>
        </div>
        <div class="col-2 p-1">
            <label for="" class="fs-6">Section:</label>
            <select name="" id="" class="form-select" v-model="section_id" disabled>
                <template v-for="s in section">
                    <option :value="s.section_id">{{ s.section_code }}</option>
                </template>
            </select>
        </div>
        <div class="col-2 p-1">
            <label for="" class="fs-6">Item Code:</label>
            <input type="text" class="form-control" v-model="item_code" disabled>
        </div>
        <div class="col-2 p-1">
            <label for="" class="fs-6">Item Parts Number:</label>
            <input type="text" class="form-control" v-model="item_parts_number" disabled>
        </div>
        <div class="col-2 p-1">
            <label for="" class="fs-6">Item Description:</label>
            <input type="text" class="form-control" v-model="item_description" disabled>
        </div>
        <div class="col-2 p-1">
            <label for="" class="fs-6">Date Encoded:</label>
            <input type="text" class="form-control" v-model="date_encoded" disabled>
        </div>
        <div class="col-2 p-1">
            <label for="flow_status" class="fs-6">Flow Status:</label>
            <select id="flow_status" class="form-select" v-model="flow_status" @change="posting" :disabled="flow_status === 'Posted' ? true : false">
                <option value="Posted">Posted</option>
                <option value="Unposted">Unposted</option>
            </select>
        </div>
        <div class="col-2 p-1">
            <label for="" class="fs-6">Revision Number:</label>
            <input type="text" class="form-control" v-model="revision_number" disabled>
        </div>
        <div class="col-2 p-1">
            <label for="" class="fs-6">Encoded By:</label>
            <input type="text" class="form-control" v-model="encoded_by" disabled>
        </div>
        <div class="col-6 p-1">
            <label for="" class="fs-6">Remarks:</label>
            <textarea  name="" id="" class="form-control" v-model="remarks" disabled></textarea>
        </div>
       <div class="float-end">
        <button class="btn btn-outline-dark btn-sm float-end m-2" id="fs" @click="fetchMissingSub" data-bs-target="#fetchMissingSub" data-bs-toggle="modal" :disabled="flow_status === 'Posted'">
            Fetch Missing Sub
            <span class="material-symbols-outlined align-bottom">
                rule
            </span>
        </button> 
        <button class="btn btn-outline-dark btn-sm float-end m-2" id="ro" @click="setReorder" data-bs-target="#reorder" data-bs-toggle="modal" :disabled="flow_status === 'Posted'">
            Reorder
            <span class="material-symbols-outlined align-bottom">
                sync
            </span>
        </button> 
       </div>
    </div>
   <div class="position-relative" v-if="loader">
    <div class="mx-auto position-absolute top-50 start-50">
        <div class="spinner-grow" role="status">
            <span class="sr-only"></span>
        </div>
        <div class="spinner-grow" role="status">
          <span class="sr-only"></span>
        </div>
        <div class="spinner-grow" role="status">
          <span class="sr-only"></span>
        </div>
    </div>
   </div>
    <div class="row mx-auto border shadow-lg" v-else>
        <div class="table-responsive col-4 shadow-lg bg-light">
            <span class="badge text-bg-dark">Key Count - {{key.length}}</span>
            <table class="table rounded">
                <thead>
                    <tr>
                        <th>Seq. No.</th>
                        <th>Op. No.</th>
                        <th>Section</th>
                        <th>Key Code</th>
                        <th>Key Process</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                  <template v-for="(k,index) in key" :key="k.Pid">
                    <tr @dblclick="editKey(k.Pid)">
                        <td>{{ k.sequence_number }}</td>
                        <td>
                            <input v-if="k.keyEditable" type="number" class="form-control" v-model="k.operation_number" @keyup.enter="updateKey(k.Pid, k.sequence_number)">
                            <input v-if="k.operation_number === '' || k.Pid === ''" type="number" class="form-control" v-model="k.operation_number">
                            <p v-if="!k.keyEditable">{{ k.operation_number }}</p>
                        </td>
                        <td>
                            <select v-if="k.section_id === ''" v-model="k.section_id" class="form-select" @change="selectSection(k.sequence_number)">
                                <template v-for="s in sectionOptions">
                                    <option :value="s.section_id">{{ s.section_code }}</option>
                                </template>
                            </select>
                            <p v-else>{{ k.section_code }}</p>
                        </td>
                        <td>{{ k.key_code }}</td>
                        <td>
                            <select v-if="k.Pid === ''" v-model="k.Pid" class="form-select" @change="selectKey(k.sequence_number, k.Pid)">
                                <template v-for="key in keyProcessOptions">
                                    <option v-if="k.section_id === key.section_id" :value="key.Pid">{{ key.Pname }}</option>
                                </template>
                            </select>
                            <p v-else>{{ k.Pname }}</p>
                        </td>
                        <td></td>
                        <td>
                            <button class="btn btn-sm btn-outline-dark" @click="removeKey(index, k.Pid, k.sequence_number)" :disabled="flow_status === 'Posted'">
                                <span class="material-symbols-outlined fs-6">
                                    close
                                </span>
                            </button>
                        </td>
                    </tr>
                    <tr v-if="k.keyEditable">
                        <td colspan="8">
                           <div class="row">
                            <div class="col">
                                <p>Standard Time</p>
                                <p>{{ k.standard_time }}</p>
                            </div>
                            <div class="col">
                                <p>Machine Time</p>
                                <p>{{ k.machine_time }}</p>
                            </div>
                           </div>
                        </td>
                    </tr>
                  </template>
                    <tr>
                        <td colspan="5"></td>
                        <td colspan="2">
                            <button id="addProcess" class="btn btn-outline-dark btn-sm w-100 shadow" @click="addKey" :disabled="flow_status === 'Posted'">
                                <span class="material-symbols-outlined">
                                    add
                                </span>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="table-responsive col-8 shadow-lg bg-light">
            <span class="badge text-bg-dark">Sub Count - {{sub.length}}</span>
            <span class="badge text-bg-dark">Condition Count - {{condition_count}}</span>
            <table class="table rounded">
                <thead>
                    <tr>
                        <th>Seq. No.</th>
                        <th>Parent</th>
                        <th>Key Code</th>
                        <th>Sub Process</th>
                        <th>Sampling</th>
                        <th>Uncontrolled Quantity</th>
                        <th>With Quantity</th>
                        <th>Batching Type</th>
                        <th>Result Type</th>
                        <th>Standard Time</th>
                        <th>Machine Time</th>
                        <th>Status</th>
                        <th>TPC Status</th>
                        <th>Edit</th>
                        <th>View</th>
                        <th>Hidden</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="(s, index) in sub">
                        <tr v-show="!editToggle['Sub-'+s.SubPid+'-'+s.sequence_number] && s.hidden === 0" :class="s.hasMissingData === true ? 'table-danger' : 'table-light'">
                            <td>{{ s.sequence_number }}</td>
                            <td>{{ s.parent_sequence }}</td>
                            <td>{{ s.key_code }}</td>
                            <td>{{ s.SubPname }}</td>
                            <td>
                                {{ s.check_sampling === 'True' ? 'With Sampling' : 'Without Sampling' }}
                            </td>
                            <td>
                                {{ s.check_uncontrolled === 'True' ? 'Uncontrolled Quantity' : 'Controlled Quantity' }}
                            </td>
                            <td>
                                {{ s.with_quantity === 1 ? 'With Quantity' : 'Without Quantity' }}
                            </td>
                            <td>{{ s.batching_type }}</td>
                            <td>{{ s.result_type }}</td>
                            <td>{{ s.standard_time }}</td>
                            <td>{{ s.machine_time }}</td>
                            <td>
                                <small :class="s.sub_status === 'Active' ? 'badge text-bg-success':'badge text-bg-secondary'">
                                    {{ s.sub_status }}
                                </small>
                            </td>
                            <td>{{ s.status }}</td>
                            <td>
                                <button :class="flow_status === 'Posted' ? 'btn btn-sm disabled' : 'btn btn-sm'" @click="ToggleEdit('Sub-'+s.SubPid+'-'+s.sequence_number)" :disabled="flow_status === 'Posted'">
                                    <span class="material-symbols-outlined fs-6">
                                        edit
                                    </span>
                                </button>
                            </td>
                            <td>
                                <button class="btn btn-sm" @click="ToggleView('Sub-'+s.SubPid+'-'+s.sequence_number)">
                                    <span class="material-symbols-outlined fs-6">
                                        {{ viewToggle['Sub-'+s.SubPid+'-'+s.sequence_number] === true ? 'expand_less' : 'expand_more' }}
                                    </span>
                                </button>
                            </td>
                            <td>
                                <input :id="'hide-'+s.SubPid" type="checkbox" :disabled="s.sub_status === 'Active'" @change="hideSubs(s.SubPid)">
                            </td>
                        </tr>
                        <tr v-if="editToggle['Sub-'+s.SubPid+'-'+s.sequence_number] && s.hidden === 0">
                            <td colspan="16">
                                <div class="row p-3 shadow border border-1 border-success rounded">
                                    <div class="col-md-10">
                                        <p class="fs-5">{{ s.sequence_number }}. {{ s.SubPname }}</p>
                                    </div>
                                    <div class="col-md-1">
                                        <button class="btn btn-outline-dark btn-sm float-end w-100" @click="ToggleView('Sub-'+s.SubPid+'-'+s.sequence_number)">
                                            <span class="material-symbols-outlined fs-5 text-dark align-bottom">
                                                expand_more
                                            </span>
                                        </button>
                                    </div>
                                    <div class="col-md-1">
                                        <button class="btn btn-sm float-end w-100" @click="UntoggleEdit('Sub-'+s.SubPid+'-'+s.sequence_number)">
                                            <span class="material-symbols-outlined fs-5 text-dark align-bottom">
                                                close
                                            </span>
                                        </button>
                                    </div>
                                    <div class="col-3 p-1 rounded">
                                        <div class="shadow p-3 rounded">
                                            <label class="form-check-label" :for="'sampling'+s.sequence_number">{{ s.check_sampling === 'False' ? 'Without Sampling' : 'With Sampling' }}</label>
                                            <div class="form-check form-switch float-end">
                                              <input class="form-check-input" type="checkbox" role="switch" :id="'sampling'+s.sequence_number" :checked="s.check_sampling === 'False' ? false : true" @change="checkSampling(s.SubPid, s.sequence_number)">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-3 p-1 rounded">
                                        <div class="shadow p-3 rounded">
                                            <label class="form-check-label" :for="'uncontrolled'+s.sequence_number">{{ s.check_uncontrolled === 'False' ? 'Controlled Quantity' : 'Uncontrolled Quantity' }}</label>
                                            <div class="form-check form-switch float-end">
                                              <input class="form-check-input" type="checkbox" role="switch" :id="'uncontrolled'+s.sequence_number" :checked="s.check_uncontrolled === 'False' ? false : true" @change="checkUncontrolled(s.SubPid, s.sequence_number)">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-3 p-1 rounded">
                                        <div class="shadow p-3 rounded">
                                            <label class="form-check-label" :for="'quantity'+s.sequence_number">{{ s.with_quantity === 1 ? 'With Quantity' : 'Without Quantity' }}</label>
                                            <div class="form-check form-switch float-end">
                                              <input class="form-check-input" type="checkbox" role="switch" :id="'quantity'+s.sequence_number" :checked="s.with_quantity === 1 ? true : false" @change="checkQuantity(s.SubPid, s.sequence_number)">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-3 p-1 rounded">
                                        <div class="shadow p-3 rounded">
                                            <label class="form-check-label" :for="'sub_status'+s.sequence_number">{{ s.sub_status === 'Active' ? 'Active' : 'Inactive' }} <div :class="s.sub_status === 'Active' ? 'rounded p-1 bg-success' : 'rounded p-1 bg-secondary'"></div></label>
                                            <div class="form-check form-switch float-end">
                                              <input class="form-check-input" type="checkbox" role="switch" :id="'sub_status'+s.sequence_number" :checked="s.sub_status === 'Active' ? true : false" @change="checkStatus(s.SubPid, s.sequence_number)">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-6 rounded p-1">
                                        <div class="shadow p-2 rounded">
                                            <label :for="'standard_time'+s.sequence_number" class="form-label">Standard Time</label>
                                            <input type="text" class="form-control" :id="'standard_time'+s.sequence_number" v-model="s.standard_time">
                                        </div>
                                    </div>
                                    <div class="col-6 rounded p-1">
                                        <div class="shadow p-2 rounded">
                                            <label :for="'machine_time'+s.sequence_number" class="form-label">Machine Time</label>
                                            <input type="text" class="form-control" :id="'machine_time'+s.sequence_number" v-model="s.machine_time">
                                        </div>
                                    </div>
                                    <div class="col-6 rounded p-1">
                                        <div class="shadow p-2 rounded">
                                            <label :for="'batching_type'+s.sequence_number" class="form-label">Batching Type</label>
                                            <select class="form-select" :id="'batching_type'+s.sequence_number" v-model="s.batching_type">
                                                <option value="Standard">Standard</option>
                                                <option value="Parallel">Parallel</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-6 rounded p-1">
                                        <div class="shadow p-2 rounded">
                                            <label :for="'result_type'+s.sequence_number" class="form-label">Result Type</label>
                                            <select class="form-select" :id="'result_type'+s.sequence_number" v-model="s.result_type">
                                                <option value="Wafer">Wafer</option>
                                                <option value="Chips">Chips</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-9"></div>
                                    <div class="col-md-1 p-2">
                                        <button class="btn btn-outline-dark btn-sm w-100" @click="hide(s.SubPid)" :disabled="s.sub_status==='Active'">
                                            Hide
                                            <span class="material-symbols-outlined fs-5 text-danger align-bottom">
                                                close
                                            </span>
                                        </button>
                                    </div>
                                    <div class="col-1 p-2">
                                        <select name="tpc_status" id="" class="form-select form-select-sm" v-model="s.status" :disabled="index === 0 ? true : false">
                                            <option value="Open">Open</option>
                                            <option value="Close">Close</option>
                                        </select>
                                    </div>
                                    <div class="col-1 p-2">
                                        <button class="btn btn-outline-dark btn-sm float-end w-100" :id="'btn-' + s.SubPid" @click="updateSubs(s.SubPid)">
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        
                        <tr v-if="viewToggle['Sub-'+s.SubPid+'-'+s.sequence_number]">
                            <td colspan="16">
                                <div class="row">
                                    <div class="col">
                                        <p>
                                            <small><b>Condition Count - {{s.condition_process_count}}</b></small>
                                        </p>
                                    </div>
                                    <div class="col">
                                        <button class="btn btn-sm float-end" @click="submitBySub(s.SubPid)" :disabled="flow_status === 'Posted'">
                                            <span class="material-symbols-outlined">
                                                save
                                            </span>
                                        </button>
                                        <button class="btn btn-sm float-end" @click="reFetchConditions(s.SubPid)" :disabled="flow_status === 'Posted'">
                                            <span class="material-symbols-outlined">
                                                refresh
                                            </span>
                                        </button>
                                    </div>
                                </div>
                                <div v-if="conditionLoader" class="row text-center p-5">
                                    <div class="mx-auto">
                                        <div class="spinner-grow" role="status">
                                          <span class="visually-hidden">Loading...</span>
                                        </div>
                                        <div class="spinner-grow" role="status">
                                          <span class="visually-hidden">Loading...</span>
                                        </div>
                                        <div class="spinner-grow" role="status">
                                          <span class="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                </div>
                                <div v-else class="table table-responsive border-1 border border-primary rounded shadow" >
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th>Seq. No.</th>
                                                <th>Parent</th>
                                                <th>Detail Description</th>
                                                <th>Typical Value</th>
                                                <th>Minimum Value</th>
                                                <th>Maximum Value</th>
                                                <th>Target Value Visibility</th>
                                                <th>Field Type</th>
                                                <th>Status</th>
                                                <th>Edit</th>
                                                <th>Save</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                          <template v-for="c in s.condition">
                                            <tr v-if="!editCondition[c.flow_condition_id]">
                                                <td>{{ c.sequence_number }}</td>
                                                <td>{{ c.parent_sequence }}</td>
                                                <td>{{ c.detail_description }}</td>
                                                <td class="text-center">{{ c.typical_value }}</td>
                                                <td class="text-center">{{ c.min_value }}</td>
                                                <td class="text-center">{{ c.max_value }}</td>
                                                <td>{{ c.visibility_status === 1 ? 'Visible' : 'Invisible'}}</td>
                                                <td>
                                                    {{ c.field_type }}
                                                </td>
                                                <td>
                                                    <span :class="c.condition_status === 'Active' ? 'badge text-bg-success': 'badge text-bg-secondary'">
                                                        {{ c.condition_status }}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button class="btn btn-sm btn-outline-dark" @click="editConditions(c)">
                                                        <span class="material-symbols-outlined fs-6">
                                                            edit
                                                        </span>
                                                    </button>
                                                </td>
                                                <td>
                                                    <button class="btn btn-sm btn-outline-success" disabled>
                                                        <span class="material-symbols-outlined fs-6">
                                                            check
                                                        </span>
                                                    </button>
                                                </td>
                                            </tr>
                                            <tr v-if="editCondition[c.flow_condition_id]">
                                                <td>{{ c.sequence_number }}</td>
                                                <td>{{ c.parent_sequence }}</td>
                                                <td>
                                                    <input type="text" class="form-control" v-model="c.detail_description">
                                                </td>
                                                <td>
                                                    <input type="text" class="form-control" v-model="c.typical_value">
                                                </td>
                                                <td>
                                                    <input type="text" class="form-control" v-model="c.min_value">
                                                </td>
                                                <td>
                                                    <input type="text" class="form-control" v-model="c.max_value">
                                                </td>
                                                <td>
                                                    <select name="" id="" class="form-select" v-model="c.visibility_status">
                                                        <option value="0">Invisible</option>
                                                        <option value="1">Visible</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <select name="" id="" class="form-select" v-model="c.field_type">
                                                        <template v-for="f in field_type_list">
                                                            <option :value="f">{{ f }}</option>
                                                        </template>
                                                    </select>
                                                </td>
                                                <td>
                                                    <div class="form-check form-switch">
                                                        <input class="form-check-input" type="checkbox" role="switch" :id="'checked - ' + c.flow_condition_id" :checked="c.condition_status === 'Active' ? true : false" @change="conditionSwitch(c)">
                                                        <label :class="c.condition_status === 'Active' ? 'badge text-bg-success' : 'badge text-bg-secondary'" for="">
                                                            {{c.condition_status}}
                                                        </label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <button class="btn btn-sm btn-outline-dark" disabled>
                                                        <span class="material-symbols-outlined fs-6">
                                                            edit
                                                        </span>
                                                    </button>
                                                </td>
                                                <td>
                                                    <button class="btn btn-sm btn-outline-success">
                                                        <span class="material-symbols-outlined fs-6">
                                                            check
                                                        </span>
                                                    </button>
                                                </td>
                                            </tr>
                                          </template>
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>
                    </template>
                </tbody>
                <thead class="border-dark">
                    <tr>
                        <td colspan="15">
                            <small>
                                Hidden Sub Process
                            </small>
                        </td>
                        <td>
                            <button class="btn btn-sm"  @click="viewHidden">
                                <span class="material-symbols-outlined align-bottom">
                                    Visibility
                                </span>
                            </button>
                        </td>
                    </tr>
                </thead>
                <tbody class="border-dark">
                    <template v-for="s in sub" v-if="viewHiddenSubs">
                        <tr v-if="s.hidden === 1">
                            <td>{{ s.sequence_number }}</td>
                            <td>{{ s.parent_sequence }}</td>
                            <td>{{ s.key_code }}</td>
                            <td colspan="12">{{ s.SubPname }}</td>
                            <td>
                                <button class="btn btn-sm" @click="show(s.SubPid)" :disabled="s.sequence_number === 0 ? true : false">
                                    <span class="material-symbols-outlined">
                                        add
                                    </span>
                                </button>
                            </td>
                        </tr>
                    </template>
                    <tr>
                        <td colspan="12"></td>
                        <td colspan="4">
                            <button class="btn btn-sm btn-outline-dark w-100" @click="removeHiddenSubs" :disabled="flow_status === 'Posted'">
                                Confirm Sub Removal
                                <span class="material-symbols-outlined align-bottom">
                                    check_circle
                                </span>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div class="modal fade" id="reorder" aria-hidden="true" aria-labelledby="reorder" tabindex="-1">
        <div class="modal-dialog modal-fullscreen">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="reorder">Reorder</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">

              <div class="position-relative" v-if="loader">
                  <div class="mx-auto position-absolute top-50 start-50">
                      <div class="spinner-grow" role="status">
                          <span class="sr-only"></span>
                      </div>
                      <div class="spinner-grow" role="status">
                        <span class="sr-only"></span>
                      </div>
                      <div class="spinner-grow" role="status">
                        <span class="sr-only"></span>
                      </div>
                  </div>
              </div>
              <div class="row mx-auto shadow-lg" v-else>
                <div class="col-4 shadow border">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Sequence Number</th>
                                <th>Key Process</th>
                                <th>Edit Sequence</th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-for="(k, index) in tempKey">
                                <tr>
                                    <td>
                                        <input v-if="k.edit === true" @keyup.enter="reSequence(k.Pid, k.sequence_number)" type="number" class="form-control form-control-sm" v-model="k.sequence_number">
                                         <p v-else>{{ k.sequence_number }}</p>
                                    </td>
                                    <td>{{ k.Pname }}</td>
                                    <td> 
                                        <button :id="'k-'+index" class="btn btn-sm w-100"  @click="editSequence(k.Pid, k.sequence_number)">
                                            <span class="material-symbols-outlined fs-6"> 
                                                edit
                                            </span>
                                        </button>
                                    </td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>
                <div class="col-8 shadow border">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Sequence Number</th>
                                <th>Parent Sequence</th>
                                <th>Sub Process</th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-for="s in tempSub">
                                <tr v-if="s.sequence_number !== 0">
                                    <td>{{ s.sequence_number }}</td>
                                    <td>{{ s.parent_sequence }}</td>
                                    <td>{{ s.SubPname }}</td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>
              </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline-dark" @click="Sync" id="Sync" disabled>Sync</button>
            </div>
          </div>
        </div>
      </div>

    <div class="modal fade" id="error" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog ">
        <div :class="'modal-content '+bg">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="error">{{ title }}</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            {{ message }}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Confirm</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="missingDataError" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog ">
          <div :class="'modal-content '+bg">
            <div class="modal-header bg-danger text-light">
              <h1 class="modal-title fs-5" id="error">Missing Data!</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p>
                    The following subs has a missing condition please check and try refetching.
                </p>
                <ul>
                    <li v-for="s in missingCon">
                        {{ s.SubPname }}
                    </li>
                </ul>
            </div>
            <div class="modal-footer bg-danger">
              <button type="button" class="btn btn-light" data-bs-dismiss="modal">Confirm</button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal fade" id="missingSubError" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog ">
          <div :class="'modal-content '+bg">
            <div class="modal-header bg-danger text-light">
              <h1 class="modal-title fs-5" id="error">Missing Data!</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p>
                    A sub process is missing or was interrupted during saving. Please review the entire subprocess. You may attempt to reinsert it using the 'Fetch Sub' tab.
                </p>
            </div>
            <div class="modal-footer bg-danger">
              <button type="button" class="btn btn-light" data-bs-dismiss="modal">Confirm</button>
            </div>
          </div>
        </div>
      </div>
    <div class="modal fade" id="fetchMissingSub" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
          <div :class="'modal-content '+bg">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="fetchMissingSub">Missing Sub Process</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="table-responsive shadow">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Sequence Number</th>
                                <th>Key Process</th>
                                <th>Sub Process</th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-for="s in missingSub">
                                <tr>
                                    <td>{{s.sequence_number}}</td>
                                    <td>
                                        <input list="key" type="text" class="form-control" v-model="s.Pname" @change="displaySub(s.Pname)">
                                        <datalist id="key">
                                           <template v-for="key in keyProcessOptions">
                                                <option v-if="key.section_id === section_id" :value="key.Pname"></option>
                                           </template>
                                        </datalist>
                                    </td>
                                    <td>
                                        <input list="sub" type="text" class="form-control" v-model="s.SubPname" @change="changeSubPid(s.SubPname)">
                                        <datalist id="sub">
                                           <template v-for="sub in missingSubOption">
                                                <option :value="sub.SubPname"></option>
                                           </template>
                                        </datalist>
                                    </td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="insertMissingSub">Confirm</button>
            </div>
          </div>
        </div>
      </div>
    <div class="modal fade" id="posting" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog ">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="posting">Confirmation</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            Please confirm if you want this process to be Posted.
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="cancelPosting">Cancel</button>
            <button type="button" class="btn btn-success" data-bs-dismiss="modal" @click="confirmPosting">Confirm</button>
          </div>
        </div>
      </div>
    </div>

</template>

<script>
    
import { createApp, h } from 'vue';
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net-bs5';
import 'datatables.net-responsive';
import 'datatables.net-select';
import axios from 'axios';
import * as bootstrap from 'bootstrap'
DataTable.use(DataTablesCore);
export default {

    components: {
        DataTable,
    },
    data() {
        return {
            requestFlowKeyURL: '',
            requestFlowSubURL: '',
            requestFlowConditionURL: '',

            requestKeyURL: 'http://172.16.2.13/tpc-endpoint/requestKeyProcess.php',
            requestSubURL: 'http://172.16.2.13/tpc-endpoint/requestSubProcess.php',
            requestConditionURL: 'http://172.16.2.13/tpc-endpoint/requestItemCondition.php',
            SectionGetURL: 'http://172.16.2.13/tpc-endpoint/GetSection.php',
            SubProcessGetURL: 'http://172.16.2.13/tpc-endpoint/GetSubProcess.php',
            requestItemMasterURL: 'http://172.16.2.13/tpc-endpoint/requestItemMasterMain.php',
            fetchProcessFlowURL: 'http://172.16.2.13/tpc-endpoint/getProcessFlowMain.php',
            GetKeyProcessURL: 'http://172.16.2.13/tpc-endpoint/GetKeyProcess.php',

            PostProcessFlowURL: 'http://172.16.2.13/tpc-endpoint/PostProcessFlow.php',
            PostKeyProcessFlowURL: 'http://172.16.2.13/tpc-endpoint/PostKeyProcessFlow.php',
            PostSubProcessFlowURL: 'http://172.16.2.13/tpc-endpoint/PostSubProcessFlow.php',
            PostConditionProcessFlowURL: 'http://172.16.2.13/tpc-endpoint/PostConditionProcessFlow.php',

            DeleteProcessFlowURL: 'http://172.16.2.13/tpc-endpoint/DeleteProcessFlow.php',
            DeleteProcessFlowKey: 'http://172.16.2.13/tpc-endpoint/DeleteProcessFlowKey.php',
            DeleteProcessFlowSub: 'http://172.16.2.13/tpc-endpoint/DeleteProcessFlowSub.php',
                
            DeleteFlowKey: 'http://172.16.2.13/tpc-endpoint/DeleteFlowKey.php',
            DeleteFlowSub: 'http://172.16.2.13/tpc-endpoint/DeleteFlowSub.php',
            DeleteFlowCondition: 'http://172.16.2.13/tpc-endpoint/DeleteFlowCondition.php',
            DeleteFlowConditionBySub: 'http://172.16.2.13/tpc-endpoint/DeleteFlowConditionBySub.php',

            PutProcessFlowMainURL: 'http://172.16.2.13/tpc-endpoint/PutProcessFlowMainStatus.php',
            PutProcessFlowKeyURL: 'http://172.16.2.13/tpc-endpoint/PutProcessFlowKey.php',
            PutProcessFlowSubURL: 'http://172.16.2.13/tpc-endpoint/PutProcessFlowSub.php',
            PutProcessFlowStatusURL: 'http://172.16.2.13/tpc-endpoint/PutProcessFlowMainStatus.php',
            PutProcessFlowConditionURL: 'http://172.16.2.13/tpc-endpoint/PutProcessFlowCondition.php',
            
            MainProcessPostRequest: 'http://172.16.2.13/tpc-endpoint/processMainPostRequest.php',
            KeyProcessPostRequest: 'http://172.16.2.13/tpc-endpoint/processKeyPostRequest.php',
            SubProcessPostRequest: 'http://172.16.2.13/tpc-endpoint/processSubPostRequest.php',
            ConditionProcessPostRequest: 'http://172.16.2.13/tpc-endpoint/processConditionPostRequest.php',

            removeKeyURL: 'http://172.16.2.13/tpc-endpoint/removeKey.php',
            removeSubURL: 'http://172.16.2.13/tpc-endpoint/removeSub.php',
            removeConURL: 'http://172.16.2.13/tpc-endpoint/removeCon.php',

            updateKeySequenceURL: 'http://172.16.2.13/tpc-endpoint/updateKeySequence.php',
            updateSubSequenceURL: 'http://172.16.2.13/tpc-endpoint/updateSubSequence.php',
            updateConSequenceURL: 'http://172.16.2.13/tpc-endpoint/updateConSequence.php',
            updateSubURL: 'http://172.16.2.13/tpc-endpoint/updateSub.php',
            updateHiddenSubURL: 'http://172.16.2.13/tpc-endpoint/updateHiddenSub.php',

            // requestFlowKeyURL: '',
            // requestFlowSubURL: '',
            // requestFlowConditionURL: '',

            // requestKeyURL: 'http://172.16.2.13/tpc-endpointDev/requestKeyProcess.php',
            // requestSubURL: 'http://172.16.2.13/tpc-endpointDev/requestSubProcess.php',
            // requestConditionURL: 'http://172.16.2.13/tpc-endpointDev/requestItemCondition.php',
            // SectionGetURL: 'http://172.16.2.13/tpc-endpointDev/GetSection.php',
            // SubProcessGetURL: 'http://172.16.2.13/tpc-endpointDev/GetSubProcess.php',
            // requestItemMasterURL: 'http://172.16.2.13/tpc-endpointDev/requestItemMasterMain.php',
            // fetchProcessFlowURL: 'http://172.16.2.13/tpc-endpointDev/getProcessFlowMain.php',
            // GetKeyProcessURL: 'http://172.16.2.13/tpc-endpointDev/GetKeyProcess.php',

            // PostProcessFlowURL: 'http://172.16.2.13/tpc-endpointDev/PostProcessFlow.php',
            // PostKeyProcessFlowURL: 'http://172.16.2.13/tpc-endpointDev/PostKeyProcessFlow.php',
            // PostSubProcessFlowURL: 'http://172.16.2.13/tpc-endpointDev/PostSubProcessFlow.php',
            // PostConditionProcessFlowURL: 'http://172.16.2.13/tpc-endpointDev/PostConditionProcessFlow.php',

            // DeleteProcessFlowURL: 'http://172.16.2.13/tpc-endpointDev/DeleteProcessFlow.php',
            // DeleteProcessFlowKey: 'http://172.16.2.13/tpc-endpointDev/DeleteProcessFlowKey.php',
            // DeleteProcessFlowSub: 'http://172.16.2.13/tpc-endpointDev/DeleteProcessFlowSub.php',
                
            // DeleteFlowKey: 'http://172.16.2.13/tpc-endpointDev/DeleteFlowKey.php',
            // DeleteFlowSub: 'http://172.16.2.13/tpc-endpointDev/DeleteFlowSub.php',
            // DeleteFlowCondition: 'http://172.16.2.13/tpc-endpointDev/DeleteFlowCondition.php',
            // DeleteFlowConditionBySub: 'http://172.16.2.13/tpc-endpointDev/DeleteFlowConditionBySub.php',

            // PutProcessFlowMainURL: 'http://172.16.2.13/tpc-endpointDev/PutProcessFlowMainStatus.php',
            // PutProcessFlowKeyURL: 'http://172.16.2.13/tpc-endpointDev/PutProcessFlowKey.php',
            // PutProcessFlowSubURL: 'http://172.16.2.13/tpc-endpointDev/PutProcessFlowSub.php',
            // PutProcessFlowStatusURL: 'http://172.16.2.13/tpc-endpointDev/PutProcessFlowMainStatus.php',
            // PutProcessFlowConditionURL: 'http://172.16.2.13/tpc-endpointDev/PutProcessFlowCondition.php',
            
            // MainProcessPostRequest: 'http://172.16.2.13/tpc-endpointDev/processMainPostRequest.php',
            // KeyProcessPostRequest: 'http://172.16.2.13/tpc-endpointDev/processKeyPostRequest.php',
            // SubProcessPostRequest: 'http://172.16.2.13/tpc-endpointDev/processSubPostRequest.php',
            // ConditionProcessPostRequest: 'http://172.16.2.13/tpc-endpointDev/processConditionPostRequest.php',

            // removeKeyURL: 'http://172.16.2.13/tpc-endpointDev/removeKey.php',
            // removeSubURL: 'http://172.16.2.13/tpc-endpointDev/removeSub.php',
            // removeConURL: 'http://172.16.2.13/tpc-endpointDev/removeCon.php',

            // updateKeySequenceURL: 'http://172.16.2.13/tpc-endpointDev/updateKeySequence.php',
            // updateSubSequenceURL: 'http://172.16.2.13/tpc-endpointDev/updateSubSequence.php',
            // updateConSequenceURL: 'http://172.16.2.13/tpc-endpointDev/updateConSequence.php',
            // updateSubURL: 'http://172.16.2.13/tpc-endpointDev/updateSub.php',
            // updateHiddenSubURL: 'http://172.16.2.13/tpc-endpointDev/updateHiddenSub.php',
            

            section_id: '',

            key: [],
            sub: [],
            condition: [],

            viewHiddenSubs: false,

            tempKey: [],
            tempSub: [],

            UnassignedSub:[],
            UnassignedCondition:[],

            sectionOptions: [],

            viewToggle: {},
            editToggle: {},

            bg: '',
            message: '',
            title: '',
            sub_count: 0,
            condition_count: 0,
            maxSubSequence: -1,
            missingSub: [],
            missingCon: [],
            missingData: false,
            missingSubData: false,
            
            missingKeyOption: [],
            missingSubOption: [],
            editCondition: {},
            field_type_list: [
                'Check Box',
                'Combo Box',
                'Date',
                'Date & Time',
                'Decimal',
                'Integer',
                'OR',
                'Text',
                'Time'
            ],
            loader: false,
            conditionLoader: false,
            }
            
    },
    computed:{
        
    },
    methods: {
        async updateKey(Pid, sequence){
            this.key.find(k => {
                if(parseInt(k.Pid) === parseInt(Pid) && parseInt(k.sequence_number) === parseInt(sequence)){
                    axios.put(this.PutProcessFlowKeyURL, {
                        operation_number: k.operation_number,
                        standard_time: k.standard_time,
                        machine_time: k.machine_time,
                        flow_key_id: k.flow_key_id,
                        Pid: k.Pid,
                    }).then(response => {
                        if(response.data.message === 'Process Flow Key updated successfully'){
                            k.keyEditable = false;
                        }
                    }).catch(error => {
                        console.log(error);
                    })       
                }
            })
        },
        editKey(Pid){
            this.key.find(k => {
                if(parseInt(k.Pid) === parseInt(Pid)){
                    k.keyEditable = true;
                }
            })
        },
        hideSubs(SubPid){
            this.sub.find(s => {
                if(parseInt(s.SubPid) === SubPid){
                    s.hidden = 1
                }
            })
        },
        conditionSwitch(c){
            let val = document.getElementById(`checked - ${c.flow_condition_id}`).checked;
            c.condition_status = val === true ? 'Active' : 'Inactive';
        },
        editConditions(c){
            console.log(c)
            this.editCondition[c.flow_condition_id] = !this.editCondition[c.flow_condition_id];
        },
        viewHidden(){
            this.viewHiddenSubs = !this.viewHiddenSubs;
        },
        async submitBySub(SubPid) {
            try {
                this.conditionLoader = true;
                const sub = this.sub.find((s) => s.SubPid === SubPid);
                await Promise.all(sub.condition.map(async (c) => {
                    try {
                        const response = await axios.post(this.ConditionProcessPostRequest, {
                            main_flow_id: this.flow_main_id,
                            item_id: c.item_id,
                            SubPid: c.SubPid,
                            sequence_number: c.sequence_number,
                            parent_sequence: c.parent_sequence,
                            detail_description: c.detail_description,
                            field_type: c.field_type,
                            typical_value: c.typical_value,
                            min_value: c.min_value,
                            max_value: c.max_value,
                            condition_status: c.condition_status,
                            visibility_status: c.visibility_status,
                            database_name: c.database_name,
                            table_name: c.table_name,
                            field_name1: c.field_name1,
                            field_name2: c.field_name2,
                            output_fieldname: c.output_fieldname,
                            fetching_eng: c.fetching_eng,
                            eng_server: c.eng_server,
                            eng_db_username: c.eng_db_username,
                            eng_db_password: c.eng_db_password
                        });
                        // Handle the response if needed
                    } catch (error) {
                        console.error(error);
                    }
                }));
            } catch (error) {
                console.error(error);
            } finally {
                this.conditionLoader = false;
            }
        },
        async reFetchConditions(SubPid) {
            try {
                const s = this.sub.find((s) => s.SubPid === SubPid);
                if (!s) {
                    console.log('SubPid not found');
                    return;
                }
                const deleteResponse = await axios.post(this.DeleteFlowConditionBySub, {
                    flow_main_id: this.flow_main_id,
                    SubPid: s.SubPid,
                });
                if (deleteResponse.data.message === 'Process Flow Condition deleted successfully') {
                    s.condition = [];
                }
                const conditionResponse = await axios.get(this.requestConditionURL, {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded',
                    },
                    params: {
                        SubPid: s.SubPid,
                    },
                });
                for (const c of conditionResponse.data) {
                    Object.assign(c, {
                        condition_status: 'Active',
                        field_name1: c.fieldname_1,
                        field_name2: c.fieldname_2,
                        field_name3: c.fieldname_3,
                        field_name4: c.fieldname_4,
                        field_name5: c.fieldname_5,
                        parent_sequence: s.parent_sequence,
                        visibility_status: 0,
                    });
                    s.condition.push(c);
                }
            } catch (error) {
                console.error(error);
            }
        },
        insertMissingSub(){
            this.missingSub.forEach(s => {
                    axios.post(this.SubProcessPostRequest, {
                        main_flow_id: this.flow_main_id,
                        section_id: this.section_id,
                        parts_number: this.item_parts_number,
                        revision_number: this.revision_number,
                        Pid: s.Pid,
                        SubPid: s.SubPid,
                        sequence_number: s.sequence_number,
                        parent_sequence: s.parent_sequence,
                        standard_time: 0,
                        machine_time: 0,
                        item_code: this.item_code,  
                        check_sampling: "False",
                        check_uncontrolled: "False",
                        batching_type: "Standard",
                        result_type: "Wafer",
                        check_sub_status: "Active",
                        status: "Close",
                        hidden: 0,
                        with_quantity: 1,
                        condition_process_count: 0
                    }).then(response => {
                        console.log(response.data)
                    }).catch(error => {
                        console.log(error);
                    })
            })
        },
        displaySub(Pname){
            this.missingSubOption = [];
            this.missingSub.find(mk => {
                if(Pname === mk.Pname){
                    mk.SubPname = ''
                    this.keyProcessOptions.find(k => {
                        if(mk.Pname === k.Pname){
                            mk.Pid = k.Pid
                            this.subProcess.find(s => {
                                if(mk.Pid === s.Pid){
                                    this.missingSubOption.push(s)
                                }
                            })
                        }
                    })
                }
            })
           
        },
        changeSubPid(SubPname){
            this.subProcess.find(s => {
                if(s.SubPname === SubPname){
                    this.missingSub.find(ms => {
                        if(s.SubPname === ms.SubPname){
                            ms.SubPid = s.SubPid;
                        }
                        this.key.find(k => {
                            if(k.Pid === ms.Pid){
                                ms.parent_sequence = k.sequence_number
                            }
                        })
                    })
                }
            })
        },
        fetchMissingSub(){
            
        },
        selectSection(sequence){
            this.key.find(k => {
                if(parseInt(sequence) === parseInt(k.sequence_number)){
                    this.section.forEach(s => {
                        if(parseInt(s.section_id) === parseInt(k.section_id)){
                            Object.assign(k, {
                                section_code: s.section_code
                            })
                        }
                    })
                }
            })
        },
        updateSubs(SubPid){
            this.sub.find(s => {
                if(parseInt(s.SubPid) === parseInt(SubPid)){
                    document.getElementById(`btn-${s.SubPid}`).disabled = true; 
                    axios.put(this.updateSubURL, {
                        flow_main_id: this.flow_main_id,
                        flow_sub_id: s.flow_sub_id,
                        SubPid: s.SubPid,
                        check_sampling: s.check_sampling,
                        check_uncontrolled: s.check_uncontrolled,
                        with_quantity: s.with_quantity,
                        sub_status: s.sub_status,
                        standard_time: s.standard_time,
                        machine_time: s.machine_time,
                        batching_type: s.batching_type,
                        result_type: s.result_type, 
                        status: s.status
                    }).then(response => {
                        console.log(response.data)
                        if(response.data.message === 'Process Flow Sub updated successfully'){
                            this.title = 'Update Success';
                            this.message = `${s.SubPname} updated successfully`;
                            let myModal = new bootstrap.Modal(document.getElementById("error"))
                            myModal.show();
                            
                        }
                    }).catch(error => {
                        console.log(error)
                    })
                }
            })
        },
        posting(){
            let myModal = new bootstrap.Modal(document.getElementById("posting"))
            myModal.show();
        },
        confirmPosting(){
            axios.put(this.PutProcessFlowMainURL, {
                flow_status: this.flow_status,
                flow_main_id: this.flow_main_id
            }).then(response => {
                if(response.data.message === 'Process Flow Status updated successfully'){
                    document.getElementById('flow_status').disabled = true;
                }
            }).catch(error => {
                console.log(error)
            })
        },
        cancelPosting(){
            this.flow_status = 'Unposted';
        },
        hide(SubPid){
            this.sub.find(s => {
                if(parseInt(SubPid) === parseInt(s.SubPid)){
                    s.hidden = 1;
                    s.sub_status = 'Inactive';
                }
            })
        },
        show(SubPid){
            this.sub.find(s => {
                if(parseInt(SubPid) === parseInt(s.SubPid)){
                    s.hidden = 0;
                    s.sub_status = 'Active';
                }
            })
        },
        async removeHiddenSubs() {
          this.loader = true;
          let sequence = 1;

          // Create an array of promises for each request
          const requests = this.sub.map(async (s) => {
            if (s.hidden === 1) {
              try {
                const res = await axios.put(this.updateHiddenSubURL, {
                  flow_main_id: this.flow_main_id,
                  flow_sub_id: s.flow_sub_id,
                  SubPid: s.SubPid,
                  sequence_number: 0,
                  parent_sequence: 0,
                  hidden: s.hidden,
                  sub_status: s.sub_status,
                });
                console.log(res.data);
              } catch (error) {
                console.log(error);
              }
            }
            if (s.hidden === 0) {
              s.sequence_number = sequence;
              sequence++;
            }
            if (s.hidden === 0) {
              try {
                const res = await axios.put(this.updateHiddenSubURL, {
                  flow_main_id: this.flow_main_id,
                  flow_sub_id: s.flow_sub_id,
                  SubPid: s.SubPid,
                  sequence_number: s.sequence_number,
                  parent_sequence: s.parent_sequence,
                  hidden: s.hidden,
                  sub_status: s.sub_status,
                });
                console.log(res.data);
              } catch (error) {
                console.log(error);
              }
            }
          });
      
          // Wait for all requests to complete
          await Promise.all(requests);
      
          // Set loader to false after all requests are done
          this.loader = false;
        },
        async selectKey(sequence, Pid){
            document.getElementById('addProcess').disabled = false;
            let key_code;
            this.key.find(k => {
                if(parseInt(sequence) === parseInt(k.sequence_number)){
                    this.keyProcessOptions.find(key => {
                        if(parseInt(k.Pid) === parseInt(key.Pid)){
                            Object.assign(k, {
                                Pname: key.Pname,
                                key_code: key.key_code
                            })
                            key_code = key.key_code;
                            this.submitKey(k.Pid, k.sequence_number);    
                        }
                    })
                }
            })
            try {
            const response = await axios.get(this.requestSubURL,{
                method: 'GET',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                params: {
                    Pid: Pid    
                }
            })
            for(const s of response.data){
                if(s.sub_process_status === 'Active'){
                    s['origin_sequence'] = s['sequence_number'];;
                    let openFirstStatus = this.sub.length === 0 ? 'Open' : 'Close';
                    this.sub.push({
                        parent_sequence: sequence,
                        sequence_number: '',
                        key_code: key_code,
                        Pid: s.Pid,
                        SubPid: s.SubPid,
                        SubPname: s.SubPname,
                        standard_time: 0,
                        machine_time: 0,
                        batching_type: 'Parallel',
                        result_type: 'Chips',
                        check_sampling: 'False',
                        check_uncontrolled: 'False',
                        with_quantity: 1,
                        sub_status: 'Active',
                        hidden: 0,
                        status: openFirstStatus,
                        condition: [],
                        condition_process_count: 0
                    })
                    await this.itemCondition(s.SubPid, sequence, s.sequence_number);
                    this.sub.sort((a,b) => a.origin_sequence - b.origin_sequence);
                    this.subSequence();
                }
            }
            this.submitSub(sequence);
            } catch (error) {
                console.log(error)
            }
        },
        async itemCondition(SubPid, sequence, sequence_number){
            await axios.get(this.requestConditionURL, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                params: {
                    SubPid: SubPid
                }
            }).then(response => {
                this.sub.find(s => {
                    if(parseInt(s.SubPid) === parseInt(SubPid) && parseInt(s.parent_sequence) === parseInt(sequence)){
                        s.condition_process_count = response.data.length;
                        
                    }
                })
                for(const c of response.data){
                    this.sub.find(s => {
                        if(parseInt(c.SubPid) === parseInt(s.SubPid) && parseInt(s.parent_sequence) === parseInt(sequence)){
                            Object.assign(c, {
                                condition_status: 'Active',
                                parent_sequence: sequence,
                                visibility_status: 0
                            })
                            s.condition.push(c)
                            s.condition.sort((a,b) => a.sequence_number - b.sequence_number);
                        }
                    })
                }
                this.submitCondition(sequence, SubPid);
                this.processConditionCount += response.data.length;
            }).catch(error => {
                console.log(error);
            })
        },
        async submitKey(Pid, sequence){
            this.key.find(k => {
                if(parseInt(k.Pid) === parseInt(Pid) && parseInt(k.sequence_number) === parseInt(sequence)){
                    axios.post(this.KeyProcessPostRequest, {
                        main_flow_id: this.flow_main_id,
                        operation_number: k.operation_number,
                        section_id: k.section_id,
                        parts_number: this.item_parts_number,
                        revision_number: this.revision_number,
                        Pid: k.Pid,
                        sequence_number: k.sequence_number,
                        standard_time: k.standard_time,
                        machine_time: k.machine_time,
                        item_code: this.item_code,   
                    }).then(response => {
                        Object.assign(k, {
                            flow_key_id: response.data.key
                        })
                    }).catch(error => {
                        console.log(error);
                    })       
                }
            })
        },
        async submitSub(sequence){
            this.sub.forEach(async (s) => {
                if(parseInt(s.parent_sequence) === parseInt(sequence)){
                    await axios.post(this.SubProcessPostRequest, {
                        main_flow_id: this.flow_main_id,
                        section_id: this.section_id,
                        parts_number: this.item_parts_number,
                        revision_number: this.revision_number,
                        Pid: s.Pid,
                        SubPid: s.SubPid,
                        sequence_number: s.sequence_number,
                        parent_sequence: s.parent_sequence,
                        standard_time: s.standard_time,
                        machine_time: s.machine_time,
                        item_code: this.item_code,  
                        check_sampling: s.check_sampling,
                        check_uncontrolled: s.check_uncontrolled,
                        batching_type: s.batching_type,
                        result_type: s.result_type,
                        check_sub_status: s.sub_status,
                        status: s.status,
                        hidden: s.hidden,
                        with_quantity: s.with_quantity,
                        condition_process_count: s.condition_process_count
                    }).then(response => {
                        Object.assign(s, {
                            flow_sub_id: response.data.sub
                        })
                    }).catch(error => {
                        console.log(error)
                    })
                }
            })
        },
        async submitCondition(sequence, SubPid){
            this.sub.forEach(async (s) => {
                if(parseInt(s.parent_sequence) === parseInt(sequence) && parseInt(s.SubPid) === parseInt(SubPid)){
                    s.condition.forEach(async (c) => {
                        await axios.post(this.ConditionProcessPostRequest, {
                            main_flow_id: this.flow_main_id,
                            item_id: c.item_id,
                            SubPid: c.SubPid,
                            sequence_number: c.sequence_number,
                            parent_sequence: c.parent_sequence,
                            detail_description: c.detail_description,
                            field_type: c.field_type,
                            typical_value: c.typical_value,
                            min_value: c.min_value,
                            max_value: c.max_value,
                            condition_status: c.condition_status,
                            visibility_status: c.visibility_status,
                            database_name: c.database_name,
                            table_name: c.table_name,
                            field_name1: c.fieldname_1,
                            field_name2: c.fieldname_2,
                            output_fieldname: c.output_fieldname,
                            fetching_eng: c.fetching_eng,
                            eng_server: c.eng_server,
                            eng_db_username: c.eng_db_username,
                            eng_db_password: c.eng_db_password
                        }).then(response => {
                            Object.assign(c, {
                                flow_condition_id: response.data.condition
                            })
                        }).catch(error => {
                            console.log(error)
                        })
                    })
                }
            })
        },
        setReorder(){
            this.tempKey = this.key.map(k => {
                return {
                    Pid: k.Pid,
                    sequence_number: k.sequence_number,
                    Pname: k.Pname,
                    edit: false
                }
            })
            this.tempSub = this.sub.map(s => {
                return {
                    Pid: s.Pid,
                    SubPid: s.SubPid,
                    sequence_number: s.sequence_number,
                    parent_sequence: s.parent_sequence,
                    SubPname: s.SubPname,
                }
            })
        },
        editSequence(Pid, sequence_number){
            let sequence = 1;
            this.tempKey.map((k, index) => {
                document.getElementById(`k-${index}`).disabled = true;
            });
            this.tempKey.filter(k => {
                if(parseInt(k.sequence_number) !== parseInt(sequence_number)){
                    k.sequence_number = sequence;
                    sequence++
                } else {
                    k.edit = true;
                    k.sequence_number = 0;
                }
            })
            this.tempKey.sort((a,b) => a.sequence_number - b.sequence_number);
        },
        reSequence(Pid, sequence_number){
        this.loader = true;
            if(sequence_number > 0 && sequence_number <= this.tempKey.length && sequence_number !== ''){
                this.tempKey.find(k => {
                    if(parseInt(Pid) === parseInt(k.Pid) && parseInt(sequence_number) === parseInt(k.sequence_number)){
                        k.edit = false;
                    }
                })
                this.tempKey.filter((k, index) => {
                    if(sequence_number <= k.sequence_number && index !== 0){
                      k.sequence_number += 1;
                    }
                })
                this.tempKey.sort((a,b) => a.sequence_number - b.sequence_number);
                this.tempKey.map((k, index) => {
                    document.getElementById(`k-${index}`).disabled = false;
                })
            }
            this.reArrangeSub();
        },
        async reArrangeSub(){
            let newSubSet = [];
            for(const k of this.tempKey){
                await axios.get(this.requestSubURL,{
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    },
                    params: {
                        Pid: k.Pid    
                    }
                }).then(response => {
                    for(const s of response.data){
                        newSubSet.push({
                            Pid: s.Pid,
                            SubPid: s.SubPid,
                            SubPname: s.SubPname,
                            parent_sequence: k.sequence_number,
                            sequence: s.sequence_number
                        })
                    }
                }).catch(error => {
                    console.log(error)
                })
            }
            let sequence_no = 1;
            for(const s of newSubSet){
                s.sequence_number = sequence_no;
                sequence_no++;
            }
            this.tempSub = newSubSet;
            document.getElementById('Sync').disabled = false;
            this.loader = false;
        },
        async Sync(){
            this.loader = true;
            let keyFlow = [];
            let subFlow = [];

            keyFlow = this.tempKey;
            subFlow = this.tempSub;

            for(const key of this.key){
                keyFlow.find(k => {
                    if(parseInt(key.Pid) === parseInt(k.Pid)){
                        key.sequence_number = k.sequence_number;
                    }
                })
            }
            for(const sub of this.sub){
                subFlow.find(s => {
                    if(parseInt(sub.SubPid) === parseInt(s.SubPid)){
                        sub.sequence_number = s.sequence_number
                        sub.parent_sequence = s.parent_sequence
                    }
                })
            }
            this.key.sort((a,b) => a.sequence_number - b.sequence_number);
            this.sub.sort((a,b) => a.sequence_number - b.sequence_number);
            await this.saveFlowSequence();
            await this.removeHiddenSubs();
        },
        async removeKey(index, Pid, p_sequence){
            let Pos = this.sub.findIndex(sub => parseInt(sub.Pid) === parseInt(Pid) && parseInt(sub.parent_sequence) === parseInt(p_sequence));
            let Span = this.sub.filter(sub => parseInt(sub.Pid) === parseInt(Pid) && parseInt(sub.parent_sequence) === parseInt(p_sequence)).length;
            await this.removeFlowSequence(index, Pos, Span, Pid);
            await this.saveFlowSequence();
        },
        async removeFlowSequence(index, Pos, Span, Pid){
            let key = this.key.splice(index, 1);
            let sub = this.sub.splice(Pos, Span);
            try {
                await axios.post(this.removeKeyURL, {
                    flow_main_id: this.flow_main_id,
                    Pid: Pid,
                }).then(response => {
                    console.log(response.data)
                })
                await axios.post(this.removeSubURL, {
                    flow_main_id: this.flow_main_id,
                    Pid: Pid,
                }).then(response => {
                    console.log(response.data);
                })
                sub.forEach(async (s) => {
                    let res = await axios.post(this.removeConURL, {
                        flow_main_id: this.flow_main_id,
                        SubPid: s.SubPid,
                    })
                    console.log(res.data);
                }) 
            } catch (error){
                console.log(error);
            }
            this.keySequence();
            this.subSequence();
            for(const k of this.key){
                for(const s of this.sub){
                    if(parseInt(k.Pid) === parseInt(s.Pid)){
                        s.parent_sequence = k.sequence_number;
                        for(const c of s.condition){
                            c.parent_sequence = k.sequence_number;
                        }
                    }
                }
            }
        },  
        async saveFlowSequence(){
            this.key.forEach(async (k) => {
                try {
                    let res1 = await axios.put(this.updateKeySequenceURL, {
                        flow_main_id: this.flow_main_id,
                        flow_key_id: k.flow_key_id,
                        Pid: k.Pid,
                        sequence_number: k.sequence_number
                    })
                } catch (error) {
                    console.log(error);
                }
            })
            this.sub.forEach(async (s) => {
                try {
                    let res2 = await axios.put(this.updateSubSequenceURL, {
                        flow_main_id: this.flow_main_id,
                        flow_sub_id: s.flow_sub_id,
                        SubPid: s.SubPid,
                        sequence_number: s.sequence_number,
                        parent_sequence: s.parent_sequence
                    })
                    const res3 = await axios.put(this.updateConSequenceURL, {
                        flow_main_id: this.flow_main_id,
                        SubPid: s.SubPid,
                        parent_sequence: s.parent_sequence
                    });
                } catch (error) {
                    console.log(error);
                }
            })
        },
        ToggleView(id){
            this.viewToggle[id] = !this.viewToggle[id];
        },
        ToggleEdit(id){
            this.editToggle[id] = !this.editToggle[id];
            let subSeq = id.split('-')[2];
            let SubPid = id.split('-')[1];
            
            this.sub.filter(s => {
                if(parseInt(s.SubPid) !== parseInt(SubPid) && parseInt(s.sequence_number) !== parseInt(subSeq)){
                    this.editToggle['Sub-'+s.SubPid+'-'+s.sequence_number] = false;
                }
            })
        },
        UntoggleEdit(id){
            this.editToggle[id] = !this.editToggle[id];
        },
        addKey(){
            document.getElementById('addProcess').disabled = true;
            this.key.push({
                sequence_number: '',
                operation_number: '',
                section_id: '',
                Pid: '',
                standard_time: 0,
                machine_time: 0
            })
            this.keySequence();
        },
        keySequence(){
            let sequence = 1;
            for(const key of this.key){
                key.sequence_number = sequence; 
                sequence++;
            }
        },
        subSequence(){
            let sequence = 1;
            for(const sub of this.sub){
                sub.sequence_number = sequence; 
                sequence++;
            }
        },
        checkSampling(SubPid, sequence){
            this.sub.find(s => {
                if(parseInt(SubPid) === parseInt(s.SubPid)){
                    s.check_sampling = document.getElementById(`sampling${sequence}`).checked === true ? 'True' : 'False';
                }
            })
        },
        checkUncontrolled(SubPid, sequence){
            this.sub.find(s => {
                if(parseInt(SubPid) === parseInt(s.SubPid)){
                    s.check_uncontrolled = document.getElementById(`uncontrolled${sequence}`).checked === true ? 'True' : 'False';
                }
            })
        },
        checkQuantity(SubPid, sequence){
            this.sub.find(s => {
                if(parseInt(SubPid) === parseInt(s.SubPid)){
                    s.with_quantity = document.getElementById(`quantity${sequence}`).checked === true ? 1 : 0;
                }
            })
        },
        checkStatus(SubPid, sequence){
            this.sub.find(s => {
                if(parseInt(SubPid) === parseInt(s.SubPid)){
                    s.sub_status = document.getElementById(`sub_status${sequence}`).checked === true ? 'Active' : 'Inactive';
                    console.log(s.sub_status)
                }
            })
        },
        findMissingNumber(sequence){
            console.log(this.maxSubSequence);
        },
        async DestroyFlow(flow_main_id){
            await axios.post(this.DeleteProcessFlowURL, {
                    flow_main_id: flow_main_id
                }).then(response => {
                    console.log(response.data);
                }).catch(error => {
                    console.log(error)
                }) 
            await axios.post(this.DeleteFlowCondition, {
                    flow_main_id: flow_main_id
                }).then(response => {
                    console.log(response.data);
                }).catch(error => {
                    console.log(error)
                })
            await axios.post(this.DeleteFlowSub, {
                    flow_main_id: flow_main_id
                }).then(response => {
                    console.log(response.data);
                }).catch(error => {
                    console.log(error)
                })
            await axios.post(this.DeleteFlowKey, {
                    flow_main_id: flow_main_id
                }).then(response => {
                    console.log(response.data)
                }).catch(error => {
                    console.log(error)
                })
            this.$router.push({ name: 'processFlow'});
        },
    }, 
    async created(){
        let flow_id = parseInt(this.$route.query.flow_id);
        let params = {
                method: 'GET',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                params: {
                    flow_main_id: flow_id
                }
            }

        await axios.get(this.SectionGetURL, {}).then(response => {
            this.section = response.data.filter((sec) => sec.section_status === 'Active');
        }).catch(error => { console.log(error) });

        await axios.get(this.requestItemMasterURL, {}).then(response => {
            this.itemMaster = response.data;
        }).catch(error => { console.log(error) });

        await axios.get(this.fetchProcessFlowURL, {}).then(response => {
            for(const flow of response.data){
                this.section.find((sec) => {
                    if(parseInt(flow.section_id) === parseInt(sec.section_id) && parseInt(flow_id) === parseInt(flow.flow_main_id)){
                        Object.assign(flow, {section_code: sec.section_code})
                        this.flow_main_id = flow.flow_main_id;
                        this.flow_type = flow.flow_type;
                        this.item_code = flow.item_code;
                        this.item_parts_number = flow.item_parts_number;
                        this.item_description = flow.item_description;
                        this.date_encoded = flow.date_encoded;
                        this.flow_status = flow.flow_status;
                        this.revision_number = flow.revision_number;
                        this.encoded_by = flow.encoded_by;
                        this.remarks = flow.remarks;
                        this.section_id = flow.section_id;
                        this.section_code = flow.section_code;
                        this.section.find(s => {
                            if(parseInt(s.section_id) === parseInt(this.section_id)){
                                let options = s.accessed_section.split(',');
                                this.section.find(sec => {
                                    if(sec.section_code === this.section_code){
                                        this.sectionOptions.push(sec);
                                    }
                                    options.forEach(o => {
                                     if(sec.section_code === o){
                                         this.sectionOptions.push(sec);
                                     }
                                    })
                                })
                            }
                        })
                        this.sub_count = flow.sub_process_count;
                    }
                })
             }
            this.processFlow = response.data;
        }).catch(error => { console.log(error) });

        await axios.get(this.GetKeyProcessURL, {}).then(response => {
            this.keyProcessOptions = response.data;
        }).catch(error => { console.log(error) });
        
        await axios.get(this.SubProcessGetURL, {}).then(response => {
            this.subProcess = response.data.filter((sub) => sub.sub_process_status === 'Active');
        }).catch(error => { console.log(error) });

        this.date_encoded = new Date().toJSON().slice(0, 10);
        
        this.requestFlowKeyURL = `http://172.16.2.13:3000/flowKey/${flow_id}`;
        await axios.get(this.requestFlowKeyURL, params).then(response => {
            response.data.forEach(k => {
                this.keyProcessOptions.find(key => {
                    if(parseInt(k.Pid) === parseInt(key.Pid)){
                        Object.assign(k, {
                            Pname: key.Pname,
                            key_code: key.key_code,
                            keyEditable: false
                        })
                    }
                })
                this.section.find(s => {
                    if(parseInt(k.section_id) === parseInt(s.section_id)){
                        Object.assign(k, {
                            section_code: s.section_code
                        })
                    }
                })
            })
            this.key = response.data
            this.key.sort((a,b) => a.sequence_number - b.sequence_number);
        }).catch(error => {
            console.log(error);
        })
        
        this.requestFlowSubURL = `http://172.16.2.13:3000/flowSub/${flow_id}`
        await axios.get(this.requestFlowSubURL, params).then(response => {
            for(const s of response.data){
                Object.assign(s, {
                    condition: []
                })
                this.key.find(k => {
                    if(parseInt(s.Pid) === parseInt(k.Pid)){
                        Object.assign(s, {
                            key_code: k.key_code
                        })
                    }
                })
                this.subProcess.find(sub => {
                    if(parseInt(s.SubPid) === parseInt(sub.SubPid)){
                        Object.assign(s, {
                            SubPname: sub.SubPname
                        })
                    }
                })
            }
            this.sub = response.data;
            this.sub.sort((a,b) => a.sequence_number - b.sequence_number);
        }).catch(error => {
            console.log(error);
        })
        this.requestFlowConditionURL = `http://172.16.2.13:3000/conditions/${flow_id}`;
        await axios.get(this.requestFlowConditionURL).then(response => {
            this.sub.forEach(s => {
                for(const c of response.data){
                    if(parseInt(s.SubPid) === parseInt(c.SubPid)){
                        s.condition.push(c);
                        s.condition.sort((a,b) => a.sequence_number - b.sequence_number);
                    }
                }
                this.condition_count += parseInt(s.condition.length);
            })
        }).catch(error => {
            console.log(error);
        })

        this.maxSubSequence = -1;

        if(this.sub_count > this.sub.length){
            this.missingSubData = true;
        }

        for(const s of this.sub){
            if(s.sequence_number > this.maxSubSequence){
                this.maxSubSequence = s.sequence_number
            }
            if(parseInt(s.condition_process_count) !== parseInt(s.condition.length)){
                this.missingCon.push(s)
                Object.assign(s, {
                    hasMissingData: true
                })
                this.missingData = true;
            }
        }
        if(this.maxSubSequence > this.sub.length){
            for(let i = 1; i <= this.maxSubSequence; i++){
                if(!this.sub.some(s => s.sequence_number === i)){
                    this.missingSub.push({
                        Pid: null,
                        SubPid: null,
                        sequence_number: i,
                    })
                }
            }
        }
        if(this.missingData){
            this.title = 'Missing Data';
            this.missingCon.forEach(s => {
                this.message = `${s.SubPname}`
            })
            let myModal = new bootstrap.Modal(document.getElementById("missingDataError"))
            myModal.show();
        }
        if(this.missingSubData){
            let myModal = new bootstrap.Modal(document.getElementById("missingSubError"))
            myModal.show();
        }
        
    },
}
</script>
<style>
@import 'bootstrap';
@import 'datatables.net-bs5';
</style>