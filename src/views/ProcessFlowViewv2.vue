
<template>

    <div class="col-md-12 row mx-auto p-3 container">
        <div class="col-md-9">
            <h3>Tablet Process Card - Setup Process Flow</h3>
        </div>
        <div class="col-md-3 float-end">
            <button type="button" class="btn btn-outline-primary w-100" data-bs-toggle="modal" data-bs-target="#createProcessFlow">
                Create Process Flow
            </button>
        </div>
        <div class="p-3">
            <DataTable
            :data="processFlow"
            :columns="columns"
            class="display table"
            @click="getFlowId"
        />
        </div>
    </div>

    

    <div class="modal fade" id="createProcessFlow" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-fullscreen">
          <div class="modal-content">
            <div class="modal-header">
              <div class="col-md-12 row">
                  <div class="col-md-1">
                      <button @click="clearField" ref="clearBtn" class="btn btn-outline-primary w-100 h-100" disabled>Clear</button>
                  </div>
                  <div class="col-md-1">
                      <button @click="submitProcessFlow" ref="saveBtn" class="btn btn-outline-primary w-100 h-100">Save</button>
                  </div>
                  <div class="col-md-1">
                      <button class="btn btn-outline-primary w-100 h-100">Close</button>
                  </div>
              </div>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="col-md-12 border rounded p-3 mx-auto row">
                <div class="col-md-1 p-1">
                    <label for="flow_no">Flow No.</label>
                    <input id="flow_no"  type="text" class="form-control" v-model="mainFlowId" disabled>
                </div>
                <div class="col-md-1 p-1">
                    <label for="flow_type">Flow Type</label>
                    <select id="flow_type" ref="flow_type" class="form-select" v-model="mainFlowType" >
                        <option value="Manual">Manual</option>
                        <option value="Auto">Auto</option>
                    </select>
                </div>
                <div class="col-md-2 p-1">
                    <label for="parts_number">Parts Number</label>
                    <select @change="getItemCode(mainPartsNumber)" id="parts_number" ref="parts_number"  class="form-select" v-model="mainPartsNumber">
                        <option v-for="item in itemMaster" :value="item.item_parts_number">{{ item.item_parts_number }}</option>
                    </select>
                </div>
                <div class="col-md-2 p-1">
                    <label for="item_code">Item Code</label>
                    <select @change="getItemDescriptionAndRevNo(mainPartsNumber, mainItemCode)" id="item_code" ref="item_code"  type="text" class="form-control" v-model="mainItemCode">
                        <option v-for="itemCode in itemList" :value="itemCode.item_code">{{itemCode.item_code}}</option>
                    </select>
                </div>
                <div class="col-md-3 p-1">
                    <label for="item_description">Item Description</label>
                    <input id="item_description" ref="item_description"  type="text" class="form-control" v-model="mainItemDescription" disabled>
                </div>
                <div class="col-md-1 p-1">
                    <label for="encoded_by">Encoded By</label>
                    <input id="encoded_by" ref="encoded_by" type="text" class="form-control" v-model="mainEncodedBy" disabled>
                </div>
                <div class="col-md-2 p-1">
                    <label for="date_encoded">Date Encoded</label>
                    <input id="date_encoded" ref="date_encoded"  type="text" class="form-control" v-model="mainDateEncoded" disabled>
                </div>
                <div class="col-md-2 p-1">
                    <label for="section">Section</label>
                    <select @change="fetchKeyProcess" ref="section" v-model="mainSection" class="form-select" id="section">
                        <option v-for="sec in section" :value="sec.section_id">{{sec.section_code}}</option>
                    </select>
                </div>
                <div class="col-md-2 p-1">
                    <label for="revision_number">Revision Number</label>
                    <input id="revision_number" ref="revision_number" type="text" class="form-control" v-model="mainRevisionNumber" disabled>
                </div>
                <div class="col-md-2 p-1">
                    <label for="flow_status">Flow Status</label>
                    <input id="flow_status" ref="flow_status" type="text" class="form-select" v-model="mainFlowStatus" disabled>
                </div>
                <div class="col-md-6 p-1">
                    <label for="remarks">Remarks</label>
                    <input id="remarks" ref="remarks"  type="text" class="form-control" v-model="mainRemarks">
                </div>

              </div>
              <div class="col-md-12 mx-auto row">
                <div class="col-md-6 border-end">
                    <h6 class="p-2"><em>Key Process Flow</em></h6>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Section</th>
                                <th>Key Process Description</th>
                                <th>Standard Time</th>
                                <th>Machine Time</th>
                                <th>Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(key, index) in keyProcessFlow">
                                <td>{{index + 1}}</td>
                                <td>{{ mainSectionCode }}</td>
                                <td>
                                    <select ref="keyProcessFlow" @change="fetchSubProcess" class="form-select" v-model="key.Pid">
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

                        </tbody>
                        <tbody>
                            <tr>
                                <td colspan="6">
                                    <button ref="addKeyBtn" @click="addKeyProcessFlow" class="btn w-100 btn-outline-primary" disabled>Add Row</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="col-md-6">
                    <h6 class="p-2"><em>Sub Process Flow</em></h6>
                    <table class="table table-responsive">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Sub Process Description</th>
                                <th>Standard Time</th>
                                <th>Machine Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(sub, index) in subProcessFlow">
                                <td>{{index + 1}}</td>
                                <td>{{sub.SubPname}}</td>
                                <td>
                                    <input ref="subStandardTime" type="text" class="form-control" v-model="sub.standard_time">
                                </td>
                                <td>
                                    <input ref="subMachineTime" type="text" class="form-control" v-model="sub.machine_time">
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
                      <button ref="viewDeleteBtn" class="btn btn-outline-primary w-100 h-100">Delete</button>
                    </div>
                    <div class="col-md-1">
                        <button class="btn btn-outline-primary w-100 h-100">Close</button>
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
                <div class="col-md-6 border-end">
                    <h6 class="p-2"><em>Key Process Flow</em></h6>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Section</th>
                                <th>Key Process Description</th>
                                <th>Standard Time</th>
                                <th>Machine Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="key in sortedKey">
                                <td>{{ key.sequence_number }}</td>
                                <td>{{ viewSectionCode }}</td>
                                <td>
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
                <div class="col-md-6">
                    <h6 class="p-2"><em>Sub Process Flow</em></h6>
                    <table class="table table-responsive">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Sub Process Description</th>
                                <th>Standard Time</th>
                                <th>Machine Time</th>
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
                            </tr>
                        </tbody>
                    </table>
                </div>
              </div>
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
   
    DataTable.use(DataTablesCore);
    export default {
        props: ['keyProcessResponse'],
        components: {
            DataTable,
        },
        data() {
            return {

                requestFlowKeyURL: 'http://172.16.2.69/tpc/requestKeyProcessFlow.php',
                requestFlowSubURL: 'http://172.16.2.69/tpc/requestSubProcessFlow.php',
                requestKeyURL: 'http://172.16.2.69/tpc/requestKeyProcess.php',
                requestSubURL: 'http://172.16.2.69/tpc/requestSubProcess.php',
                SectionGetURL: 'http://172.16.2.69/TPC/GetSection.php',
                SubProcessGetURL: 'http://172.16.2.69/tpc/GetSubProcess.php',
                requestItemMasterURL: 'http://172.16.2.69/tpcrequesthandlers/requestItemMasterMain.php',
                fetchProcessFlowURL: 'http://172.16.2.69/tpcrequesthandlers/fetchProcessFlowMain.php',

                PostProcessFlowURL: 'http://172.16.2.69/tpc/PostProcessFlow.php',
                PostKeyProcessFlowURL: 'http://172.16.2.69/tpc/PostKeyProcessFlow.php',
                PostSubProcessFlowURL: 'http://172.16.2.69/tpc/PostSubProcessFlow.php',

                PutProcessFlowKeyURL: 'http://172.16.2.69/tpc/PutProcessFlowKey.php',
                PutProcessFlowSubURL: 'http://172.16.2.69/tpc/PutProcessFlowSub.php',
                PutProcessFlowStatusURL: 'http://172.16.2.69/tpc/PutProcessFlowMainStatus.php',
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

                // main data
                mainSection: '',
                mainSectionCode: '',
                mainFlowId: '',
                mainFlowType: '',
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
            submitProcessFlow(){
                let processFlowResponse = '';
                let processFlowSubResponse = '';
                let processFlowKeyResponse = '';
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
                        this.$refs.flow_type.disabled = true;
                        this.$refs.parts_number.disabled = true;
                        this.$refs.item_code.disabled = true;
                        this.$refs.section.disabled = true
                        this.$refs.addKeyBtn.disabled = true;
                        this.$refs.remarks.disabled = true;
                        this.$refs.saveBtn.disabled = true;
                        this.$refs.clearBtn.disabled = false;
                        for(const key of this.keyProcessFlow){
                            axios.post(this.PostKeyProcessFlowURL, {
                                main_flow_id: this.mainFlowId,
                                section_id: this.mainSection,
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
                                }
                            }).catch(error => {
                                console.log(error);
                            });
                        }
                        for(const sub of this.subProcessFlow){
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
                            }).then(response => {
                                if(response.data.message == 'Process Flow Sub inserted successfully'){
                                    processFlowSubResponse = 'Data Submitted';
                                    for(const subStdTime of this.$refs.subStandardTime){
                                        subStdTime.disabled = true;
                                    }
                                    for(const subMachTime of this.$refs.subMachineTime){
                                        subMachTime.disabled = true;
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
                
            },
            getFlowId(event){
                if(event.target.tagName == 'BUTTON'){
                    const row = event.target.parentNode.parentNode;
                    const cell = row.querySelector('td');
                    this.tempFlowId = parseInt(cell.textContent);
                    console.log(this.tempFlowId);
                }
                if(event.target.tagName == 'SPAN'){
                    const row = event.target.parentNode.parentNode.parentNode;
                    const cell = row.querySelector('td');
                    this.tempFlowId = parseInt(cell.textContent);
                    console.log(this.tempFlowId);
                }
                for(const flow of this.processFlow){
                    if(this.tempFlowId === flow.flow_main_id){
                        this.viewSection = flow.section_id;
                        this.viewSectionCode = flow.section_code; 
                        this.viewFlowId = flow.flow_main_id;
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
                                    }
                                }
                            }
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
                
            },
            getItemCode(parts_number){
                this.itemList = [];
                for(const item of this.itemMaster){
                    if(parts_number === item.item_parts_number){
                        this.itemList.push(item);
                    }
                }
            },
            getItemDescriptionAndRevNo(parts_number, item_code){
                for(const item of this.itemMaster){
                    if(parts_number === item.item_parts_number && item_code === item.item_code){
                        this.mainItemDescription = item.item_description;
                    }
                }
            },
            addKeyProcessFlow(){
                this.keyProcessFlow.push({
                    sequence_no: '',
                    section_id: this.mainSection,
                    section_code: this.mainSectionCode,
                    Pid: '',
                    standard_time: 0,
                    machine_time: 0,
                })
                this.addSequenceNumber();
                this.$refs.addKeyBtn.disabled = true;
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
                console.log(this.mainRevisionNumber);
                
            },
            fetchSubProcess(){
                this.subProcessFlow = [];
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
                        for(const sub of response.data){
                            this.subProcessFlow.push({
                                Pid: sub.Pid,
                                SubPid: sub.SubPid,
                                SubPname: sub.SubPname,
                                sequence_number: sub.sequence_number,
                                standard_time: 0,
                                machine_time: 0,
                                order: order,
                                sequence_no: '',
                            });
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
                            axios.put(this.PutProcessFlowSubURL, {
                                standard_time: sub.standard_time,
                                machine_time: sub.machine_time,
                                flow_sub_id: sub.flow_sub_id,
                                SubPid: sub.SubPid,
                            }).then(response => {
                                console.log(response.data);
                            }).catch(error => {
                                console.log(error);
                            });
                        }
                    }
                }).catch(error => {
                    console.log(error)
                });
                
            }
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

            await axios.get(this.SectionGetURL,{
            }).then(response => {
                this.section = response.data;
            }).catch(error => {
                console.log(error)
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
    