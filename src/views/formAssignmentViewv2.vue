
<template>
    <div class="row col-md-12 mx-auto p-3">
        <div class="col-md-9">
            <h3>TPC - Setup Key Process</h3>
          </div>
          <div class="col-md-3 float-end">
            <button class="btn btn-outline-primary w-100 float-end" data-bs-toggle="modal" data-bs-target="#createForm"><span class=" align-bottom material-symbols-outlined">add</span>Create</button>
          </div>
    </div>
    <hr>
    <div class="p-3">
        <DataTable
        :data="formAssignment"
        :columns="columns"
        class="display table"
        @click="getRowData"
        />
    </div>
    
    <div class="modal fade" id="createForm" tabindex="-1" aria-labelledby="createFormAssignment" aria-hidden="true">
        <div class="modal-dialog modal-fullscreen">
          <div class="modal-content">
            <div class="modal-body">
              <div class="col-md-12 row">
                <div class="col-md-5 mx-auto row border-end">
                    <div class="col-md-4 p-2">
                        <button class="btn btn-outline-primary w-100">Save</button>
                    </div>
                    <div class="col-md-4 p-2">
                        <button class="btn btn-outline-primary w-100">Save</button>
                    </div>
                    <div class="col-md-4 p-2">
                        <button class="btn btn-outline-primary w-100">Save</button>
                    </div>
                    <div class="col-md-4 p-2">
                        <button class="btn btn-outline-primary w-100">Save</button>
                    </div>
                    <div class="col-md-4 p-2">
                        <button class="btn btn-outline-primary w-100">Save</button>
                    </div>
                    <div class="col-md-4 p-2">
                        <button class="btn btn-outline-primary w-100">Save</button>
                    </div>
                    <hr>
                    <div class="col-md-3">
                        <p>Form Assignment No: </p>
                    </div>
                    <hr>
                    <div class="col-md-4 p-2">
                        <label for="status">Form Status:</label>
                        <input type="text" class="form-control" disabled>
                    </div>
                    <div class="col-md-4 p-2">
                        <label for="status">Assigned By:</label>
                        <input type="text" class="form-control" disabled>
                    </div>
                    <div class="col-md-4 p-2">
                        <label for="status">Date Created:</label>
                        <input type="text" class="form-control" disabled>
                    </div>
                    <hr>
                    <div class="col-md-2 p-2">
                        <label for="section_code">Section:</label>
                        <select id="section_code" class="form-select" v-model="section_id" @change="generatePartsNumber(section_id)">
                            <option v-for="sec in section" :value="sec.section_id">{{sec.section_code}}</option>
                        </select>
                    </div>
                    <div class="col-md-5 p-2">
                        <label for="parts_number">Parts Number: </label>
                        <input list="parts_number_list" type="text" id="parts_number" v-model="parts_number" class="form-select" autocomplete="off" @input="generateSectionRequest(section_id, parts_number)">
                        <datalist id="parts_number_list">
                            <option v-for="pn in partsNumber" :value="pn.parts_number">{{pn.parts_number}}</option>
                        </datalist>
                    </div>
                    <div class="col-md-5 p-2">
                        <label for="lot_number">Lot Number: </label>
                        <select id="lot_number" class="form-select" v-model="lot_number">
                            <option v-for="ln in lotNumber" :value="ln.lot_number">{{ln.lot_number}}</option>
                        </select>
                    </div>
                    <div class="col-md-6 p-2">
                        <label for="wafer_no_from">Wafer Number From:</label>
                        <input id="wafer_no_from" type="text" class="form-control">
                    </div>
                    <div class="col-md-6 p-2">
                        <label for="wafer_no_to">Wafer Number To:</label>
                        <input id="wafer_no_to" type="text" class="form-control">
                    </div>
                    <div v-if="section_code === 'CCI'" class="col-md-6 p-2">
                        <label for="po_number">PO Number: </label>
                        <input list="po_number_list" type="text" id="po_number" v-model="po_number" class="form-select" autocomplete="off" >
                        <datalist id="po_number_list">
                            <option v-for="po in poNumber" :value="po.po_number">{{po.po_number}}</option>
                        </datalist>
                    </div>
                    <div v-if="section_code === 'CCI'" class="col-md-6 p-2">
                        <label for="order_pn">Order PN:</label>
                        <input type="text" class="form-control">
                    </div>
                    <div class="col-md-8 p-2">
                        <label for="item_code">Item Code:</label>
                        <input type="text" id="item_code" class="form-select">
                    </div>
                    <div class="col-md-4 p-2">
                        <label for="">Material Lot Number:</label>
                        <input type="text" class="form-control">
                    </div>
                </div>

                <div class="col-md-7">

                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>
    
    
    </template>
    <script>
    import DataTablesCore from 'datatables.net-bs5';
    import DataTable from 'datatables.net-vue3';
    import 'datatables.net-responsive';
    import 'datatables.net-select';
    import axios from 'axios';
    DataTable.use(DataTablesCore);
    export default {
    components: {
        DataTable,
    },
    data() {
        return {
            formAssignmentURL: 'http://172.16.2.69/tpcrequesthandlers/formAssignment.php',
            sectionURL: 'http://172.16.2.69/tpcrequesthandlers/sectionView.php',
            processFlowURL: 'http://172.16.2.69/tpcrequesthandlers/fetchProcessFlowMain.php',
            keyProcessURL: 'http://172.16.2.69/tpc/requestKeyProcess.php',
            subProcessURL: 'http://172.16.2.69/tpc/requestSubProcess.php',

            CCILotRequestURL: 'http://172.16.2.69/tpc/HandleCCILotRequest.php',
            CCIPoRequstURL: 'http://172.16.2.69/tpc/HandleCCIPoRequest.php',

            formAssignment: [],
            section: [],
            keyProcess: [],
            subProcess: [],
            processFlow: [],

            partsNumber: [],
            lotNumber: [],
            poNumber: [],

            parts_number: '',
            section_id: '',
            section_code: '',
            lot_number: '',
            po_number: '',

            columns: [
              { title: 'Assign No.', data: 'assignment_id'},
              { title: 'Status', data: 'assignment_status' },
              { title: 'Section', data: 'section_code' },
              { title: 'Lot Number', data: 'lot_number' },
              { title: 'PO Number', data: 'po_number' },
              { title: 'Parts Number', data: 'item_parts_number' },
              { title: 'Item Code', data: 'item_code' },
              { title: 'Quantity Ordered', data: 'quantity' },
              { title: 'Deliver Date', data: 'delivery_date' },
              { title: 'JO Number', data: 'jo_number' },
              { title: 'Revision No.', data: 'revision_number' },
              { title: 'Wafer No From', data: 'wafer_number_from' },
              { title: 'Wafer No To', data: 'wafer_number_to' },
              { title: 'Assigned By', data: 'assigned_by' },
              { title: 'Date Created', data: 'date_created' },
              { title: 'Date Issued', data: 'date_issued' },
              { title: 'Total Instruction Count', data: null },
              { title: 'Total Attachment Count', data: null },
              { title: 'View', data: null, 
                orderable: false, 
                render: function (data) { 
                            return '<button data-bs-toggle="modal" data-bs-target="#viewForm" class="btn w-100"><span class="material-symbols-outlined">visibility</span></button'} 
                        },
            ]
        }
    },
    methods: {
       generatePartsNumber(section_id){
        this.partsNumber = [];
        const selectedPartsNumber = new Set();
        for(const flow of this.processFlow){    
            if(parseInt(section_id) === flow.section_id && flow.flow_status === 'Posted'){
                const partsNumber = flow.item_parts_number;
                if(!selectedPartsNumber.has(partsNumber)){
                    this.partsNumber.push({parts_number: partsNumber});
                    selectedPartsNumber.add(partsNumber);
                }
            }
        }
        for(const sec of this.section){
            if(section_id === sec.section_id){
                this.section_code = sec.section_code;
            }
        }
       },
       async generateSectionRequest(section_id, parts_number){
        this.lotNumber = [];
        this.poNumber = [];

        const selectedLotNumber = new Set();
        const selectedPoNumber = new Set();
        for(const sec of this.section){
            if(section_id === sec.section_id){
                if(sec.section_code.split('-').includes('CCI')){
                    const lotRequest = axios.get(this.CCILotRequestURL, {
                        method: 'GET',
                        headers: {
                            'Content-type': 'application/x-www-form-urlencoded'
                        },
                        params: {
                            parts_number: parts_number
                        }
                    });
                    const poRequest = axios.get(this.CCIPoRequstURL, {
                        method: 'GET',
                        headers: {
                            'Content-type': 'application/x-www-form-urlencoded'
                        },
                        params: {
                            parts_number: parts_number
                        }
                    });
                    Promise.all([lotRequest, poRequest], {
                    
                    }).then(response => {
                        for(const lot of response[0].data){
                            if(!selectedLotNumber.has(lot.lotno)){
                                this.lotNumber.push({lot_number: lot.lotno})
                                selectedLotNumber.add(lot.lotno);
                            }
                        }
                        for(const po of response[1].data){
                            if(!selectedPoNumber.has(po.po_no)){
                                this.poNumber.push({po_number: po.po_no})
                                selectedPoNumber.add(po.po_no);
                            }
                        }
                    }).catch(error => {
                        console.log(error);
                    })
                    // await axios.get(this.CCILotRequestURL, {
                    //     method: 'GET',
                    //     headers: {
                    //         'Content-type': 'application/x-www-form-urlencoded'
                    //     },
                    //     params: {
                    //         parts_number: parts_number
                    //     }
                    // }).then(response => {
                    //     if(response.data === null || (Array.isArray(response.data) && response.data.length === 0)){
                    //         this.lotNumber = [];
                    //     } else {
                    //         for(const lot of response.data){
                    //             if(!selectedLotNumber.has(lot.lotno)){
                    //                 this.lotNumber.push({lot_number: lot.lotno})
                    //                 selectedLotNumber.add(lot.lotno);
                    //             }
                    //         }
                    //     }
                    // }).catch(error => {
                    //     console.log(error);
                    // });
                    // await axios.get(this.CCIPoRequestURL, {
                    //     method: 'GET',
                    //     headers: {
                    //         'Content-type': 'application/x-www-form-urlencoded'
                    //     },
                    //     params: {
                    //         parts_number: parts_number
                    //     }
                    // }).then(response => {
                    //     if(response.data === null || (Array.isArray(response.data) && response.data.length === 0)){
                    //         this.poNumber = [];
                    //     } else {
                    //         for(const po of response.data){
                    //             if(!selectedPoNumber.has(po.po_no)){
                    //                 this.poNumber.push({po_number: po.po_no})
                    //                 selectedPoNumber.add(po.po_no);
                    //             }
                    //         }
                    //     }
                    // }).catch(error => {
                    //     console.log(error);
                    // });
                }
            }
        }
       },
       
        
    },
    async created() {
        await axios.get(this.sectionURL, {
    
        }).then(response => {
            this.section = response.data;
        }).catch(error => {
            console.log(error);
        });
    
        await axios.get(this.processFlowURL, {
    
        }).then(response => {
            this.processFlow = response.data;
        }).catch(error => {
            console.log(error);
        });
    
        await axios.get(this.formAssignmentURL, {
    
        }).then(response => {
            this.formAssignment = response.data;
            for(const fa of this.formAssignment){
                for(const sec of this.section){
                    if(sec.section_id === fa.section_id){
                        Object.assign(fa, {section_code: sec.section_code});
                    }
                }
            }
        }).catch(error => {
            console.log(error)
        });
    
    
        await axios.get(this.keyProcessURL, {
    
        }).then(response => {
            this.keyProcess = response.data;
        }).catch(error => {
            console.log(error);
        });
    
        await axios.get(this.subProcessURL, {
    
        }).then(response => {
            this.subProcess = response.data;
        }).catch(error => {
            console.log(error);
        });
        
        this.formAssignmentId = this.formAssignment.length + 1;
        this.currentDate = new Date().toJSON().slice(0, 10);
        this.hasAttachment = false;
        this.hasInstruction = false;
    },
    
    }
    </script>
    
    <style>
    @import 'datatables.net-bs5';
    @import 'animate.css';
    @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,300,0,0');
    @import '@splidejs/vue-splide/css/sea-green';
    </style>