
<template>
  <div class="col-md-12 row mx-auto py-3 container">
    <div class="col-md-6">
      <h3>TPC - Setup Sub Process</h3>
    </div>
    <div class="col-md-3">
      <button class="btn btn-outline-primary w-100 float-end" data-bs-toggle="modal" data-bs-target="#update"><span class=" align-bottom material-symbols-outlined">update</span>Update Sequence</button>
    </div>
    <div class="col-md-3 float-end">
      <button class="btn btn-outline-primary w-100 float-end" data-bs-toggle="modal" data-bs-target="#create"><span class=" align-bottom material-symbols-outlined">add</span>Create</button>
    </div>
  </div>
  <div class="border rounded p-3 container">
    <DataTable
      :data="subProcess"
      :columns="columns"
      class="display table"
      @click="getData"
    />
  </div>
  
  
  <div class="modal fade" id="create" tabindex="-1" aria-labelledby="createModal" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="createModal">Create New Key Process!</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <div class="col-md-12 row mx-auto p-1">
                <div class="col-md-4">
                    <label for="section">Section:</label>
                    <select @change="FetchKeyOptions(section_id)" id="section" class="form-select" v-model="section_id">
                        <option v-for="sec in section" :value="sec.section_id">{{sec.section_code}}</option>
                    </select>
                </div>
                <div class="col-md-8">
                    <label for="key">Key Process:</label>
                    <select @change="FetchSubOptions(Pid)" id="key" class="form-select" v-model="Pid">
                        <option v-for="key in keyProcessOptions" :value="key.Pid">{{key.Pname}}</option>
                    </select>
                </div>
                <div class="col-md-12">
                    <label for="sub">Sub Process:</label>
                    <input type="text" class="form-control" v-model="SubPname" required>
                </div>
                <div class="col-md-4">
                  <label for="process_type">Process Type:</label>
                  <select id="process_type" class="form-select" v-model="sub_process_type">
                      <option value="Production">Production</option>
                      <option value="Quality Control">Quality Control</option>
                  </select>
                </div>
                <div class="col-md-4">
                  <label for="process_status">Sub Process Status:</label>
                  <input type="text" class="form-select" v-model="sub_process_status" disabled>
                </div>
                <div class="col-md-4">
                  <label for="sequence_number">Sequence Number</label>
                  <input id="sequence_number" class="form-control" v-model="sequence_number" disabled>
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
                    <th>Sequence Number.</th>
                    <th>Sub Process Description</th>
                    <th>Sub Process Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="sub in SortSubProcessList" :key="sub.SubPid">
                      <td>{{sub.sequence_number}}</td>
                      <td>{{sub.SubPname}}</td>
                      <td>{{sub.sub_process_status}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
        </div>
        <div class="modal-footer">
          <button ref="addSub" type="submit" @click="addSubProcess" class="btn btn-success" >Add Sub Process</button>
          <button ref="submit" type="submit" @click="submitSubProcess" class="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="update" tabindex="-1" aria-labelledby="updateModal" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="updateModal">Create New Key Process!</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <div class="col-md-12 row mx-auto p-1">
                <div class="col-md-4">
                    <label for="section">Section:</label>
                    <select @change="FetchKeyOptions(section_id)" id="section" class="form-select" v-model="section_id">
                        <option v-for="sec in section" :value="sec.section_id">{{sec.section_code}}</option>
                    </select>
                </div>
                <div class="col-md-8">
                    <label for="key">Key Process:</label>
                    <select @change="FetchSubOrder(orderPid)" id="key" class="form-select" v-model="orderPid">
                        <option v-for="key in keyProcessOptions" :value="key.Pid">{{key.Pname}}</option>
                    </select>
                </div>
                
            </div>
            <div v-if="validateSubPname" class="alert alert-warning col-md-12 p-3">
              <p class="text-center">The input for this field "Sub Process" is mandatory.</p>
            </div>
            <hr>
              <div class="col-md-12 row">
                <div class="col-md-6">
                  <h6 class="text-center">Sub-Process Name</h6>
                </div>
                <div class="col-md-6">
                  <h6 class="text-center">Sequence Number</h6>
                </div>
              </div>
              <div class="col-md-12 border-rounded px-3">
                <draggable :list="subProcessOrder" 
                         item-key="name"
                         @change="onChange">
                  <template #item="{ element }">
                      <div class="col-md-12 row p-1 border-top rounded">
                          <div class="col-md-6">
                            {{ element.SubPname }}
                          </div>
                          <div class="col-md-6 text-center">
                            {{ element.sequence_number }}
                          </div>
                      </div>
                  </template>
              </draggable>
              </div>
        </div>
        <div class="modal-footer">
          <button ref="submit" type="submit" @click="updateSubOrder" class="btn btn-primary">Save changes</button>
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
              <label for="e_SubPname">Sub Process Description:</label>
              <input v-model="e_SubPname" class="form-control" type="text">
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
              <input v-model="e_sequence_number" class="form-control" type="text" disabled>
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
  draggable
},
data() {
  return {
    SubProcessGetURL: 'http://172.16.2.69/TPC/GetSubProcess.php',
    SubProcessPostURL: 'http://172.16.2.69/TPC/PostSubProcess.php',
    KeyProcessGetURL: 'http://172.16.2.69/TPC/GetKeyProcess.php',
    SectionGetURL: 'http://172.16.2.69/TPC/GetSection.php',
    KeyProcessOptionsGetURL: 'http://172.16.2.69/TPC/GetKeyProcessOptions.php',
    SubProcessOptionsGetURL: 'http://172.16.2.69/TPC/GetSubProcessOptions.php',
    SubProcessOrderPutURL: 'http://172.16.2.69/TPC/PutSubProcessOrder.php',
    SubProcessPutURL: 'http://172.16.2.69/TPC/PutSubProcess.php',

    section_id: null,
    Pid: null,
    OrderPid: null,
    SubPname: '',
    sub_process_type: 'Production',
    sub_process_status: 'Active',
    sequence_number: null,

    validateSubPname: false,
    tempSubPid: '',

    section: [],
    keyProcess: [],
    subProcess: [],

    alert: '',

    e_SubPid: '',
    e_section_id: '',
    e_Pid: '',
    e_SubPname: '',
    e_sequence_number: '',
    e_process_type: '',
    e_status: '',

    keyProcessOptions: [],
    subProcessList:[],

    subProcessNewList: [],

    subProcessOrder: [],

    columns: [
      { title: 'No.', data: 'SubPid' },
      { title: 'Section Code', data: 'section_code' },
      { title: 'Process Description', data: 'Pname' },
      { title: 'Sub Process Description', data: 'SubPname' },
      { title: 'Process Type', data: 'process_type' },
      { title: 'Sequence Number', data: 'sequence_number' },
      { title: 'Status', data: 'sub_process_status' },
      { title: 'Date Created', data: 'date_created' },
      { title: 'Open', data: null, orderable: false, 
        render: function (data) { 
            return '<button data-bs-toggle="modal" data-bs-target="#editSubProcess" class="btn w-100"><span class="material-symbols-outlined">open_in_new</span></button'
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
},
methods: {
  getData(){
    if(event.target.tagName == 'BUTTON'){
        const row = event.target.parentNode.parentNode;
        const cell = row.querySelector('td');
        this.tempSubPid = parseInt(cell.textContent);
    }
    if(event.target.tagName == 'SPAN'){
        const row = event.target.parentNode.parentNode.parentNode;
        const cell = row.querySelector('td');
        this.tempSubPid = parseInt(cell.textContent);
    }
    for(const sub of this.subProcess){
      if(this.tempSubPid === parseInt(sub.SubPid)){
        this.e_section_id = sub.section_id;
        this.e_Pid = sub.Pid;
        this.e_SubPid = sub.SubPid;
        this.e_SubPname = sub.SubPname;
        this.e_sequence_number = sub.sequence_number;
        this.e_process_type = sub.process_type;
        this.e_status = sub.sub_process_status;
      }
    }
  },
  updateSubProcess(){
    const toastLiveExample = document.getElementById('liveToast');
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
    let isDuplicate = false;
    let isNull = false;
    for(const sub of this.subProcess){
      const formattedESubPname = this.e_SubPname.replace(/\s+/g, '').toUpperCase();
      const formattedSubPname = sub.SubPname.replace(/\s+/g, '').toUpperCase();
      if(formattedESubPname === formattedSubPname){
        isDuplicate = true;
        toastBootstrap.show();
        this.alert = 'System Warning: Duplicate Entry Detected. Please perform a comprehensive verification';
        break;
      }
    }
    const formattedESubPname = this.e_SubPname.replace(/\s+/g, '').toUpperCase();
    if(formattedESubPname === ''){
      isNull = true;
      toastBootstrap.show();
      this.alert = 'System Alert: Detection of an Unassigned Sub Process Description. Please conduct a thorough review';
    } else {
      isNull = false;
    }

    if(isDuplicate || isNull){
      console.log('cancel');
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
  },
  onChange(event) {
      this.reorder()
  },
  reorder() {
      this.subProcessOrder.forEach((sub, index) => (sub.sequence_number = index + 1))
  },
  submitSubProcess(){
    for(const sub of this.subProcessNewList){
      axios.post(this.SubProcessPostURL, {
        section_id: sub.section_id,
        Pid: sub.Pid,
        SubPname: sub.SubPname,
        sub_process_type: sub.sub_process_type,
        sub_process_status: sub.sub_process_status,
        sequence_number: sub.sequence_number
      }).then(response => {
        console.log(response.data);
      }).catch(error => {
        console.log(error);
      });
    }
  },
  updateSubOrder(){
    console.log(this.subProcessOrder);
    for(const sub of this.subProcessOrder){
        axios.put(this.SubProcessOrderPutURL, {
          SubPid: sub.SubPid,
          sequence_number: sub.sequence_number,
        }).then(response => {
          console.log(response.data);
        }).catch(error => {
          console.log(error);
        });
    }
  },
  addSubProcess(){
    if(this.SubPname == ''){
      this.validateSubPname = true;
    } else {
      this.validateSubPname = false;
      this.subProcessList.push({
        sequence_number: this.sequence_number,
        SubPname: this.SubPname,
        sub_process_status: this.sub_process_status
      });
      this.subProcessNewList.push({
        section_id: this.section_id,
        Pid: this.Pid,
        sequence_number: this.sequence_number,
        SubPname: this.SubPname,
        sub_process_status: this.sub_process_status,
        sub_process_type: this.sub_process_type,
      });
      this.SubPname = '';
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
      this.keyProcessOptions = response.data;
    }).catch(error => {
      console.log(error);
    });
  },
  FetchSubOptions(Pid){
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

},

async created() {
  await axios.get(this.SectionGetURL, {
    }).then(response => {
      this.section = response.data;
    }).catch(error => {
      console.log(error)
    });
    
    await axios.get(this.KeyProcessGetURL, {
    }).then(response => {
      this.keyProcess = response.data;
    }).catch(error => {
      console.log(error)
    });

    await axios.get(this.SubProcessGetURL, {
    }).then(response => {
      for(const sub of response.data){
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
