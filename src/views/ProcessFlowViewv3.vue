
<template>

    <div class="col-md-12 row mx-auto py-3 container">
        <div class="col-md-9">
            <h3>Tablet Process Card - <em>Setup Process Flow</em></h3>
        </div>
        <div class="col-md-3 float-end">
            <button type="button" class="btn btn-outline-info w-100" data-bs-toggle="modal" data-bs-target="#createProcessFlow" @click="clear">
                Create Process Flow
            </button>
        </div>subProcessFlow
    </div>
    <div class="container table-responsive">
        <DataTable
        :data="processFlow"
        :columns="columns"
        class="display table"
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
                    <button v-if="flow_main_id ===''" type="button" @click="clearFields" class="btn btn-outline-primary float-end w-100">Clear</button>
                    <button v-else type="button" @click="deleteFlow" class="btn btn-outline-primary float-end w-100" data-bs-dismiss="modal" :disabled="flowStatus === 'Posted'">Delete</button>
                </div>
                <div class="col-md-4">
                    <button v-if="flow_main_id===''" type="button" @click="submitFlow" class="btn btn-outline-primary float-end w-100" :disabled="finishedMainSubmission">Save</button>
                    <button ref="postingBtn" v-else-if="flow_main_id !=='' || flowStatus==='Unposted'" type="button" @click="Posting" class="btn btn-outline-primary float-end w-100" >Save</button>
                </div>
              </div>
            </div>
            <div class="modal-body">
              <div class="col-md-12 p-3 row border rounded mx-auto shadow bg-light">
                
                <div class="col-md-2 p-2">
                    <label for="flow_type">Flow Type : </label>
                    <select id="flow_type" class="form-select" v-model="flowType" :disabled="flow_main_id !== '' || finishedMainSubmission">
                        <option value="Manual">Manual</option>
                        <option value="Auto">Auto</option>
                    </select>
                </div>
                <div class="col-md-2 p-2">
                    <label for="section">Section :</label>
                    <select id="section" class="form-control" v-model="sectionId" @change="assignSectionCode(sectionId)" :disabled="flow_main_id !== '' || finishedMainSubmission">
                        <option v-for="sec in section" :value="sec.section_id">{{sec.section_code}}</option>
                    </select>
                </div>
                <div class="col-md-2 p-2">
                    <label for="parts_number">Parts Number :</label>
                    <select id="parts_number" @change="getItemCode(itemPartsNumber)" class="form-control" v-model="itemPartsNumber" :disabled="flow_main_id !== '' || finishedMainSubmission">
                        <option v-for="parts in filteredItemPartsNumber" :value="parts.item_parts_number">{{parts.item_parts_number}}</option>
                    </select>
                </div>
                <div class="col-md-2 p-2">
                    <label for="item_code">Item Code :</label>
                    <select v-if="flow_main_id === ''" id="item_code" @change="getRevisionNumber(itemPartsNumber, itemCode)" class="form-select" v-model="itemCode" :disabled="finishedMainSubmission">
                        <option v-for="item in itemCodeList" :value="item.item_code">{{item.item_code}}</option>
                    </select>
                    <input v-else type="text" class="form-control" v-model="itemCode" disabled>
                </div>
                <div class="col-md-2 p-2">
                    <label for="item_description">Item Description :</label>
                    <input type="text" class="form-control" v-model="itemDescription" disabled> 
                </div>
                <div class="col-md-2 p-2">
                    <label for="date_encoded">Date Encoded :</label>
                    <input id="date_encoded" type="text" class="form-control" v-model="dateEncoded" disabled>
                </div>
                <div class="col-md-2 p-2">
                    <label for="process_flow_status">Process Flow Status :</label>
                    <select @change="enablePostingBtn" id="process_flow_status" class="form-select" v-model="flowStatus" :disabled="flow_main_id === '' || flowStatus === 'Posted' || finishedMainSubmission" >
                        <option value="Posted">Posted</option>
                        <option value="Unposted">Unposted</option>
                    </select>
                </div>
                <div class="col-md-2 p-2">
                    <label for="revision_number">Revision Number :</label>
                    <input id="revision_number" type="text" class="form-control" v-model="revisionNumber" disabled>
                </div>
                <div class="col-md-2 p-2">
                    <label for="encoded_by">Encoded By :</label>
                    <input id="encoded_by" type="text" class="form-control" v-model="encodedBy" disabled>
                </div>
                <div class="col-md-6 p-2">
                    <label for="remarks">Remarks</label>
                    <input type="text" class="form-control" v-model="remarks" :disabled="flow_main_id !== '' || finishedMainSubmission">
                </div>
                <hr>
                <div v-if="submissionOnProgress" class="col-md-12 alert alert-warning">
                    <p>System Alert: Please avoid closing or refreshing the page. Thank you for your patience as we complete the submission.</p>
                </div>
                <div class="col-md-5 border-end p-2">
                    <p class="fs-5"><em>Key Process Flow</em></p>
                    <div class="progress" role="progressbar" aria-label="Example with label" :aria-valuenow="keyLoader" aria-valuemin="0" aria-valuemax="100">
                        <div class="progress-bar" :style="'width: '+keyLoader+'%'">{{keyLoader}}%</div>
                    </div>
                </div>
                <div class="col-md-7 p-2">
                    <p class="fs-5"><em>Sub Process Flow</em></p>
                    <div class="progress" role="progressbar" aria-label="Example with label" :aria-valuenow="subLoader" aria-valuemin="0" aria-valuemax="100">
                        <div class="progress-bar" :style="'width: '+subLoader+'%'">{{ parseInt(subLoader)}}%</div>
                    </div>
                </div>
              </div>
              <div class="col-md-12 row mx-auto shadow">
                <div class="col-md-5 mx-auto border-end table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th width="10%">Op. No.</th>
                                <th>Section</th>
                                <th>Key Process</th>
                                <th width="10%">Standard</th>
                                <th width="10%">Machine</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(key, index) in keyProcessFlow" :key="key.Pid">
                                <td>{{key.sequence_number}}</td>
                                <td>
                                    <input type="number" class="form-control" v-model="key.operation_number" :disabled="flowStatus === 'Posted' || finishedKeySubmission">
                                </td>
                                <td>
                                    <select v-if="sectionCode === 'SWP'"  class="form-select" :id="'section'+key.Pid" v-model="key.section_id" :disabled="key.section_id !== ''">
                                        <template  v-for="sec in section">
                                            <option :value="sec.section_id" v-if="sec.section_code === 'SWP' || sec.section_code === 'CCD'">{{sec.section_code}}</option>
                                        </template>
                                    </select>
                                    <p v-else>{{sectionCode}}</p>
                                </td>
                                <td>
                                    <select class="form-select" v-model="key.Pid" @change="handleKeyProcessChange(key.Pid)" :disabled="key.Pid !== ''">
                                        <option value="" selected disabled></option>
                                        <template v-if="sectionCode === 'SWP'" v-for="option in SWPOptions" :key="option.Pid">
                                            <option v-if="key.section_id === option.section_id" :value="option.Pid" :disabled="option.selected">{{option.Pname}}</option>
                                            <option v-else-if="key.Pid !==''" :value="option.Pid" :disabled="option.selected">{{option.Pname}}</option>
                                        </template>
                                        <option v-else v-for="option in KEYOptions" :value="option.Pid" :disabled="option.selected">{{option.Pname}}</option>
                                    </select>
                                </td>
                                <td>
                                    <input type="text" class="form-control" v-model="key.standard_time" :disabled="flowStatus === 'Posted' || finishedKeySubmission">
                                </td>
                                <td>
                                    <input type="text" class="form-control" v-model="key.machine_time" :disabled="flowStatus === 'Posted' || finishedKeySubmission">
                                </td>
                                <td>
                                    <button class="btn btn-sm btn-outline-danger" @click="removeFlow(index, key.Pid)" :disabled="flowStatus === 'Posted'">
                                        <span class="material-symbols-outlined">
                                            close
                                        </span>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                        <tbody>
                            <tr>
                                <td colspan="6">
                                    <button 
                                    ref="addBtn" 
                                    class="btn btn-lg btn-outline-primary float-end w-100" 
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
                <div class="col-md-7 table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Sub Process</th>
                                <th width="10%">Standard</th>
                                <th width="10%">Machine</th>
                                <th width="10%">Batching Type</th>
                                <th width="10%">Result Type</th>
                                <th>Sampling</th>
                                <th>Uncontrolled</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-for="sub in subProcessFlow" :key="sub.SubPid">
                                <tr >
                                    <td>{{sub.sequence_number}}</td>
                                    <td>{{sub.SubPname}}</td>
                                    <td>
                                        <input type="text" class="form-control" v-model="sub.machine_time" :disabled="flowStatus === 'Posted' || finishedSubSubmission">
                                    </td>
                                    <td>
                                        <input type="text" class="form-control" v-model="sub.machine_time" :disabled="flowStatus === 'Posted' || finishedSubSubmission">
                                    </td>
                                    <td>
                                        <select class="form-select" v-model="sub.batching_type" :disabled="flowStatus === 'Posted' || finishedSubSubmission">
                                            <option value="Standard">Standard</option>
                                            <option value="Parallel">Parallel</option>
                                        </select>
                                    </td>
                                    <td>
                                        <select class="form-select" v-model="sub.result_type" :disabled="flowStatus === 'Posted' || finishedSubSubmission">
                                            <option value="Wafer">Wafer</option>
                                            <option value="Chips">Chips</option>
                                        </select>
                                    </td>
                                    <td>
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" @change="samplingStatus(sub.SubPid)" type="checkbox" role="switch" :id="'sampling'+sub.SubPid" :checked="sub.sampling" :disabled="flowStatus === 'Posted' || finishedSubSubmission">
                                          </div>
                                    </td>
                                    <td>
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" @change="uncontrolledStatus(sub.SubPid)" type="checkbox" role="switch" :id="'uncontrolled'+sub.SubPid" :checked="sub.uncontrolled" :disabled="flowStatus === 'Posted' || finishedSubSubmission">
                                          </div>
                                    </td>
                                    <td>
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" @change="subProcessFlowStatus(sub.SubPid)" type="checkbox" role="switch" :id="'status'+sub.SubPid" :checked="sub.sub_status" :disabled="flowStatus === 'Posted' || finishedSubSubmission">
                                            <label class="form-check-label" :for="'status'+sub.SubPid">{{sub.sub_status_label}}</label>
                                          </div>
                                    </td>
                                    <td>
                                        <button class="btn btn-sm btn-outline-primary" @click="" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapseWidthExample'+sub.SubPid" aria-expanded="false" :aria-controls="'collapseWidthExample'+sub.SubPid">
                                            <span class="material-symbols-outlined">
                                                expand_more
                                            </span>
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="10" class="collapse collapse-horizontal" :id="'collapseWidthExample'+sub.SubPid">
                                        <div class="table-responsive p-3">
                                            <table class="table">
                                                <thead>
                                                    <tr>
                                                        <th>No.</th>
                                                        <th>Process Detail Description</th>
                                                        <th>Typical Value</th>
                                                        <th>Minimum Value</th>
                                                        <th>Maximum Value</th>
                                                        <th>Target Value Visibility</th>
                                                        <th>Condition Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                <template v-for="condition in sub.conditions" :key="condition.item_id">
                                                    <tr v-if="sub.SubPid === condition.SubPid">
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
                    </table>
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
        props: ['keyProcessResponse'],
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

                alert: '',

                finishedKeySubmission: false,
                finishedSubSubmission: false,
                finishedMainSubmission: false,
                finishedConditionSubmission: false,

                keyLoader: 0,
                subLoader: 0,
                submissionOnProgress: false,


                itemMaster: [],
                processFlow: [],
                section: [],
                keyProcess: [],
                subProcess: [],
                itemCodeList: [],

                KEYOptions: [],
                SWPOptions: [],
                CCDOptions: [],

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
                    ]
                }
        },
        computed:{
            filteredItemPartsNumber(){
                const uniquePartsNumber = new Set();
                return this.itemMaster.filter((itemPartsNumber) => {
                    if(!uniquePartsNumber.has(itemPartsNumber.item_parts_number)){
                        uniquePartsNumber.add(itemPartsNumber.item_parts_number);
                        return true;
                    }
                    return false;
                })
            },
        },
        methods: {
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
                await axios.put(this.PutProcessFlowStatusURL, {
                    flow_main_id: this.flow_main_id,
                    flow_status: this.flowStatus
                }).then(response => {
                    if(response.data.message === 'Process Flow Status updated successfully'){
                        for(const flow of this.processFlow){
                            if(parseInt(this.flow_main_id) === parseInt(flow.flow_main_id)){
                                flow.flow_status = this.flowStatus;
                                // this.$refs.postingBtn.disabled = true;
                                let initiateQuery = async () => {
                                    await this.DestroyFlow(this.flow_main_id);
                                    this.SubmitKey(this.flow_main_id);
                                    this.SubmitSub(this.flow_main_id);
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
                    if(flow.flow_main_id === this.flow_main_id){
                        this.flowType = flow.flow_type;
                        this.sectionId = parseInt(flow.section_id);
                        this.itemPartsNumber = flow.item_parts_number;
                        this.itemCode = flow.item_code;
                        this.itemDescription = flow.item_description;
                        this.dateEncoded = flow.date_encoded;
                        this.flowStatus = flow.flow_status;
                        this.revisionNumber = flow.revision_number;
                        this.encodedBy = flow.encoded_by;
                        this.remarks = flow.remarks;
                    }
                }
                await this.assignSectionCode(this.sectionId);
                await this.assignFlowKey(this.flow_main_id);
                await this.assignFlowSub(this.flow_main_id);
                

            },
            enablePostingBtn(){
                this.$refs.postingBtn.disabled = false;
            },
            async submitFlow(){
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

                } else {
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
                                console.log(flow_main_id)
                                await this.SubmitKey(flow_main_id);
                                await this.SubmitSub(flow_main_id);
                                // await this.SubmitCondition(flow_main_id);
                            }
                            submitFlow(flow_main_id);
                            
                        }
                    }).catch(error => {
                        console.log(error)
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
                        console.log(response.data)
                        if(response.data.message === 'Process Flow Key inserted successfully'){
                            loader++;
                            this.keyLoader = (loader / limit) * 100;
                            if(loader === limit){
                                this.finishedKeySubmission = true;
                                this.alert = 'Flow Key Submission: Complete';
                                toastBootstrap.show();
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
                        check_sub_status: sub.sub_status_label
                    }).then(response => {
                        if(response.data.message === 'Process Flow Sub inserted successfully'){
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
                    for(const condition of sub.conditions){
                        console.log(condition);
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
                        }).then(response => {
                            console.log(response.data)
                        }).catch(error => {
                            console.log(error);
                        })
                    }
                }
            },
            async SubmitCondition(flow_main_id){
                for(const condition of this.conditionProcessFlow){
                    await axios.post(this.PostConditionProcessFlowURL, {
                        main_flow_id: flow_main_id,
                        SubPid: condition.SubPid,
                        sequence_number: condition.sequence_number,
                        detail_description: condition.detail_description,
                        field_type: condition.field_type,
                        typical_value: condition.typical_value,
                        min_value: condition.min_value,
                        max_value: condition.max_value,
                        condition_status: condition.status_label,
                        visibility_status: condition.visibility,
                    }).then(response => {
                        console.log(response.data)
                    }).catch(error => {
                        console.log(error);
                    })
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
                this.itemCodeList = [];
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
                        // for(const condition of this.conditionProcessFlow){
                        //     if(parseInt(SubPid) === parseInt(condition.SubPid)){
                        //         document.getElementById(`itemStatus${condition.item_id}`).disabled = !status;
                        //         condition.status = status;
                        //         condition.status_label = status ? 'Active' : 'Inactive';
                        //     }
                        // }
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
                for(const sub of this.subProcessFlow){
                    if(parseInt(SubPid) === parseInt(sub.SubPid)){
                        for(const condition of sub.conditions){
                            if(parseInt(item_id) === parseInt(condition.item_id)){
                                condition.status_label = status ? 'Active': 'Inactive';
                            }
                        }
                    }
                }
                // for(const condition of this.conditionProcessFlow){
                //     if(parseInt(item_id) === parseInt(condition.item_id)){
                //         condition.status_label = status ? 'Active': 'Inactive';
                //     }
                // }
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
                // for(const condition of this.conditionProcessFlow){
                //     if(parseInt(item_id) === parseInt(condition.item_id)){
                //         condition.visibility = status ? true : false;
                //     }
                // }
            },
            handleKeyProcessChange(Pid){
                this.$refs.addBtn.disabled = false;
                if(this.sectionCode === 'SWP'){
                    for(const option of this.SWPOptions){
                        if(parseInt(Pid) === parseInt(option.Pid)){
                            option.selected = true;
                        }
                    }
                } else {
                    for(const option of this.KEYOptions){
                        if(parseInt(Pid) === parseInt(option.Pid)){
                            option.selected = true;
                        }
                    }
                }
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
                    console.log(sub);
                        if(sub.sub_process_status === 'Active'){
                            sub['sequence'] = sub['sequence_number'];
                            sub.sequence_number = '';
                            this.subProcessFlow.push({
                                Pid: sub.Pid,
                                SubPid: sub.SubPid,
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
                                conditions: []
                            })
                            this.getCondition(sub.SubPid)
                        }
                   }
                   this.subProcessFlow.sort((a,b) => a.sequence - b.sequence);
                   this.subSequence();
                }).catch(error => {
                    console.log(error)
                });
            },
            async getCondition(SubPid){
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
                        Object.assign(condition, {status: true, status_label: 'Active', visibility: true });
                        for(const sub of this.subProcessFlow){
                            if(sub.SubPid === condition.SubPid){
                                sub.conditions.push(condition);
                                sub.conditions.sort((a,b) => a.sequence_number - b.sequence_number);
                            }
                        }
                    }
                }).catch(error => {
                    console.log(error)
                });
            }, 
            async getFlowCondition(flow_main_id){
                await axios.get(this.requestFlowConditionURL, {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    },
                    params: {
                        flow_main_id: flow_main_id
                    }
                }).then(response => {
                    for(const condition of response.data){
                        condition['status_label'] = condition['condition_status'];
                        Object.assign(condition, {status: true ? condition.status_label === 'Active' : 'Inactive', visibility: true ? condition.visibility_status === 1 : 0});
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
            getItemCode(partsNumber){
                this.itemCodeList = []
                this.keyProcessFlow = [];
                this.subProcessFlow = [];
                this.conditionProcessFlow = [];
                for(const item of this.itemMaster){
                    if(partsNumber === item.item_parts_number){
                        this.itemCodeList.push(item);
                    }
                }
            },
            getRevisionNumber(partsNumber, itemCode){
                let latestRevNo = -1;
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

                            axios.get(this.requestFlowKeyURL, {
                                method: 'GET',
                                headers: {
                                    'Content-type': 'application/x-www-form-urlencoded'
                                },
                                params: {
                                    flow_main_id: flow.flow_main_id
                                }
                            }).then(response => {
                                for(const key of response.data){
                                    this.keyProcessFlow.push(key)
                                    for(const option of this.KEYOptions){
                                        if(parseInt(key.Pid) === parseInt(option.Pid)){
                                            option.selected = true;
                                        }
                                    }
                                }
                                this.keyProcessFlow.sort((a,b) => a.sequence_number - b.sequence_number);
                            }).catch(error => {
                                console.log(error);
                            });

                            axios.get(this.requestFlowSubURL, {
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
                                            Object.assign(flowSub, {
                                                SubPname: sub.SubPname,
                                                sampling: flowSub.check_sampling === "True" ? true : false,
                                                uncontrolled: flowSub.check_uncontrolled === "True" ? true : false,
                                                sub_status: flowSub.sub_status === "Active" ? true : false,
                                                sub_status_label: flowSub.sub_status === "Active" ? "Active" : "Inactive",
                                                conditions: [],
                                            });
                                            this.subProcessFlow.sort((a,b) => a.sequence_number - b.sequence_number).push(flowSub);
                                        }
                                    }
                                    
                                }
                            }).catch(error => {
                                console.log(error);
                            });
                            this.getFlowCondition(flow.flow_main_id);
                    }
                }
                this.revisionNumber = latestRevNo + 1;

            },
            addKeyProcessFlow(){
                this.$refs.addBtn.disabled = true;
                if(this.sectionCode === 'SWP'){
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
                this.keyProcessFlow = [];
                this.subProcessFlow = [];
                this.conditionProcessFlow = [];
                for(const sec of this.section){
                    if(parseInt(section_id) === parseInt(sec.section_id)){
                        this.sectionCode = sec.section_code;
                    }
                }
                this.KEYOptions = [];

                for(const key of this.keyProcess){
                    if(parseInt(section_id) === parseInt(key.section_id)){
                        this.KEYOptions.push(key);
                        for(const option of this.KEYOptions){
                            Object.assign(option, {selected: false});
                        }
                    }
                }
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
                    for(const key of response.data){
                        this.keyProcessFlow.push(key)
                        for(const option of this.KEYOptions){
                            if(parseInt(key.Pid) === parseInt(option.Pid)){
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
                        for(const sub of this.subProcess){
                            if(parseInt(flowSub.SubPid) === parseInt(sub.SubPid)){
                                Object.assign(flowSub, {
                                    SubPname: sub.SubPname,
                                    sampling: flowSub.check_sampling === "True" ? true : false,
                                    uncontrolled: flowSub.check_uncontrolled === "True" ? true : false,
                                    sub_status: flowSub.sub_status === "Active" ? true : false,
                                    sub_status_label: flowSub.sub_status === "Active" ? "Active" : "Inactive",
                                    conditions: [],
                                });
                                this.subProcessFlow.sort((a,b) => a.sequence_number - b.sequence_number).push(flowSub);
                            }
                        }
                    }
                }).catch(error => {
                    console.log(error);
                });
                await this.getFlowCondition(flow_main_id);
            },
            async removeFlow(index, Pid){
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
            })

            await axios.get(this.GetKeyProcessURL, {
            }).then(response => {
                this.keyProcess = response.data.filter((key) => key.key_process_status === 'Active');
                for(const key of this.keyProcess){
                    for(const sec of this.section){
                        if(parseInt(key.section_id) === parseInt(sec.section_id)){
                            Object.assign(key, {section_code: sec.section_code});
                        }
                    }
                    if(key.section_code === 'SWP' || key.section_code === 'CCD'){
                            this.SWPOptions.push(key);
                            for(const option of this.SWPOptions){
                                Object.assign(option, {selected: false});
                            }
                    }
                }
                
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
    