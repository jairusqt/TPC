
<template>
    <div class="py-2">
        <h3>TPC - Setup Process Flow</h3>
    </div>
    <div class="col-md-12">
        <div class="col-md-2 p-2 pb-3 ms-auto">
            <button type="button" class="btn btn-primary w-100" data-bs-toggle="modal" data-bs-target="#createProcessFlow">
                Create Process Flow
            </button>
        </div>
    </div>
    <DataTable
        :data="processFlow"
        :columns="columns"
        class="display table"
        @click="getRowData"
    />

    <div class="modal fade" id="createProcessFlow" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-fullscreen">
        <div class="modal-content">
          <div class="modal-header">
            <p>PROCESS FLOW ASSIGNMENT</p>
            <div class="col-md-12 row">
                
                <div class="col-md-1">
                    <button @click="testApp" class="btn btn-primary w-100 h-100">Clear</button>
                </div>
                <div class="col-md-1">
                    <button ref="save" @click="readySetData" class="btn btn-primary w-100 h-100">Save</button>
                </div>
                <div class="col-md-1">
                    <button class="btn btn-primary w-100 h-100">Close</button>
                </div>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="col-md-12 row">
                <div class="col-md-1">
                    <label for="flow_number">Flow No.</label>
                    <input  type="text" v-model="mainFlowNo" class="form-control" disabled>
                </div>
                <div class="col-md-1">
                    <label for="flow_type">Flow Type: </label>
                    <select ref="flow_type" v-model="mainFlowType" class="form-select" name="" id="flow_type">
                        <option value="Manual">Manual</option>
                        <option value="Auto">Auto</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <label for="parts_number">Parts Number: </label>
                    <select ref="parts_number" @change="getItemCode(mainPartsNumber)" v-model="mainPartsNumber" class="form-select" name="" id="parts_number" >
                        <option v-for="item in itemMaster" :value="item.item_parts_number" >{{item.item_parts_number}}</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <label for="item_code">Item Code: </label>
                    <select ref="item_code" @change="getItemDescription(mainPartsNumber, mainItemCode)" class="form-select" name="" id="item_code" v-model="mainItemCode">
                        <option v-for="code in itemCode" :value="code.item_code">{{ code.item_code }}</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <label for="Item_description">Item Description:</label>
                    <input ref="item_description" v-model="mainItemDescription" type="text" class="form-control" id="item_description" disabled>
                </div>
                <div class="col-md-1">
                    <label for="encoded_by">Encoded By: </label>
                    <input ref="encoded_by" type="text" v-model="mainEncodedBy" class="form-control" id="encoded_by" disabled>
                </div>
                <div class="col-md-2">
                    <label for="date_encoded">Date Encoded: </label>
                    <input ref="date_encoded" type="text" v-model="mainDateEncoded" class="form-control" id="date_encoded" disabled>
                </div>

                <div class="col-md-2">
                    <label for="section">Section: </label>
                    <select ref="section" @change="getKeyProcess(selectedSection)" class="form-select" v-model="selectedSection" id="section">
                        <option v-for="sect of section" :value="sect.section_id">{{sect.section_code}}</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <label for="revision_number">Revision Number: </label>
                    <input ref="revision_number" type="text" v-model="mainRevisionNumber" class="form-control" disabled>
                </div>
                <div class="col-md-2">
                    <label for="flow_status">Process Flow Status: </label>
                    <select ref="flow_status" v-model="mainProcessFlowStatus" class="form-select" name="" id="flow_status">
                        <option value="Posted">Posted</option>
                        <option value="Unposted">Unposted</option>
                    </select>
                </div>
                <div class="col-md-6">
                    <label for="remarks">Remarks: </label>
                    <input ref="remarks" v-model="mainRemarks" type="text" class="form-control">
                </div>
            </div>
            <div class="col-md-12 row">
                <div class="col-md-6 p-3">
                    <h6>Key Process Selection</h6>
                    <table class="table table-responsive">
                        <thead>
                            <th>No.</th>
                            <th>Section Code</th>
                            <th>Key Process Description</th>
                            <th>Standard Time</th>
                            <th>Machine Time</th>
                            <th>Remove</th>
                        </thead>
                        <tbody v-if="selectedSectionCode == 'SWP'">
                            <tr v-for="(row, index) in rows" :key="index">
                                <td class="">{{index + 1}}</td>
                                <td>
                                    <select @change="SWPoptions" class="form-select" v-model="row.section_id" name="" id="">
                                        <option v-for="sec in section" :value="sec.section_id" v-show="sec.section_code === 'SWP' || sec.section_code === 'CCD'">{{sec.section_code}}</option>
                                    </select>
                                </td>
                                <!-- <td v-if="row.section_id === '674'">
                                    <select ref="keys" @change="getSubProcess(row.Pid, index)" v-model="row.Pid" class="form-select">
                                        <option v-for="(ccd, index) in tempCCDOptions" :value="ccd.Pid">{{ccd.Pname}}</option>
                                    </select>
                                </td> -->
                                <td>
                                    <select ref="keys" @change="getSubProcess(row.Pid, index)" v-model="row.Pid" class="form-select">
                                        <option v-for="(process, index) of keyProcess" :value="process.Pid" :key="index" >{{ process.Pname }}</option>
                                    </select>
                                </td>
                                <td>
                                    <input ref="key_std_time" type="text" v-model="row.keyStdTime" class="form-control">
                                </td>
                                <td>
                                    <input ref="key_mach_time" type="text" v-model="row.keyMachTime" class="form-control">
                                </td>
                                <td>
                                    <button @click="removeRow(index)" class="btn btn-outline-danger w-100">-</button>
                                </td>
                            </tr>
                        </tbody>

                        <tbody v-else>
                            <tr v-for="(row, index) in rows" :key="index">
                                <td>{{index + 1}}</td>
                                <td>
                                    {{ selectedSectionCode }}
                                </td>
                                <td>
                                    <select ref="keys" @change="getSubProcess(row.Pid, index)" v-model="row.Pid" class="form-select">
                                        <option v-for="(process, index) of keyProcess" :value="process.Pid" :key="index" >{{ process.Pname }}</option>
                                    </select>
                                </td>
                                <td>
                                    <input ref="key_std_time" type="text" v-model="row.keyStdTime" class="form-control">
                                </td>
                                <td>
                                    <input ref="key_mach_time" type="text" v-model="row.keyMachTime" class="form-control">
                                </td>
                                <td>
                                    <button @click="removeRow(index)" class="btn btn-outline-danger w-100">-</button>
                                </td>
                            </tr>
                        </tbody>
                        <tbody>
                            <tr>
                                <td colspan="6">
                                    <button ref="addRow" @click="addRow" class="btn btn-primary w-100" disabled>Add row</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="col-md-6 p-3">
                    <h6>Sub Process Sequence Form</h6>
                    <table class="table table-responsive">
                        <thead>
                            <tr>
                                <th>Sequence No.</th>
                                <th>Sub Process Description</th>
                                <th>Standard Time</th>
                                <th>Machine Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(sub, index) in subProcess" :key="index">
                                <td>{{ index + 1 }}</td>
                                <td>{{ sub.SubPname }}</td>
                                <td><input ref="sub_standard_time" v-model="sub.standardTime" type="text" class="form-control"></td>
                                <td><input ref="sub_machine_time" v-model="sub.machineTime" type="text" class="form-control"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="modal fade" id="viewFlow" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-fullscreen">
          <div class="modal-content">
            <div class="modal-header">
              <div class="col-md-12 row">
                    <div class="col-md-1">
                        <button class="btn btn-primary w-100 h-100">Edit</button>
                    </div>
                    <div class="col-md-1">
                        <button class="btn btn-primary w-100 h-100" disabled>Save</button>
                    </div>
                    <div class="col-md-1">
                        <button class="btn btn-primary w-100 h-100">Delete</button>
                    </div>
                    <div class="col-md-1">
                        <button class="btn btn-primary w-100 h-100">Close</button>
                    </div>
              </div>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="col-md-12 row">
                <div class="col-md-1">
                    <label for="view_flow_no">Process Flow No.</label>
                    <input id="view_flow_no" v-model="viewFlowNo" type="text" class="form-control" disabled>
                </div>
                <div class="col-md-1">
                    <label for="view_flow_type">Flow Type:</label>
                    <input id="view_flow_type" v-model="viewFlowType" type="text" class="form-control" disabled>
                </div>
                <div class="col-md-2">
                    <label for="view_parts_number">Parts Number:</label>
                    <input id="view_parts_number" v-model="viewPartsNumber" type="text" class="form-control" disabled>
                </div>
                <div class="col-md-2">
                    <label for="view_item_code">Item Code:</label>
                    <input id="view_item_code" v-model="viewItemCode" type="text" class="form-control" disabled>
                </div>
                <div class="col-md-3">
                    <label for="view_item_description">Item Description:</label>
                    <input id="view_item_description" v-model="viewItemDescription" type="text" class="form-control" disabled>
                </div>
                <div class="col-md-1">
                    <label for="view_encoded_by">Encoded By:</label>
                    <input id="view_encoded_by" v-model="viewEncodedBy" type="text" class="form-control" disabled>
                </div>
                <div class="col-md-2">
                    <label for="view_date_encoded">Date Encoded: </label>
                    <input id="view_date_encoded" v-model="viewDateEncoded" type="text" class="form-control" disabled>
                </div>
                <div class="col-md-2">
                    <label for="view_section">Section</label>
                    <input id="view_section" v-model="viewSection" type="text" class="form-control" disabled>
                </div>
                <div class="col-md-2">
                    <label for="view_revision_number">Revision Number</label>
                    <input id="view_revision_number" v-model="viewRevisionNo" type="text" class="form-control" disabled>
                </div>
                <div class="col-md-2">
                    <label for="view_flow_status">Process Flow Status</label>
                    <!-- <input id="view_flow_status" v-model="viewFlowStatus" type="text" class="form-control"> -->
                    <select name="" id="view_flow_status" v-model="viewFlowStatus" class="form-select">
                        <option value="Posted">Posted</option>
                        <option value="Unposted">Unposted</option>
                    </select>
                </div>
                <div class="col-md-6">
                    <label for="view_remarks">Remarks</label>
                    <input id="view_remarks" v-model="viewRemarks" type="text" class="form-control" disabled>
                </div>
              </div>
              <div class="col-md-12 row">
                  <div class="col-md-6 p-3">
                      <h6>Key Process Selection</h6>
                      <table class="table table-responsive">
                          <thead>
                              <th>No.</th>
                              <th>Section Code</th>
                              <th>Key Process Description</th>
                              <th>Standard Time</th>
                              <th>Machine Time</th>
                              <th>Remove</th>
                          </thead>
                          <tbody>
                              <tr v-for="(row, index) in rows" :key="index">
                                  <td>{{index + 1}}</td>
                                  <td v-if="selectedSectionCode == 'SWP'">
                                      <select name="" id="" class="form-control">
                                          <option></option>
                                      </select>
                                  </td>
                                  <td v-else>
                                      {{ selectedSectionCode }}
                                  </td>
                                  <td>
                                      <select ref="keys" @change="getSubProcess(row.Pid, index)" v-model="row.Pid" class="form-select">
                                          <option v-for="(process, index) of keyProcess" :value="process.Pid" :key="index" >{{ process.Pname }}</option>
                                      </select>
                                  </td>
                                  <td>
                                      <input ref="key_std_time" type="text" v-model="row.keyStdTime" class="form-control">
                                  </td>
                                  <td>
                                      <input ref="key_mach_time" type="text" v-model="row.keyMachTime" class="form-control">
                                  </td>
                                  <td>
                                      <button @click="removeRow(index)" class="btn btn-outline-danger w-100">-</button>
                                  </td>
                              </tr>
                          </tbody>
                          <tbody>
                              <tr>
                                  <td colspan="6">
                                      <button class="btn btn-primary w-100" disabled>Add row</button>
                                  </td>
                              </tr>
                          </tbody>
                      </table>
                  </div>
                  <div class="col-md-6 p-3">
                      <h6>Sub Process Sequence Form</h6>
                      <table class="table table-responsive">
                          <thead>
                              <tr>
                                  <th>Sequence No.</th>
                                  <th>Sub Process Description</th>
                                  <th>Standard Time</th>
                                  <th>Machine Time</th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr v-for="(sub, index) in subProcess" :key="index">
                                  <td>{{ index + 1 }}</td>
                                  <td>{{ sub.SubPname }}</td>
                                  <td><input ref="sub_standard_time" v-model="sub.standardTime" type="text" class="form-control"></td>
                                  <td><input ref="sub_machine_time" v-model="sub.machineTime" type="text" class="form-control"></td>
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
              sequence: 0, 
              countRow: 0,
              idCount: 0,
              test: '',
              keySequence: 1,
              subSequence: 1,
            
              mainFlowNo: '',
              selectedSection: '',
              mainFlowType: '',
              mainPartsNumber: '',
              mainItemCode: '',
              mainItemDescription: '',
              mainEncodedBy: '3141',
              mainDateEncoded: '',
              mainRevisionNumber: '',
              mainProcessFlowStatus: '',
              mainRemarks: '',

              tempFlowNo: '',
              tempSWPOptions: '',
              tempCCDOptions: [],

              viewFlowNo: '',
              viewFlowType: '',
              viewPartsNumber: '',
              viewItemCode: '',
              viewItemDescription: '',
              viewEncodedBy: '',
              viewDateEncoded: '',
              viewSection: '',
              viewRevisionNo: '',
              viewFlowStatus: '',
              viewRemarks: '',

              processFlow: [],
              section: [],
              itemMaster: [],
              itemCode: [],

              selectedSectionCode: '',
              keyProcess: [],
              selectedKeyProcess: [],
              subProcess: [],
              rows: [],
              stdTime: [],
              machTime: [],
              columns: [
                { title: 'No', data: 'flow_main_id'},
                { title: 'Flow Type', data: 'flow_type' },
                { title: 'Section', data: 'section_code' },
                { title: 'Parts Number', data: 'item_parts_number' },
                { title: 'Item Code', data: 'item_code' },
                { title: 'Item Description', data: 'item_description' },
                { title: 'Revision No', data: 'revision_number' },
                { title: 'Remarks', data: 'flow_remarks' },
                { title: 'Date Created', data: 'date_created' },
                { title: 'Created By', data: 'encoded_by' },
                { title: 'Status', data: 'flow_status' },
                { title: 'Open', data: null, 
                orderable: false, 
                render: function (data) { 
                                return '<button data-bs-toggle="modal" data-bs-target="#viewFlow" class="btn w-100"><span class="material-symbols-outlined">visibility</span></button'
                            } 
                        },
                  ]
                }
        },
       
        methods: {
            SWPoptions(section_id){
                console.log(this.rows)
            },
            getRowData(){
                if(event.target.tagName == 'BUTTON'){
                    const row = event.target.parentNode.parentNode;
                    const cell = row.querySelector('td');
                    this.tempFlowNo = cell.textContent;
                }
                if(event.target.tagName == 'SPAN'){
                    const row = event.target.parentNode.parentNode.parentNode;
                    const cell = row.querySelector('td');
                    this.tempFlowNo = cell.textContent;
                }
                for(const flow of this.processFlow){
                    console.log(flow);
                    if(flow.flow_main_id == this.tempFlowNo){
                        this.viewFlowNo = flow.flow_main_id;
                        this.viewFlowType = flow.flow_type;
                        this.viewPartsNumber = flow.item_parts_number;
                        this.viewItemCode = flow.item_code;
                        this.viewItemDescription = flow.item_description;
                        this.viewEncodedBy = flow.encoded_by;
                        this.viewDateEncoded = flow.date_created;
                        this.viewSection = flow.section_code;
                        this.viewRevisionNo = flow.revision_number;
                        this.viewFlowStatus = flow.flow_status;
                        this.viewRemarks = flow.flow_remaks;
                    }
                }
            },
            testApp(){

            },
            readySetData(){
                this.subSequence = 1;
                for(const sub of this.subProcess){
                    sub.sub_sequence = this.subSequence;
                    this.subSequence++;    
                }
                axios.post('http://localhost/tpcrequesthandlers/FlowPostRequestHandler.php', {
                    main_flow_id: this.mainFlowNo,
                    parts_number: this.mainPartsNumber,
                    item_code: this.mainItemCode,
                    item_description: this.mainItemDescription,
                    section_id: this.selectedSection,
                    revision_number: this.mainRevisionNumber,
                    flow_status: this.mainProcessFlowStatus,
                    remarks: this.mainRemarks,
                    encoded_by: this.mainEncodedBy,
                    date_encoded: this.mainDateEncoded,
                    flow_type: this.mainFlowType,
                }).then(response => {
                    if(response.data.message == 'Process Flow inserted successfully'){
                        this.$refs.flow_type.disabled = true;
                        this.$refs.parts_number.disabled = true;
                        this.$refs.item_code.disabled = true;
                        this.$refs.section.disabled = true;
                        this.$refs.flow_status.disabled = true;
                        this.$refs.remarks.disabled = true;
                        this.$refs.save.disabled = true;
                        this.$refs.addRow.disabled = true;
                        for(const row of this.rows){
                            axios.post('http://localhost/tpcrequesthandlers/KeyFlowPostRequestHandler.php', {
                                main_flow_id: this.mainFlowNo,
                                section_id: this.selectedSection,
                                parts_number: this.mainPartsNumber,
                                revision_number: this.mainRevisionNumber,
                                Pid: row.Pid,
                                sequence_number: row.key_sequence,
                                standard_time: row.keyStdTime,
                                machine_time: row.keyMachTime,
                                item_code: this.mainItemCode,                                
                            }).then(response => {
                                if(response.data.message === 'Process Flow Key inserted successfully'){
                                    for(const key of this.$refs.keys){
                                        key.disabled = true;
                                    }
                                    for(const key_std of this.$refs.key_std_time){
                                        key_std.disabled = true;
                                    }
                                    for(const key_mach of this.$refs.key_mach_time){
                                        key_mach.disabled = true;
                                    }
                                }
                            }).catch(error => {
                                console.log(error)
                            });
                        }

                        for(const sub of this.subProcess){
                            console.log(sub);
                            axios.post('http://localhost/tpcrequesthandlers/SubFlowPostRequestHandler.php', {
                                main_flow_id: this.mainFlowNo,
                                section_id: this.selectedSection,
                                parts_number: this.mainPartsNumber,
                                revision_number: this.mainRevisionNumber,
                                Pid: sub.Pid,
                                SubPid: sub.SubPid,
                                sequence_number: sub.sub_sequence,
                                standard_time: sub.standardTime,
                                machine_time: sub.machineTime,
                                item_code: this.mainItemCode,                                
                            }).then(response => {
                                if(response.data.message === 'Process Flow Sub inserted successfully'){
                                    for(const sub_std of this.$refs.sub_standard_time){
                                        sub_std.disabled = true;
                                    }
                                    for(const sub_mach of this.$refs.sub_machine_time){
                                        sub_mach.disabled = true;
                                    }
                                }
                            }).catch(error => {
                                console.log(error)
                            });
                        }
                    }
                }).catch(error => {
                    console.log(error);
                })
            },
            getItemCode(partsNumber){
                this.itemCode = [];
                this.mainItemDescription = '';
                this.mainRevisionNumber = ''
                for(const [key, item] of Object.entries(this.itemMaster)){
                    if(item.item_parts_number == partsNumber){
                        this.itemCode.push(item);
                    }  
                }
            },
            getItemDescription(partsNumber, itemCode){
                this.mainItemDescription = '';
                this.mainRevisionNumber = '';
                for(const [key, item] of Object.entries(this.itemMaster)){
                    if(item.item_parts_number == partsNumber){
                        if(item.item_code == itemCode){
                            this.mainItemDescription = item.item_description;
                            this.mainRevisionNumber = item.itemmaster_revision_no;
                        }
                    }
                }
            },
            addRow(){
                this.keySequence = 1;
                this.rows.push({
                    key_sequence: '',
                    section_id: this.selectedSection,
                    Pid: '',
                    Pname: '',
                    keyStdTime: '',
                    keyMachTime: '',
                });
                for(const row of this.rows){
                    row.key_sequence = this.keySequence;
                    this.keySequence++;
                }
            },
            removeRow(index){
                this.keySequence = 1;
                this.rows.splice(index, 1);
                this.getSubProcess();
                for(const row of this.rows){
                    row.key_sequence = this.keySequence;
                    this.keySequence++;
                }
            },
            getKeyProcess(section_id){
                this.$refs.addRow.disabled = false;
                this.keyProcess = [];
                this.rows = [];
                this.subProcess = [];

                for(const section of this.section){
                    if(section.section_id == section_id){
                        this.selectedSectionCode = section.section_code;
                    }
                }
                axios.get('http://localhost/tpcrequesthandlers/requestKeyProcess.php',{
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    },
                    params: {
                        section_id: section_id
                    }
                }).then(response => {
                    for(const key of response.data){
                        this.keyProcess = response.data;                   
                    }
                    this.keyProcess.sort((a,b) => a.sequence_number - b.sequence_number);
                }).catch(error => {
                    console.log(error)
                });
            },
            getSubProcess(){
                this.subProcess = [];
                for(const [order, row] of Object.entries(this.rows)){
                    axios.get('http://localhost/tpcrequesthandlers/requestSubProcess.php',{
                        method: 'GET',
                        headers: {
                            'Content-type': 'application/x-www-form-urlencoded'
                        },
                        params: {
                            Pid: row.Pid
                        }
                    }).then(response => {
                        for(const sub of response.data){
                            this.subProcess.push({
                                Pid: sub.Pid,
                                SubPid: sub.SubPid,
                                SubPname: sub.SubPname,
                                standardTime: '',
                                machineTime: '',
                                sequence_number: sub.sequence_number,
                                order: order,
                                sub_sequence: ''
                            })
                        }                  
                        this.subProcess.sort((a, b) => a.order - b.order);
                    }).catch(error => {
                        console.log(error)
                    });
                    
                    for(const key of this.keyProcess){
                        if(row.Pid == key.Pid){
                            row.Pname = key.Pname;
                        }
                    }
                }
            },
           

        },
        mounted(){
            
        },
        created() {
            this.mainDateEncoded = new Date().toJSON().slice(0, 10);
            
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
            
            axios.get('http://localhost/tpcrequesthandlers/requestKeyProcess.php',{
                method: 'GET',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                params: {
                    section_id: 674
                }
            }).then(response => {
                for(const key of response.data){
                    this.tempCCDOptions = response.data;                   
                }
            }).catch(error => {
                console.log(error)
            });

            axios.get('http://localhost/tpcrequesthandlers/fetchProcessFlowMain.php', {

            }).then(response => {
                for(const [key,flow] of Object.entries(response.data)){
                    for(const section of this.section){
                        if(flow.section_id == section.section_id){
                            this.processFlow.push({
                                flow_main_id: flow.flow_main_id,
                                flow_type: flow.flow_type,
                                section_code: section.section_code,
                                item_parts_number: flow.item_parts_number,
                                item_code: flow.item_code,
                                item_description: flow.item_description,
                                revision_number: flow.revision_number,
                                item_description: flow.item_description,
                                flow_remarks: flow.flow_remarks,
                                date_created: flow.date_encoded,
                                encoded_by: flow.encoded_by,
                                flow_status: flow.flow_status
                            });
                        }
                    }
                }
                
                const maxFlowMainId = this.processFlow.reduce((maxId, flow) => {
                    return flow.flow_main_id > maxId ? flow.flow_main_id : maxId;
                }, 0);
                this.mainFlowNo = maxFlowMainId + 1;
            }).catch(error => {
                console.log(error)
            })
            
        },
        updated(){

        }
    }
    </script>
    <style>
    @import 'bootstrap';
    @import 'datatables.net-bs5';
    </style>
    