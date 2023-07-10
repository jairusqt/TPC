
<template>
    <div class="col-md-12 px-5">
        <h3 class="text-center">Tablet Process Card - Setup Process Flow</h3>
    </div>
    <div class="col-md-12">
        <div class="col-md-2 p-2 pb-3 ms-auto">
            <button type="button" class="btn btn-primary w-100" data-bs-toggle="modal" data-bs-target="#createProcessFlow">
                Create Process Flow
            </button>
        </div>
    </div>

    <div class="p-5">
        <DataTable
        :data="processFlow"
        :columns="columns"
        class="display table"
        @click="getFlowId"
    />
    </div>

    <div class="modal fade" id="createProcessFlow" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-fullscreen">
          <div class="modal-content">
            <div class="modal-header">
              <div class="col-md-12 row">
                  <div class="col-md-1">
                      <button class="btn btn-outline-primary w-100 h-100">Clear</button>
                  </div>
                  <div class="col-md-1">
                      <button class="btn btn-outline-primary w-100 h-100">Save</button>
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
                    <select id="flow_type" class="form-select" v-model="mainFlowType">
                        <option value="Manual">Manual</option>
                        <option value="Auto">Auto</option>
                    </select>
                </div>
                <div class="col-md-2 p-1">
                    <label for="parts_number">Parts Number</label>
                    <select @change="getItemCode(mainPartsNumber)" id="parts_number"  class="form-select" v-model="mainPartsNumber">
                        <option v-for="item in itemMaster" :value="item.item_parts_number">{{ item.item_parts_number }}</option>
                    </select>
                </div>
                <div class="col-md-2 p-1">
                    <label for="item_code">Item Code</label>
                    <select @change="getItemDescriptionAndRevNo(mainPartsNumber, mainItemCode)" id="item_code"  type="text" class="form-control" v-model="mainItemCode">
                        <option v-for="itemCode in itemList" :value="itemCode.item_code">{{itemCode.item_code}}</option>
                    </select>
                </div>
                <div class="col-md-3 p-1">
                    <label for="item_description">Item Description</label>
                    <input id="item_description"  type="text" class="form-control" v-model="mainItemDescription" disabled>
                </div>
                <div class="col-md-1 p-1">
                    <label for="encoded_by">Encoded By</label>
                    <input id="encoded_by" type="text" class="form-control" v-model="mainEncodedBy" disabled>
                </div>
                <div class="col-md-2 p-1">
                    <label for="date_encoded">Date Encoded</label>
                    <input id="date_encoded"  type="text" class="form-control" v-model="mainDateEncoded" disabled>
                </div>
                <div class="col-md-2 p-1">
                    <label for="section">Section</label>
                    <select @change="fetchKeyProcess" v-model="mainSection" class="form-select" id="section">
                        <option v-for="sec in section" :value="sec.section_id">{{sec.section_code}}</option>
                    </select>
                </div>
                <div class="col-md-2 p-1">
                    <label for="revision_number">Revision Number</label>
                    <input id="revision_number"  type="text" class="form-control" v-model="mainRevisionNumber" disabled>
                </div>
                <div class="col-md-2 p-1">
                    <label for="flow_status">Flow Status</label>
                    <input id="flow_status"  type="text" class="form-select" v-model="mainFlowStatus" disabled>
                </div>
                <div class="col-md-6 p-1">
                    <label for="remarks">Remarks</label>
                    <input id="remarks"  type="text" class="form-control" v-model="mainRemarks">
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
                                    <select @change="fetchSubProcess" class="form-select" v-model="key.Pid">
                                        <option v-for="key in keyProcess" :value="key.Pid">{{key.Pname}}</option>
                                    </select>
                                </td>
                                <td>
                                    <input type="text" class="form-control" v-model="key.standard_time">
                                </td>
                                <td>
                                    <input type="text" class="form-control" v-model="key.machine_time">
                                </td>
                                <td>
                                    <button @click="removeKey(index)" class="btn btn-sm btn-outline-danger w-100">
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
                                    <input type="text" class="form-control" v-model="sub.standard_time">
                                </td>
                                <td>
                                    <input type="text" class="form-control" v-model="sub.machine_time">
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
                        <button class="btn btn-outline-primary w-100 h-100">Edit</button>
                    </div>
                    <div class="col-md-1">
                        <button class="btn btn-outline-primary w-100 h-100">Save</button>
                    </div>
                    <div class="col-md-1">
                      <button class="btn btn-outline-primary w-100 h-100">Delete</button>
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
                    <input id="view_flow_status"  type="text" class="form-select" v-model="viewFlowStatus" disabled>
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
                                <th>Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="key in sortedKey">
                                <td>{{ key.sequence_number }}</td>
                                <td>{{ viewSectionCode }}</td>
                                <td>
                                    <select class="form-select" v-model="key.Pid">
                                        <option v-for="tempKey in tempKeyProcess" :value="tempKey.Pid">{{tempKey.Pname}}</option>
                                    </select>
                                </td>
                                <td>
                                    <input type="text" class="form-control" v-model="key.standard_time">
                                </td>
                                <td>
                                    <input type="text" class="form-control" v-model="key.machine_time">
                                </td>
                                <td>
                                    <button class="btn btn-outline-danger w-100">-</button>
                                </td>
                            </tr>
                        </tbody>
                        <tbody>

                        </tbody>
                        <tbody>
                            <tr>
                                <td colspan="6">
                                    <button class="btn w-100 btn-outline-primary" disabled>Add Row</button>
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
                            <tr v-for="sub in sortedSub">
                                <td>{{sub.sequence_number}}</td>
                                <td>{{sub.SubPname}}</td>
                                <td><input type="text" class="form-control" v-model="sub.standard_time"></td>
                                <td><input type="text" class="form-control" v-model="sub.machine_time"></td>
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
                //objects
                section: [],
                processFlow: [],
                itemMaster: [],
                keyProcess: [],
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
                        
                        axios.get('http://localhost/tpcrequesthandlers/requestFlowKey.php', {
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

                        axios.get('http://localhost/tpcrequesthandlers/requestFlowSub.php', {
                            method: 'GET',
                            headers: {
                                'Content-type': 'application/x-www-form-urlencoded'
                            },
                            params: {
                                flow_main_id: this.viewFlowId 
                            }
                        }).then(response => {
                            this.flowSub = response.data;
                            for(const sub of this.flowSub){
                                axios.get('http://localhost/tpcrequesthandlers/requestSubProcess.php',{
                                    method: 'GET',
                                    headers: {
                                        'Content-type': 'application/x-www-form-urlencoded'
                                    },
                                    params: {
                                        Pid: sub.Pid
                                    }
                                }).then(response => {
                                    for(const subProcess of response.data){
                                        if(subProcess.SubPid == sub.SubPid){
                                            Object.assign(sub, {SubPname: subProcess.SubPname});
                                        }
                                    }
                                }).catch(error => {
                                    console.log(error);
                                });
                            }
                        }).catch(error => {
                            console.log(error);
                        });


                        axios.get('http://localhost/tpcrequesthandlers/requestKeyProcess.php', {
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
                        console.log(item);
                        this.itemList.push(item);
                    }
                }
            },
            getItemDescriptionAndRevNo(parts_number, item_code){
                for(const item of this.itemMaster){
                    if(parts_number === item.item_parts_number && item_code === item.item_code){
                        this.mainItemDescription = item.item_description;
                        this.mainRevisionNumber = item.itemmaster_revision_no;
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
                        axios.get('http://localhost/tpcrequesthandlers/requestKeyProcess.php', {
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
            },
            fetchSubProcess(){
                this.subProcessFlow = [];
                for(const [order, key] of Object.entries(this.keyProcessFlow)){
                    axios.get('http://localhost/tpcrequesthandlers/requestSubProcess.php',{
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
                                Pid: sub.SubPid,
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
                    }).catch(error => {
                        console.log(error)
                    });
                }
                this.addSubSequenceNumber();
                this.$refs.addKeyBtn.disabled = false;
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
        created(){

            axios.get('http://localhost/tpcrequesthandlers/sectionView.php',{
            }).then(response => {
                this.section = response.data;
            }).catch(error => {
                console.log(error)
            });

            axios.get('http://localhost/tpcrequesthandlers/requestItemMasterMain.php', {
            }).then(response => {
                this.itemMaster = response.data;
            }).catch(error => {
                console.log(error)
            })

            axios.get('http://localhost/tpcrequesthandlers/fetchProcessFlowMain.php', {
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
    