
<template>
    <div class="col-md-12 row mx-auto py-3 container">
        <div class="col-md-9">
          <h3>Tablet Process Card - <em>Setup Key Process</em></h3>
        </div>
        <div class="col-md-3 float-end">
          <button class="btn btn-outline-info w-100 float-end" data-bs-toggle="modal" data-bs-target="#create"><span class=" align-bottom material-symbols-outlined">add</span>Create</button>
        </div>
    </div>
    <div class="container table-responsive">
        <DataTable
            :data="keyProcess"
            :columns="columns"
            class="display table table-hover"
            @click="getProcess_id"
            :options="tableOptions"
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
            <div class="col-md-12 row">
                <div class="col-md-4">
                    <label for="section">Section:</label>
                    <select id="section" class="form-select" v-model="section_id">
                        <option v-for="sec in section" :value="sec.section_id">{{sec.section_code}}</option>
                    </select>
                </div>
                <div class="col-md-8">
                    <label for="keyProcessCode">Key Process Code:</label>
                    <input type="text" class="form-control" @input="toUpper()" v-model="Pcode">
                </div>
                <div class="col-md-12">
                    <label for="keyProcessDescription">Key Process Description:</label>
                    <input type="text" class="form-control" v-model="Pname">
                </div>
                <div class="col-md-7">
                    <label for="keyProcessStatus">Key Process Status:</label>
                    <input type="text" class="form-select" v-model="key_status" disabled>
                </div>
                <div class="col-md-5">
                    <label for="stock_point">Stock Point</label>
                    <select id="stock_point" class="form-select" v-model="stock_point">
                        <option value="1">True</option>
                        <option value="0">False</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="modal-footer">
          <button ref="submit" type="submit" @click="submitKeyProcess" class="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
</div>

