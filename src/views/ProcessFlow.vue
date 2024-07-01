
<template>

    <div class="col-md-12 row mx-auto py-3 container">
        <div class="col-md-9">
            <h3 class="">Tablet Process Card - <em>Process Flow Assignment</em></h3>
        </div>
        <div class="col-md-3 float-end">
            <button type="button" class="btn btn-outline-dark btn-sm w-100 shadow" data-bs-toggle="modal" data-bs-target="#createProcessFlow" @click="clear">
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

    <div class="modal fade" id="createProcessFlow" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-fullscreen">
        <div class="modal-content">
          <div class="modal-header shadow">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Create Process Flow</h1>
            <div class="col-4 row">
                <div class="col-6">
                    <p v-if="loader" class="text-center">Submitting Data: {{ totalProcessSubmitted }} / {{ totalProcessCount }}</p>
                </div>
                <div class="col-2">
                    <button class="btn btn-sm w-100 btn-outline-dark shadow float-end">Clear</button>
                </div>
                <div class="col-2">
                    <button class="btn btn-sm w-100 btn-outline-dark shadow float-end" @click="submitFlow">Save</button>
                </div>
                <div class="col-2">
                    <button class="btn btn-sm shadow float-end" data-bs-dismiss="modal">
                        <span class="material-symbols-outlined">
                            close
                        </span>
                    </button>
                </div>
            </div>
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
        <template v-else>
            <div class="col-12 row shadow rounded p-3 mx-auto">
                <div class="col-11"></div>
                <div class="col-1 float-end">
                    <div class="form-check form-switch" v-if="cloning">
                      <input class="form-check-input" type="checkbox" role="switch" id="enableCloning" @change="enableCloning" :disabled="dataSaved">
                      <label class="form-check-label" for="enableCloning">Clone Flow</label>
                    </div>
                </div>
                <div class="col-2">
                    <label for="flow_type">Flow Type:</label>
                    <select id="flow_type" class="form-select shadow" v-model="flow_type" :disabled="dataSaved">
                        <option value="" selected disabled></option>
                        <option value="Manual">Manual</option>
                        <option value="Auto">Auto</option>
                    </select>
                </div>
                <div class="col-2">
                    <label for="section">Section:</label>
                    <select id="section" class="form-select shadow" v-model="section_id" @change="setAccessedSection" :disabled="dataSaved">
                        <option value="" selected disabled></option>
                        <template v-for="s in section">
                            <option :value="s.section_id">{{ s.section_code }} - {{ s.section_description }}</option>
                        </template>
                    </select>
                </div>
                <div class="col-2">
                    <label for="item_code">Item Code:</label>
                    <select id="item_code" class="form-select shadow" v-model="item_code" @change="getFlow" :disabled="dataSaved">
                        <option value="" selected disabled></option>
                        <template v-for="item in itemMaster">
                            <option :value="item.item_code">{{ item.item_code }}</option>
                        </template>
                    </select>
                </div>
                <div class="col-2">
                    <label for="parts_number">Parts Number:</label>
                    <input id="parts_number" type="text" class="form-control shadow" disabled v-model="item_parts_number">
                </div>
                <div class="col-2">
                    <label for="item_description">Item Description:</label>
                    <input id="item_description" type="text" class="form-control shadow" disabled v-model="item_description">
                </div>
                <div class="col-2">
                    <label for="date_encoded">Date Encoded:</label>
                    <input id="date_encoded" type="text" class="form-control shadow" disabled v-model="date_encoded">
                </div>
                <template v-if="cloningSwitch">
                    <div class="col-2">

                    </div>
                    <div class="col-2">
                        <label for="">Source Section:</label>
                        <select name="" id="" class="form-select shadow" v-model="sourceSection"> 
                            <option value="" selected disabled></option>
                            <template v-for="s in section">
                                <option :value="s.section_id">{{ s.section_code }} - {{ s.section_description }}</option>
                            </template>
                        </select>
                    </div>
                    <div class="col-2">
                        <label for="">Source Item Code:</label>
                        <select name="" id="" class="form-select shadow" v-model="sourceItemCode" @change="setCloneRevision"> 
                            <option value="" selected disabled></option>
                            <template v-for="item in itemMaster">
                                <option :value="item.item_code">{{ item.item_code }}</option>
                            </template>
                        </select>
                    </div>
                    <div class="col-2">
                        <label for="">Source Revision Number:</label>
                        <select name="" id="" class="form-select shadow" v-model="sourceRevisionNumber" @change="getClone"> 
                            <option value="" selected disabled></option>
                            <template v-for="source in sourceRevisionList">
                                <option :value="source.revision_number">{{ source.revision_number }}</option>
                            </template>
                        </select>
                    </div>
                    <div class="col-4">
    
                    </div>
                </template>
                <div class="col-2">
                    <label for="flow_status">Flow Status:</label>
                    <select id="flow_status" class="form-select shadow" v-model="flow_status" disabled>
                        <option value="" selected disabled></option>
                        <option value="Posted">Posted</option>
                        <option value="Unposted">Unposted</option>
                    </select>
                </div>
                <div class="col-2">
                    <label for="revision_number">Revision Number:</label>
                    <input id="revision_number" type="text" class="form-control shadow" disabled v-model="revision_number">
                </div>
                <div class="col-2">
                    <label for="encoded_by">Encoded By:</label>
                    <input id="encoded_by" type="text" :class="encodedByValidation === true ? 'form-control shadow is-invalid' : 'form-control shadow'" v-model="encoded_by" :disabled="dataSaved">
                    <div class="invalid-feedback">
                        Please fill this up!
                    </div>
                </div>
                <div class="col-6">
                    <label for="remarks">Remarks:</label>
                    <textarea id="remarks" :class="remarksValidation === true ? 'form-control shadow is-invalid' : 'form-control shadow'" v-model="remarks" :disabled="dataSaved"></textarea>
                    <div class="invalid-feedback">
                        Please fill this up!
                      </div>
                </div>
            </div>
            <div class="col-12 row shadow rounded p-2 mx-auto">
                <div class="col-4 table-responsive border rounded shadow">
                   <div class="col-12">
                        <span class="badge text-bg-light float-end shadow">
                                KEY PROCESS COUNT - {{ keyProcessCount }}
                        </span>
                   </div>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>
                                    <small>Seq. No.</small>
                                </th>
                                <th>
                                    <small>Op. No.</small>
                                </th>
                                <th>
                                    <small>Section</small>
                                </th>
                                <th>
                                    <small>Code</small>
                                </th>
                                <th>
                                    <small>Key Process</small>
                                </th>
                                <th>
                                    <small>Remove</small>
                                </th>
                                <th>
                                    <small>View</small>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-for="(key,index) in keyProcessFlow" :key="key.Pid">
                                <tr class="table-light">
                                    <td>
                                        <small>{{ key.sequence_number }}</small>
                                    </td>
                                    <td>
                                        <input type="number" class="form-control form-control-sm" v-model="key.operation_number" :disabled="dataSaved">
                                    </td>
                                    <td>
                                        <select v-if="key.section_id === ''" class="form-select form-select-sm" v-model="key.section_id" @change="setSectionCode">
                                            <option value="" disabled selected></option>
                                            <template v-for="s in sectionOptions">
                                                <option :value="s.section_id">{{ s.section_code }}</option>
                                            </template>
                                        </select>
                                        <p v-else>
                                            <small>{{ key.section_code }}</small>
                                        </p>
                                    </td>
                                    <td>
                                        <small>{{ key.key_code }}</small>
                                    </td>
                                    <td>
                                        <select v-if="key.Pid === ''" class="form-select form-select-sm" @change="setSubOptions(key.Pid, key.sequence_number)" v-model="key.Pid">
                                            <option value="" disabled selected></option>
                                            <template v-for="k in keyProcessOptions">
                                                <option v-if="key.section_id == k.section_id" :value="k.Pid">{{ k.Pname }}</option>
                                            </template>
                                        </select>
                                        <p v-else>
                                            <small>{{ key.Pname }}</small>
                                        </p>
                                    </td>
                                    <td>
                                        <button class="btn btn-sm rounded w-100" @click="removeKey(index, key.Pid, key.sequence_number)">
                                            <span class="material-symbols-outlined fs-6 text-danger">
                                                close
                                            </span>
                                        </button>
                                    </td>
                                    <td>
                                        <button class="btn btn-sm w-100" @click="accordionToggler('Key-'+key.Pid+'-'+key.sequence_number)">
                                            <span class="material-symbols-outlined fs-6">
                                                {{ toggle['Key-'+key.Pid+'-'+key.sequence_number] ? 'expand_less' : 'expand_more' }}
                                            </span>
                                        </button>
                                    </td>
                                </tr>
                                <tr v-show="toggle['Key-'+key.Pid+'-'+key.sequence_number]">
                                    <td colspan="7">
                                        <div class="row">
                                            <div class="col-6">
                                                <label for="">Standard Time:</label>
                                                <input type="text" class="form-control form-control-sm">
                                            </div>
                                            <div class="col-6">
                                                <label for="">Machine Time:</label>
                                                <input type="text" class="form-control form-control-sm">
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                        </tbody>
                        <tbody>
                            <tr>
                                <td colspan="5"></td>
                                <td colspan="2">
                                    <button class="btn btn-sm btn-outline-dark w-100" @click="addKey">
                                        Add
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="col-8 table-responsive border rounded shadow">
                    <div class="col-12">
                        <span class="badge text-bg-light float-end shadow">
                            PROCESS CONDITION COUNT - {{ processConditionCount }}
                        </span>
                        <span class="badge text-bg-light float-end shadow">
                            SUB PROCESS COUNT - {{ subProcessCount }}
                        </span>
                    </div>
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>
                                    <small>Seq. No.</small>
                                </th>
                                <th>
                                    <small>Parent Sequence</small>
                                </th>
                                <th>
                                    <small>Code</small>
                                </th>
                                <th>
                                    <small>Sub Process</small>
                                </th>
                                <th>
                                    <small>Sampling</small>
                                </th>
                                <th>
                                    <small>With Quantity</small>
                                </th>
                                <th>
                                    <small>Uncontrolled Quantity</small>
                                </th>
                                <th>
                                    <small>Batching Type</small>
                                </th>
                                <th>
                                    <small>Result Type</small>
                                </th>
                                <th>
                                    <small>Standard Time</small>
                                </th>
                                <th>
                                    <small>Machine Time</small>
                                </th>
                                <th>
                                    <small>Status</small>
                                </th>
                                <th>
                                    <small>TPC Status</small>
                                </th>
                                <th>
                                    <small>View</small>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-for="sub in subProcessFlow">
                                <tr :class="sub.sub_status === 'Inactive' ? 'table-secondary' : 'table-light'">
                                    <td>
                                        <small>{{ sub.sequence_number }}</small>
                                    </td>
                                    <td>
                                        <small>{{ sub.parent_sequence }}</small>
                                    </td>
                                    <td>
                                        <small>{{ sub.key_code }}</small>
                                    </td>
                                    <td>
                                        <small>{{ sub.SubPname }}</small>
                                    </td>
                                    <td>
                                        <small :class="sub.check_sampling === 'True' ? 'badge text-bg-primary' : 'badge text-bg-secondary'">
                                            {{ sub.check_sampling === 'False' ? 'Without Sampling' : 'With Sampling' }}
                                        </small>
                                    </td>
                                    <td>
                                        <small :class="sub.with_quantity === 1 ? 'badge text-bg-primary' : 'badge text-bg-secondary'">
                                            {{ sub.with_quantity === 1 ? 'With Quantity' : 'Without Quantity' }}
                                        </small>
                                    </td>
                                    <td>
                                        <small :class="sub.check_uncontrolled === 'True' ? 'badge text-bg-primary' : 'badge text-bg-secondary'">
                                            {{ sub.check_uncontrolled === 'True' ? 'Uncontrolled Quantity' : 'Controlled Quantity' }}
                                        </small>
                                    </td>
                                    <td>
                                        <small>{{ sub.batching_type }}</small>
                                    </td>
                                    <td>
                                        <small>{{ sub.result_type }}</small>
                                    </td>
                                    <td>
                                        <small>{{ sub.standard_time }}</small>
                                    </td>
                                    <td>
                                        <small>{{ sub.machine_time }}</small>
                                    </td>
                                    <td>
                                        <small :class="sub.sub_status === 'Active' ? 'badge text-bg-success' : 'badge text-bg-secondary'">
                                            {{ sub.sub_status }}
                                        </small>
                                    </td>
                                    <td>
                                        <small :class="sub.status === 'Open' ? 'badge text-bg-success' : 'badge text-bg-dark'">{{ sub.status }}</small>
                                    </td>
                                    <td>
                                        <button class="btn btn-sm w-100" @click="accordionToggler('Sub-'+sub.SubPid+'-'+sub.sequence_number)">
                                            <span class="material-symbols-outlined fs-6">
                                                {{ toggle['Sub-'+sub.SubPid+'-'+sub.sequence_number] ? 'expand_less' : 'expand_more' }}
                                            </span>
                                        </button>
                                    </td>
                                </tr>
                                <tr v-show="toggle['Sub-'+sub.SubPid+'-'+sub.sequence_number]">
                                    <td colspan="14">
                                        <small>Condition Count - <b>{{ sub.condition_process_count }}</b></small>
                                        <div class="table-responsive shadow rounded">
                                            <table class="table">
                                                <thead> 
                                                    <tr>
                                                        <th><small>Seq. No.</small></th>
                                                        <th><small>Parent Sequence</small></th>
                                                        <th><small>Detail Description</small></th>
                                                        <th><small>Typical Value</small></th>
                                                        <th><small>Minimum Value</small></th>
                                                        <th><small>Maximum Value</small></th>
                                                        <th><small>Status</small></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <template v-for="con in sub.condition">
                                                        <tr>
                                                            <td><small>{{ con.sequence_number }}</small></td>
                                                            <td><small>{{ con.parent_sequence }}</small></td>
                                                            <td><small>{{ con.detail_description }}</small></td>
                                                            <td><small>{{ con.typical_value }}</small></td>
                                                            <td><small>{{ con.min_value }}</small></td>
                                                            <td><small>{{ con.max_value }}</small></td>
                                                            <td>
                                                                <span :class="con.condition_status === 'Active' ? 'badge text-bg-success' : 'badge text-bg-secondary'">
                                                                    {{ con.condition_status }}
                                                                </span>
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
                    </table>
                </div>
            </div>
        </template>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="error" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="error">Saving Data</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            Submitting Data: {{ totalProcessSubmitted }} / {{ totalProcessCount }};
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Understood</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="connect" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="error">Modal title</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
           NETWORK ERROR
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="reloadWorker">Close</button>
            <button type="button" class="btn btn-primary"  data-bs-dismiss="modal" @click="redoWorker">Understood</button>
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
import * as bootstrap from 'bootstrap';
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

            MainProcessPostRequest: 'http://172.16.2.13:3000/insertMainFlow',
            KeyProcessPostRequest:  'http://172.16.2.13:3000/insertKeyFlow',
            SubProcessPostRequest:  'http://172.16.2.13:3000/insertSubFlow',
            ConditionProcessPostRequest: 'http://172.16.2.13:3000/insertConditionFlow',

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
            
            // MainProcessPostRequest: 'http://172.16.2.13/tpc-endpointDev/processMainPostRequest.php',
            // KeyProcessPostRequest: 'http://172.16.2.13/tpc-endpointDev/processKeyPostRequest.php',
            // SubProcessPostRequest: 'http://172.16.2.13/tpc-endpointDev/processSubPostRequest.php',
            // ConditionProcessPostRequest: 'http://172.16.2.13/tpc-endpointDev/processConditionPostRequest.php',

            // KeyProcessPostRequest:  'http://localhost:3000/insertKeyFlow',
            // SubProcessPostRequest:  'http://localhost:3000/insertSubFlow',
            // ConditionProcessPostRequest: 'http://localhost:3000/insertConditionFlow',


            flow_status: 'Unposted',
            flow_type: 'Manual',
            section_id: '',
            section_code: '',
            item_parts_number: '',
            item_description: '',
            date_encoded: '',

            keyProcessCount: 0,
            subProcessCount: 0,
            processConditionCount: 0,

            totalProcessCount: 0,
            totalProcessSubmitted: 0,

            keyProcessFlow: [],
            subProcessFlow: [],
            conProcessFlow: [],

            tempKey:[],
            tempSub:[],

            sectionOptions: [],

            sourceSection: '',
            sourceItemCode: '',
            sourceRevisionNumber: '',
            sourceRevisionList: [],

            encodedByValidation: false,
            remarksValidation: false,

            dataSaved: false,

            connect_err: false,

            processFlow:[],
            tableOptions: {
                order: [[0, 'desc']]
            },
            loader: false,
            cloning: false,
            cloningSwitch: false,
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
                              return '<button class="btn w-100"><span class="material-symbols-outlined">open_in_new</span></button'
                          } 
                      },
              ],
              toggle: {},
            }
            
    },
    computed:{
        
    },
    methods: {
        enableCloning(){
            let val = document.getElementById('enableCloning').checked
            this.cloningSwitch = val;
            if(this.cloningSwitch){
                this.clearFlow();
            }
        },
        setCloneRevision(){
            this.sourceRevisionList = [];
            if(this.sourceSection === ''){
                prompt('Missing Section');
                this.sourceItemCode = '';
            } else {
                this.processFlow.find(flow => {
                    if(parseInt(flow.section_id) === parseInt(this.sourceSection) && flow.item_code === this.sourceItemCode){
                        this.sourceRevisionList.push(flow)
                    }
                })
            }
        },
        getClone(){
            this.keyProcessFlow = [];
            this.subProcessFlow = [];
            this.processConditionCount = 0;
            this.processFlow.find((f) => {
                if(parseInt(f.section_id) === parseInt(this.sourceSection) && f.item_code === this.sourceItemCode && parseInt(f.revision_number) === parseInt(this.sourceRevisionNumber)){
                    this.fetchFlowDetails(f.flow_main_id)                        
                }
            })
        },
        viewing(event){
            if(event.target.tagName == 'BUTTON'){
                const row = event.target.parentNode.parentNode;
                const cell = row.querySelector('td');
                let flow_id = parseInt(cell.textContent);
                this.$router.push({ name: 'processFlowViewing', query: { flow_id: flow_id} });
            }
            if(event.target.tagName == 'SPAN'){
                const row = event.target.parentNode.parentNode.parentNode;
                const cell = row.querySelector('td');
                let flow_id = parseInt(cell.textContent);
                this.$router.push({ name: 'processFlowViewing', query: { flow_id: flow_id} });
            }
        },
        Sync(){
            let keyFlow = [];
            let subFlow = [];

            keyFlow = this.tempKey;
            subFlow = this.tempSub;

            for(const key of this.keyProcessFlow){
                keyFlow.find(k => {
                    if(parseInt(key.Pid) === parseInt(k.Pid)){
                        key.sequence_number = k.sequence_number;
                    }
                })
            }
            for(const sub of this.subProcessFlow){
                subFlow.find(s => {
                    if(parseInt(sub.SubPid) === parseInt(s.SubPid)){
                        sub.sequence_number = s.sequence_number
                        sub.parent_sequence = s.parent_sequence
                    }
                })
            }
            this.keyProcessFlow.sort((a,b) => a.sequence_number - b.sequence_number);
            this.subProcessFlow.sort((a,b) => a.sequence_number - b.sequence_number);
        },
        async submitFlow() {
            this.loader = true;
            this.conProcessFlow = [];
            let flow_main_id = '';
            let main = {
                item_parts_number: this.item_parts_number,
                item_code: this.item_code,
                item_description: this.item_description,
                section_id: this.section_id,
                revision_number: this.revision_number,
                flow_status: this.flow_status,
                remarks: this.remarks,
                encoded_by: this.encoded_by,
                date_encoded: this.date_encoded,
                flow_type: this.flow_type,
                sub_process_count: this.subProcessCount,
            };
        
            this.subProcessFlow.forEach(s => {
                for (const c of s.condition) {
                    this.conProcessFlow.push(c);
                }
            });
        
            this.totalProcessCount = this.keyProcessCount + this.subProcessCount + this.processConditionCount;
        
            if (this.encoded_by === '') {
                this.encodedByValidation = true;
            } else if (this.remarks === '') {
                this.remarksValidation = true;
            } else {
                try {
                    const response = await axios.post(this.MainProcessPostRequest, main);
                    if (response.status === 200 && response.data.message === "Process Flow Main inserted successfully") {
                        flow_main_id = response.data.flow_main_id;
                        await this.submitKey(flow_main_id);
                        await this.submitSub(flow_main_id);
                        await this.submitCondition(flow_main_id);
                        this.section.find(s => {
                            if(parseInt(s.section_id) === parseInt(this.section_id)){
                                this.processFlow.push({
                                    flow_main_id: flow_main_id,
                                    item_parts_number: this.item_parts_number,
                                    item_code: this.item_code,
                                    item_description: this.item_description,
                                    section_id: this.section_id,
                                    section_code: s.section_code,
                                    revision_number: this.revision_number,
                                    flow_status: this.flow_status,
                                    flow_remarks: this.remarks,
                                    encoded_by: this.encoded_by,
                                    date_encoded: this.date_encoded,
                                    flow_type: this.flow_type,
                                    sub_process_count: this.subProcessCount,
                                })
                            }
                        })
                    }
                } catch (error) {
                   console.log(error)
                }
            }
            this.dataSaved = true;
            this.loader = false;
        },

        async submitKey(flow_main_id){
           for(const k of this.keyProcessFlow){
                try {
                    let response = await axios.post(this.KeyProcessPostRequest, {
                        main_flow_id: flow_main_id,
                        operation_number: k.operation_number,
                        section_id: k.section_id,
                        parts_number: this.item_parts_number,
                        revision_number: this.revision_number,
                        Pid: k.Pid,
                        sequence_number: k.sequence_number,
                        standard_time: k.standard_time,
                        machine_time: k.machine_time,
                        item_code: this.item_code,   
                    })
                    if(response.data.message === 'Process Flow Key inserted successfully' && response.status === 200){
                        this.totalProcessSubmitted++;
                    }
                } catch (error) {
                    if(error.message === 'Network Error'){
                        let myModal = new bootstrap.Modal(document.getElementById("error"))
                        myModal.show();
                    }
                }
            }
        },
        async submitSub(flow_main_id){
            for(const s of this.subProcessFlow){
               try {
                    let response = await axios.post(this.SubProcessPostRequest, {
                        main_flow_id: flow_main_id,
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
                    })
                    if(response.data.message === 'Process Flow Sub inserted successfully' && response.status === 200){
                        this.totalProcessSubmitted++;
                    }
               } catch (error) {
                    console.log(error)
               }
            }
        },
        async submitCondition(flow_main_id){         
            for(const c of this.conProcessFlow){
                try {
                    let response = await axios.post(this.ConditionProcessPostRequest, {
                        main_flow_id: flow_main_id,
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
                    })
                    if(response.data.message === 'Process Flow Condition inserted successfully' && response.status === 200){
                        this.totalProcessSubmitted++;
                    }
                } catch(error){
                  if(error){
                    let myModal = new bootstrap.Modal(document.getElementById("connect"))
                    myModal.show();
                    this.flow_main_id = flow_main_id;
                    break;
                  }
                }
            }  
        },
        redoWorker(){
            try {
                let res = axios.get(this.fetchProcessFlowURL, {})
                
            } catch (error) {
                if(error){
                    this.DestroyFlow(this.flow_main_id);
                    this.totalProcessSubmitted = 0;
                    this.submitFlow();
                    let myModal = new bootstrap.Modal(document.getElementById("connect"))
                    myModal.show();
                }
            }
        },
        async removeKey(index, Pid, p_sequence){
            this.subProcessFlow.find(s => {
                if(parseInt(s.Pid) === parseInt(Pid)){
                    this.processConditionCount -= s.condition.length;
                }
            })
            this.keyProcessFlow.splice(index, 1);
            this.keyProcessCount = this.keyProcessFlow.length;
            this.keySequence();

            let Pos = this.subProcessFlow.findIndex(sub => parseInt(sub.Pid) === parseInt(Pid) && parseInt(sub.parent_sequence) === parseInt(p_sequence));
            let Span = this.subProcessFlow.filter(sub => parseInt(sub.Pid) === parseInt(Pid) && parseInt(sub.parent_sequence) === parseInt(p_sequence)).length;
            
            this.subProcessFlow.splice(Pos, Span);
            this.subProcessCount = this.subProcessFlow.length;
            this.subSequence();
            for(const k of this.keyProcessFlow){
                for(const s of this.subProcessFlow){
                    if(parseInt(k.Pid) === parseInt(s.Pid)){
                        s.parent_sequence = k.sequence_number;
                        for(const c of s.condition){
                            c.parent_sequence = k.sequence_number;
                        }
                    }
                }
            }
            
        },
        accordionToggler(id){
            this.toggle[id] = !this.toggle[id];
        },
        getFlow(){
            let latestRevNo = -1;
            this.keyProcessFlow = [];
            this.subProcessFlow = [];
            if(this.section_id === ''){
                prompt("Missing Section.")
            } else {
                this.itemMaster.find((i) => {
                    if(i.item_code === this.item_code){
                        this.item_parts_number = i.item_parts_number;
                        this.item_description = i.item_description;
                    }
                })
                this.processFlow.find((f) => {
                    
                    if(parseInt(f.section_id) === parseInt(this.section_id) && f.item_code === this.item_code){
                        if(f.flow_status === 'Posted'){
                            if(f.revision_number > latestRevNo){
                                latestRevNo = f.revision_number;
                            }
                        } else {
                            this.DestroyFlow(f.flow_main_id);
                        }
                    }
                })
                this.processFlow.find((f) => {
                    if(parseInt(f.section_id) === parseInt(this.section_id) && f.item_code === this.item_code && parseInt(f.revision_number) === parseInt(latestRevNo)){
                        this.fetchFlowDetails(f.flow_main_id)                        
                    }
                })
                this.revision_number = latestRevNo + 1;
            }
            this.cloning = true;
        },
        async fetchFlowDetails(flow_main_id){
                await axios.get(this.requestFlowKeyURL, {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    },
                    params: {
                        flow_main_id: flow_main_id
                    }
                }).then(response => {
                    for(const k of response.data){
                        this.section.find(sec => {
                            if(parseInt(k.section_id) === parseInt(sec.section_id)){
                                Object.assign(k, {
                                    section_code: sec.section_code
                                })
                            }
                        })
                        this.keyProcessOptions.find(key => {
                            if(parseInt(k.Pid) === parseInt(key.Pid)){
                                Object.assign(k, {
                                    Pname: key.Pname,
                                    key_code: key.key_code
                                })
                            }
                        })
                    }
                    this.keyProcessFlow = response.data;
                    this.keyProcessCount = this.keyProcessFlow.length;
                }).catch(error => {
                    console.log(error);
                });

                await axios.get(this.requestFlowSubURL, {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    },
                    params: {
                        flow_main_id: flow_main_id
                    }
                }).then(response => {
                    for(const s of response.data){
                        this.subProcess.find(sub => {
                            if(parseInt(s.SubPid) === parseInt(sub.SubPid)){
                                Object.assign(s, {
                                    SubPname: sub.SubPname,
                                    condition: []
                                })
                            }
                        })
                        this.keyProcessFlow.find(k => {
                            if(parseInt(s.Pid) === parseInt(k.Pid)){
                                Object.assign(s, {
                                    key_code: k.key_code,
                                    parent_sequence: k.sequence_number
                                })
                            }
                        })
                    }
                    this.subProcessFlow = response.data
                    this.subProcessCount = this.subProcessFlow.length
                }).catch(error => {
                    console.log(error)
                })

                await axios.get(this.requestFlowConditionURL, {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    },
                    params: {
                        flow_main_id: flow_main_id
                    }
                }).then(response => {
                    for(const c of response.data){
                        this.subProcessFlow.find(s => {
                            if(parseInt(s.SubPid) === parseInt(c.SubPid)){
                                Object.assign(c, {
                                    parent_sequence: s.parent_sequence
                                })
                                s.condition.push(c);
                            }
                        })
                    }
                    this.processConditionCount += response.data.length;
                }).catch(error => {
                    console.log(error);
                });
                this.subProcessFlow.forEach(s => {
                    Object.assign(s, {
                        condition_process_count: s.condition.length
                    })
                })
        },
        clearData(){
            this.cloning = false;
            this.item_code = '';
            this.item_parts_number = '';
            this.item_description = '';
            this.revision_number = '';
            this.encoded_by = '';
            this.remarks = '';
            this.keyProcessFlow = [];
            this.subProcessFlow = [];
            this.keyProcessCount = 0;
            this.subProcessCount = 0;
            this.processConditionCount = 0;
        },
        clearFlow(){
            this.keyProcessFlow = [];
            this.subProcessFlow = [];
            this.keyProcessCount = 0;
            this.subProcessCount = 0;
            this.processConditionCount = 0;
        },
        setAccessedSection(){
            this.clearData();
            this.section_code = '';
            this.sectionOptions = [];
            this.section.find((s) => {
                if(parseInt(s.section_id) === parseInt(this.section_id)){
                    this.section_code = s.section_code;
                    this.sectionOptions.push({
                        section_id: this.section_id,
                        section_code: this.section_code
                    });
                }
                
            })
            this.section.find(sec => {
                if(parseInt(sec.section_id) === parseInt(this.section_id)){
                    if(typeof sec.accessed_section === 'string'){
                        sec.accessed_section.split(',').forEach(s => {
                            this.section.find(section => {
                                if(s === section.section_code){
                                    this.sectionOptions.push({
                                        section_id: section.section_id,
                                        section_code: section.section_code
                                    })
                                }
                            })
                        });
                    }
                }
            })
        },
        setSectionCode(){
            for(const k of this.keyProcessFlow){
                this.section.find(s => {
                    if(parseInt(k.section_id) === parseInt(s.section_id)){
                        Object.assign(k, {
                            section_code: s.section_code 
                        })
                    }
                })
            }
        },
        async setSubOptions(Pid, key_sequence_number){
            let key_code = '';
            for(const k of this.keyProcessFlow){
                this.keyProcessOptions.find(kp => {
                    if(parseInt(k.Pid) === parseInt(kp.Pid)){
                        Object.assign(k, {
                            Pname: kp.Pname,
                            key_code: kp.key_code
                        })
                        key_code = kp.key_code
                    }
                })
            }
            await axios.get(this.requestSubURL,{
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
                        sub['origin_sequence'] = sub['sequence_number'];;
                        let openFirstStatus = this.subProcessFlow.length === 0 ? 'Open' : 'Close';
                        this.subProcessFlow.push({
                            parent_sequence: key_sequence_number,
                            sequence_number: '',
                            key_code: key_code,
                            Pid: sub.Pid,
                            SubPid: sub.SubPid,
                            SubPname: sub.SubPname,
                            standard_time: 0,
                            machine_time: 0,
                            batching_type: 'Standard',
                            result_type: 'Chips',
                            check_sampling: 'False',
                            check_uncontrolled: 'False',
                            with_quantity: 1,
                            sub_status: 'Active',
                            hidden: 0,
                            status: openFirstStatus,
                            condition: [],
                            condition_process_count: 0,
                        })
                    }
                    this.itemCondition(sub.SubPid, key_sequence_number);
                }
                this.subProcessFlow.sort((a,b) => a.origin_sequence - b.origin_sequence);
                this.subSequence();
            }).catch(error => {
                console.log(error);
            })
            this.keyProcessCount = this.keyProcessFlow.length;
            this.subProcessCount = this.subProcessFlow.length;
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
        },
        addKey(){
            this.keyProcessFlow.push({
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
            for(const key of this.keyProcessFlow){
                key.sequence_number = sequence; 
                sequence++;
            }
        },
        subSequence(){
            let sequence = 1;
            for(const sub of this.subProcessFlow){
                sub.sequence_number = sequence; 
                sequence++;
            }
        },
        async itemCondition(SubPid, key_sequence_number){
            await axios.get(this.requestConditionURL, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                params: {
                    SubPid: SubPid
                }
            }).then(response => {
                for(const c of response.data){
                    this.subProcessFlow.find(s => {
                        if(parseInt(c.SubPid) === parseInt(s.SubPid) && parseInt(s.parent_sequence) === parseInt(key_sequence_number)){
                            Object.assign(c, {
                                condition_status: 'Active',
                                parent_sequence: key_sequence_number,
                                field_name1: c.fieldname_1,
                                field_name2: c.fieldname_2,
                                field_name3: c.fieldname_3,
                                field_name4: c.fieldname_4,
                                field_name5: c.fieldname_5,
                                visibility_status: 0,
                            })
                            s.condition.push(c)
                        }
                    })
                }
                this.processConditionCount += response.data.length;
                this.subProcessFlow.find(s => {
                    if(parseInt(SubPid) === parseInt(s.SubPid)){
                        s.condition_process_count = response.data.length;
                        console.log(s)
                    }
                })
            }).catch(error => {
                console.log(error);
            })
        }
    }, 
    async created(){
        
        await axios.get(this.SectionGetURL, {}).then(response => {
            this.section = response.data.filter((sec) => sec.section_status === 'Active');
        }).catch(error => { console.log(error) });

        await axios.get(this.requestItemMasterURL, {}).then(response => {
            this.itemMaster = response.data;
        }).catch(error => { console.log(error) });

        await axios.get(this.fetchProcessFlowURL, {}).then(response => {
            for(const flow of response.data){
                this.section.find((sec) => {
                    if(parseInt(flow.section_id) === parseInt(sec.section_id)){
                        Object.assign(flow, {section_code: sec.section_code})
                    }
                })
             }
            this.processFlow = response.data;
        }).catch(error => { 
           console.log(error)
        });

        await axios.get(this.GetKeyProcessURL, {}).then(response => {
            this.keyProcessOptions = response.data;
        }).catch(error => { console.log(error) });
        
        await axios.get(this.SubProcessGetURL, {}).then(response => {
            this.subProcess = response.data.filter((sub) => sub.sub_process_status === 'Active');
        }).catch(error => { console.log(error) });

        this.date_encoded = new Date().toJSON().slice(0, 10);
    },
}
</script>
<style>
@import 'bootstrap';
@import 'datatables.net-bs5';
</style>