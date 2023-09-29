<template>
    <div class="col-md-12 row mx-auto py-3 container">
        <div class="col-md-9">
          <h3>Tablet Process Card - <em>NG Reason</em></h3>
        </div>
        <div class="col-md-10 mx-auto row p-1">
            <div class="col-md-5 p-1">
                <select id="sub" class="form-select" v-model="SubPid" @change="fetchNGReason">
                    <option v-for="sub in subProcess" :key="sub.SubPid" :value="sub.SubPid" >
                        {{sub.SubPname}}
                    </option>
                </select>
            </div>
            <div class="col-md-6 p-1">
                <input ref="reason" type="text" placeholder="Reason" class="form-control" v-model="reason" v-on:keyup.enter="addReason">
            </div>
            <div class="col-md-1 p-1">
                <button class="btn btn-outline-info btn-sm w-100" @click="addReason">
                    <span class="material-symbols-outlined">
                        add
                    </span>
                </button>
            </div>
            <div class="col-md-12 mx-auto p-1 table-responsive border rounded">
                <table class="table">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>NG Reason</th>
                            <th style="width: 3%">Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(ng,index) in ngReason" :key="ng.id">
                            <td>{{index + 1}}</td>
                            <td>{{ng.ng_reason}}</td>
                            <td>
                                <button class="btn btn-outline-danger w-100 btn-sm" @click="deleteReason(ng.id)">-</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        
        
    </div>
    <!--Datatable-->

    

    <!-- Modal -->

    <div class="toast-container position-fixed top-0 end-0 p-3">
      <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
          <strong class="me-auto">Alert</strong>
          <small>a while ago</small>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          {{submissionAlert}}
        </div>
      </div>
    </div>
</template>
<script>
    
    import * as bootstrap from 'bootstrap';
    import axios from 'axios';
    import DataTable from 'datatables.net-vue3';
    import DataTablesCore from 'datatables.net-bs5';
    import 'datatables.net-responsive';
    import 'datatables.net-select';
    
    DataTable.use(DataTablesCore);
    export default {
    components: {
        DataTable,
    },
    data() {
      return {
        sectionURL: 'http://172.16.2.13/tpc-endpoint/GetSection.php',
        sectionPostURL: 'http://172.16.2.13/tpc-endpoint/PostSection.php',
        sectionPutURL: 'http://172.16.2.13/tpc-endpoint/PutSection.php',
        sectionDeleteURL: 'http://172.16.2.13/tpc-endpoint/DeleteSection.php',
        keyProcessURL: 'http://172.16.2.13/tpc-endpoint/GetKeyProcess.php',
        subProcessURL: 'http://172.16.2.13/tpc-endpoint/GetSubProcess.php',

        insertNGReasonURL: 'http://172.16.2.13/tpc-endpoint/PostNGReason.php',
        requestNGReasonURL: 'http://172.16.2.13/tpc-endpoint/requestNGReason.php',
        deleteNGReasonURL: 'http://172.16.2.13/tpc-endpoint/DeleteNGReason.php',
        section: [],
        keyProcess: [],
        subProcess: [],
        submissionAlert: '',
        ngReason: [],
        //Entry 
        SubPid: '',
        reason: '',

        // for edit and delete

        tableOptions: { order: [[0, 'desc']]},
      } 
    },
    computed: {
      
    },
    methods: {
        addReason(){
            const toastLiveExample = document.getElementById('liveToast');
            const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
            let dupCode = this.ngReason.some(ng => ng.ng_reason.toUpperCase() === this.reason.toUpperCase());
            let isNull = this.reason === '' ? true : false;
            let subIsNull = this.SubPid === '' ? true : false;
            
            if(dupCode || isNull || subIsNull){
                this.submissionAlert = 'This could be due to an empty field or a preexisting entry. Please review the field for accuracy and attempt the operation once more.'
                toastBootstrap.show();
            } else {
                axios.post(this.insertNGReasonURL, {
                    SubPid: this.SubPid,
                    ng_reason: this.reason
                }).then(response => {
                    if(response.data.message === 'NG Reason inserted successfully'){
                        let ng_id = response.data.id
                        this.$refs.reason.focus();
                        this.ngReason.push({
                            id: ng_id,
                            ng_reason: this.reason
                        });
                        this.reason = '';
                    }
                }).catch(error => {
                    console.log(error);
                }); 
            }
        },
        fetchNGReason(){
            this.ngReason = [];
            axios.get(this.requestNGReasonURL, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                params: {
                    SubPid: this.SubPid
                }
            }).then(response => {
                this.ngReason = response.data;
            }).catch(error => {
                console.log(error);
            })
        },
        deleteReason(id){
            axios.post(this.deleteNGReasonURL, {
                id: id
            }).then(response => {
                if(response.data.message === 'NG Reason deleted successfully'){
                    let index = this.ngReason.findIndex((ng) => ng.id === id);
                    this.ngReason.splice(index, 1);
                }
            }).catch(error => {
                console.log(error)
            });
        }
    },
    
    created() {
        axios.get(this.subProcessURL, {

        }).then(response => {
            this.subProcess = response.data;
        }).catch(error => {
            console.log(error)
        })
    },
  }
</script>
  <style>
    @import 'bootstrap';
    @import 'datatables.net-bs5';
  </style>
  