<div class="modal fade" id="edit" tabindex="-1" aria-labelledby="editModal" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="editModal">Create New Key Process!</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
          <div class="col-md-12 row">
              <div class="col-md-4">
                  <label for="edit_section">Section:</label>
                  <select id="edit_section" class="form-select" v-model="e_section_id">
                      <option v-for="sec in section" :value="sec.section_id">{{sec.section_code}}</option>
                  </select>
              </div>
              <div class="col-md-8">
                <label for="edit_Pcode">Key Process Code:</label>
                <input id="edit_Pcode" type="text" class="form-control" @input="toUpperE" v-model="e_Pcode">
              </div>
              <div class="col-md-12">
                  <label for="edit_keyProcessDescription">Key Process Description:</label>
                  <input id="edit_keyProcessDescription" type="text" class="form-control" v-model="e_Pname">
              </div>
              <div class="col-md-7">
                  <label for="edit_keyProcessStatus">Key Process Status:</label>
                  <select id="edit_keyProcessStatus" class="form-control" v-model="e_key_status">
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                  </select>
              </div>
              <div class="col-md-5">
                  <label for="edit_stock_point">Stock Point</label>
                  <select id="edit_stock_point" class="form-select" v-model="e_stock_point">
                      <option value="1">True</option>
                      <option value="0">False</option>
                  </select>
              </div>
          </div>
      </div>
      <div class="modal-footer">
        <button ref="edit" type="submit" @click="editKeyProcess" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="delete" tabindex="-1" aria-labelledby="deleteModal" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="deleteModal">Create New Key Process!</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <div class="alert alert-warning text-center">
                <p >YOU ARE GOING TO DELETE THIS PROCESS: "{{e_Pname}}"</p>
                <h5 class="text-danger">Do you wish to proceed?</h5>
              </div>
        </div>
        <div class="modal-footer">
          <button ref="delete" type="submit" @click="deleteKeyProcess" data-bs-dismiss="modal" class="btn btn-primary">Save changes</button>
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
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net-bs5';
import 'datatables.net-responsive';
import 'datatables.net-select';
import * as bootstrap from 'bootstrap';
DataTable.use(DataTablesCore);
export default {
    components: {
        DataTable
    },
    data() {
        return {
            sectionURL: 'http://172.16.2.60/TPC/GetSection.php',
            keyProcessURL: 'http://172.16.2.60/TPC/GetKeyProcess.php',
            KeyProcessPostURL: 'http://172.16.2.60/TPC/PostKeyProcess.php',
            KeyProcessPutURL: 'http://172.16.2.60/TPC/PutKeyProcess.php',
            KeyProcessDeleteURL: 'http://172.16.2.60/TPC/DeleteKeyProcess.php',
            

            section: [],
            keyProcess: [],
            alert: '',
            //data processing
            section_id: '',
            section_code: '',
            Pname: '',
            Pcode: '',
            key_status: 'Active',
            stock_point: 0,

            e_Pid: '',
            e_Pname: '',
            e_Pcode: '',
            e_section_id: '',
            e_key_status: '',
            e_stock_point: null,
            tableOptions: { order: [[0, 'desc']]},
            columns: [
              { title: 'Section Code', data: 'section_code' },
              { title: 'Process Name', data: 'Pname' },
              { title: 'Process Code', data: 'key_code'},
              { title: 'Status', data: 'key_process_status' },
              { title: 'Stock Point', data: 'stock_point_bool' },
              { title: 'Date Created', data: 'date_created' },
              { title: 'Edit Section', data: null, 
                  orderable: false, 
                  render: function (data) { 
                                  return '<button data-bs-toggle="modal" data-bs-target="#edit" class="btn w-100 text-start"><span class="material-symbols-outlined">edit</span></button'
                              } 
                          },
              { title: 'Delete Section',data: null, 
                      orderable: false, 
                      render: function (data) { 
                                      return '<button data-bs-toggle="modal" data-bs-target="#delete" class="btn w-100 text-start"><span class="material-symbols-outlined">delete</span></button'
                                  } 
                              },
            ]
        }
    },
    methods: {
        toUpperE(){
            this. e_Pcode = this.e_Pcode.toUpperCase();
        },
        toUpper(){
            this.Pcode = this.Pcode.toUpperCase();
        },
        getProcess_id(event){
            let row;
            let cells;
            if(event.target.tagName === 'BUTTON'){
                row = event.target.parentNode.parentNode;
                cells = row.querySelectorAll('td');
                this.e_Pname = cells[1].textContent;
            }
            if(event.target.tagName === 'SPAN'){
                row = event.target.parentNode.parentNode.parentNode;
                cells = row.querySelectorAll('td');
                this.e_Pname = cells[1].textContent;
            }
            for(const key of this.keyProcess){
                if(key.Pname === this.e_Pname){
                    this.e_Pid = key.Pid;
                    this.e_section_id = key.section_id;
                    this.e_Pname = key.Pname;
                    this.e_Pcode = key.key_code;
                    this.e_key_status = key.key_process_status;
                    this.e_stock_point = key.stock_point;
                }
            }
            
        },
        submitKeyProcess(){
            const toastLiveExample = document.getElementById('liveToast');
            const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
            let dupPname = false;
            let dupKey_Code = false; 
            console.log(this.section_id)
            for(const key of this.keyProcess){
                if(parseInt(key.section_id) === parseInt(this.section_id)){
                    if(this.Pname.toUpperCase() === key.Pname.toUpperCase()){
                        dupPname = true;
                        this.alert = 'A duplicate Key Process Description is detected';
                        toastBootstrap.show();
                        break;
                    } else {
                        dupPname = false;
                    }
                }
                if(this.Pcode === key.key_code){
                        dupKey_Code = true;
                        this.alert = 'A duplicate code is detected';
                        toastBootstrap.show()
                        break;
                    } else {
                        dupKey_Code = false;
                }
                
            }
            if(dupPname || dupKey_Code){

            } else {
                axios.post(this.KeyProcessPostURL, {
                    section_id: this.section_id,
                    key_code: this.Pcode,
                    Pname: this.Pname,
                    key_process_status: this.key_status,
                    stock_point: this.stock_point
                }).then(response => {
                    if(response.data.message === 'Key Process inserted successfully'){
                        for(const section of this.section){
                            if(this.section_id === section.section_id){
                                this.section_code = section.section_code;
                            }
                        }
                        this.keyProcess.push({
                            section_id: this.section_id,
                            section_code: this.section_code,
                            key_code: this.Pcode,
                            Pname: this.Pname,
                            key_process_status: this.key_status,
                            stock_point: this.stock_point,
                            stock_point_bool: this.stock_point == 1 ? 'True' : 'False',
                            date_created: new Date().toJSON().slice(0,10),
                        })
                        this.alert = 'The Key Process ' + this.Pname + ' is Submitted Successfully';
                        toastBootstrap.show(); 
                        this.section_id = '';
                        this.section_code = '';
                        this.Pname = '';
                        this.Pcode = '';
                        this.key_status = 'Active';
                        this.stock_point = 0;
                    }
                }).catch(error => {
                    console.log(error)
                });
            }
            
        },
        editKeyProcess(){
            const toastLiveExample = document.getElementById('liveToast');
            const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
            axios.put(this.KeyProcessPutURL, {
                section_id: this.e_section_id,
                Pid: this.e_Pid,
                Pname: this.e_Pname,
                key_code: this.e_Pcode,
                key_process_status: this.e_key_status,
                stock_point: this.e_stock_point
            }).then(response => {
                console.log(response.data);
                if(response.data.message === 'Key Process updated successfully'){
                    for(const key of this.keyProcess){
                        if(parseInt(this.e_Pid) === parseInt(key.Pid)){
                            key.key_code = this.e_Pcode;
                            key.Pname = this.e_Pname;
                            key.key_process_status = this.e_key_status;
                            key.stock_point_bool = this.e_stock_point === '0' ? 'False' : 'True';
                        }
                    }
                } else {
                    this.alert = response.data;
                    toastBootstrap.show();
                }
            }).catch(error => {
                console.log(error);
            });
        },
        deleteKeyProcess(){
            const toastLiveExample = document.getElementById('liveToast');
            const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
            axios.post(this.KeyProcessDeleteURL, {
                Pid: this.e_Pid
            }).then(response => {
                if(response.data.message === 'Key Process deleted successfully'){
                    let idToRemove = this.keyProcess.findIndex(key => key.Pid === this.e_Pid);
                    this.keyProcess.splice(idToRemove, 1);
                    this.alert = 'This Key Process ' + this.e_Pname + ' has been removed successfully';
                    toastBootstrap.show();
                }
            }).catch(error => {
                console.log(error);
            });
        }
    },
    created() {
        const promise1 = axios.get(this.sectionURL);
        const promise2 = axios.get(this.keyProcessURL);
        Promise.all([promise1, promise2])
        .then(response => {
            this.section = response[0].data;
            for(const key of response[1].data){
                if(key.stock_point == 0){
                    Object.assign(key, {stock_point_bool: 'False'});
                } else {
                    Object.assign(key, {stock_point_bool: 'True'});
                }
                for(const sec of this.section){
                    if(key.section_id == sec.section_id){
                        Object.assign(key, {section_code: sec.section_code});
                        this.keyProcess.push(key);
                    }
                }
            }
        }).catch(error => {
            console.log(error);
        });

        
    }
}
</script>
<style>
@import 'bootstrap';
@import 'datatables.net-bs5';
</style>
