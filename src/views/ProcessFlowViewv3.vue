
<template>

    <div class="col-md-12 row mx-auto py-3 container">
        <div class="col-md-9">
            <h3 class="">Tablet Process Card - <em>Process Flow Assignment</em></h3>
        </div>
        <div class="col-md-3 float-end">
            <button type="button" class="btn btn-outline-info w-100 shadow" data-bs-toggle="modal" data-bs-target="#createProcessFlow" @click="clear">
                Create Process Flow
            </button>
        </div>
    </div>
    <div class="container table-responsive shadow p-3 rounded">
        <DataTable
        :data="processFlow"
        :columns="columns"
        class="display table table-hover gradient shadow"
        @click="viewing"
        :options="tableOptions"
        />
    </div>

    <!-- Modal -->
    <div class="modal fade" id="createProcessFlow" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-fullscreen">
          <div class="modal-content">
            <div class="modal-header bg-light shadow">
              <h1 class="modal-title fs-5" id="staticBackdropLabel">PROCESS FLOW ASSIGNMENT<em v-if="flow_main_id != ''"> - Process Flow Number {{flow_main_id}}</em></h1>
              <div class="col-md-4 row">
                
                <div class="col-md-4">
                    <button type="button" @click="clearFields" class="btn btn-outline-secondary float-end w-100" data-bs-dismiss="modal">Close</button>
                </div>
                <div class="col-md-4">
                    <button v-if="flow_main_id ===''" type="button" @click="clearFields" ref="closeBtn" class="btn btn-outline-primary float-end w-100">Clear</button>
                    <button v-else type="button" @click="deleteFlow" class="btn btn-outline-primary float-end w-100" data-bs-dismiss="modal" :disabled="flowStatus === 'Posted'">Delete</button>
                </div>
                <div class="col-md-4">
                    <button ref="submitBtn" v-if="flow_main_id===''" type="button" @click="submitFlow" class="btn btn-outline-primary float-end w-100"  :disabled="finishedMainSubmission">Save</button>
                    <button ref="postingBtn" v-else-if="flow_main_id !== '' || flowStatus==='Unposted'" type="button" @click="Posting" class="btn btn-outline-primary float-end w-100" :disabled="flow_status">Save</button>
                </div>
              </div>
            </div>
            <div class="modal-body">
              <div class="col-md-12 p-3 row border rounded mx-auto shadow bg-light bg-gradient">
                <!-- <div class="col-md-2">
                    <div class="form-check form-switch">
                        <input class="form-check-input" @change="processInsertionSwitch" type="checkbox" role="switch" id="processInsertion" :checked="enableProcessInsertion">
                        <label class="form-check-label" for="processInsertion">Enable Process Insertion</label>
                    </div>
                </div> -->
                <!-- <div class="col-md-10"></div> -->
                <div class="col-md-2">
                    <label for="flow_type">Flow Type : </label>
                    <select id="flow_type" class="form-select" v-model="flowType" :disabled="flow_main_id !== '' || finishedMainSubmission">
                        <option value="Manual">Manual</option>
                        <option value="Auto">Auto</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <label for="section">Section :</label>
                    <select id="section" class="form-control" v-model="sectionId" @change="assignSectionCode(sectionId)" :disabled="flow_main_id !== '' || finishedMainSubmission">
                        <option v-for="sec in section" :value="sec.section_id">{{sec.section_code}} - {{sec.section_description}}</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <label for="item_code">Item Code :</label>
                    <select v-if="flow_main_id === ''" id="item_code" @change="getRevisionNumber(itemCode)" class="form-select" v-model="itemCode" :disabled="finishedMainSubmission">
                        <option v-for="item in itemCodeList" :value="item.item_code">{{item.item_code}}</option>
                    </select>
                    <input v-else type="text" class="form-control" v-model="itemCode" disabled>
                </div>
                <div class="col-md-2">
                    <label for="parts_number">Parts Number :</label>
                    <input type="text" class="form-control" v-model="itemPartsNumber" disabled>
                </div>
                <div class="col-md-2">
                    <label for="item_description">Item Description :</label>
                    <input type="text" class="form-control" v-model="itemDescription" disabled> 
                </div>
                <div class="col-md-2">
                    <label for="date_encoded">Date Encoded :</label>
                    <input id="date_encoded" type="text" class="form-control" v-model="dateEncoded" disabled>
                </div>
                <div class="col-md-2">
                    <label for="process_flow_status">Flow Status :</label>
                    <select @change="enablePostingBtn" id="process_flow_status" class="form-select" v-model="flowStatus" :disabled="flow_main_id === '' || flowStatus === 'Posted' || finishedMainSubmission" >
                        <option value="Posted">Posted</option>
                        <option value="Unposted">Unposted</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <label for="revision_number">Revision Number :</label>
                    <input id="revision_number" type="text" class="form-control" v-model="revisionNumber" disabled>
                </div>
                <div class="col-md-2">
                    <label for="encoded_by">Encoded By :</label>
                    <input id="encoded_by" type="text" class="form-control" v-model="encodedBy" disabled>
                </div>
                <div class="col-md-6">
                    <label for="remarks">Remarks :</label>
                    <textarea type="text" class="form-control" v-model="remarks" :disabled="flow_main_id !== '' || finishedMainSubmission"></textarea>
                </div>
                <div class="col-md-2 pt-4" v-if="flow_main_id === '' && itemCode !== '' && flowStatus === 'Unposted'">
                    <input type="checkbox" class="btn-check" id="enableCloning" autocomplete="off" @change="cloningSwitch" :checked="enableCloning">
                    <label class="btn btn-outline-secondary w-100" for="enableCloning">Flow Cloning</label>
                </div>
                <div class="col-md-2" v-if="flow_main_id === '' && enableCloning">
                    <label for="tempItemCode">Source Item Code :</label>
                    <select id="tempItemCode" class="form-select" v-model="tempItemCode" @change="clone(tempItemCode)">
                        <option value="" selected disabled></option>
                        <option v-for="item in itemCodeList" :value="item.item_code" v-show="item.item_code !== itemCode">{{item.item_code}}</option>
                    </select>
                </div>
                <!-- <div v-if="enableProcessInsertion === true" class="col-md-2">
                    <label for="">Process Insertion :</label>
                    <select multiple class="form-select" v-model="additionalOption" @change="handleSectionOptions">
                        <option v-for="sec in section" v-show="parseInt(sec.section_id) !== parseInt(sectionId)" :value="sec.section_id">{{sec.section_code}} - {{sec.section_description}}</option>
                    </select>
                </div> -->
                <div v-if="enableProcessInsertion === true" class="col-md-2">
                    Section Additional Options :
                    <ul>
                        <li v-for="sec in additionalSection">{{sec.section_code}} - {{sec.section_description}}</li>
                    </ul>
                </div>
                <div class="col-md-12 p-3"></div>
                <hr>
                <div v-if="submissionOnProgress" class="col-md-12 alert alert-warning">
                    <p>System Alert: Please avoid closing or refreshing the page. Thank you for your patience as we complete the submission.</p>
                </div>
                <div class="col-md-5 border-end p-2" v-if="keyLoader > 0 && keyLoader !== 100 || subLoader > 0 && subLoader !== 100">
                    <p>Key Process: <em class="text-decoration-underline fw-semibold">{{loadPname}}</em>... </p>
                    <div class="progress" role="progressbar" aria-label="Example with label" :aria-valuenow="keyLoader" aria-valuemin="0" aria-valuemax="100">
                        <div class="progress-bar" :style="'width: '+keyLoader+'%'">{{keyLoader.toFixed(2)}}%</div>
                    </div>
                </div>
                <div class="col-md-7 p-2" v-if="keyLoader > 0 && keyLoader !== 100 || subLoader > 0 && subLoader !== 100">
                    <p>Sub Process: <em class="text-decoration-underline fw-semibold">{{loadSubPname}}</em>... Condition: <em class="text-decoration-underline fw-semibold">{{loadDetail}}</em>...</p>
                    <div class="progress" role="progressbar" aria-label="Example with label" :aria-valuenow="subLoader" aria-valuemin="0" aria-valuemax="100">
                        <div class="progress-bar" :style="'width: '+subLoader+'%'">{{ subLoader.toFixed(2)}}%</div>
                    </div>
                </div>
              </div>
              <div class="col-md-12 row mx-auto shadow">
                <div class="col-md-5 mx-auto border-end table-responsive pt-5">
                    <table class="table shadow">
                        <thead>
                            <tr class="text-bg-primary bg-gradient">
                                <th></th>
                                <th><small>No.</small></th>
                                <th><small>Op. No.</small></th>
                                <th><small>Section</small></th>
                                <th><small>Code</small></th>
                                <th><small>Key Process</small></th>
                                <!-- <th></th> -->
                                <th><small>Remove</small></th>
                                <th><small>View</small></th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-for="(key, index) in keyProcessFlow" :key="key.Pid">
                            <tr :style=" 'border-color: '+key.color" class="table-light">
                                <td :style=" 'background-color: '+key.color">

                                </td>
                                <td> 
                                    <input @input="reSequence(key.Pid , key.sequence_number)" v-if="key.sequence_number === 0 || key.sequence_number === ''" type="number" class="form-control" v-model="key.sequence_number">
                                    <p v-else>{{key.sequence_number}}</p>
                                    <!-- {{key.sequence_number}} -->
                                </td>
                                <td>
                                    <input type="number" class="form-control" v-model="key.operation_number" :disabled="flowStatus === 'Posted' || finishedKeySubmission">
                                </td>
                                <td>
                                    <select v-if="additionalSection.length >= 1 && key.Pid === ''" class="form-select" :id="'section'+key.Pid" v-model="key.section_id" >
                                        <option value="" selected disabled></option>
                                        <option v-for="sec in additionalSection" :value="sec.section_id">{{sec.section_code}}</option>
                                    </select>
                                    <template v-else v-for="sec in section" :key="sec.section_id">
                                        <p v-if="parseInt(key.section_id) === parseInt(sec.section_id)">
                                            {{sec.section_code}}
                                        </p>
                                    </template>
                                </td>
                                <td>
                                    {{key.key_code}}
                                </td>
                                <td>
                                    <select v-if="key.Pid === ''" class="form-select" v-model="key.Pid" @change="handleKeyProcessChange(key.Pid, key.sequence_number)" :disabled="key.Pid !== ''">
                                        <option value="" selected disabled></option>
                                        <template v-if="additionalSection.length >= 2" v-for="option in keyProcess">
                                            <option v-if="key.section_id === option.section_id" :value="option.Pid" :disabled="option.selected">{{option.Pname}}</option>
                                            <option v-else-if="key.Pid !==''" :value="option.Pid" :disabled="option.selected">{{option.Pname}}</option>
                                        </template>
                                        <template v-else v-for="option in keyProcess" >
                                            <option v-if="parseInt(sectionId) === parseInt(option.section_id)" :value="option.Pid" :disabled="option.selected">{{option.Pname}}</option>
                                            <option v-else-if="key.Pid !==''" :value="option.Pid" :disabled="option.selected">{{option.Pname}}</option>
                                        </template>
                                    </select>
                                    <p v-if="key.Pid !== ''">{{key.Pname}}</p>
                                </td>
                                <!-- <td>
                                    <button :id="'edit_sequence'+key.Pid" class="btn btn-sm btn-outline-primary" @click="editSequence(key.Pid, key.sequence_number)">
                                        <span class="material-symbols-outlined">
                                            edit
                                        </span>
                                    </button>
                                </td> -->
                                <td>
                                    <button class="btn btn-sm btn-outline-danger" @click="removeFlow(index, key.Pid)" :disabled="flowStatus === 'Posted'">
                                        <span class="material-symbols-outlined">
                                            close
                                        </span>
                                    </button>
                                </td>
                                <td>
                                    <button class="btn btn-sm" type="button" @click="accordionToggler(key.Pid)">
                                        <span class="material-symbols-outlined">
                                            expand_more
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr v-show="toggle[key.Pid]">
                                <td colspan="10">
                                    <div class="table-responsive">
                                        <p class="fs-5"><em>{{key.key_code}}</em></p>
                                        <table class="table">
                                            <thead>
                                                <tr>
                                                    <th>Standard Time</th>
                                                    <th>Machine Time</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td><input type="text" class="form-control" v-model="key.standard_time" :disabled="flowStatus === 'Posted' || finishedKeySubmission"></td>
                                                    <td><input type="text" class="form-control" v-model="key.machine_time" :disabled="flowStatus === 'Posted' || finishedKeySubmission"></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </td>
                            </tr>
                            </template>
                        </tbody>
                        <tbody>
                            <tr>
                                <td colspan="6"></td>
                                <td colspan="2">
                                    <button 
                                    ref="addBtn" 
                                    class="btn btm-sm btn-primary bg-gradient float-end w-100 shadow" 
                                    @click="addKeyProcessFlow" 
                                    :disabled="sectionId == '' || itemPartsNumber == '' || itemCode == '' || flowStatus === 'Posted'"
                                    >
                                        <span class="material-symbols-outlined">add</span>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="col-md-7 table-responsive pt-5">
                    <table class="table shadow">
                        <thead>
                            <tr class="text-bg-primary bg-gradient">
                                <th></th>
                                <th><small>No.</small></th>
                                <th><small>Key Code</small></th>
                                <th><small>Sub Process</small></th>
                                <th><small>Sampling</small></th>
                                <th><small>With Quantity</small></th>
                                <th><small>Uncontrolled Quantity</small></th>
                                <th><small>Status</small></th>
                                <th><small>Hide</small></th>
                                <th><small>View</small></th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-for="(sub, index) in subProcessFlow" :key="sub.SubPid">
                                <tr v-if="sub.hidden !== true" :style=" 'border-color: '+sub.color" :class=" sub.sub_status_label === 'Inactive' ? 'table-secondary' : 'table-light'" >
                                    <td :style=" 'background-color: '+sub.color">

                                    </td>
                                    <td>{{sub.sequence_number}}</td>
                                    <td>{{sub.key_code}}</td>
                                    <td>{{sub.SubPname}}</td>
                                    <td>
                                        <div class="form-check form-switch">
                                            <input class="form-check-input mx-auto" @change="samplingStatus(sub.SubPid)" type="checkbox" role="switch" :id="'sampling'+sub.SubPid" :checked="sub.sampling" :disabled="flowStatus === 'Posted' || finishedSubSubmission">
                                        </div>
                                        <span 
                                        :class="sub.sampling === true ? 'badge text-bg-primary' : 'badge text-bg-secondary'"
                                        >{{sub.sampling === true ? 'With Sampling' : 'Without Sampling'}}
                                        </span>
                                    </td>
                                    <td>
                                        <div class="form-check form-switch">
                                            <input class="form-check-input mx-auto" @change="withQuantityStatus(sub.SubPid)" type="checkbox" role="switch" :id="'with_quantity'+sub.SubPid" :checked="sub.with_quantity === 1 ? true : false" :disabled="flowStatus === 'Posted' || finishedSubSubmission">
                                        </div>
                                        <span 
                                        :class="sub.with_quantity === 1 ? 'badge text-bg-success' : 'badge text-bg-secondary'"
                                        >{{sub.with_quantity === 1 ? 'With Quantity' : 'Without Quantity'}}
                                        </span>
                                    </td>
                                    <td>
                                        <div class="form-check form-switch">
                                            <input class="form-check-input mx-auto" @change="uncontrolledStatus(sub.SubPid)" type="checkbox" role="switch" :id="'uncontrolled'+sub.SubPid" :checked="sub.uncontrolled" :disabled="flowStatus === 'Posted' || finishedSubSubmission">
                                        </div>
                                        <span 
                                        :class="sub.uncontrolled === true ? 'badge text-bg-success' : 'badge text-bg-secondary'"
                                        >{{sub.uncontrolled === true ? 'Uncontrolled Quantity' : 'Controlled Quantity'}}
                                        </span>
                                    </td>
                                    <td>
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" @change="subProcessFlowStatus(sub.SubPid)" type="checkbox" role="switch" :id="'status'+sub.SubPid" :checked="sub.sub_status" :disabled="flowStatus === 'Posted' || finishedSubSubmission">
                                            <label class="form-check-label" :for="'status'+sub.SubPid">{{sub.sub_status_label}}</label>
                                        </div>
                                    </td>
                                    <td>
                                        <button class="btn btn-sm rounded-circle btn-danger shadow" @click="hide(sub.SubPid)" :disabled="sub.sub_status_label === 'Active'">
                                            <span class="material-symbols-outlined fs-5">
                                                remove
                                            </span>
                                        </button>
                                    </td>
                                    <td>
                                        <button class="btn btn-sm" @click="accordionToggler(sub.sequence_number)" type="button" >
                                            <span class="material-symbols-outlined">
                                                {{toggle[sub.sequence_number] ? 'expand_less' : 'expand_more' }}
                                            </span>
                                        </button>
                                    </td>
                                </tr>
                                <tr v-show="toggle[sub.sequence_number]">
                                    <td colspan="13">
                                        <div class="row p-3">
                                            <div class="col-md-4">
                                                <label :for="'tpc_status' + sub.SubPid">TPC Status :</label>
                                                <select :id="'tpc_status' + sub.SubPid" class="form-select" v-model="sub.status" :disabled="flowStatus === 'Posted' || finishedSubSubmission || index === 0">
                                                    <option value="Open">Open</option>
                                                    <option value="Close">Close</option>
                                                </select>
                                            </div>
                                            <div class="col-md-4">
                                                <label :for="'batching' + sub.SubPid">Batching Type :</label>
                                                <select :id="'batching' + sub.SubPid" class="form-select" v-model="sub.batching_type" :disabled="flowStatus === 'Posted' || finishedSubSubmission">
                                                    <option value="Standard">Standard</option>
                                                    <option value="Parallel">Parallel</option>
                                                </select>
                                            </div>
                                            <div class="col-md-4">
                                                <label :for="'result' + sub.SubPid">Result Type :</label>
                                                <select :id="'result' + sub.SubPid" class="form-select" v-model="sub.result_type" :disabled="flowStatus === 'Posted' || finishedSubSubmission">
                                                    <option value="Wafer">Wafer</option>
                                                    <option value="Chips">Chips</option>
                                                </select>
                                            </div>
                                            <div class="col-md-6">
                                                <label :for="'subStandardTime'+sub.SubPid">Standard Time: </label>
                                                <input :id="'subStandardTime'+sub.SubPid" type="text" class="form-control" v-model="sub.standard_time" :disabled="flowStatus === 'Posted' || finishedSubSubmission">
                                            </div>
                                            <div class="col-md-6">
                                                <label :for="'subMachineTime'+sub.SubPid">Machine Time: </label>
                                                <input :id="'subMachineTime'+sub.SubPid" type="text" class="form-control" v-model="sub.machine_time" :disabled="flowStatus === 'Posted' || finishedSubSubmission">
                                            </div>
                                        </div>
                                        <p class="fs-5"><em>- Process Conditions of {{sub.SubPname}}</em></p>
                                        <div :style="'background-color: '+sub.color" class="table-responsive shadow rounded p-3">
                                            <table class="table bg-light">
                                                <thead>
                                                    <tr>
                                                        <th>No.</th>
                                                        <th>Process Detail Description</th>
                                                        <th>Typical Value</th>
                                                        <th>Minimum Value</th>
                                                        <th>Maximum Value</th>
                                                        <th>Target Value Visibility</th>
                                                        <th>Edit</th>
                                                        <th class="text-center">
                                                            Status
                                                            <div class="form-check">
                                                                <input class="form-check-input mx-auto" @change="conditionStatusGenSwitch(sub.SubPid)" type="checkbox" :id="'conditionStatus'+sub.SubPid" :checked="true" :disabled="flowStatus === 'Posted'">
                                                            </div>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                <template v-for="condition in sub.conditions" :key="condition.item_id">
                                                    <tr v-if="sub.SubPid === condition.SubPid" :class="condition.status_label === 'Inactive' ? 'table-secondary' : 'table-light'">
                                                        <td>{{condition.sequence_number}}</td>
                                                        <td>{{condition.detail_description}}</td>
                                                        <td>{{condition.typical_value ? condition.typical_value : '-'}}</td>
                                                        <td>{{condition.min_value}}</td>
                                                        <td>{{condition.max_value}}</td>
                                                        <td>
                                                            <div class="form-check form-switch">
                                                                <input class="form-check-input" @click="itemConditionVisibility(condition.item_id, sub.SubPid)" type="checkbox" role="switch" :id="'visibilityStatus'+condition.item_id" :checked="condition.visibility" :disabled="flowStatus === 'Posted' || finishedSubSubmission">
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <button class="btn btn-primary btn-sm" @click="editCondition(condition.SubPid, condition.item_id)" disabled>
                                                                <span class="material-symbols-outlined">
                                                                    edit
                                                                </span>
                                                            </button>
                                                        </td>
                                                        <td>
                                                            <div class="form-check form-switch">
                                                                <input class="form-check-input" @click="itemConditionStatus(condition.item_id, sub.SubPid)" type="checkbox" role="switch" :id="'itemStatus'+condition.item_id" :checked="condition.status" :disabled="!sub.sub_status || flowStatus === 'Posted' || finishedSubSubmission">
                                                                <label class="form-check-label" :for="'itemStatus'+condition.item_id">{{condition.status_label}}</label>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr v-if="sub.SubPid === condition.SubPid && editToggle[condition.item_id]" :class="condition.status_label === 'Inactive' ? 'table-secondary' : 'table-light'">
                                                        <td>{{condition.sequence_number}}</td>
                                                        <td><input type="text" class="form-control" v-model="condition.detail_description"></td>
                                                        <td><input type="text" class="form-control" v-model="condition.typical_value"></td>
                                                        <td><input type="text" class="form-control" v-model="condition.min_value"></td>
                                                        <td><input type="text" class="form-control" v-model="condition.max_value"></td>
                                                        <td>
                                                            <div class="form-check form-switch">
                                                                <input class="form-check-input" @click="itemConditionVisibility(condition.item_id, sub.SubPid)" type="checkbox" role="switch" :id="'visibilityStatus'+condition.item_id" :checked="condition.visibility" :disabled="flowStatus === 'Posted' || finishedSubSubmission">
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <button class="btn btn-sm btn-primary" @click="updateCondition(condition.SubPid, condition.item_id)" disabled>
                                                                <span class="material-symbols-outlined">
                                                                    update
                                                                </span>
                                                            </button>
                                                        </td>
                                                        <td>
                                                            <div class="form-check form-switch">
                                                                <input class="form-check-input" @click="itemConditionStatus(condition.item_id, sub.SubPid)" type="checkbox" role="switch" :id="'itemStatus'+condition.item_id" :checked="condition.status" :disabled="!sub.sub_status || flowStatus === 'Posted' || finishedSubSubmission">
                                                                <label class="form-check-label" :for="'itemStatus'+condition.item_id">{{condition.status_label}}</label>
                                                            </div>
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
                        
                        <tbody>
                            <template v-for="sub in subProcessFlow" :key="sub.SubPid">
                                <tr v-if="sub.hidden === true" v-show="showHidden" :style=" 'border-color: '+sub.color" :class=" sub.sub_status_label === 'Inactive' ? 'table-secondary' : 'table-light'" >
                                    <td :style=" 'background-color: '+sub.color">

                                    </td>
                                    <td>{{sub.sequence_number}}</td>
                                    <td>{{sub.key_code}}</td>
                                    <td colspan="7">{{sub.SubPname}}</td>
                                    <td>
                                        <button class="btn btn-sm rounded-circle btn-danger shadow" @click="show(sub.SubPid)" :disabled="sub.sub_status_label === 'Active'">
                                            <span class="material-symbols-outlined fs-5">
                                                add
                                            </span>
                                        </button>
                                    </td>
                                    <td></td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                    <div v-if="flowStatus === 'Unposted'" class="col-2 float-end p-1">
                        <button class="btn btn-sm btn-primary bg-gradient shadow w-100" @click="toggleHiddenSub">
                            <span class="material-symbols-outlined align-text-bottom">
                                visibility
                            </span>
                        </button>
                    </div>   
                </div>
              </div>

            </div>
          </div>
        </div>
    </div>

    <div class="toast-container position-fixed top-0 end-0 p-3">
        <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="toast-header">
            <strong class="me-auto">Alert</strong>
            <small>a while ago</small>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div class="toast-body">
            {{alert}}
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
                requestFlowKeyURL: 'http://172.16.2.13/tpc-endpoint/requestKeyProcessFlow.php',
                requestFlowSubURL: 'http://172.16.2.13/tpc-endpoint/requestSubProcessFlow.php',
                requestFlowConditionURL: 'http://172.16.2.13/tpc-endpoint/requestConditionProcessFlow.php',
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

                PutProcessFlowKeyURL: 'http://172.16.2.13/tpc-endpoint/PutProcessFlowKey.php',
                PutProcessFlowSubURL: 'http://172.16.2.13/tpc-endpoint/PutProcessFlowSub.php',
                PutProcessFlowStatusURL: 'http://172.16.2.13/tpc-endpoint/PutProcessFlowMainStatus.php',
                PutProcessFlowConditionURL: 'http://172.16.2.13/tpc-endpoint/PutProcessFlowCondition.php',


                // requestFlowKeyURL: 'http://172.16.2.13/tpc-endpointDev/requestKeyProcessFlow.php',
                // requestFlowSubURL: 'http://172.16.2.13/tpc-endpointDev/requestSubProcessFlow.php',
                // requestFlowConditionURL: 'http://172.16.2.13/tpc-endpointDev/requestConditionProcessFlow.php',
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

                // PutProcessFlowKeyURL: 'http://172.16.2.13/tpc-endpointDev/PutProcessFlowKey.php',
                // PutProcessFlowSubURL: 'http://172.16.2.13/tpc-endpointDev/PutProcessFlowSub.php',
                // PutProcessFlowStatusURL: 'http://172.16.2.13/tpc-endpointDev/PutProcessFlowMainStatus.php',
                // PutProcessFlowConditionURL: 'http://172.16.2.13/tpc-endpointDev/PutProcessFlowCondition.php',

                flow_main_id: '',
                flowType: '',
                sectionId: '',
                sectionCode: '',
                itemPartsNumber: '',
                itemCode: '',
                revisionNumber: '',
                flowStatus: 'Unposted',
                encodedBy: '3141',
                remarks: '',

                flow_status: false,

                alert: '',

                loadPname: '',
                loadSubPname: '',
                loadDetail: '',

                finishedKeySubmission: false,
                finishedSubSubmission: false,
                finishedMainSubmission: false,
                finishedConditionSubmission: false,

                enableProcessInsertion: false,
                enableCloning: false,

                tempItemCode: '',
                
                keyLoader: 0,
                subLoader: 0,
                submissionOnProgress: false,

                oldKey: [],
                oldSub: [],

                showHidden: false,

                itemMaster: [],
                processFlow: [],
                section: [],
                keyProcess: [],
                subProcess: [],
                itemCodeList: [],

                KEYOptions: [],
                SWPOptions: [],
                CCDOptions: [],
                additionalSection: [],
                additionalOption: [],

                keyProcessFlow: [],
                subProcessFlow: [],
                conditionProcessFlow: [],
                columns: [
                  { title: 'No', data: 'flow_main_id'},
                  { title: 'Flow Type', data: 'flow_type' },
                  { title: 'Section', data: 'section_code' },
                  { title: 'Parts Number', data: 'item_parts_number' },
                  { title: 'Item Code', data: 'item_code' },
                  { title: 'Item Description', data: 'item_description' },
                  { title: 'Revision No', data: 'revision_number' },
                  { title: 'Remarks', data: 'flow_remarks' },
                  { title: 'Date Created', data: 'date_encoded' },
                  { title: 'Created By', data: 'encoded_by' },
                  { title: 'Status', data: 'flow_status' },
                  { title: 'Open', data: null, 
                  orderable: false, 
                  render: function (data) { 
                                  return '<button data-bs-toggle="modal" data-bs-target="#createProcessFlow" class="btn w-100"><span class="material-symbols-outlined">open_in_new</span></button'
                              } 
                          },
                    ],
                toggle: {},
                editToggle: {},
                }
                
        },
        computed:{
            
        },
        methods: {
            editCondition(SubPid, item_id){
                this.editToggle[item_id] = !this.editToggle[item_id];
            },
            updateCondition(SubPid, item_id){
                this.subProcessFlow.find(s => {
                    if(parseInt(SubPid) === parseInt(s.SubPid)){
                        s.conditions.find(c => {
                            if(parseInt(item_id) === parseInt(c.item_id)){
                                console.log(c);
                                console.log(c.detail_description);
                                console.log(this.flow_main_id);
                                axios.put(this.PutProcessFlowConditionURL, {
                                    flow_main_id: this.flow_main_id,
                                    item_id: c.item_id,
                                    min_value: c.min_value,
                                    max_value: c.max_value,
                                    detail_description: c.detail_description,
                                    typical_value: c.typical_value
                                }).then(response => {
                                    console.log(response.data);
                                }).catch(error => {
                                    console.error(error);
                                })
                            }
                        })
                    }
                })
            },
            conditionStatusGenSwitch(SubPid){
                let switchVal = document.getElementById(`conditionStatus${SubPid}`).checked;
                this.subProcessFlow.find(sub => {
                    if(parseInt(SubPid) === parseInt(sub.SubPid)){
                        sub.conditions.map(con => {
                            con.status = switchVal;
                            con.status_label = switchVal === true ? 'Active' : 'Inactive';
                        })
                    }
                })
            },
            async clone(itemCode){
                this.keyProcessFlow = [];
                this.subProcessFlow = [];
                this.$refs.addBtn.disabled = false;
                let latestRevNo = -1;
                let partsNumber = '';
                if(this.sectionCode === 'SWP'){
                for(const option of this.SWPOptions){
                        option.selected = false;
                    }
                } else {
                    for(const option of this.KEYOptions){
                        option.selected = false;
                    }
                }
                for(const item of this.itemMaster){
                    if(itemCode === item.item_code){
                    //    this.itemPartsNumber = item.item_parts_number
                       partsNumber = item.item_parts_number
                    }
                }
                for(const flow of this.processFlow){
                    if(partsNumber === flow.item_parts_number && itemCode === flow.item_code && parseInt(this.sectionId) === parseInt(flow.section_id) && flow.flow_status === 'Posted'){
                        if(flow.revision_number > latestRevNo){
                            latestRevNo = flow.revision_number;
                        }
                    }
                }
                // for(const item of this.itemCodeList){
                //     if(item.item_code === itemCode){
                //         this.itemDescription = item.item_description
                //     }
                // }
                for(const flow of this.processFlow){
                    if(partsNumber === flow.item_parts_number && itemCode === flow.item_code && parseInt(this.sectionId) === parseInt(flow.section_id) && flow.flow_status === 'Posted' && flow.revision_number === latestRevNo){
                            await axios.get(this.requestFlowKeyURL, {
                                method: 'GET',
                                headers: {
                                    'Content-type': 'application/x-www-form-urlencoded'
                                },
                                params: {
                                    flow_main_id: flow.flow_main_id
                                }
                            }).then(response => {
                                for(const flowkey of response.data){
                                    let hue = Math.floor(Math.random() * 360);
                                    let pastel = 'hsl(' + hue + ', 100%, 80%)';
                                    for(const key of this.keyProcess){
                                        if(parseInt(flowkey.Pid) === parseInt(key.Pid)){
                                            Object.assign(flowkey, {
                                                key_code: key.key_code,
                                                Pname: key.Pname,
                                                color: pastel,
                                            })
                                        }
                                    }
                                    this.keyProcessFlow.push(flowkey);
                                    for(const option of this.KEYOptions){
                                        if(parseInt(flowkey.Pid) === parseInt(option.Pid)){
                                            option.selected = true;
                                        }
                                    }
                                }
                                this.keyProcessFlow.sort((a,b) => a.sequence_number - b.sequence_number);
                            }).catch(error => {
                                console.log(error);
                            });

                            await axios.get(this.requestFlowSubURL, {
                                method: 'GET',
                                headers: {
                                    'Content-type': 'application/x-www-form-urlencoded'
                                },
                                params: {
                                    
                                    flow_main_id: flow.flow_main_id
                                }
                            }).then(response => {
                                for(const flowSub of response.data){
                                    for(const sub of this.subProcess){
                                        if(parseInt(flowSub.SubPid) === parseInt(sub.SubPid)){
                                            let openFirstTPCStatus = this.subProcessFlow.length === 0 ? 'Open' : 'Close';
                                            Object.assign(flowSub, {
                                                SubPname: sub.SubPname,
                                                sampling: flowSub.check_sampling === "True" ? true : false,
                                                uncontrolled: flowSub.check_uncontrolled === "True" ? true : false,
                                                sub_status: flowSub.sub_status === "Active" ? true : false,
                                                sub_status_label: flowSub.sub_status === "Active" ? "Active" : "Inactive",
                                                hidden: false,
                                                with_quantity: flowSub.with_quantity === null ? 1 : flowSub.with_quantity,
                                                status: flowSub.status === null ? openFirstTPCStatus : flowSub.status,
                                                conditions: [],
                                            });
                                            this.subProcessFlow.sort((a,b) => a.sequence_number - b.sequence_number).push(flowSub);
                                        }
                                    }
                                    for(const key of this.keyProcess){
                                        if(parseInt(flowSub.Pid) === parseInt(key.Pid)){
                                            flowSub.key_code = key.key_code;
                                        }
                                    }
                                    for(const flowKey of this.keyProcessFlow){
                                        if(parseInt(flowKey.Pid) === parseInt(flowSub.Pid)){
                                            Object.assign(flowSub,{
                                                color: flowKey.color,
                                                parent_sequence: flowKey.sequence_number
                                            })
                                        }
                                    }
                                    this.getProcessFlowCondition(flowSub.SubPid);
                                }
                            }).catch(error => {
                                console.log(error);
                            });
                            
                    } 
                }
                // this.revisionNumber = latestRevNo + 1;
                if(this.keyProcessFlow.length === 0){
                    if(this.sectionCode === 'SWP'){
                        for(const option of this.SWPOptions){
                                option.selected = false;
                            }
                        } else {
                            for(const option of this.KEYOptions){
                                option.selected = false;
                            }
                        }
                }
            },
            cloningSwitch(){
                let switchVal = document.getElementById('enableCloning').checked;
                this.enableCloning = switchVal
            },
            toggleHiddenSub(){
                this.showHidden = !this.showHidden;
            },
            accordionToggler(id){
                this.toggle[id] = !this.toggle[id];
            },
            hide(SubPid){
                let sub = this.subProcessFlow.find(sub => parseInt(sub.SubPid) === SubPid);
                sub.hidden = true;
                sub.sub_status = false;
                sub.sub_status_label = 'Inactive';
            },
            show(SubPid){
                let sub = this.subProcessFlow.find(sub => parseInt(sub.SubPid) === SubPid);
                console.log(sub);
                sub.hidden = false;
                sub.sub_status = true;
                sub.sub_status_label = 'Active';
            },
            async deleteFlow(){
                await this.DeleteCondition(this.flow_main_id);
                await this.DeleteSub(this.flow_main_id);
                await this.DeleteKey(this.flow_main_id);
                await axios.post(this.DeleteProcessFlowURL, {
                    flow_main_id: this.flow_main_id
                }).then(response => {
                    if(response.data.message === 'Process Flow deleted successfully'){
                        console.log(response.data)
                        for(const flow of this.processFlow) {
                          if (this.flow_main_id === flow.flow_main_id) {
                            const index = this.processFlow.indexOf(flow);
                            this.processFlow.splice(index, 1);
                          }
                        }
                    }
                }).catch(error => {
                    console.log(error)
                }) 
            },
            async Posting(){
                this.$refs.postingBtn.disabled = true;
                await axios.put(this.PutProcessFlowStatusURL, {
                    flow_main_id: this.flow_main_id,
                    flow_status: this.flowStatus
                }).then(response => {
                    if(response.data.message === 'Process Flow Status updated successfully'){
                        for(const flow of this.processFlow){
                            if(parseInt(this.flow_main_id) === parseInt(flow.flow_main_id)){
                                flow.flow_status = this.flowStatus;
                                let initiateQuery = async () => {
                                    await this.DestroyFlow(this.flow_main_id);
                                    this.SubmitKey(this.flow_main_id);
                                    this.PostSub(this.flow_main_id);
                                }
                                initiateQuery();
                            }
                            
                        }
                    }
                }).catch(error => {
                    console.log(error)
                })
            },
            async DestroyFlow(flow_main_id){
                await axios.post(this.DeleteFlowCondition, {
                    flow_main_id: flow_main_id
                }).then(response => {
                    console.log(response.data)
                }).catch(error => {
                    console.log(error);
                })
                await axios.post(this.DeleteFlowSub, {
                    flow_main_id: flow_main_id
                }).then(response => {
                    console.log(response.data)
                }).catch(error => {
                    console.log(error);
                })
                await axios.post(this.DeleteFlowKey, {
                    flow_main_id: flow_main_id
                }).then(response => {
                    console.log(response.data)
                }).catch(error => {
                    console.log(error);
                })
            },
            DeleteKey(flow_main_id){
                axios.post(this.DeleteFlowKey, {
                    flow_main_id: flow_main_id
                }).then(response => {
                    console.log(response.data)
                }).catch(error => {
                    console.log(error);
                })

            },
            DeleteSub(flow_main_id){
                axios.post(this.DeleteFlowSub, {
                    flow_main_id: flow_main_id
                }).then(response => {
                    console.log(response.data)
                }).catch(error => {
                    console.log(error);
                })
            },
            DeleteCondition(flow_main_id){
                axios.post(this.DeleteFlowCondition, {
                    flow_main_id: flow_main_id
                }).then(response => {
                    console.log(response.data)
                }).catch(error => {
                    console.log(error);
                })
            },
            async viewing(event){
                if(event.target.tagName == 'BUTTON'){
                    const row = event.target.parentNode.parentNode;
                    const cell = row.querySelector('td');
                    this.flow_main_id = parseInt(cell.textContent);
                }
                if(event.target.tagName == 'SPAN'){
                    const row = event.target.parentNode.parentNode.parentNode;
                    const cell = row.querySelector('td');
                    this.flow_main_id = parseInt(cell.textContent);
                }
                for(const flow of this.processFlow){
                    if(flow.flow_main_id === this.flow_main_id){;
                        this.flowType = flow.flow_type;
                        this.sectionId = parseInt(flow.section_id);
                        this.itemPartsNumber = flow.item_parts_number;
                        this.itemCode = flow.item_code;
                        this.itemDescription = flow.item_description;
                        this.dateEncoded = flow.date_encoded;
                        this.flowStatus = flow.flow_status;
                        this.revisionNumber = flow.revision_number;
                        this.encodedBy = flow.encoded_by;
                        this.remarks = flow.flow_remarks;
                        this.flow_status = flow.flow_status === 'Posted' ? true : false;
                    }
                }
                await this.assignSectionCode(this.sectionId);
                await this.assignFlowKey(this.flow_main_id);
                await this.assignFlowSub(this.flow_main_id);
                await this.getProcessFlowCondition();
                

            },
            enablePostingBtn(){
                this.$refs.postingBtn.disabled = false;
            },
            async submitFlow(){
                this.$refs.closeBtn.disabled = true;
                this.$refs.submitBtn.disabled = true;
                let flowTypeisNull = false;
                let sectionisNull = false;
                let partsNumberisNull = false;
                let itemCodeisNull = false;
                let filterNull = false;
                const toastLiveExample = document.getElementById('liveToast');
                const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
                let flow_main_id = '';
                if(this.flowType === ''){
                    flowTypeisNull = true;
                    this.alert = 'System Alert: Detection of an Unassigned Flow Type. Please conduct a thorough review.';
                    toastBootstrap.show()
                }
                if(this.sectionId === ''){
                    sectionisNull = true;
                    this.alert = 'System Alert: Detection of an Unassigned Section. Please conduct a thorough review.';
                    toastBootstrap.show()
                }
                if(this.itemPartsNumber === ''){
                    partsNumberisNull = true;
                    this.alert = 'System Alert: Detection of an Unassigned Parts Number. Please conduct a thorough review.';
                    toastBootstrap.show()
                }
                if(this.itemCode === ''){
                    itemCodeisNull = true;
                    this.alert = 'System Alert: Detection of an Unassigned Item Code. Please conduct a thorough review.';
                    toastBootstrap.show()
                }
                for(const key of this.keyProcessFlow){
                    if(key.Pid === ''){
                        toastBootstrap.show()
                        this.alert = 'System Alert: Detection of an Unassigned Key Process. Please conduct a thorough review.';
                        filterNull = true;
                        break;            
                    } else {                    
                        filterNull = false;
                    }
                    if(key.operation_number === '' || key.operation_number === 0){
                        toastBootstrap.show()
                        this.alert = 'System Alert: Detection of an Unassigned Operation Number. Please conduct a thorough review.';
                        filterNull = true;
                        break;
                        
                    } else {
                        filterNull = false;
                    }
                }
                if(filterNull || flowTypeisNull || sectionisNull || partsNumberisNull || itemCodeisNull){
                    this.$refs.submitBtn.disabled = false;
                } else {
                    this.subProcessFlow[0].status = 'Open';
                    await axios.post(this.PostProcessFlowURL, {
                        parts_number: this.itemPartsNumber,
                        item_code: this.itemCode,
                        item_description: this.itemDescription,
                        section_id: this.sectionId,
                        revision_number: this.revisionNumber,
                        flow_status: this.flowStatus,
                        remarks: this.remarks,
                        encoded_by: this.encodedBy,
                        date_encoded: this.dateEncoded,
                        flow_type: this.flowType,
                    }).then(response => {
                        console.log(response.data);
                        if(response.data.message === 'Form Assignment inserted successfully'){
                            this.submissionOnProgress = true;
                            this.finishedMainSubmission = true;
                            this.flow_main_id = response.data.flow_main_id;
                            flow_main_id = response.data.flow_main_id;
                            this.processFlow.push({
                                flow_main_id: flow_main_id,
                                flow_type: this.flowType,
                                section_id: this.sectionId,
                                section_code: this.sectionCode,
                                item_parts_number: this.itemPartsNumber,
                                item_code: this.itemCode,
                                item_description: this.itemDescription,
                                revision_number: this.revisionNumber,
                                flow_remarks: this.remarks,
                                date_encoded: this.dateEncoded,
                                encoded_by: this.encodedBy,
                                flow_status: this.flowStatus,
                            })
                            let submitFlow = async (flow_main_id) => {
                                await this.SubmitKey(flow_main_id);
                                await this.SubmitSub(flow_main_id);
                            }
                            submitFlow(flow_main_id);
                            
                        }
                    }).catch(error => {
                        if(!error.response){
                            console.log('network error');
                        }
                    })
                }
                
            },
            async SubmitKey(flow_main_id){
                const toastLiveExample = document.getElementById('liveToast');
                const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);

                let limit = this.keyProcessFlow.length;
                let loader = 0;
                for(const key of this.keyProcessFlow){
                    await axios.post(this.PostKeyProcessFlowURL, {
                        main_flow_id: flow_main_id,
                        operation_number: key.operation_number,
                        section_id: key.section_id,
                        parts_number: this.itemPartsNumber,
                        revision_number: this.revisionNumber,
                        Pid: key.Pid,
                        sequence_number: key.sequence_number,
                        standard_time: key.standard_time,
                        machine_time: key.machine_time,
                        item_code: this.itemCode,   
                    }).then(response => {
                        if(response.data.message === 'Process Flow Key inserted successfully'){
                            this.loadPname = key.Pname;
                            loader++;
                            this.keyLoader = (loader / limit) * 100;
                            if(loader === limit){
                                this.loadPname = '';
                                this.finishedKeySubmission = true;
                                this.alert = 'Flow Key Submission: Complete';
                                toastBootstrap.show(); 
                            }
                            if(this.keyLoader === 100){
                                this.loadPname = '';
                            }
                        }
                    }).catch(error => {
                        console.log(error);
                    });
                }
            },
            async SubmitSub(flow_main_id){
                const toastLiveExample = document.getElementById('liveToast');
                const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);

                let limit = this.subProcessFlow.length;
                let loader = 0;
                for(const sub of this.subProcessFlow){
                    sub.hidden = sub.hidden === true ? '1' : '0';
                    await axios.post(this.PostSubProcessFlowURL, {
                        main_flow_id: flow_main_id,
                        section_id: this.sectionId,
                        parts_number: this.itemPartsNumber,
                        revision_number: this.revisionNumber,
                        Pid: sub.Pid,
                        SubPid: sub.SubPid,
                        sequence_number: sub.sequence_number,
                        standard_time: sub.standard_time,
                        machine_time: sub.machine_time,
                        item_code: this.itemCode,  
                        check_sampling: sub.check_sampling,
                        check_uncontrolled: sub.check_uncontrolled,
                        batching_type: sub.batching_type,
                        result_type: sub.result_type,
                        check_sub_status: sub.sub_status_label,
                        status: sub.status,
                        hidden: sub.hidden,
                        with_quantity: sub.with_quantity
                    }).then(response => {
                        if(response.data.message === 'Process Flow Sub inserted successfully'){
                            this.loadSubPname = sub.SubPname;
                            loader++;
                            this.subLoader = (loader / limit) * 100;
                            if(loader === limit){
                                this.loadSubPname = '';
                                this.loadDetail = '';
                                this.finishedSubSubmission = true;
                                this.alert = 'Flow Sub Submission: Complete';
                                toastBootstrap.show();
                            }
                            if(this.subLoader === 100){
                                this.submissionOnProgress = false;
                                this.loadSubPname = '';
                                this.loadDetail = '';
                            }
                        }
                    }).catch(error => {
                        console.log(error.message);
                    });
                    let cLimit = sub.conditions.length;
                    let cloader = 0;
                    for(const condition of sub.conditions){
                        console.log(condition)
                        await axios.post(this.PostConditionProcessFlowURL, {
                            main_flow_id: flow_main_id,
                            item_id: condition.item_id,
                            SubPid: condition.SubPid,
                            sequence_number: condition.sequence_number,
                            detail_description: condition.detail_description,
                            field_type: condition.field_type,
                            typical_value: condition.typical_value,
                            min_value: condition.min_value,
                            max_value: condition.max_value,
                            condition_status: condition.status_label,
                            visibility_status: condition.visibility,
                            database_name: condition.database_name,
                            table_name: condition.table_name,
                            field_name1: condition.fieldname_1,
                            field_name2: condition.fieldname_2,
                            output_fieldname: condition.output_fieldname,
                            fetching_eng: condition.fetching_eng,
                            eng_server: condition.eng_server,
                            eng_db_username: condition.eng_db_username,
                            eng_db_password: condition.eng_db_password
                        }).then(response => {
                            console.log(response.data);
                            if(response.data.message === 'Process Flow Condition inserted successfully'){
                                this.loadDetail = condition.detail_description;
                                cloader++;
                                if(cloader === cLimit){
                                    this.loadDetail = '';
                                }
                            }
                        }).catch(error => {
                            console.log(error);
                        })
                    }
                }
            },
            async PostSub(flow_main_id){
                const toastLiveExample = document.getElementById('liveToast');
                const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);

                let limit = this.subProcessFlow.filter(sub => sub.hidden !== true).length;
                let sequence_no = 1;
                let loader = 0;
                for(const sub of this.subProcessFlow){
                    sub.hidden = sub.hidden === true ? '1' : '0';
                    if(sub.hidden === '0'){
                        sub.sequence_number = sequence_no;
                        await axios.post(this.PostSubProcessFlowURL, {
                            main_flow_id: flow_main_id,
                            section_id: this.sectionId,
                            parts_number: this.itemPartsNumber,
                            revision_number: this.revisionNumber,
                            Pid: sub.Pid,
                            SubPid: sub.SubPid,
                            sequence_number: sub.sequence_number,
                            standard_time: sub.standard_time,
                            machine_time: sub.machine_time,
                            item_code: this.itemCode,  
                            check_sampling: sub.check_sampling,
                            check_uncontrolled: sub.check_uncontrolled,
                            batching_type: sub.batching_type,
                            result_type: sub.result_type,
                            check_sub_status: sub.sub_status_label,
                            status: sub.status,
                            hidden: sub.hidden,
                            with_quantity: sub.with_quantity,
                        }).then(response => {
                            if(response.data.message === 'Process Flow Sub inserted successfully'){
                                this.loadSubPname = sub.SubPname;
                                loader++;
                                this.subLoader = (loader / limit) * 100;
                                if(loader === limit){
                                    this.finishedSubSubmission = true;
                                    this.alert = 'Flow Sub Submission: Complete';
                                    toastBootstrap.show();
                                }
                                if(this.subLoader === 100){
                                    this.submissionOnProgress = false;
                                }
                            }
                        }).catch(error => {
                            console.log(error)
                        });
                        sequence_no++;
                    }
                    for(const condition of sub.conditions){
                        await axios.post(this.PostConditionProcessFlowURL, {
                            main_flow_id: flow_main_id,
                            item_id: condition.item_id,
                            SubPid: condition.SubPid,
                            sequence_number: condition.sequence_number,
                            detail_description: condition.detail_description,
                            field_type: condition.field_type,
                            typical_value: condition.typical_value,
                            min_value: condition.min_value,
                            max_value: condition.max_value,
                            condition_status: condition.status_label,
                            visibility_status: condition.visibility,
                            database_name: condition.database_name,
                            table_name: condition.table_name,
                            field_name1: condition.field_name1,
                            field_name2: condition.field_name2,
                            output_fieldname: condition.output_fieldname,
                            fetching_eng: condition.fetching_eng,
                            eng_server: condition.eng_server,
                            eng_db_username: condition.eng_db_username,
                            eng_db_password: condition.eng_db_password
                        }).then(response => {
                            console.log(response.data);
                            if(response.data.message === 'Process Flow Condition inserted successfully'){
                                this.loadDetail = condition.detail_description;
                            }
                        }).catch(error => {
                            console.log(error);
                        })
                    }
                }
            },
            clearFields(){
                this.flowType = '';
                this.sectionId = '';
                this.sectionCode = '';
                this.itemPartsNumber = '';
                this.itemCode = '';
                this.itemDescription = '';
                this.revisionNumber = '';
                this.flowStatus = 'Unposted';
                this.encodedBy = '3141',
                this.remarks = '';
                this.flow_main_id = '';
                this.keyProcessFlow = [];
                this.subProcessFlow = [];
                this.conditionProcessFlow = [];
                this.finishedKeySubmission = false;
                this.finishedSubSubmission = false;
                this.finishedMainSubmission = false;
                this.keyLoader = 0;
                this.subLoader = 0;
            },
            subProcessFlowStatus(SubPid){
                let status = document.getElementById(`status${SubPid}`).checked;
                for(const sub of this.subProcessFlow){
                    if(parseInt(SubPid) === parseInt(sub.SubPid)){
                        sub.sub_status_label = status ? 'Active' : 'Inactive';
                        for(const condition of sub.conditions){
                            if(parseInt(SubPid) === parseInt(condition.SubPid)){
                                document.getElementById(`itemStatus${condition.item_id}`).disabled = !status;
                                condition.status = status;
                                condition.status_label = status ? 'Active' : 'Inactive';
                            }
                        }
                    }
                }
            },
            samplingStatus(SubPid){
                let status = document.getElementById(`sampling${SubPid}`).checked;
                for(const sub of this.subProcessFlow){
                    if(parseInt(SubPid) === parseInt(sub.SubPid)){
                        sub.sampling = status;
                        sub.check_sampling = status ? 'True' : 'False';
                    }
                }
            },
            withQuantityStatus(SubPid){
                let status = document.getElementById(`with_quantity${SubPid}`).checked;
                console.log(status);
                for(const sub of this.subProcessFlow){
                    if(parseInt(SubPid) === parseInt(sub.SubPid)){
                        sub.with_quantity = status === true ? 1 : 0;
                    }
                }
            },
            uncontrolledStatus(SubPid){
                let status = document.getElementById(`uncontrolled${SubPid}`).checked;
                for(const sub of this.subProcessFlow){
                    if(parseInt(SubPid) === parseInt(sub.SubPid)){
                        sub.uncontrolled = status;
                        sub.check_uncontrolled = status ? 'True' : 'False';
                    }
                }
            },  
            itemConditionStatus(item_id, SubPid){
                let status = document.getElementById(`itemStatus${item_id}`).checked;
                console.log(status);
                for(const sub of this.subProcessFlow){
                    if(parseInt(SubPid) === parseInt(sub.SubPid)){
                        for(const condition of sub.conditions){
                            if(parseInt(item_id) === parseInt(condition.item_id)){
                                console.log(condition);
                                condition.status = status;
                                condition.status_label = status ? 'Active': 'Inactive';
                            }
                        }
                    }
                }
            },
            itemConditionVisibility(item_id, SubPid){
                let status = document.getElementById(`visibilityStatus${item_id}`).checked;
                for(const sub of this.subProcessFlow){
                    if(parseInt(SubPid) === parseInt(sub.SubPid)){
                        for(const condition of sub.conditions){
                            if(parseInt(item_id) === parseInt(condition.item_id)){
                                condition.visibility = status ? true : false;
                            }
                        }
                    }
                }
            },
            handleKeyProcessChange(Pid, sequence_number){
                this.$refs.addBtn.disabled = false;
                let key_code = '';
                let hue = Math.floor(Math.random() * 360);
                let pastel = 'hsl(' + hue + ', 100%, 80%)';
                for(const flowkey of this.keyProcessFlow){
                    if(parseInt(Pid) === parseInt(flowkey.Pid) && sequence_number === flowkey.sequence_number){
                        for(const key of this.keyProcess){
                            if(parseInt(Pid) === parseInt(key.Pid)){
                                Object.assign(flowkey, {
                                    key_code: key.key_code,
                                    Pname: key.Pname,
                                    color: pastel,
                                })
                                key_code = key.key_code
                            }
                        }
                    }
                }
                // if(this.sectionCode === 'SWP'){
                //     for(const option of this.SWPOptions){
                //         if(parseInt(Pid) === parseInt(option.Pid)){
                //             option.selected = true;
                //         }
                //     }
                // } else {
                //     for(const option of this.KEYOptions){
                //         if(parseInt(Pid) === parseInt(option.Pid)){
                //             option.selected = true;
                //         }
                //     }
                // }
                axios.get(this.requestSubURL,{
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    },
                    params: {
                        Pid: Pid
                    }
                }).then(response => {
                   for(const sub of response.data){
                        if(sub.sub_process_status === 'Active'){
                            sub['sequence'] = sub['sequence_number'];
                            sub.sequence_number = '';
                            let openFirstStatus = this.subProcessFlow.length === 0 ? 'Open' : 'Close';
                            this.subProcessFlow.push({
                                Pid: sub.Pid,
                                SubPid: sub.SubPid,
                                key_code: key_code,
                                SubPname: sub.SubPname,
                                sequence_number: sub.sequence_number,
                                standard_time: 0,
                                machine_time: 0,
                                sampling: false,
                                uncontrolled: false,
                                sequence_no: '',
                                sub_status: true,
                                batching_type: 'Standard',
                                check_sampling: 'False',
                                check_uncontrolled: 'False',
                                result_type: 'Wafer',
                                sub_status_label: 'Active',
                                color: pastel,
                                hidden: false,
                                with_quantity: 1,
                                status: openFirstStatus,
                                parent_sequence: sequence_number,
                                conditions: []
                            })
                            this.getCondition(sub.SubPid, sequence_number)
                        }
                   }
                   this.subProcessFlow.sort((a,b) => a.sequence - b.sequence);
                   this.subSequence();
                }).catch(error => {
                    console.log(error)
                });
            },
            async getCondition(SubPid, parent_sequence){
                await axios.get(this.requestConditionURL, {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    },
                    params: {
                        SubPid: SubPid
                    }
                }).then(response => {
                    for(const condition of response.data){
                        Object.assign(condition, {status: true, status_label: 'Active', visibility: true, parent_sequence: parent_sequence });
                        for(const sub of this.subProcessFlow){
                            if(sub.SubPid === condition.SubPid && sub.parent_sequence === condition.parent_sequence){
                                sub.conditions.push(condition);
                                sub.conditions.sort((a,b) => a.sequence_number - b.sequence_number);
                                console.log(sub.condition)
                            }
                        }
                    }
                }).catch(error => {
                    console.log(error)
                });
            }, 
            
            async getFlowCondition(SubPid){
                await axios.get(this.requestConditionURL, {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    },
                    params: {
                        SubPid: SubPid
                    }
                }).then(response => {
                    for(const condition of response.data){
                        // console.log(condition)
                        Object.assign(condition, {status: true, status_label: 'Active', visibility: true ? condition.visibility_status === 1 : 0});
                        for(const sub of this.subProcessFlow){
                            if(sub.SubPid){
                                if(sub.SubPid === condition.SubPid){
                                    sub.conditions.push(condition);
                                    sub.conditions.sort((a,b) => a.sequence_number - b.sequence_number);
                                }
                            }
                        }                                   
                    }
                }).catch(error => {
                    console.log(error)
                });
            },
            async getProcessFlowCondition(){
                await axios.get(this.requestFlowConditionURL, {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    },
                    params: {
                        flow_main_id: this.flow_main_id
                    }
                }).then(response => {
                    for(const condition of response.data){
                        console.log(condition)
                        Object.assign(condition, {status: condition.condition_status === 'Active' ? true : false, status_label: condition.condition_status === 'Active' ? 'Active' : 'Inactive', visibility: true ? condition.visibility_status === 1 : 0});
                        for(const sub of this.subProcessFlow){
                            if(sub.SubPid){
                                if(sub.SubPid === condition.SubPid && sub.parent_sequence === condition.parent_sequence){
                                    sub.conditions.push(condition);
                                    sub.conditions.sort((a,b) => a.sequence_number - b.sequence_number);
                                }
                            }
                        }                                   
                    }
                }).catch(error => {
                    console.log(error)
                });
            },
            async getRevisionNumber(itemCode){
                this.keyProcessFlow = [];
                this.subProcessFlow = [];
                this.$refs.addBtn.disabled = false;
                let latestRevNo = -1;
                let partsNumber = '';
                if(this.sectionCode === 'SWP'){
                for(const option of this.SWPOptions){
                        option.selected = false;
                    }
                } else {
                    for(const option of this.KEYOptions){
                        option.selected = false;
                    }
                }
                for(const item of this.itemMaster){
                    if(itemCode === item.item_code){
                       this.itemPartsNumber = item.item_parts_number
                       partsNumber = item.item_parts_number
                    }
                }
                for(const flow of this.processFlow){
                    if(partsNumber === flow.item_parts_number && itemCode === flow.item_code && parseInt(this.sectionId) === parseInt(flow.section_id) && flow.flow_status === 'Posted'){
                        if(flow.revision_number > latestRevNo){
                            latestRevNo = flow.revision_number;
                        }
                    }
                }
                for(const item of this.itemCodeList){
                    if(item.item_code === itemCode){
                        this.itemDescription = item.item_description
                    }
                }
                for(const flow of this.processFlow){
                    if(partsNumber === flow.item_parts_number && itemCode === flow.item_code && parseInt(this.sectionId) === parseInt(flow.section_id) && flow.flow_status === 'Posted' && flow.revision_number === latestRevNo){
                            console.log(flow.flow_main_id)
                            await axios.get(this.requestFlowKeyURL, {
                                method: 'GET',
                                headers: {
                                    'Content-type': 'application/x-www-form-urlencoded'
                                },
                                params: {
                                    flow_main_id: flow.flow_main_id
                                }
                            }).then(response => {
                                for(const flowkey of response.data){
                                    let hue = Math.floor(Math.random() * 360);
                                    let pastel = 'hsl(' + hue + ', 100%, 80%)';
                                    for(const key of this.keyProcess){
                                        if(parseInt(flowkey.Pid) === parseInt(key.Pid)){
                                            Object.assign(flowkey, {
                                                key_code: key.key_code,
                                                Pname: key.Pname,
                                                color: pastel,
                                            })
                                        }
                                    }
                                    this.keyProcessFlow.push(flowkey);
                                    for(const option of this.KEYOptions){
                                        if(parseInt(flowkey.Pid) === parseInt(option.Pid)){
                                            option.selected = true;
                                        }
                                    }
                                }
                                this.keyProcessFlow.sort((a,b) => a.sequence_number - b.sequence_number);
                            }).catch(error => {
                                console.log(error);
                            });

                            await axios.get(this.requestFlowSubURL, {
                                method: 'GET',
                                headers: {
                                    'Content-type': 'application/x-www-form-urlencoded'
                                },
                                params: {
                                    
                                    flow_main_id: flow.flow_main_id
                                }
                            }).then(response => {
                                for(const flowSub of response.data){
                                    for(const sub of this.subProcess){
                                        if(parseInt(flowSub.SubPid) === parseInt(sub.SubPid)){
                                            let openFirstTPCStatus = this.subProcessFlow.length === 0 ? 'Open' : 'Close';
                                            Object.assign(flowSub, {
                                                SubPname: sub.SubPname,
                                                sampling: flowSub.check_sampling === "True" ? true : false,
                                                uncontrolled: flowSub.check_uncontrolled === "True" ? true : false,
                                                sub_status: flowSub.sub_status === "Active" ? true : false,
                                                sub_status_label: flowSub.sub_status === "Active" ? "Active" : "Inactive",
                                                hidden: false,
                                                with_quantity: flowSub.with_quantity === null ? 1 : flowSub.with_quantity,
                                                status: flowSub.status === null ? openFirstTPCStatus : flowSub.status,
                                                conditions: [],
                                            });
                                            this.subProcessFlow.sort((a,b) => a.sequence_number - b.sequence_number).push(flowSub);
                                        }
                                    }
                                    for(const key of this.keyProcess){
                                        if(parseInt(flowSub.Pid) === parseInt(key.Pid)){
                                            flowSub.key_code = key.key_code;
                                        }
                                    }
                                    for(const flowKey of this.keyProcessFlow){
                                        if(parseInt(flowKey.Pid) === parseInt(flowSub.Pid)){
                                            Object.assign(flowSub,{
                                                color: flowKey.color,
                                                parent_sequence: flowKey.sequence_number
                                            })
                                        }
                                    }
                                    this.getFlowCondition(flowSub.SubPid);
                                }
                            }).catch(error => {
                                console.log(error);
                            });
                            
                    } 
                }
                this.revisionNumber = latestRevNo + 1;
                if(this.keyProcessFlow.length === 0){
                    if(this.sectionCode === 'SWP'){
                        for(const option of this.SWPOptions){
                                option.selected = false;
                            }
                        } else {
                            for(const option of this.KEYOptions){
                                option.selected = false;
                            }
                        }
                }
                

            },
            addKeyProcessFlow(){
                this.$refs.addBtn.disabled = true;
                if(this.enableProcessInsertion === true){
                    this.keyProcessFlow.push({
                        sequence_number: '',
                        operation_number: '',
                        section_id: '',
                        Pid: '',
                        standard_time: 0.000,
                        machine_time: 0.000,
                    })
                } else {
                    this.keyProcessFlow.push({
                        sequence_number: '',
                        operation_number: '',
                        section_id: this.sectionId,
                        Pid: '',
                        standard_time: 0.000,
                        machine_time: 0.000,
                    })
                }
                // if(this.sectionCode === 'SWP'){
                //     this.keyProcessFlow.push({
                //         sequence_number: '',
                //         operation_number: '',
                //         section_id: '',
                //         Pid: '',
                //         standard_time: 0.000,
                //         machine_time: 0.000,
                //     })
                // } else {
                //         this.keyProcessFlow.push({
                //             sequence_number: '',
                //             operation_number: '',
                //             section_id: this.sectionId,
                //             Pid: '',
                //             standard_time: 0.000,
                //             machine_time: 0.000,
                //         })
                //     }
                    this.keySequence();
            },
            keySequence(){
                let sequence_no = 1;
                for(const key of this.keyProcessFlow){
                    key.sequence_number = sequence_no;
                    sequence_no++;
                }
            },
            subSequence(){
                let sequence_no = 1;
                for(const sub of this.subProcessFlow){
                    sub.sequence_number = sequence_no;
                    sequence_no++;
                }
            },
            assignSectionCode(section_id){

                if(this.flow_main_id === ''){
                    this.itemCode = '';
                    this.itemPartsNumber = '';
                    this.itemDescription = '';
                    this.revisionNumber = '';
                }
                this.keyProcessFlow = [];
                this.subProcessFlow = [];
                this.additionalSection = [];
                this.conditionProcessFlow = [];
                for(const sec of this.section){
                    if(parseInt(section_id) === parseInt(sec.section_id)){
                        this.sectionCode = sec.section_code;
                    }
                }
                this.section.find(sec => {
                    if(this.flow_main_id === ''){
                        if(this.sectionCode === sec.section_code){
                        this.additionalSection.push(sec);
                    }
                    }
                    // if(this.sectionCode === sec.section_code){
                    //     this.additionalSection.push(sec);
                    // }
                    if(parseInt(section_id) === parseInt(sec.section_id)){
                        this.additionalSection.push(sec);
                        // console.log(this.additionalSection);
                        if(typeof sec.accessed_section === 'string'){
                            sec.accessed_section.split(',').map(s => {
                                this.section.find(section => {
                                    if(s === section.section_code){
                                        this.additionalSection.push(section);
                                    }
                                })
                            });
                        }
                    }
                    
                })
                // this.KEYOptions = [];
                // for(const key of this.keyProcess){
                //     if(parseInt(section_id) === parseInt(key.section_id)){
                //         this.KEYOptions.push(key);
                //         for(const option of this.KEYOptions){
                //             Object.assign(option, {selected: false});
                //         }
                //     }
                // }
            },
            async assignFlowKey(flow_main_id){
                
                await axios.get(this.requestFlowKeyURL, {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    },
                    params: {
                        flow_main_id: flow_main_id
                    }
                }).then(response => {
                    for(const flowkey of response.data){
                        let hue = Math.floor(Math.random() * 360);
                        let pastel = 'hsl(' + hue + ', 100%, 80%)';
                        for(const key of this.keyProcess){
                            if(parseInt(flowkey.Pid) === parseInt(key.Pid)){
                                Object.assign(flowkey, {
                                    key_code: key.key_code,
                                    Pname: key.Pname,
                                })
                            }
                        }
                        Object.assign(flowkey, {color: pastel});
                        this.keyProcessFlow.push(flowkey)
                        for(const option of this.KEYOptions){
                            if(parseInt(flowkey.Pid) === parseInt(option.Pid)){
                                option.selected = true;
                            }
                        }
                    }
                    this.keyProcessFlow.sort((a,b) => a.sequence_number - b.sequence_number);
                }).catch(error => {
                    console.log(error);
                });
            },
            async assignFlowSub(flow_main_id){
                await axios.get(this.requestFlowSubURL, {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    },
                    params: {
                        
                        flow_main_id: flow_main_id
                    }
                }).then(response => {
                    for(const flowSub of response.data){
                        flowSub.hidden = flowSub.hidden === 1 ? true : false;
                        for(const flowKey of this.keyProcessFlow){
                            if(parseInt(flowSub.Pid) === parseInt(flowKey.Pid)){
                                Object.assign(flowSub, {color: flowKey.color, key_code: flowKey.key_code});
                            }
                        }
                        for(const sub of this.subProcess){
                            if(parseInt(flowSub.SubPid) === parseInt(sub.SubPid)){
                                Object.assign(flowSub, {
                                    SubPname: sub.SubPname,
                                    sampling: flowSub.check_sampling === "True" ? true : false,
                                    with_quantity: flowSub.with_quantity === null ? 1 : flowSub.with_quantity,
                                    uncontrolled: flowSub.check_uncontrolled === "True" ? true : false,
                                    sub_status: flowSub.sub_status === "Active" ? true : false,
                                    sub_status_label: flowSub.sub_status === "Active" ? "Active" : "Inactive",
                                    status: flowSub.status,
                                    conditions: [],
                                });
                                this.subProcessFlow.sort((a,b) => a.sequence_number - b.sequence_number).push(flowSub);
                            }
                        }
                        // this.getFlowCondition(flowSub.SubPid);
                        
                    }
                }).catch(error => {
                    console.log(error);
                });
                // await this.getProcessFlowCondition();
            },
            async removeFlow(index, Pid){
                this.$refs.addBtn.disabled = false;
                this.keyProcessFlow.splice(index, 1);
                this.keySequence();

                if(this.sectionCode === 'SWP'){
                    for(const option of this.SWPOptions){
                        if(parseInt(Pid) === parseInt(option.Pid)){
                            option.selected = false;
                        }
                    }
                } else {
                    for(const option of this.KEYOptions){
                        if(parseInt(Pid) === parseInt(option.Pid)){
                            option.selected = false;
                        }
                    }
                }
                for(const sub of this.subProcessFlow){
                    if(Pid === sub.Pid){
                        let Pos = this.conditionProcessFlow.findIndex(condition => parseInt(sub.SubPid) === parseInt(condition.SubPid));
                        let Span = this.conditionProcessFlow.filter(condition => parseInt(sub.SubPid) === parseInt(condition.SubPid)).length;
                        this.conditionProcessFlow.splice(Pos, Span);
                    }
                }
                console.log(this.conditionProcessFlow);
                let Pos = this.subProcessFlow.findIndex(sub => parseInt(sub.Pid) === parseInt(Pid));
                let Span = this.subProcessFlow.filter(sub => parseInt(sub.Pid) === parseInt(Pid)).length;
                this.subProcessFlow.splice(Pos, Span);
                this.subSequence();
                
            },
        },
        
        async created(){
            await axios.get(this.SectionGetURL,{
            }).then(response => {
                this.section = response.data.filter((sec) => sec.section_status === 'Active');
            }).catch(error => {
                console.error(error)
                console.log(error);
            })

            await axios.get(this.GetKeyProcessURL, {
            }).then(response => {
                this.keyProcess = response.data.filter((key) => key.key_process_status === 'Active');
                // for(const key of this.keyProcess){
                //     for(const sec of this.section){
                //         if(parseInt(key.section_id) === parseInt(sec.section_id)){
                //             Object.assign(key, {section_code: sec.section_code});
                //         }
                //     }
                //     if(key.section_code === 'SWP' || key.section_code === 'CCD'){
                //             this.SWPOptions.push(key);
                //             for(const option of this.SWPOptions){
                //                 Object.assign(option, {selected: false});
                //             }
                //     }
                // }
                
            }).catch(error => {
                console.log(error);
            });

            await axios.get(this.SubProcessGetURL, {
            }).then(response => {
                this.subProcess = response.data.filter((sub) => sub.sub_process_status === 'Active');
            }).catch(error => {
                console.log(error);
            });

            await axios.get(this.requestItemMasterURL, {
            }).then(response => {
                this.itemMaster = response.data;
                for(const item of this.itemMaster){
                    this.itemCodeList.push(item);
                }
            }).catch(error => {
                console.log(error)
            })

            await axios.get(this.fetchProcessFlowURL, {
            }).then(response => {
                this.processFlow = response.data;
                for(const flow of this.processFlow){
                    for(const sec of this.section){
                        if(flow.section_id == sec.section_id){
                            Object.assign(flow, {section_code: sec.section_code});
                        }
                    }
                }
            }).catch(error => {
                console.log(error)
            })

            
            this.dateEncoded = new Date().toJSON().slice(0, 10)
        },
    }
    </script>
    <style>
    @import 'bootstrap';
    @import 'datatables.net-bs5';
    </style>
    