
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
                    <div class="col-md-5 mx-auto row border-end h-100">
                        <div class="col-md-4 p-2">
                            <button class="btn btn-outline-primary w-100">New</button>
                        </div>
                        <div class="col-md-4 p-2">
                            <button class="btn btn-outline-primary w-100">Save</button>
                        </div>
                        <div class="col-md-4 p-2">
                            <button class="btn btn-outline-primary w-100" data-bs-dismiss="modal">Close</button>
                        </div>
                        <div class="col-md-4 p-2">
                            <button class="btn btn-outline-primary w-100">Generate QR Code</button>
                        </div>
                        <div class="col-md-4 p-2">
                            <button class="btn btn-outline-primary w-100">Special Instructions</button>
                        </div>
                        <div class="col-md-4 p-2">
                            <button class="btn btn-outline-primary w-100">Attachments</button>
                        </div>
                        <hr>
                        <div class="col-md-4">
                            <p>Form Assignment No. : <strong>{{formAssignmentId}}</strong></p>
                        </div>
                        <hr>
                        <div class="col-md-4 p-2">
                            <label for="status">Form Status:</label>
                            <input type="text" class="form-control" v-model="form_status" disabled>
                        </div>
                        <div class="col-md-4 p-2">
                            <label for="status">Assigned By:</label>
                            <input type="text" class="form-control" v-model="assigned_by" disabled>
                        </div>
                        <div class="col-md-4 p-2">
                            <label for="status">Date Created:</label>
                            <input type="text" class="form-control" v-model="date_created" disabled>
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
                            <input id="wafer_no_from" type="number" class="form-control" v-model="wafer_number_from">
                        </div>
                        <div class="col-md-6 p-2">
                            <label for="wafer_no_to">Wafer Number To:</label>
                            <input id="wafer_no_to" type="number" class="form-control" v-model="wafer_number_to">
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
                            <input type="text" id="order_pn" class="form-control">
                        </div>
                        <div class="col-md-8 p-2">
                            <label for="item_code">Item Code:</label>
                            <input @input="generateRevisionNumber(section_id, parts_number, item_code)" list="item_code_list" type="text" id="item_code" class="form-select" v-model="item_code">
                            <datalist id="item_code_list">
                                <option v-for="ic in itemCode" :value="ic.item_code">{{ic.item_code}}</option>
                            </datalist>
                        </div>
                        <div class="col-md-4 p-2">
                            <label for="material_lot_number">Material Lot Number:</label>
                            <input type="text" id="material_lot_number" class="form-control">
                        </div>
                        <div v-if="section_code ==='CCI'" class="col-md-3 p-2">
                            <label for="customer_pn">Customer PN:</label>
                            <input type="text" class="form-control">
                        </div>
                        <div v-if="section_code ==='CCI'" class="col-md-6 p-2">
                            <label for="customer_name">Customer Name:</label>
                            <input type="text" class="form-control">
                        </div>
                        <div v-if="section_code ==='CCI'" class="col-md-3 p-2">
                            <label for="delivery_date">Delivery Date:</label>
                            <input type="text" id="delivery_date" class="form-control">
                        </div>
                        <div class="col-md-4 p-2">
                            <label for="order_quantity">Order Quantity:</label>
                            <input type="text" id="order_quantity" class="form-control">
                        </div>
                        <div class="col-md-8 p-2">
                            <label for="jo_number">JO number: </label>
                            <input type="text" class="form-control">
                        </div>
                        <div class="col-md-6 p-2">
                            <label for="revision_number">Revision Number: </label>
                            <input type="text" id="revision_number" v-model="revision_number" class="form-control" disabled>
                        </div>
                        <div class="col-md-6 p-2">
                            <label for="date_issued">Date Issued: </label>
                            <input type="text" id="date_issued" class="form-control">
                        </div>
                    </div>
    
                    <div class="col-md-7">
                        <div class="row mx-auto">
                            <p><em><strong>{{section_description}}</strong></em> - <strong>PROCESS FLOW ASSIGNMENT</strong></p>
                        </div>
                        <table class="table table-responsive">
                            <thead>
                                <tr>
                                    <th>Seq No.</th>
                                    <th>Key Process</th>
                                    <th>Sub Process</th>
                                    <th>Process Type</th>
                                    <th>Standard Time</th>
                                    <th>Machine Time</th>
                                    <th>Attachment Count</th>
                                    <th>Instruction Count</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <template v-for="flowSub in processFlowSub" :key="flowSub.flow_main_id">
                                    <tr>
                                        <td>{{flowSub.sequence_number}}</td>
                                        <td>{{flowSub.Pname}}</td>
                                        <td>{{flowSub.SubPname}}</td>
                                        <td>{{flowSub.process_type}}</td>
                                        <td>{{flowSub.standard_time}}</td>
                                        <td>{{flowSub.machine_time}}</td>
                                        <td></td>
                                        <td></td>
                                        <td>{{flowSub.status}}</td>
                                        <td>
                                            <button @click="toggleItemCondition(flowSub.SubPid)" class="btn">
                                                <span class="material-symbols-outlined">
                                                    {{ toggle[flowSub.SubPid]? 'expand_less' : 'expand_more' }}
                                                </span>
                                            </button>
                                        </td>
                                    </tr>
                                    <tr v-show="toggle[flowSub.SubPid]">
                                        <td colspan="10">
                                            <div class="p-3">
                                                <table class="table table-responsive">
                                                    <thead>
                                                        <tr>
                                                            <th>No.</th>
                                                            <th>Process Detail Description</th>
                                                            <th>Typical Value</th>
                                                            <th>Minimum Value</th>
                                                            <th>Maximum Value</th>
                                                            <th>Condition Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <template v-for="item in itemCondition" :key="item.item_id">
                                                            <tr v-if="flowSub.SubPid == item.SubPid">
                                                                <td>{{item.sequence_number}}</td>
                                                                <td>{{item.detail_description}}</td>
                                                                <td>{{item.typical_value}}</td>
                                                                <td>{{item.min_value}}</td>
                                                                <td>{{item.max_value}}</td>
                                                                <td>{{item.condition_status}}</td>
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
            formAssignmentURL: 'http://172.16.2.69/tpc/GetFormAssignment.php',
            sectionURL: 'http://172.16.2.69/tpc/GetSection.php',
            processFlowURL: 'http://172.16.2.69/tpc/GetProcessFlow.php',
            keyProcessURL: 'http://172.16.2.69/tpc/GetKeyProcess.php',
            subProcessURL: 'http://172.16.2.69/tpc/GetSubProcess.php',
            processFlowSubURL: 'http://172.16.2.69/tpc/requestProcessFlowSub.php',
            itemConditionURL: 'http://172.16.2.69/tpc/requestItemCondition.php',

            CCILotRequestURL: 'http://172.16.2.69/tpc/HandleCCILotRequest.php',
            CCIPoRequestURL: 'http://172.16.2.69/tpc/HandleCCIPoRequest.php',
            POLRequestURL: 'http://172.16.2.69/tpc/HandlePOLRequest.php',
            CWPRequestURL: 'http://172.16.2.69/tpc/HandleCWPRequest.php',
            SWPRequestURL: 'http://172.16.2.69/tpc/HandleSWPRequest.php',

            toggle: {},

            formAssignment: [],
            section: [],
            keyProcess: [],
            subProcess: [],
            processFlow: [],
            processFlowSub: [],
            itemCondition: [],

            partsNumber: [],
            lotNumber: [],
            poNumber: [],
            itemCode: [],

            form_status: 'Unposted',
            assigned_by: '3141 - Casul',
            date_created: '',
            parts_number: '',
            section_id: '',
            lot_number: '',
            po_number: '',
            item_code: '',
            revision_number: '',
            wafer_number_from: 0,
            wafer_number_to: 0,

            section_code: '',
            flow_main_id: '',

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
        this.lotNumber = [];
        this.poNumber = [];
        this.itemCode = [];
        this.processFlowSub = [];

        this.parts_number = '';
        this.lot_number = '';
        this.po_number = '';
        this.item_code = '';
        this.revision_number = '';
        const selectedPartsNumber = new Set();
        for(const flow of this.processFlow){    
            if(parseInt(section_id) === parseInt(flow.section_id) && flow.flow_status === 'Posted'){
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
                this.section_description = sec.section_description;
            }
        }
       },
       async generateSectionRequest(section_id, parts_number){
        this.lotNumber = [];
        this.poNumber = [];
        this.itemCode = [];
        this.processFlowSub = [];

        this.lot_number = '';
        this.po_number = '';
        this.item_code = '';
        this.revision_number = '';
        const axiosParams = {
            method: 'GET',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
                parts_number: parts_number
            }
        };
        
        const selectedItemCode = new Set();
        const selectedLotNumber = new Set();
        const selectedPoNumber = new Set();
        for(const sec of this.section){
            if(section_id === sec.section_id){
                if(sec.section_code.split('-').includes('CCI')){
                    const lotRequest = axios.get(this.CCILotRequestURL, axiosParams);
                    const poRequest = axios.get(this.CCIPoRequestURL, axiosParams);
                   await Promise.all([lotRequest, poRequest], {
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
                    }).catch(error => {console.log(error); });
                } else if(sec.section_code.split('-').includes('POL')){
                   await axios.get(this.POLRequestURL, axiosParams)
                    .then(response => {
                        for(const lot of response.data){
                            if(!selectedLotNumber.has(lot.cwp_input_plan_pol_orderno)){
                                this.lotNumber.push({lot_number: lot.cwp_input_plan_pol_orderno});
                                selectedLotNumber.add(lot.cwp_input_plan_pol_orderno);
                            }
                         }
                    }).catch(error => {console.log(error); });
                } else if(sec.section_code.split('-').includes('CWP')){
                   await axios.get(this.CWPRequestURL, axiosParams)
                    .then(response => {
                        for(const lot of response.data){
                            if(!selectedLotNumber.has(lot.cwp_input_plan_lotno)){
                                this.lotNumber.push({lot_number: lot.cwp_input_plan_lotno});
                                selectedLotNumber.add(lot.cwp_input_plan_lotno);
                            }
                         }
                    }).catch(error => {console.log(error); });
                } else if(sec.section_code.split('-').includes('SWP')){
                   await axios.get(this.SWPRequestURL, axiosParams)
                    .then(response => {
                        for(const lot of response.data){
                            if(!selectedLotNumber.has(lot.lot_number)){
                                this.lotNumber.push({lot_number: lot.lot_number});
                                selectedLotNumber.add(lot.lot_number);
                            }
                         }
                    }).catch(error => {console.log(error); });
                }
            }
        }
        for(const flow of this.processFlow){
            if(parseInt(section_id) === parseInt(flow.section_id) && parts_number === flow.item_parts_number && flow.flow_status === 'Posted'){
                if(!selectedItemCode.has(flow.item_code)){
                    this.itemCode.push({item_code: flow.item_code});
                    selectedItemCode.add(flow.item_code);
                }
            }
        }
       },
       generateRevisionNumber(section_id, parts_number, item_code){
        this.processFlowSub = [];
        this.revision_number = '';
        let latestRevNo = -1;
        for(const flow of this.processFlow){
            if(parseInt(section_id) === parseInt(flow.section_id) && parts_number === flow.item_parts_number && item_code === flow.item_code && flow.flow_status === 'Posted'){
                if(flow.revision_number > latestRevNo){
                    latestRevNo = flow.revision_number;
                    this.revision_number = latestRevNo;
                    this.flow_main_id = flow.flow_main_id;
                }
            }
        }
        if(this.revision_number){
            axios.get(this.processFlowSubURL,{
                method: 'GET',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                params: {
                    section_id: section_id,
                    parts_number: parts_number,
                    flow_main_id: this.flow_main_id,
                    revision_number: this.revision_number
                }
            }).then(response => {
                this.processFlowSub = response.data;
                for(const flowSub of this.processFlowSub){
                    console.log(flowSub);
                    for(const key of this.keyProcess){
                        if(flowSub.Pid === parseInt(key.Pid)){
                            Object.assign(flowSub, {Pname: key.Pname});
                        }
                    }
                    for(const sub of this.subProcess){
                        if(flowSub.SubPid === parseInt(sub.SubPid)){
                            Object.assign(flowSub, {
                                SubPname: sub.SubPname,
                                process_type: sub.process_type,
                                status: 'Active'
                            });
                        }
                    }
                    axios.get(this.itemConditionURL, {
                        method: 'GET',
                        headers: {
                            'Content-type': 'application/x-www-form-urlencoded'
                        },
                        params: {
                            SubPid: flowSub.SubPid
                        }
                    }).then(response => {
                        for(const item of response.data){
                            this.itemCondition.push(item);
                            this.itemCondition.sort((a, b) => a.sequence_number - b.sequence_number);
                            Object.assign(item, {condition_status: 'Active'});
                        }
                    }).catch(error => {
                        console.log(error);
                    });
                }
            }).catch(error => {
                console.log(error);
            });
        } else {
            this.revision_number = '-';
            console.log('revision number is missing apply an error message');
        }
       },

       toggleItemCondition(SubPid){
            this.toggle[SubPid] = !this.toggle[SubPid];
       },
        
    },
    async created() {
        await axios.get(this.sectionURL, {}).
        then(response => {
            this.section = response.data;
        }).catch(error => {
            console.log(error);
        });
    
        await axios.get(this.processFlowURL, {}).
        then(response => {
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
        this.date_created = new Date().toJSON().slice(0, 10);
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