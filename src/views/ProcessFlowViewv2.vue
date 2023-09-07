
<template>

    <div class="col-md-12 row mx-auto py-3 container">
        <div class="col-md-9">
            <h3>Tablet Process Card - <em>Setup Process Flow</em></h3>
        </div>
        <div class="col-md-3 float-end">
            <button type="button" class="btn btn-outline-info w-100" data-bs-toggle="modal" data-bs-target="#createProcessFlow">
                Create Process Flow
            </button>
        </div>
    </div>
    <div class="container table-responsive">
        <DataTable
        :data="processFlow"
        :columns="columns"
        class="display table"
        @click="getFlowId"
        :options="tableOptions"
    />
    </div>

    

    <div class="modal fade" id="createProcessFlow" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-fullscreen">
          <div class="modal-content">
            <div class="modal-header">
              <div class="col-xl-12 col-lg-6 row">
                  <div class="col-xl-1 col-lg-4">
                      <button @click="clearField" ref="clearBtn" class="btn btn-outline-primary w-100 h-100" disabled>Clear</button>
                  </div>
                  <div class="col-xl-1 col-lg-4">
                      <button @click="submitProcessFlow" ref="saveBtn" class="btn btn-outline-primary w-100 h-100">Save</button>
                  </div>
                  <div class="col-xl-1 col-lg-4">
                      <button class="btn btn-outline-primary w-100 h-100" data-bs-dismiss="modal">Close</button>
                  </div>
              </div>
            </div>
            <div class="modal-body">
              <div class="col-md-12 border rounded p-3 mx-auto row">
                <div class="col-xl-1 col-lg-1 p-1">
                    <label for="flow_no">Flow No.</label>
                    <input id="flow_no"  type="text" class="form-control" v-model="mainFlowId" disabled>
                </div>
                <div class="col-xl-1 col-lg-2 p-1">
                    <label for="flow_type">Flow Type</label>
                    <select id="flow_type" ref="flow_type" class="form-select" v-model="mainFlowType" >
                        <option value="Manual">Manual</option>
                        <option value="Auto">Auto</option>
                    </select>
                </div>
                <div class="col-xl-2 col-lg-2 p-1">
                    <label for="parts_number">Parts Number</label>
                    <select @change="getItemCode(mainPartsNumber)" id="parts_number" ref="parts_number"  class="form-select" v-model="mainPartsNumber">
                        <option v-for="item in itemMaster" :value="item.item_parts_number">{{ item.item_parts_number }}</option>
                    </select>
                </div>
                <div class="col-xl-2 col-lg-2 p-1">
                    <label for="item_code">Item Code</label>
                    <select @change="getItemDescriptionAndRevNo(mainPartsNumber, mainItemCode)" id="item_code" ref="item_code"  type="text" class="form-control" v-model="mainItemCode" disabled>
                        <option v-for="itemCode in itemList" :value="itemCode.item_code">{{itemCode.item_code}}</option>
                    </select>
                </div>
                <div class="col-xl-3 col-lg-3 p-1">
                    <label for="item_description">Item Description</label>
                    <input id="item_description" ref="item_description"  type="text" class="form-control" v-model="mainItemDescription" disabled>
                </div>
                <div class="col-xl-1 col-lg-2  p-1">
                    <label for="encoded_by">Encoded By</label>
                    <input id="encoded_by" ref="encoded_by" type="text" class="form-control" v-model="mainEncodedBy" disabled>
                </div>
                <div class="col-xl-2 col-lg-2 p-1">
                    <label for="date_encoded">Date Encoded</label>
                    <input id="date_encoded" ref="date_encoded"  type="text" class="form-control" v-model="mainDateEncoded" disabled>
                </div>
                <div class="col-xl-2 col-lg-2 p-1">
                    <label for="section">Section</label>
                    <select @change="fetchKeyProcess" ref="section" v-model="mainSection" class="form-select" id="section" disabled>
                        <option v-for="sec in section" :value="sec.section_id">{{sec.section_code}}</option>
                    </select>
                </div>
                <div class="col-xl-2 col-lg-2 p-1">
                    <label for="revision_number">Revision Number</label>
                    <input id="revision_number" ref="revision_number" type="text" class="form-control" v-model="mainRevisionNumber" disabled>
                </div>
                <div class="col-xl-2 col-lg-2 p-1">
                    <label for="flow_status">Flow Status</label>
                    <input id="flow_status" ref="flow_status" type="text" class="form-select" v-model="mainFlowStatus" disabled>
                </div>
                <div class="col-xl-6 col-lg-4 p-1 ">
                    <label for="remarks">Remarks</label>
                    <input id="remarks" ref="remarks"  type="text" class="form-control" v-model="mainRemarks">
                </div>

              </div>
              <div class="col-md-12 mx-auto row">
                <div class="col-md-5 border-end table-responsive">
                    <h6 class="p-2"><em>Key Process Flow</em></h6>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th style="width: 15%">Opr. No.</th>
                                <th style="width: 15%">Section</th>
                                <th>Key Process</th>
                                <th style="width: 15%">Standard Time</th>
                                <th style="width: 15%">Machine Time</th>
                                <th>Remove</th>
                            </tr>
                        </thead>
                        <tbody v-if="mainSectionCode === 'SWP'">
                            <tr v-for="(key, index) in keyProcessFlow">
                                <td>{{index + 1}}</td>
                                <td>
                                    <input ref="keyOperationNumber" type="number" class="form-control" v-model="key.operation_number">
                                </td>
                                <td>
                                    <select v-model="key.section_code" class="form-select">
                                        <option value="SWP">SWP</option>
                                        <option value="CCD">CCD</option>
                                    </select>
                                </td>
                                <td v-if="key.section_code == 'SWP'">
                                    <select ref="keyProcessFlow" @change="fetchSubProcess" class="form-select" v-model="key.Pid">
                                        <option v-for="key in SWPOptions" :value="key.Pid">{{key.Pname}}</option>
                                    </select>
                                </td>   
                                <td v-else-if="key.section_code == 'CCD'">
                                    <select ref="keyProcessFlow" @change="fetchSubProcess" class="form-select" v-model="key.Pid">
                                        <option v-for="key in CCDOptions" :value="key.Pid">{{key.Pname}}</option>
                                    </select>
                                </td>
                                <td>
                                    <input ref="keyStandardTime" type="text" class="form-control" v-model="key.standard_time">
                                </td>
                                <td>
                                    <input ref="keyMachineTime" type="text" class="form-control" v-model="key.machine_time">
                                </td>
                                <td>
                                    <button ref="removeBtn" @click="removeKey(index)" class="btn btn-sm btn-outline-danger w-100">
                                        <span class="material-symbols-outlined">remove</span>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr v-for="(key, index) in keyProcessFlow">
                                <td>{{index + 1}}</td>
                                <td>
                                    <input ref="keyOperationNumber" type="number" class="form-control" v-model="key.operation_number">
                                </td>
                                <td>{{ mainSectionCode }}</td>
                                <td>
                                    <select ref="keyProcessFlow" @change="fetchSubProcess(key.Pid)" class="form-select" v-model="key.Pid">
                                        <option v-for="key in keyProcess" :value="key.Pid">{{key.Pname}}</option>
                                    </select>
                                </td>
                                <td>
                                    <input ref="keyStandardTime" type="text" class="form-control" v-model="key.standard_time">
                                </td>
                                <td>
                                    <input ref="keyMachineTime" type="text" class="form-control" v-model="key.machine_time">
                                </td>
                                <td>
                                    <button ref="removeBtn" @click="removeKey(index)" class="btn btn-sm btn-outline-danger w-100">
                                        <span class="material-symbols-outlined">remove</span>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                        
                        <tbody>
                            <tr>
                                <td colspan="7">
                                    <button ref="addKeyBtn" @click="addKeyProcessFlow" class="btn w-100 btn-outline-primary" disabled>Add Row</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="col-md-7 table-responsive">
                    <h6 class="p-2"><em>Sub Process Flow</em></h6>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Sub Process</th>
                                <th style="width: 6%">Standard Time</th>
                                <th style="width: 6%">Machine Time</th>
                                <th style="width: 5%" class="text-center">Sampling</th>
                                <th style="width: 8%" class="text-center">Uncontrolled</th>
                                <th>Batching Type</th>
                                <th>Result Type</th>
                                <th class="text-center">Status</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(sub, index) in subProcessFlow">
                                <td>{{index + 1}}</td>
                                <td>{{sub.SubPname}}</td>
                                <td class="">
                                    <input ref="subStandardTime" type="text" class="form-control" v-model="sub.standard_time">
                                </td>
                                <td class="auto-fit">
                                    <input ref="subMachineTime" type="text" class="form-control" v-model="sub.machine_time">
                                </td>
                                <td>
                                    <div class="form-check form-switch">
                                        <input ref="sampling" v-model="sub.sampling" class="form-check-input" type="checkbox" role="switch">
                                    </div>
                                </td>
                                <td>
                                    <div class="form-check form-switch">
                                        <input ref="uncontrolled" v-model="sub.uncontrolled" class="form-check-input" type="checkbox" role="switch">
                                    </div>
                                </td>
                                <td>
                                    <select ref="batching_type" class="form-select" v-model="sub.batching_type">
                                        <option value="Parallel">Parallel</option>
                                        <option value="Standard">Standard</option>
                                    </select>
                                </td>
                                <td>
                                    <select ref="result_type" class="form-select" v-model="sub.result_type">
                                        <option value="Chips">Chips</option>
                                        <option value="Wafer">Wafer</option>
                                    </select>
                                </td>
                                <td>
                                    <div class="form-check form-switch">
                                        <input ref="sub_status" v-model="sub.sub_status" class="form-check-input" @change="statusChange(sub.SubPid)" :id="'sub_status'+sub.SubPid" type="checkbox" role="switch">
                                        <label :for="'sub_status'+sub.SubPid" :id="sub_label+sub.SubPid">{{sub.sub_status_label}}</label>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
    
    <div class="modal fade" id="viewProcessFlow" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-fullscreen">
          <div class="modal-content">
            <div class="modal-header">
              <div class="col-md-12 row">
                    <div class="col-md-1">
                        <button ref="viewSaveBtn" @click="updatePosting" class="btn btn-outline-primary w-100 h-100" disabled>Save</button>
                    </div>
                    <div class="col-md-1">
                      <button ref="viewDeleteBtn" data-bs-target="#deletePrompt" data-bs-toggle="modal" class="btn btn-outline-primary w-100 h-100">Delete</button>
                    </div>
                    <div class="col-md-1">
                        <button data-bs-dismiss="modal" class="btn btn-outline-primary w-100 h-100">Close</button>
                    </div>
              </div>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="col-md-12 border rounded p-3 mx-auto row">
                <h6 class="p-3"><em>SETUP PROCESS FLOW MAIN</em></h6>
                <div class="col-md-1 p-1">
                    <label for="view_flow_no">Flow No.</label>
                    <input id="view_flow_no"  type="text" class="form-control" v-model="viewFlowId" disabled>
                </div>
                <div class="col-md-1 p-1">
                    <label for="view_flow_type">Flow Type</label>
                    <select id="view_flow_type" class="form-select" v-model="viewFlowType" disabled>
                        <option value="Manual">Manual</option>
                        <option value="Auto">Auto</option>
                    </select>
                </div>
                <div class="col-md-2 p-1">
                    <label for="view_parts_number">Parts Number</label>
                    <select id="view_parts_number"  class="form-select" v-model="viewPartsNumber" disabled>
                        <option v-for="item in itemMaster" :value="item.item_parts_number">{{ item.item_parts_number }}</option>
                    </select>
                </div>
                <div class="col-md-2 p-1">
                    <label for="view_item_code">Item Code</label>
                    <input id="view_item_code"  type="text" class="form-control" v-model="viewItemCode" disabled> 
                </div>
                <div class="col-md-3 p-1">
                    <label for="view_item_description">Item Description</label>
                    <input id="view_item_description"  type="text" class="form-control" v-model="viewItemDescription" disabled>
                </div>
                <div class="col-md-1 p-1">
                    <label for="view_encoded_by">Encoded By</label>
                    <input id="view_encoded_by" type="text" class="form-control" v-model="viewEncodedBy" disabled>
                </div>
                <div class="col-md-2 p-1">
                    <label for="view_date_encoded">Date Encoded</label>
                    <input id="view_date_encoded"  type="text" class="form-control" v-model="viewDateEncoded" disabled>
                </div>
                <div class="col-md-2 p-1">
                    <label for="view_section">Section</label>
                    <select v-model="viewSection" class="form-select" id="view_section" disabled>
                        <option v-for="sec in section" :value="sec.section_id">{{sec.section_code}}</option>
                    </select>
                </div>
                <div class="col-md-2 p-1">
                    <label for="view_revision_number">Revision Number</label>
                    <input id="view_revision_number"  type="text" class="form-control" v-model="viewRevisionNumber" disabled>
                </div>
                <div class="col-md-2 p-1">
                    <label for="view_flow_status">Flow Status</label>
                    <select ref="viewFlowStatus" @change="posting" class="form-select" id="view_flow_status" v-model="viewFlowStatus">
                        <option value="Posted">Posted</option>
                        <option value="Unposted">Unposted</option>
                    </select>
                </div>
                <div class="col-md-6 p-1">
                    <label for="view_remarks">Remarks</label>
                    <input id="view_remarks"  type="text" class="form-control" v-model="viewRemarks" disabled>
                </div>
              </div>
              <div class="col-md-12 mx-auto row">
                <div class="col-md-5 border-end">
                    <h6 class="p-2"><em>Key Process Flow</em></h6>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th style="width: 10%">Opr. No.</th>
                                <th>Section</th>
                                <th>Key Process Description</th>
                                <th style="width: 15%">Standard Time</th>
                                <th style="width: 15%">Machine Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="key in sortedKey">
                                <td>{{ key.sequence_number }}</td>
                                <td>{{ key.operation_number }}</td>
                                <td>{{ key.section_code }}</td>
                                <td v-if="key.section_code == 'SWP'">
                                    <select ref="keyProcessFlow" @change="fetchSubProcess" class="form-select" v-model="key.Pid" disabled>
                                        <option v-for="key in SWPOptions" :value="key.Pid">{{key.Pname}}</option>
                                    </select>
                                </td>   
                                <td v-else-if="key.section_code == 'CCD'">
                                    <select ref="keyProcessFlow" @change="fetchSubProcess" class="form-select" v-model="key.Pid" disabled>
                                        <option v-for="key in CCDOptions" :value="key.Pid">{{key.Pname}}</option>
                                    </select>
                                </td>
                                <td v-else>
                                    <select class="form-select" v-model="key.Pid" disabled>
                                        <option v-for="tempKey in tempKeyProcess" :value="tempKey.Pid">{{tempKey.Pname}}</option>
                                    </select>
                                </td>
                                <td>
                                    <input v-if="viewFlowStatus == 'Unposted'" ref="viewKeyStandardTime" type="text" class="form-control" v-model="key.standard_time">
                                    <p v-else>{{key.standard_time}}</p>
                                </td>
                                <td>
                                    <input v-if="viewFlowStatus == 'Unposted'" ref="viewKeyMachineTime" type="text" class="form-control" v-model="key.machine_time">
                                    <p v-else>{{key.machine_time}}</p>
                                </td>
                            </tr>
                        </tbody>
                        <tbody>

                        </tbody>
                    </table>
                </div>
                <div class="col-md-7">
                    <h6 class="p-2"><em>Sub Process Flow</em></h6>
                    <table class="table table-responsive">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Sub Process Description</th>
                                <th style="width: 6%">Standard Time</th>
                                <th style="width: 6%">Machine Time</th>
                                <th>Sampling</th>
                                <th>Uncontrolled</th>
                                <th>Batching Type</th>
                                <th>Result Type</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="sub in sortedSub">
                                <td>{{sub.sequence_number}}</td>
                                <td>{{sub.SubPname}}</td>
                                <td>
                                    <input v-if="viewFlowStatus == 'Unposted'" ref="viewSubStandardTime" type="text" class="form-control" v-model="sub.standard_time">
                                    <p v-else>{{sub.standard_time}}</p>
                                </td>
                                <td>
                                    <input v-if="viewFlowStatus == 'Unposted'" ref="viewSubMachineTime" type="text" class="form-control" v-model="sub.machine_time">
                                    <p v-else>{{sub.machine_time}}</p>
                                </td>
                                <td v-if="viewFlowStatus === 'Unposted'">
                                    <div class="form-check form-switch">
                                        <input ref="viewSampling" v-model="sub.check_sampling" class="form-check-input" type="checkbox" role="switch">
                                    </div>
                                </td>
                                <td v-else>
                                    <div class="form-check form-switch">
                                        <input ref="viewSampling" v-model="sub.check_sampling" class="form-check-input" type="checkbox" role="switch" disabled>
                                    </div>
                                </td>
                                <td v-if="viewFlowStatus === 'Unposted'">
                                    <div class="form-check form-switch">
                                        <input ref="viewUncontrolled" v-model="sub.check_uncontrolled" class="form-check-input" type="checkbox" role="switch">
                                    </div>
                                </td>
                                <td v-else>
                                    <div class="form-check form-switch">
                                        <input ref="viewUncontrolled" v-model="sub.check_uncontrolled" class="form-check-input" type="checkbox" role="switch" disabled>
                                    </div>
                                </td>
                                <td>
                                    <select class="form-select" v-model="sub.batching_type" disabled>
                                        <option value="Standard">Standard</option>
                                        <option value="Parallel">Parallel</option>
                                    </select>
                                </td>
                                <td>
                                    <select class="form-select" v-model="sub.result_type" disabled>
                                        <option value="Chips">Chips</option>
                                        <option value="Wafer">Wafer</option>
                                    </select>
                                </td>
                                <td v-if="viewFlowStatus === 'Unposted'">
                                    <div class="form-check form-switch">
                                        <input ref="viewSub_Status" :id="'viewSub_Status'+sub.SubPid" @change="viewStatusChange(sub.SubPid)" v-model="sub.sub_bool" class="form-check-input" type="checkbox" role="switch">
                                        <label :for="'viewSub_Status'+sub.SubPid">{{sub.sub_status}}</label>
                                    </div>
                                </td>
                                <td v-else>
                                    <div class="form-check form-switch">
                                        <input ref="viewSub_Status" :id="'viewSub_Status'+sub.SubPid" @change="viewStatusChange(sub.SubPid)" v-model="sub.sub_bool" class="form-check-input" type="checkbox" role="switch" disabled>
                                        <label :for="'viewSub_Status'+sub.SubPid">{{sub.sub_status}}</label>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
    <div class="modal fade" id="deletePrompt" aria-hidden="true" aria-labelledby="deletePrompt" tabindex="-1">
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="deletePrompt">Delete Process Flow</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                Are you certain you wish to delete this entire record? This action is irreversible and all associated data will be permanently lost. Please click 'Confirm' to proceed with the deletion.
            </div>
            <div class="modal-footer">
              <button class="btn btn-outline-primary" @click="deleteFlow" data-bs-dismiss="modal">Confirm</button>
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
        props: ['keyProcessResponse'],
        components: {
            DataTable,
        },
        data() {
            return {

                requestFlowKeyURL: 'http://172.16.2.60/tpc/requestKeyProcessFlow.php',
                requestFlowSubURL: 'http://172.16.2.60/tpc/requestSubProcessFlow.php',
                requestKeyURL: 'http://172.16.2.60/tpc/requestKeyProcess.php',
                requestSubURL: 'http://172.16.2.60/tpc/requestSubProcess.php',
                SectionGetURL: 'http://172.16.2.60/TPC/GetSection.php',
                SubProcessGetURL: 'http://172.16.2.60/tpc/GetSubProcess.php',
                requestItemMasterURL: 'http://172.16.2.60/tpcrequesthandlers/requestItemMasterMain.php',
                fetchProcessFlowURL: 'http://172.16.2.60/tpcrequesthandlers/fetchProcessFlowMain.php',
                GetKeyProcessURL: 'http://172.16.2.60/tpc/GetKeyProcess.php',

                PostProcessFlowURL: 'http://172.16.2.60/tpc/PostProcessFlow.php',
                PostKeyProcessFlowURL: 'http://172.16.2.60/tpc/PostKeyProcessFlow.php',
                PostSubProcessFlowURL: 'http://172.16.2.60/tpc/PostSubProcessFlow.php',

                DeleteProcessFlowURL: 'http://172.16.2.60/tpc/DeleteProcessFlow.php',
                DeleteProcessFlowKey: 'http://172.16.2.60/tpc/DeleteProcessFlowKey.php',
                DeleteProcessFlowSub: 'http://172.16.2.60/tpc/DeleteProcessFlowSub.php',

                PutProcessFlowKeyURL: 'http://172.16.2.60/tpc/PutProcessFlowKey.php',
                PutProcessFlowSubURL: 'http://172.16.2.60/tpc/PutProcessFlowSub.php',
                PutProcessFlowStatusURL: 'http://172.16.2.60/tpc/PutProcessFlowMainStatus.php',
                //objects
                section: [],
                processFlow: [],
                itemMaster: [],
                keyProcess: [],
                subProcess: [],
                tempKeyProcess: [],
                keyProcessFlow: [],
                subProcessFlow: [],
                itemList: [],
                flowKey: [],
                flowSub: [],

                SWPOptions: [],
                CCDOptions: [],

                // main data
                mainSection: '',
                mainSectionCode: '',
                mainFlowId: '',
                mainFlowType: 'Manual',
                mainPartsNumber: '',
                mainItemCode: '',
                mainItemDescription: '',
                mainEncodedBy: '3141 - Casul',
                mainDateEncoded: '',
                mainRevisionNumber: '',
                mainFlowStatus: 'Unposted',
                mainRemarks: '',

                // view data
                viewSection: '',
                viewSectionCode: '',
                viewFlowId: '',
                viewFlowType: '',
                viewPartsNumber: '',
                viewItemCode: '',
                viewItemDescription: '',
                viewEncodedBy: '',
                viewDateEncoded: '',
                viewRevisionNumber: '',
                viewFlowStatus: '',
                viewRemarks: '',

                tempFlowId: null,
                alert: '',
                tableOptions: { order: [[0, 'desc']]},
                // process flow table
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
                                  return '<button data-bs-toggle="modal" data-bs-target="#viewProcessFlow" class="btn w-100"><span class="material-symbols-outlined">open_in_new</span></button'
                              } 
                          },
                    ]
                }
        },
       
        methods: {
            statusChange(id){
                for(const sub of this.subProcessFlow){
                    if(id === sub.SubPid){
                        if(sub.sub_status === false){
                            sub.sub_status_label = 'Inactive';
                        } else {
                            sub.sub_status_label = 'Active';
                        }
                    }
                }
            },
            viewStatusChange(id){
                for(const sub of this.sortedSub){
                    if(id === sub.SubPid){
                        if(sub.sub_bool === false){
                            sub.sub_status = 'Inactive';
                        } else {
                            sub.sub_status = 'Active';
                        }
                    }
                }
            },
            submitProcessFlow(){
                const toastLiveExample = document.getElementById('liveToast');
                const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
                // toastBootstrap.show()

                let processFlowResponse = '';
                let processFlowSubResponse = '';
                let processFlowKeyResponse = '';
                let filterNull = false;
                let isDuplicate = false;
                let validatePartsNumber = false;
                let validateItemCode = false;
                let validateSection = false;
                let validateKeyProcessFlow = false;
                let validateSubProcessFlow = false;
                
                
                // checks for empty or null Pid in the selection
                if(this.mainPartsNumber == ""){
                    validatePartsNumber = true;
                    toastBootstrap.show()
                    this.alert = 'System Alert: Detection of an Unassigned Parts Number. Please conduct a thorough review.';
                }
                else if(this.mainItemCode == ""){
                    validateItemCode = true;
                    toastBootstrap.show()
                    this.alert = 'System Alert: Detection of an Unassigned Item Code. Please conduct a thorough review.';
                }
                else if(this.mainSection == ""){
                    validateSection = true;
                    toastBootstrap.show()
                    this.alert = 'System Alert: Detection of an Unassigned Section. Please conduct a thorough review.';
                }
                else if(this.keyProcessFlow.length == 0){
                    validateKeyProcessFlow = true;
                    toastBootstrap.show()
                    this.alert = 'System Alert: Detection of an Empty Key Process Flow. Please conduct a thorough review.';
                }
                else if(this.subProcessFlow.length == 0){
                    validateSubProcessFlow = true;
                    toastBootstrap.show()
                    this.alert = 'System Alert: Detection of an Empty Sub Process Flow. Please conduct a thorough review.';
                }
                for(const key of this.keyProcessFlow){
                    if(!Object.is(key.Pid, '')){
                        filterNull = false;
                    } else {
                        toastBootstrap.show()
                        this.alert = 'System Alert: Detection of an Unassigned Key Process. Please conduct a thorough review.';
                        filterNull = true;
                        break;
                    }
                }
                //checks for dups in data
                let valueArr = this.keyProcessFlow.map(function(key){ return key.Pid });
                isDuplicate = valueArr.some(function(item, idx){ 
                    return valueArr.indexOf(item) != idx
                });
               
                if(filterNull || isDuplicate || validatePartsNumber || validateItemCode || validateSection || validateKeyProcessFlow || validateSubProcessFlow){
                    if(isDuplicate === true){
                        this.alert = 'System Warning: Duplicate Entry Detected. Please perform a comprehensive verification.';
                        toastBootstrap.show()
                        isDuplicate = false;
                    } else {
                        isDuplicate = false;
                    }
                    isDuplicate = false;
                } else {
                axios.post(this.PostProcessFlowURL, {
                    main_flow_id: this.mainFlowId,
                    parts_number: this.mainPartsNumber,
                    item_code: this.mainItemCode,
                    item_description: this.mainItemDescription,
                    section_id: this.mainSection,
                    revision_number: this.mainRevisionNumber,
                    flow_status: this.mainFlowStatus,
                    remarks: this.mainRemarks,
                    encoded_by: this.mainEncodedBy,
                    date_encoded: this.mainDateEncoded,
                    flow_type: this.mainFlowType,
                }).then(response => {
                    if(response.data.message == 'Process Flow inserted successfully'){
                        processFlowResponse = 'Data Submitted';
                        this.alert = 'Your data has been successfully submitted! Thank you for providing the required information.';
                        toastBootstrap.show()
                        this.$refs.flow_type.disabled = true;
                        this.$refs.parts_number.disabled = true;
                        this.$refs.item_code.disabled = true;
                        this.$refs.section.disabled = true
                        this.$refs.addKeyBtn.disabled = true;
                        this.$refs.remarks.disabled = true;
                        this.$refs.saveBtn.disabled = true;
                        this.$refs.clearBtn.disabled = false;
                        this.processFlow.push({
                            flow_main_id: this.mainFlowId,
                            item_parts_number: this.mainPartsNumber,
                            section_code: this.mainSectionCode,
                            item_code: this.mainItemCode,
                            item_description: this.mainItemDescription,
                            section_id: this.mainSection,
                            revision_number: this.mainRevisionNumber,
                            flow_status: this.mainFlowStatus,
                            flow_remarks: this.mainRemarks,
                            encoded_by: this.mainEncodedBy,
                            date_encoded: this.mainDateEncoded,
                            flow_type: this.mainFlowType,
                        })
                        for(const key of this.keyProcessFlow){
                            for(const sec of this.section){
                                if(key.section_code == sec.section_code){
                                    key.section_id = sec.section_id;
                                }
                            }
                            axios.post(this.PostKeyProcessFlowURL, {
                                main_flow_id: this.mainFlowId,
                                operation_number: key.operation_number,
                                section_id: key.section_id,
                                parts_number: this.mainPartsNumber,
                                revision_number: this.mainRevisionNumber,
                                Pid: key.Pid,
                                sequence_number: key.sequence_no,
                                standard_time: key.standard_time,
                                machine_time: key.machine_time,
                                item_code: this.mainItemCode,   
                            }).then(response => {
                                if(response.data.message == 'Process Flow Key inserted successfully'){
                                    processFlowKeyResponse = 'Data Submitted';
                                    for(const processFlow of this.$refs.keyProcessFlow){
                                        processFlow.disabled = true;
                                    }
                                    for(const keyStdTime of this.$refs.keyStandardTime){
                                        keyStdTime.disabled = true;
                                    }
                                    for(const keyMachTime of this.$refs.keyMachineTime){
                                        keyMachTime.disabled = true;
                                    }
                                    for(const removeBtn of this.$refs.removeBtn){
                                        removeBtn.disabled = true;
                                    }
                                    for(const operation_number of this.$refs.keyOperationNumber){
                                        operation_number.disabled = true;
                                    }
                                }
                            }).catch(error => {
                                console.log(error);
                            });
                        }
                        for(const sub of this.subProcessFlow){
                            if(sub.sampling === true){
                                sub.sampling = 'True';
                            } else {
                                sub.sampling = 'False';
                            }
                            if(sub.uncontrolled === true){
                                sub.uncontrolled = 'True';
                            } else {
                                sub.uncontrolled = 'False';
                            }
                            axios.post(this.PostSubProcessFlowURL, {
                                main_flow_id: this.mainFlowId,
                                section_id: this.mainSection,
                                parts_number: this.mainPartsNumber,
                                revision_number: this.mainRevisionNumber,
                                Pid: sub.Pid,
                                SubPid: sub.SubPid,
                                sequence_number: sub.sequence_no,
                                standard_time: sub.standard_time,
                                machine_time: sub.machine_time,
                                item_code: this.mainItemCode,  
                                check_sampling: sub.sampling,
                                check_uncontrolled: sub.uncontrolled,
                                batching_type: sub.batching_type,
                                result_type: sub.result_type,
                                check_sub_status: sub.sub_status_label
                            }).then(response => {
                                if(response.data.message == 'Process Flow Sub inserted successfully'){
                                    processFlowSubResponse = 'Data Submitted';
                                    for(const subStdTime of this.$refs.subStandardTime){
                                        subStdTime.disabled = true;
                                    }
                                    for(const subMachTime of this.$refs.subMachineTime){
                                        subMachTime.disabled = true;
                                    }
                                    for(const sampling of this.$refs.sampling){
                                        sampling.disabled = true;
                                    }
                                    for(const uncontrolled of this.$refs.uncontrolled){
                                        uncontrolled.disabled = true;
                                    }
                                    for(const status of this.$refs.sub_status){
                                        status.disabled = true;
                                    }
                                    for(const batching of this.$refs.batching_type){
                                        batching.disabled = true;
                                    }
                                }
                            }).catch(error => {
                                console.log(error)
                            });
                        }
                    }
                }).catch(error => {
                    console.log(error);
                });
                }
            },
            getFlowId(event){
                if(event.target.tagName == 'BUTTON'){
                    const row = event.target.parentNode.parentNode;
                    const cell = row.querySelector('td');
                    this.tempFlowId = parseInt(cell.textContent);
                }
                if(event.target.tagName == 'SPAN'){
                    const row = event.target.parentNode.parentNode.parentNode;
                    const cell = row.querySelector('td');
                    this.tempFlowId = parseInt(cell.textContent);
                }
                for(const flow of this.processFlow){
                    if(this.tempFlowId === flow.flow_main_id){
                        this.viewSection = flow.section_id;
                        this.viewSectionCode = flow.section_code; 
                        this.viewFlowId = flow.flow_main_id;
                        if(this.viewSectionCode === 'SWP'){
                            this.viewFlowType = flow.flow_type;
                            this.viewPartsNumber = flow.item_parts_number;
                            this.viewItemCode = flow.item_code;
                            this.viewItemDescription = flow.item_description;
                            this.viewEncodedBy = flow.encoded_by;
                            this.viewDateEncoded = flow.date_encoded;
                            this.viewRevisionNumber = flow.revision_number;
                            this.viewFlowStatus = flow.flow_status;
                            this.viewRemarks = flow.flow_remarks;
                            if(this.viewFlowStatus == 'Posted'){
                                this.$refs.viewDeleteBtn.disabled = true;
                                this.$refs.viewSaveBtn.disabled = true;
                                this.$refs.viewFlowStatus.disabled = true;

                            } else {
                                this.$refs.viewDeleteBtn.disabled = false;
                                this.$refs.viewFlowStatus.disabled = false;
                            }
                            axios.get(this.requestFlowKeyURL, {
                                method: 'GET',
                                headers: {
                                    'Content-type': 'application/x-www-form-urlencoded'
                                },
                                params: {
                                    flow_main_id: this.viewFlowId 
                                }
                            }).then(response => {
                                this.flowKey = response.data;
                                for(const flowKey of this.flowKey){
                                    for(const sec of this.section){
                                        if(parseInt(flowKey.section_id) === parseInt(sec.section_id)){
                                            Object.assign(flowKey, {section_code: sec.section_code});
                                        }
                                    }
                                }
                            }).catch(error => {
                                console.log(error);
                            });
                            axios.get(this.requestFlowSubURL, {
                                method: 'GET',
                                headers: {
                                    'Content-type': 'application/x-www-form-urlencoded'
                                },
                                params: {
                                    flow_main_id: this.viewFlowId 
                                }
                            }).then(response => {
                                this.flowSub = response.data;
                                for(const sub of this.subProcess){
                                    for(const flow of this.flowSub){
                                        if(parseInt(flow.SubPid) === parseInt(sub.SubPid)){ 
                                            Object.assign(flow, {SubPname: sub.SubPname});
                                            if(flow.check_sampling === "True"){
                                                flow.check_sampling = true;
                                            } else {
                                                flow.check_sampling = false;
                                            }
                                            if(flow.check_uncontrolled === "True"){
                                                flow.check_uncontrolled = true;
                                            } else {
                                                flow.check_uncontrolled = false;
                                            }
                                        }
                                    }
                                }
                            }).catch(error => {
                                console.log(error);
                            });
                        } else {
                        this.viewFlowType = flow.flow_type;
                        this.viewPartsNumber = flow.item_parts_number;
                        this.viewItemCode = flow.item_code;
                        this.viewItemDescription = flow.item_description;
                        this.viewEncodedBy = flow.encoded_by;
                        this.viewDateEncoded = flow.date_encoded;
                        this.viewRevisionNumber = flow.revision_number;
                        this.viewFlowStatus = flow.flow_status;
                        this.viewRemarks = flow.flow_remarks;
                        if(this.viewFlowStatus == 'Posted'){
                            this.$refs.viewDeleteBtn.disabled = true;
                            this.$refs.viewSaveBtn.disabled = true;
                            this.$refs.viewFlowStatus.disabled = true;
                            
                        } else {
                            this.$refs.viewDeleteBtn.disabled = false;
                            this.$refs.viewFlowStatus.disabled = false;
                        }
                        axios.get(this.requestFlowKeyURL, {
                            method: 'GET',
                            headers: {
                                'Content-type': 'application/x-www-form-urlencoded'
                            },
                            params: {
                                flow_main_id: this.viewFlowId 
                            }
                        }).then(response => {
                            this.flowKey = response.data;
                            for(const key of this.flowKey){
                                for(const sec of this.section){
                                    if(parseInt(key.section_id) === parseInt(sec.section_id)){
                                        Object.assign(key, {section_code: sec.section_code});
                                    }
                                }
                            }
                        }).catch(error => {
                            console.log(error);
                        });
                        axios.get(this.requestFlowSubURL, {
                            method: 'GET',
                            headers: {
                                'Content-type': 'application/x-www-form-urlencoded'
                            },
                            params: {
                                flow_main_id: this.viewFlowId 
                            }
                        }).then(response => {
                            this.flowSub = response.data;
                            for(const sub of this.subProcess){
                                for(const flow of this.flowSub){
                                    if(parseInt(flow.SubPid) === parseInt(sub.SubPid)){ 
                                        Object.assign(flow, {SubPname: sub.SubPname});
                                        if(flow.check_sampling === "True"){
                                            flow.check_sampling = true;
                                        } else {
                                            flow.check_sampling = false;
                                        }
                                        if(flow.check_uncontrolled === "True"){
                                            flow.check_uncontrolled = true;
                                        } else {
                                            flow.check_uncontrolled = false;
                                        }
                                        if(flow.sub_status === 'Active'){
                                            Object.assign(flow, {sub_bool: true});
                                        } else {
                                            Object.assign(flow, {sub_bool: false})
                                        }
                                    }
                                }
                            }
                            console.log(this.flowSub);
                        }).catch(error => {
                            console.log(error);
                        });
                        axios.get(this.requestKeyURL, {
                            method: 'GET',
                            headers: {
                                'Content-type': 'application/x-www-form-urlencoded'
                            },
                            params: {
                                section_id: this.viewSection
                            }
                        }).then(response => {
                            this.tempKeyProcess = response.data;
                        }).catch(error => {
                            console.log(error);
                        });
                        }
                    }
                }
                
            },
            getItemCode(parts_number){
                this.mainSection = '';
                this.mainItemDescription = '';
                this.mainRevisionNumber = '';
                this.mainItemCode = '';
                this.itemList = [];
                this.$refs.item_code.disabled = false;
                
                for(const item of this.itemMaster){
                    if(parts_number === item.item_parts_number){
                        this.itemList.push(item);
                    }
                }
            },
            getItemDescriptionAndRevNo(parts_number, item_code){
                this.mainSection = '';
                this.mainRevisionNumber = '';
                this.$refs.section.disabled = false;
                for(const item of this.itemMaster){
                    if(parts_number === item.item_parts_number && item_code === item.item_code){
                        this.mainItemDescription = item.item_description;
                    }
                }
            },
            addKeyProcessFlow(){
                if(this.mainSectionCode === 'SWP'){
                    this.keyProcessFlow.push({
                        sequence_no: '',
                        operation_number: '',
                        section_id: '',
                        section_code: 'SWP',
                        Pid: '',
                        standard_time: 0,
                        machine_time: 0,
                    })
                    this.addSequenceNumber();
                    this.$refs.addKeyBtn.disabled = true;
                } else {
                    this.keyProcessFlow.push({
                    sequence_no: '',
                    operation_number: '',
                    section_id: this.mainSection,
                    section_code: this.mainSectionCode,
                    Pid: '',
                    standard_time: 0,
                    machine_time: 0,
                })
                    this.tempKeyProcess.shift();
                    this.addSequenceNumber();
                    this.$refs.addKeyBtn.disabled = true;
                }
            },
            removeKey(index){
                this.keyProcessFlow.splice(index, 1);
                this.addSequenceNumber();
                this.fetchSubProcess();
            },
            addSequenceNumber(){
                let sequence_number = 1;
                for(const key of this.keyProcessFlow){
                    key.sequence_no = sequence_number;
                    sequence_number++;
                }
            },
            addSubSequenceNumber(){
                let sequence_number = 1;
                for(const sub of this.subProcessFlow){
                    sub.sequence_no = sequence_number;
                    sequence_number++;
                }
            },
            
            fetchKeyProcess(){
                this.$refs.addKeyBtn.disabled = false;
                this.keyProcessFlow = [];
                this.subProcessFlow = [];
                for(const sec of this.section){
                    if(this.mainSection == sec.section_id){
                        this.mainSectionCode = sec.section_code;
                        axios.get(this.requestKeyURL, {
                            method: 'GET',
                            headers: {
                                'Content-type': 'application/x-www-form-urlencoded'
                            },
                            params: {
                                section_id: this.mainSection
                            }
                        }).then(response => {
                            this.keyProcess = response.data
                        }).catch(error => {
                            console.log(error);
                        });
                    }
                }
                let latestRevNo = -1;
                for(const flow of this.processFlow){
                    if(this.mainPartsNumber === flow.item_parts_number && this.mainItemCode === flow.item_code && parseInt(this.mainSection) === parseInt(flow.section_id) && flow.flow_status === 'Posted'){
                        if(flow.revision_number > latestRevNo){
                            latestRevNo = flow.revision_number;
                        }
                    }
                }
                this.mainRevisionNumber = latestRevNo + 1;
                
            },
            fetchSubProcess(){
                const toastLiveExample = document.getElementById('liveToast');
                const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
                this.subProcessFlow = [];
                let Pname = '';
                for(const [order, key] of Object.entries(this.keyProcessFlow)){
                    axios.get(this.requestSubURL,{
                        method: 'GET',
                        headers: {
                            'Content-type': 'application/x-www-form-urlencoded'
                        },
                        params: {
                            Pid: key.Pid
                        }
                    }).then(response => {
                        if(response.data.length > 0){
                            for(const sub of response.data){
                                if(sub.sub_process_status === 'Active'){
                                        this.subProcessFlow.push({
                                        Pid: sub.Pid,
                                        SubPid: sub.SubPid,
                                        SubPname: sub.SubPname,
                                        sequence_number: sub.sequence_number,
                                        standard_time: 0,
                                        machine_time: 0,
                                        sampling: false,
                                        uncontrolled: false,
                                        order: order,
                                        sequence_no: '',
                                        sub_status: true,
                                        batching_type: 'Standard',
                                        result_type: 'Wafer',
                                        sub_status_label: 'Active',
                                    });
                                } 
                            }
                        } else {
                            for(const keyP of this.keyProcess){
                                if(parseInt(key.Pid) === parseInt(keyP.Pid)){
                                    Pname = keyP.Pname;
                                }
                            }
                            toastBootstrap.show()
                            this.alert = 'System Alert: Detection of an Unassigned Sub Process Flow in Key Process Flow Sequence No - ' + Pname + '. Please conduct a thorough review.';
                        }
                        this.subProcessFlow.sort((a, b) => a.order - b.order);
                        this.addSubSequenceNumber();
                    }).catch(error => {
                        console.log(error)
                    });
                }
                this.$refs.addKeyBtn.disabled = false;
            },
            clearField(){
                this.mainFlowId = this.mainFlowId + 1;
                this.keyProcessFlow = [];
                this.subProcessFlow = [];
                this.$refs.flow_type.disabled = false;
                this.$refs.parts_number.disabled = false;
                this.$refs.item_code.disabled = false;
                this.$refs.section.disabled = false;
                this.$refs.addKeyBtn.disabled = false;
                this.$refs.remarks.disabled = false;
                this.$refs.saveBtn.disabled = false;
                this.$refs.clearBtn.disabled = true;
                this.mainFlowType = '';
                this.mainPartsNumber = '';
                this.mainItemCode = '';
                this.mainItemDescription = '';
                this.mainSection = '';
                this.mainRevisionNumber = '';
                this.mainRemarks = '';
            },
            posting(){
                if(this.viewFlowStatus == 'Posted'){
                    this.$refs.viewSaveBtn.disabled = false;
                    this.$refs.viewDeleteBtn.disabled = true;
                   
                    for(const viewKeyStdTime of this.$refs.viewKeyStandardTime){
                        viewKeyStdTime.disabled = true;
                    }
                    for(const viewKeyMachTime of this.$refs.viewKeyMachineTime){
                        viewKeyMachTime.disabled = true;
                    }
                    for(const viewSubStdTime of this.$refs.viewSubStandardTime){
                        viewSubStdTime.disabled = true;
                    }
                    for(const viewSubMachTime of this.$refs.viewSubMachineTime){
                        viewSubMachTime.disabled = true;
                    }
                } else {
                    this.$refs.viewSaveBtn.disabled = true;
                    this.$refs.viewDeleteBtn.disabled = false;
                }

            },
            updatePosting(){
                axios.put(this.PutProcessFlowStatusURL, {
                    flow_main_id: this.viewFlowId,
                    flow_status: this.viewFlowStatus
                }).then(response => {
                    if(response.data.message === 'Process Flow Status updated successfully'){
                        for(const flow of this.processFlow){
                            if(parseInt(this.viewFlowId) === parseInt(flow.flow_main_id)){
                                flow.flow_status = this.viewFlowStatus;
                            }
                        }
                        this.$refs.viewFlowStatus.disabled = true;

                        for(const key of this.flowKey){
                            axios.put(this.PutProcessFlowKeyURL, {
                                standard_time: key.standard_time,
                                machine_time: key.machine_time,
                                flow_key_id: key.flow_key_id,
                                Pid: key.Pid,
                            }).then(response => {
                                console.log(response.data);
                            }).catch(error => {
                                console.log(error);
                            });
                        }
                        
                        for(const sub of this.flowSub){
                            console.log(sub);
                            if(sub.check_sampling === true){
                                sub.sampling = 'True';
                            } else {
                                sub.sampling = 'False';
                            }
                            if(sub.check_uncontrolled === true){
                                sub.uncontrolled = 'True';
                            } else {
                                sub.uncontrolled = 'False';
                            }

                            axios.put(this.PutProcessFlowSubURL, {
                                standard_time: sub.standard_time,
                                machine_time: sub.machine_time,
                                flow_sub_id: sub.flow_sub_id,
                                SubPid: sub.SubPid,
                                sampling: sub.sampling,
                                uncontrolled: sub.uncontrolled,
                                sub_status: sub.sub_status
                            }).then(response => {
                                if(response.data.message === 'Process Flow Sub updated successfully'){
                                    for(const sampling of this.$refs.viewSampling){
                                        sampling.disabled = true;
                                    }
                                    for(const uncontrolled of this.$refs.viewUncontrolled){
                                        uncontrolled.disabled = true;
                                    }
                                    for(const sub_status of this.$refs.viewSub_Status){
                                        sub_status.disabled = true;
                                    }
                                }
                            }).catch(error => {
                                console.log(error);
                            });
                        }
                    }
                }).catch(error => {
                    console.log(error)
                });
            },
            deleteFlow(){
                    if(this.viewFlowStatus === 'Unposted'){
                        const SubandKeyDeleteMessage = '';
                        for(const sub of this.flowSub){
                            axios.post(this.DeleteProcessFlowSub, {
                                flow_main_id: sub.flow_main_id,
                                flow_sub_id: sub.flow_sub_id,
                                SubPid: sub.SubPid
                            }).then(response => {   
                                console.log(response.data);
                                if(response.data.message === 'Process Flow Sub deleted successfully'){
                                    for(const key of this.flowKey){
                                        if(parseInt(sub.flow_main_id) === parseInt(key.flow_main_id)){
                                            axios.post(this.DeleteProcessFlowKey, {
                                                flow_main_id: key.flow_main_id,
                                                flow_key_id: key.flow_key_id,
                                                Pid: key.Pid
                                            }).then(response => {
                                                if(response.data.message === 'Process Flow Key deleted successfully'){
                                                    axios.post(this.DeleteProcessFlowURL, {
                                                        flow_main_id: key.flow_main_id
                                                    }).then(response => {
                                                        if(response.data.message === 'Process Flow deleted successfully'){
                                                            for (const flow of this.processFlow) {
                                                              if (this.viewFlowId === flow.flow_main_id) {
                                                                const index = this.processFlow.indexOf(flow);
                                                                this.processFlow.splice(index, 1);
                                                              }
                                                            }
                                                        }
                                                    }).catch(error => {
                                                        console.log(error)
                                                    }) 
                                                }
                                            }).catch(error => {
                                                console.log(error);
                                            }); 
                                        }
                                    }
                                }
                            }).catch(error => {
                                console.log(error)
                            });
                        }
                    }
            },
        },
        computed:{
            sortedKey(){
                return this.flowKey.sort((a, b) => a.sequence_number - b.sequence_number);
            },
            sortedSub(){
                return this.flowSub.sort((a, b) => a.sequence_number - b.sequence_number);
            }
        },
        async created(){

            if(this.viewFlowStatus === 'Posted'){
                this.$refs.viewSaveBtn.disabled = true;
                this.$refs.viewDeleteBtn.disabled = true;
                for(const sampling of this.$refs.viewSampling){
                    sampling.disabled = true;
                    console.log(sampling);
                }
                for(const uncontrolled of this.$refs.viewUncontrolled){
                    uncontrolled.disabled = true;
                }
            }

            await axios.get(this.SectionGetURL,{
            }).then(response => {
                this.section = response.data;
            }).catch(error => {
                console.log(error)
            });
            
            await axios.get(this.GetKeyProcessURL, {

            }).then(response => {
                for(const key of response.data){
                    for(const sec of this.section){
                        if(sec.section_code == 'SWP' && sec.section_id == key.section_id){
                            this.SWPOptions.push(key);
                        } else if(sec.section_code == 'CCD' && sec.section_id == key.section_id){
                            this.CCDOptions.push(key);
                        }
                    }
                }
                
            }).catch(error => {
                console.log(error);
            });

            await axios.get(this.requestItemMasterURL, {
            }).then(response => {
                this.itemMaster = response.data;
            }).catch(error => {
                console.log(error)
            })

            await axios.get(this.SubProcessGetURL, {

            }).then(response => {
                this.subProcess = response.data;
            }).catch(error => {
                console.log(error);
            });

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
                const maxFlowMainId = this.processFlow.reduce((maxId, flow) => {
                    return flow.flow_main_id > maxId ? flow.flow_main_id : maxId;
                }, 0);
                this.mainFlowId = maxFlowMainId + 1;
            }).catch(error => {
                console.log(error)
            })

            const maxFlowMainId = this.processFlow.reduce((maxId, flow) => {
                    return flow.flow_main_id > maxId ? flow.flow_main_id : maxId;
            }, 0);
            
            this.mainDateEncoded = new Date().toJSON().slice(0, 10);
        },
        updated(){

        }
    }
    </script>
    <style>
    @import 'bootstrap';
    @import 'datatables.net-bs5';
    </style>
    