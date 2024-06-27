
<template>
  <div class="col-md-12 row mx-auto py-3 container">
    <div class="col-md-6">
      <h3>Tablet Process Card - <em>Setup Sub Process</em></h3>
    </div>
    <div class="col-md-3">
      <button class="btn btn-outline-info w-100 float-end shadow" data-bs-toggle="modal" data-bs-target="#update"><span class=" align-bottom material-symbols-outlined">update</span>Update Sequence</button>
    </div>
    <div class="col-md-3 float-end">
      <button class="btn btn-outline-info w-100 float-end shadow" data-bs-toggle="modal" data-bs-target="#create"><span class=" align-bottom material-symbols-outlined">add</span>Create</button>
    </div>
  </div>
  <div class="container table-responsive shadow rounded p-3">
    <DataTable
      :data="subProcess"
      :columns="columns"
      class="display table-hover table shadow rounded p-3 table-light"
      @click="getData"
      :options="tableOptions"
    />
  </div>
  
  
  <div class="modal fade" id="create" tabindex="-1" aria-labelledby="createModal" aria-hidden="true">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="createModal">Create New Sub Process!</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <div class="col-md-12 row mx-auto p-1">
                <div class="col-md-12 row mx-auto">
                  <div class="col-md-4">
                      <label for="section">Section:</label>
                      <select ref="section" @change="FetchKeyOptions(section_id)" id="section" class="form-select" v-model="section_id">
                          <option v-for="sec in section" :value="sec.section_id">{{sec.section_code}}</option>
                      </select>
                  </div>
                  <div class="col-md-8">
                      <label for="key">Key Process:</label>
                      <select ref="keyProcess" @change="FetchSubOptions(Pid)" id="key" class="form-select" v-model="Pid">
                          <option v-for="key in keyProcessOptions" :value="key.Pid">{{key.Pname}}</option>
                      </select>
                  </div>
                </div>
                <div class="col-md-12 row align-items-end mx-auto">
                    <div class="col-md-4 p-2">
                      <label for="key_code"></label>
                      <input id="key_code" ref="sub_code" type="text" class="form-control" @input="toUpper" v-model="key_code" required disabled>
                    </div>
                    <div class="col-md-8 p-2">
                      <label for="sub_code">Sub Process Code:</label>
                      <input id="sub_code" ref="sub_code" type="text" class="form-control" @input="toUpper" v-model="sub_code" required>
                    </div>
                    <div class="col-md-9 p-2">
                      <label for="sub">Sub Process Description:</label>
                      <input id="sub" ref="SubPname" type="text" class="form-control" v-on:keyup.enter="addSubProcess" v-model="SubPname" required>
                    </div>
                    <div class="col-md-3 p-2">
                      <button ref="addSub" type="submit" @click="addSubProcess"  class="btn btn-outline-success w-100" >Add Sub Process</button>
                    </div>
                </div>
                <div class="col-md-12 p-2 row mx-auto">
                  <div class="col-md-4">
                    <label for="process_type">Process Type:</label>
                    <select ref="process_type" id="process_type" class="form-select" v-model="sub_process_type">
                        <option value="Production">Production</option>
                        <option value="Quality Control">Quality Control</option>
                    </select>
                  </div>
                  <div class="col-md-4">
                    <label for="process_status">Sub Process Status:</label>
                    <input id="process_status" type="text" class="form-select" v-model="sub_process_status" disabled>
                  </div>
                  <div class="col-md-4">
                    <label for="sequence_number">Sequence Number</label>
                    <input id="sequence_number" class="form-control" v-model="sequence_number" disabled>
                  </div>
                </div>
                
            </div>
            <div v-if="validateSubPname" class="alert alert-warning col-md-12 p-3">
              <p class="text-center">The input for this field "Sub Process" is mandatory.</p>
            </div>
            <hr>
            <div class="border p-3 rounded">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Sequence No.</th>
                    <th>Code</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Type</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="sub in SortSubProcessList" :key="sub.SubPid">
                      <td>{{sub.sequence_number}}</td>
                      <td>{{sub.sub_code}}</td>
                      <td>{{sub.SubPname}}</td>
                      <td>{{sub.sub_process_status}}</td>
                      <td>{{sub.process_type}}</td>
                      <td></td>
                  </tr>
                  <tr v-for="(newSub, index) in SortNewSubProcessList">
                      <td>{{newSub.sequence_number}}</td>
                      <td>{{newSub.sub_code}}</td>
                      <td>{{newSub.SubPname}}</td>
                      <td>{{newSub.sub_process_status}}</td>
                      <td>{{newSub.sub_process_type}}</td>
                      <td>
                        <button type="button" @click="removeSub(index)" class="btn btn-sm btn-outline-secondary w-100">Remove</button>
                      </td>
                  </tr>
                </tbody>
              </table>
            </div>
        </div>
        <div class="modal-footer">
          <button ref="submit" type="submit" @click="submitSubProcess" class="btn btn-outline-primary">Save changes</button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="update" tabindex="-1" aria-labelledby="updateModal" aria-hidden="true">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="updateModal">Update Sub Process Sequence!</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <div class="col-md-12 row mx-auto p-1">
                <div class="col-md-4">
                    <label for="u_section">Section:</label>
                    <select @change="FetchKeyOptions(section_id)" id="u_section" class="form-select" v-model="section_id">
                        <option v-for="sec in section" :value="sec.section_id">{{sec.section_code}}</option>
                    </select>
                </div>
                <div class="col-md-8">
                    <label for="u_key">Key Process:</label>
                    <select @change="FetchSubOrder(orderPid)" id="u_key" class="form-select" v-model="orderPid">
                        <option v-for="key in keyProcessOptions" :value="key.Pid">{{key.Pname}}</option>
                    </select>
                </div>
                
            </div>
            <div v-if="validateSubPname" class="alert alert-warning col-md-12 p-3">
              <p class="text-center">The input for this field "Sub Process" is mandatory.</p>
            </div>
            <hr class="p-1">
              <div class="col-md-12 p-2 row mx-auto">
                <div class="col-md-9">
                  <em>Sub Process Name</em>
                </div>
                <div class="col-md-3 text-center">
                  <em>Sequence Number</em>
                </div>
              </div>
              <div class="col-md-12 rounded">
                <draggable :list="subProcessOrder" 
                         item-key="name"
                         @change="onChange"
                         >
                  <template #item="{ element }" :class="">
                      <div class="col-md-12 row p-3 mx-auto bg-light bg-gradient shadow">
                          <div class="col-md-12 row">
                            <div class="col-md-9">
                              <em>{{ element.SubPname }}</em>
                            </div>
                            <div class="col-md-3 text-center">
                              <em>{{ element.sequence_number }}</em>
                            </div>
                          </div>
                      </div>
                  </template>
                </draggable>
              </div>
        </div>
        <div class="modal-footer">
          <button type="submit" @click="updateSubOrder" class="btn btn-outline-primary">Save changes</button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="editSubProcess" tabindex="-1" aria-labelledby="editSubProcess" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="editSubProcess">Edit Sub Process Details</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="col-md-12 mx-auto row">
            <div class="col-md-10">

            </div>
            <div class="col-md-2">
              <div class="form-check pt-4">
                <label class="form-check-label" for="fetching" >
                  Fetching
                </label>
                <input class="form-check-input" type="checkbox" @change="checkFetchingValue" id="fetching" :checked="e_fetching === '1' ? true : false">
              </div>
            </div>
            <div class="col-md-4 p-2">
              <label for="e_section">Section Code: </label>
              <select class="form-select" v-model="e_section_id" id="e_section" disabled>
                <option v-for="sec in section" :key="sec.section_id" :value="sec.section_id">{{sec.section_code}}</option>
              </select>
            </div>
            <div class="col-md-8 p-2">
              <label for="e_key_process">Key Process Description:</label>
              <select class="form-select" v-model="e_Pid" id="e_key_process" disabled>
                <option v-for="key in keyProcess" :key="key.Pid" :value="key.Pid">{{key.Pname}}</option>
              </select>
            </div>
            <div class="col-md-12 p-2">
              <label for="e_sub_code">Sub Process Code:</label>
              <input id="e_sub_code" v-model="e_sub_code" class="form-control" type="text" disabled>
            </div>
            <div class="col-md-12 p-2">
              <label for="e_SubPname">Sub Process Description:</label>
              <input id="e_SubPname" v-model="e_SubPname" class="form-control" type="text">
            </div>
            <div class="col-md-6 p-2">
              <label for="e_process_type">Process Type: </label>
              <select v-model="e_process_type" class="form-control" id="e_process_type">
                <option value="Production">Production</option>
                <option value="Quality Control">Quality Control</option>
              </select>
            </div>
            <div class="col-md-3 p-2">
              <label for="e_status">Sub Process Status: </label>
              <select v-model="e_status" class="form-control" id="e_status">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div class="col-md-3 p-2">
              <label for="e_sequence_number">Sequence No.</label>
              <input id="e_sequence_number" v-model="e_sequence_number" class="form-control" type="text" disabled>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" @click="updateSubProcess">Save changes</button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade" id="deleteSubProcess" tabindex="-1" aria-labelledby="editSubProcess" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="editSubProcess">Delete Sub Process</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="text-center">
            <p >YOU ARE GOING TO DELETE THIS SECTION: "{{e_SubPname}}"</p>
            <h5 class="text-danger pb-3">Do you wish to proceed?</h5>
            <p class="border rounded text-start p-3"><small>This is a system warning indicating that the data you're attempting to delete might be in use by another table. Deleting it may potentially disrupt the entire process. Please proceed with caution and ensure the implications are understood before confirming the deletion.</small></p>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-primary" @click="deleteSubProcess">Delete</button>
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
import axios from 'axios';
import draggable from 'vuedraggable';
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net-bs5';
import 'datatables.net-responsive';
import 'datatables.net-select';
DataTable.use(DataTablesCore);
import * as bootstrap from 'bootstrap'
export default {
components: {
  DataTable,
  draggable,
},
data() {
  return {
    SubProcessGetURL: 'http://172.16.2.13/tpc-endpoint/GetSubProcess.php',
    SubProcessPostURL: 'http://172.16.2.13/tpc-endpoint/PostSubProcess.php',
    KeyProcessGetURL: 'http://172.16.2.13/tpc-endpoint/GetKeyProcess.php',
    SectionGetURL: 'http://172.16.2.13/tpc-endpoint/GetSection.php',
    KeyProcessOptionsGetURL: 'http://172.16.2.13/tpc-endpoint/GetKeyProcessOptions.php',
    SubProcessOptionsGetURL: 'http://172.16.2.13/tpc-endpoint/GetSubProcessOptions.php',
    SubProcessOrderPutURL: 'http://172.16.2.13/tpc-endpoint/PutSubProcessOrder.php',
    SubProcessPutURL: 'http://172.16.2.13/tpc-endpoint/PutSubProcess.php',
    SubProcessFetchingPutURL: 'http://172.16.2.13/tpc-endpoint/PutSubProcessFetching.php',
    DeleteSubURL: 'http://172.16.2.13/tpc-endpoint/DeleteSubProcess.php',

    fetchSubProcessFlowURL: 'http://172.16.2.13/tpc-endpoint/fetchSubProcessFlow.php',
    requestConditionURL: 'http://172.16.2.13/tpc-endpoint/requestItemCondition.php',

    // SubProcessGetURL: 'http://172.16.2.13/tpc-endpointDev/GetSubProcess.php',
    // SubProcessPostURL: 'http://172.16.2.13/tpc-endpointDev/PostSubProcess.php',
    // KeyProcessGetURL: 'http://172.16.2.13/tpc-endpointDev/GetKeyProcess.php',
    // SectionGetURL: 'http://172.16.2.13/tpc-endpointDev/GetSection.php',
    // KeyProcessOptionsGetURL: 'http://172.16.2.13/tpc-endpointDev/GetKeyProcessOptions.php',
    // SubProcessOptionsGetURL: 'http://172.16.2.13/tpc-endpointDev/GetSubProcessOptions.php',
    // SubProcessOrderPutURL: 'http://172.16.2.13/tpc-endpointDev/PutSubProcessOrder.php',
    // SubProcessPutURL: 'http://172.16.2.13/tpc-endpointDev/PutSubProcess.php',
    // SubProcessFetchingPutURL: 'http://172.16.2.13/tpc-endpointDev/PutSubProcessFetching.php',
    // DeleteSubURL: 'http://172.16.2.13/tpc-endpointDev/DeleteSubProcess.php',

    // fetchSubProcessFlowURL: 'http://172.16.2.13/tpc-endpointDev/fetchSubProcessFlow.php',
    // requestConditionURL: 'http://172.16.2.13/tpc-endpointDev/requestItemCondition.php',

    section_id: null,
    Pid: null,
    OrderPid: null,
    key_code: '',
    sub_code: '',
    SubPname: '',
    sub_process_type: 'Production',
    sub_process_status: 'Active',
    sequence_number: null,

    validateSubPname: false,
    tempSub: '',

    section: [],
    keyProcess: [],
    subProcess: [],

    alert: '',

    e_SubPid: '',
    e_section_id: '',
    e_Pid: '',
    e_sub_code: '',
    e_SubPname: '',
    e_sequence_number: '',
    e_process_type: '',
    e_status: '',
    e_fetching: '',

    keyProcessOptions: [],
    subProcessList:[],

    subProcessNewList: [],

    subProcessOrder: [],

    tableOptions: { order: [[0, 'desc']]},

    columns: [
      { title: 'Section Code', data: 'section_code' },
      { title: 'Key Process Description', data: 'Pname' },
      { title: 'Sub Process Description', data: 'SubPname' },
      { title: 'Sub Process Code', data: 'sub_code' },
      { title: 'Process Type', data: 'process_type', 
            render: function (data) { 
              return `${data === 'Production' ? '<span class="badge rounded-pill text-bg-success">Production</span>' : '<span class="badge rounded-pill text-bg-primary">Quality Control</span>'}`
        }   },
      { title: 'Sequence Number', data: 'sequence_number' },
      { title: 'Fetching', data: 'fetching', 
          render: function (data) { 
            return `${data === '1' ? '<span class="badge rounded-pill text-bg-success">True</span>' : '<span class="badge rounded-pill text-bg-secondary">False</span>'}`
          } 
      },
      { title: 'Status', data: 'sub_process_status', 
        render: function (data) { 
            return `${data === 'Active' ? '<span class="badge rounded-pill text-bg-success">Active</span>' : '<span class="badge rounded-pill text-bg-secondary">Inactive</span>'}`
        } 
      },
      { title: 'Date Created', data: 'date_created' },
      { title: 'Open', data: null, orderable: false, 
        render: function (data) { 
            return '<button data-bs-toggle="modal" data-bs-target="#editSubProcess" class="btn w-100"><span class="material-symbols-outlined">open_in_new</span></button'
        } 
      },
      { title: 'Delete', data: null, orderable: false, 
        render: function (data) { 
            return '<button data-bs-toggle="modal" data-bs-target="#deleteSubProcess" class="btn w-100"><span class="material-symbols-outlined">delete</span></button'
        } 
      },
      // Add more columns as needed
    ],
    items: [],

  }
},
computed: {
  SortSubProcessList(){
    return this.subProcessList.sort((a, b) => a.sequence_number - b.sequence_number);
  },
  SortNewSubProcessList(){
    return this.subProcessNewList.sort((a, b) => a.sequence_number - b.sequence_number);
  }
},
methods: {
  checkFetchingValue(){
    const toastLiveExample = document.getElementById('liveToast');
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
    let checkVal = document.getElementById('fetching').checked;
    this.e_fetching = checkVal === true ? 1 : 0;
    axios.put(this.SubProcessFetchingPutURL, {
      fetching: this.e_fetching,
      SubPid: this.e_SubPid,
    }).then(response => {
      if(response.data.message === 'Sub Process Fetching updated successfully'){
        this.alert = 'Your data has been successfully submitted! Thank you for providing the required information. Please reload the page';
        toastBootstrap.show();
        for(const sub of this.subProcess){
          if(this.e_SubPid === sub.SubPid){
            sub.fetching = this.e_fetching;
          }
        }
      }
    }).catch(error => {
      console.log(error);
    });
  },
  toUpper(){
    this.sub_code = this.sub_code.toUpperCase();
  },
  getData(event){
    if(event.target.tagName == 'BUTTON'){
        const row = event.target.parentNode.parentNode;
        const cell = row.querySelectorAll('td');
        this.tempSub = cell[2].textContent;
    }
    if(event.target.tagName == 'SPAN'){
        const row = event.target.parentNode.parentNode.parentNode;
        const cell = row.querySelectorAll('td');
        this.tempSub = cell[2].textContent;
    }
    for(const sub of this.subProcess){
      if(this.tempSub == sub.SubPname){
        this.e_section_id = sub.section_id;
        this.e_Pid = sub.Pid;
        this.e_SubPid = sub.SubPid;
        this.e_sub_code = sub.sub_code;
        this.e_SubPname = sub.SubPname;
        this.e_sequence_number = sub.sequence_number;
        this.e_process_type = sub.process_type;
        this.e_status = sub.sub_process_status;
        this.e_fetching = sub.fetching;
      }
    }
  },
  updateSubProcess(){
    const toastLiveExample = document.getElementById('liveToast');
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
    let isDuplicate = false;
    let isNull = false;
    axios.get(this.fetchSubProcessFlowURL, {
        method: 'GET',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        params: {
            SubPid: this.e_SubPid
        }
    }).then(response => {
        let exists = response.data.length > 0 ? true : false;
        if(exists){
          toastBootstrap.show();
          this.alert = 'This sub process is currently in use within Process Flow, and editing is prohibited';
        } else {
          const formattedESubPname = this.e_SubPname.replace(/\s+/g, '').toUpperCase();
          if(formattedESubPname === ''){
            isNull = true;
            toastBootstrap.show();
            this.alert = 'System Alert: Detection of an Unassigned Sub Process Description. Please conduct a thorough review';
          } else {
            isNull = false;
          }
        
          if(isNull){
          
          } else {
            axios.put(this.SubProcessPutURL, {
              SubPname: this.e_SubPname,
              process_type: this.e_process_type,
              sub_process_status: this.e_status,
              SubPid: this.e_SubPid,
            }).then(response => {
              if(response.data.message === 'Sub Process updated successfully'){
                this.alert = 'Your data has been successfully submitted! Thank you for providing the required information.';
                toastBootstrap.show();
                for(const sub of this.subProcess){
                  if(this.e_SubPid === sub.SubPid){
                    sub.SubPname = this.e_SubPname;
                    sub.process_type = this.e_process_type;
                    sub.sub_process_status = this.e_status;
                  }
                }
              }
            }).catch(error => {
              console.log(error);
            });
          }
        }

    }).catch(error => {
        console.log(error);
    });
  
    
  },
  onChange(event) {
      this.reorder()
  },
  reorder() {
      this.subProcessOrder.forEach((sub, index) => (sub.sequence_number = index + 1))
  },
  submitSubProcess(){
    const toastLiveExample = document.getElementById('liveToast');
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
    let isDuplicate = false;
    for(const newSub of this.subProcessNewList){
      const formattedNewSub = newSub.SubPname.replace(/\s+/g, '').toUpperCase();
      const formattedNewSubCode = newSub.sub_code.replace(/\s+/g, '').toUpperCase();
      for(const sub of this.subProcessList){
        const formattedSubCode = sub.sub_code.replace(/\s+/g, '').toUpperCase();
        if(parseInt(this.Pid) === parseInt(sub.Pid)){
          const formattedSub = sub.SubPname.replace(/\s+/g, '').toUpperCase();
          if(formattedNewSub === formattedSub){
            isDuplicate = true;
            toastBootstrap.show();
            this.alert = 'System Warning: Sub Process Descriptiion Duplicate Entry Detected. Please perform a comprehensive verification';
            break;
          } else {
            isDuplicate = false;
          }
        }
        if(formattedNewSubCode === formattedSubCode){
          isDuplicate = true;
            toastBootstrap.show();
            this.alert = 'System Warning: Sub Process Code Duplicate Entry Detected. Please perform a comprehensive verification';
            break;
        } else {
          isDuplicate = false;
        }
      }
    }
    if(isDuplicate){
      
    } else {
      for(const sub of this.subProcessNewList){
        axios.post(this.SubProcessPostURL, {
          section_id: sub.section_id,
          Pid: sub.Pid,
          sub_code: sub.sub_code,
          SubPname: sub.SubPname,
          sub_process_type: sub.sub_process_type,
          sub_process_status: sub.sub_process_status,
          sequence_number: sub.sequence_number
        }).then(response => {
          if(response.data.message === 'Sub Process inserted successfully'){
            let section_code = '';
            let Pname = '';
            this.subProcessList.push({
              section_id: sub.section_id,
              Pid: sub.Pid,
              sub_code: sub.sub_code,
              SubPname: sub.SubPname,
              sub_process_type: sub.sub_process_type,
              sub_process_status: sub.sub_process_status,
              sequence_number: sub.sequence_number
            });
            for(const sec of this.section){
              if(sub.section_id === sec.section_id){
                section_code = sec.section_code;
              }
            }
            for(const key of this.keyProcess){
              if(parseInt(sub.Pid ) === parseInt(key.Pid)){
                Pname = key.Pname;
              }
            }
            this.subProcess.push({
              section_id: sub.section_id,
              Pid: sub.Pid,
              sub_code: sub.sub_code,
              section_code: section_code,
              Pname: Pname,
              SubPname: sub.SubPname,
              process_type: sub.sub_process_type,
              sub_process_status: sub.sub_process_status,
              sequence_number: sub.sequence_number,
              date_created: new Date().toJSON().slice(0,10)
            })
            this.subProcessNewList = [];
            this.alert = 'This Sub Process ' + sub.SubPname + ' Is saved successfully';
            toastBootstrap.show()
            this.subProcessList = [];
            this.subProcessNewList = [];
            // this.section_id = null;
            this.Pid = null;
            this.SubPname = null;
            this.sub_code = null;
          }
        }).catch(error => {
          console.log(error);
        });
      }
    }
  },
  removeSub(index){
    this.subProcessNewList.splice(index, 1);
    const maxSequenceNo = this.subProcessList.reduce((maxId, sub) => {
          return sub.sequence_number > maxId ? sub.sequence_number : maxId;
    }, 0);
    this.sequence_number = maxSequenceNo + 1;
  },
  updateSubOrder(){
    const toastLiveExample = document.getElementById('liveToast');
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
    for(const sub of this.subProcessOrder){
        axios.put(this.SubProcessOrderPutURL, {
          SubPid: sub.SubPid,
          sequence_number: sub.sequence_number,
        }).then(response => {
          if(response.data.message === 'Sub Process Order updated successfully'){
            for(const s of this.subProcess){
              if(parseInt(s.SubPid) === parseInt(sub.SubPid)){
                s.sequence_number = sub.sequence_number;
                this.alert = 'The Sub Process Order has been update successfully';
                toastBootstrap.show();
              }
            }
          }
        }).catch(error => {
          console.log(error);
        });
    }
  },
  addSubProcess(){
    const toastLiveExample = document.getElementById('liveToast');
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
    let dupCode = false;
    let dupDesc = false;
    let dupOutCode = false;
    let dupOutDesc = false;
    let nullCode = false;
    let nullDesc = false;
    this.sub_code = this.key_code+'-'+this.sub_code;
    for(const sub of this.subProcessList){
      if(this.SubPname.toUpperCase() === sub.SubPname.toUpperCase()){
        dupDesc = true;
        this.alert = 'Warning: The sub-process description you are attempting to add already exists in the list under the key process. Please provide a unique description. Refer to the list below for existing descriptions.';
        toastBootstrap.show();
        break;
      } else {
        dupDesc = false;
      }
    }
    for(const sub of this.subProcessNewList){
      if(this.SubPname.toUpperCase() === sub.SubPname.toUpperCase()){
        dupOutDesc = true;
        this.alert = 'Warning: The sub-process description you are attempting to add already exists in the list under the key process. Please provide a unique description. Refer to the list below for existing descriptions.';
        toastBootstrap.show();
        break;
      } else {
         dupOutDesc = false;
      }
    }
    for(const sub of this.subProcess){
      if(this.sub_code === sub.sub_code){
        dupCode = true;
        this.sub_code = '';
        this.alert = 'Warning: The sub-process code you are attempting to add already existed. Please provide a unique code.';
        toastBootstrap.show();
        break;
      } else {
        dupCode = false;
      }
    }
    for(const sub of this.subProcessNewList){
      if(this.sub_code === sub.sub_code){
        dupOutCode = true;
        this.alert = 'Warning: The sub-process code you are attempting to add already existed. Please provide a unique code.';
        toastBootstrap.show();
        break;
      } else {
        dupOutCode = false;
      }
    }
    if(this.SubPname == '' || this.SubPname == null){
      nullDesc = true;
      this.alert = 'Warning: The sub-process description field is mandatory. Please provide a unique description.';
      toastBootstrap.show();
    } else {
      nullDesc = false;
    }
    if(this.sub_code == '' || this.sub_code == null){
      nullCode = true;
      this.alert = 'Warning: The sub-process code field is mandatory. Please provide a unique description.';
      toastBootstrap.show();
    } else {
      nullCode = false;
    }

    if(!(nullDesc || nullCode || dupDesc || dupCode || dupOutCode || dupOutDesc)){
      this.subProcessNewList.push({
        section_id: this.section_id,
        Pid: this.Pid,
        sub_code: this.sub_code,
        sequence_number: this.sequence_number,
        SubPname: this.SubPname,
        sub_process_status: this.sub_process_status,
        sub_process_type: this.sub_process_type,
      });
      this.SubPname = '';
      this.sub_code = '';
      this.$refs.sub_code.focus();
      this.sequence_number++;
    } 
      
  },
  FetchKeyOptions(section_id){
    this.subProcessOrder = [];
    this.subProcessList = [];
    this.keyProcessOptions = [];
    this.subProcessNewList = [];
    axios.get(this.KeyProcessOptionsGetURL, {
      method: 'GET',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        params: {
            section_id: section_id
        }
    }).then(response => {
      this.keyProcessOptions = response.data.filter((key) => key.key_process_status === 'Active');
    }).catch(error => {
      console.log(error);
    });
  },
  FetchSubOptions(Pid){
    for(const key of this.keyProcess){
      if(parseInt(Pid) === parseInt(key.Pid)){
        this.key_code = key.key_code;
      }
    }
    this.subProcessList = [];
    this.subProcessNewList = [];
    axios.get(this.SubProcessOptionsGetURL, {
      method: 'GET',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        params: {
            Pid: Pid
        }
    }).then(response => {
      this.subProcessList = response.data;

      const maxSequenceNo = this.subProcessList.reduce((maxId, sub) => {
          return sub.sequence_number > maxId ? sub.sequence_number : maxId;
      }, 0);
      
      this.sequence_number = maxSequenceNo + 1;
    }).catch(error => {
      console.log(error);
    });
  },
  FetchSubOrder(Pid){
    axios.get(this.SubProcessOptionsGetURL, {
      method: 'GET',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        params: {
            Pid: Pid
        }
    }).then(response => {
      this.subProcessOrder = response.data;
      this.subProcessOrder.sort((a, b) => a.sequence_number - b.sequence_number); 
    }).catch(error => {
      console.log(error);
    });
  },
  deleteSubProcess(){
    const toastLiveExample = document.getElementById('liveToast');
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);

    axios.get(this.requestConditionURL, {
        method: 'GET',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        params: {
            SubPid: this.e_SubPid
        }
    }).then(response => {
      let exists = response.data.length > 0 ? true : false;
      if(exists){
        toastBootstrap.show();
        this.alert = 'This sub process is currently in use within other masterfiles, and editing is prohibited';
      } else {
          axios.post(this.DeleteSubURL, {
              SubPid: this.e_SubPid
          }).then(response => {
            if(response.data.message === 'Sub Process deleted successfully'){
              let idToRemove = this.subProcess.findIndex(sub => sub.SubPid === this.e_SubPid);
              this.subProcess.splice(idToRemove, 1);
              this.alert = 'This Sub Process ' + this.e_SubPname + ' has been removed successfully';
              toastBootstrap.show();
            }
          }).catch(error => {
            console.log(error);
          });
      }
    }).catch(error => {
      console.log(error);
    })

    
  },

},

async created() {
  await axios.get(this.SectionGetURL, {
    }).then(response => {
      this.section = response.data.filter((sec)=> sec.section_status === 'Active');
    }).catch(error => {
      console.log(error)
    });
    
    await axios.get(this.KeyProcessGetURL, {
    }).then(response => {
      this.keyProcess = response.data.filter((key)=> key.key_process_status === 'Active');
    }).catch(error => {
      console.log(error)
    });

    await axios.get(this.SubProcessGetURL, {
    }).then(response => {
      for(const sub of response.data){
        console.log(sub);
        for(const sec of this.section){
          if(sec.section_id == sub.section_id){
            Object.assign(sub, {section_code: sec.section_code});
            for(const key of this.keyProcess){
              if(key.Pid == sub.Pid){
                Object.assign(sub, {Pname: key.Pname});
                this.subProcess.push(sub);
              }
            }
          }
        }
      }
    }).catch(error => {
      console.log(error)
    });
    
    
    
}
}
</script>
<style>
@import 'bootstrap';
@import 'datatables.net-bs5';
</style>
