
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
        class="display table table-responsive"
        @click="getRowData"
        />
    </div>
    
    <div class="modal fade" id="createForm" tabindex="-1" aria-labelledby="createFormAssignment" aria-hidden="true">
        <div class="modal-dialog modal-fullscreen">
          <div class="modal-content">
            <div class="modal-body">
                <div class="col-md-12 row">
                    <div class="col-md-5 mx-auto row h-100 sticky-top">
                        <div class="col-md-4 p-2">
                            <button class="btn btn-outline-primary w-100" disabled>New</button>
                        </div>
                        <div class="col-md-4 p-2">
                            <button class="btn btn-outline-primary w-100" @click="submitFormAssignment">Save</button>
                        </div>
                        <div class="col-md-4 p-2">
                            <button class="btn btn-outline-primary w-100" data-bs-dismiss="modal">Close</button>
                        </div>
                        <div class="col-md-4 p-2">
                            <button class="btn btn-outline-primary w-100" disabled>Generate QR Code</button>
                        </div>
                        <div class="col-md-4 p-2">
                            <button class="btn btn-outline-primary w-100" disabled>Special Instructions</button>
                        </div>
                        <div class="col-md-4 p-2">
                            <button class="btn btn-outline-primary w-100" disabled>Attachments</button>
                        </div>
                        <hr>
                        <div class="col-md-4">
                            <p>Form Assignment No. : <strong>{{formAssignmentId}}</strong></p>
                        </div>
                        <hr>
                        <div class="col-md-6">
                            <div class="form-check form-switch">
                                <input class="form-check-input" @change="instructionSwitch" type="checkbox" role="switch" id="special_instruction">
                                <label class="form-check-label" for="special_instruction">Special Instruction</label>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-check form-switch">
                                <input ref="attachment" class="form-check-input" @change="attachmentSwitch" type="checkbox" role="switch" id="attachment">
                                <label class="form-check-label" for="attachment">Attachment</label>
                            </div>
                        </div>
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
                            <input list="po_number_list" @input="generateCCICustomerDetails(parts_number, po_number)" type="text" id="po_number" v-model="po_number" class="form-select" autocomplete="off" >
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
                            <input @input="generateRevisionNumber(section_id, parts_number, item_code)" list="item_code_list" type="text" id="item_code" class="form-select" v-model="item_code" autocomplete="off">
                            <datalist id="item_code_list">
                                <option v-for="ic in itemCode" :value="ic.item_code">{{ic.item_code}}</option>
                            </datalist>
                        </div>
                        <div v-if="section_code === 'CCI'" class="col-md-4 p-2">
                            <label for="material_lot_number">Material Lot Number:</label>
                            <input type="text" id="material_lot_number" class="form-control" disabled>
                        </div>
                        <div v-else class="col-md-4 p-2">
                            <label for="material_lot_number">Material Lot Number:</label>
                            <input type="text" id="material_lot_number" class="form-control">
                        </div>
                        <div v-if="section_code ==='CCI'" class="col-md-3 p-2">
                            <label for="customer_pn">Customer PN:</label>
                            <input type="text" v-model="customer_pn" class="form-control" disabled>
                        </div>
                        <div v-if="section_code ==='CCI'" class="col-md-6 p-2">
                            <label for="customer_name">Customer Name:</label>
                            <input type="text" v-model="customer_name" class="form-control" disabled>
                        </div>
                        <div v-if="section_code ==='CCI'" class="col-md-3 p-2">
                            <label for="delivery_date">Delivery Date:</label>
                            <input type="text" v-model="delivery_date" id="delivery_date" class="form-control" disabled>
                        </div>
                        <div class="col-md-4 p-2">
                            <label for="order_quantity">Order Quantity:</label>
                            <input type="text" v-model="order_quantity" id="order_quantity" class="form-control" disabled>
                        </div>
                        <div class="col-md-8 p-2">
                            <label for="jo_number">JO number: </label>
                            <input type="text" v-model="jo_number" class="form-control">
                        </div>
                        <div class="col-md-6 p-2">
                            <label for="revision_number">Revision Number: </label>
                            <input type="text" id="revision_number" v-model="revision_number" class="form-control" disabled>
                        </div>
                        <div class="col-md-6 p-2">
                            <label for="date_issued">Date Issued: </label>
                            <input type="date" v-model="date_issued" id="date_issued" class="form-control">
                        </div>
                    </div>
    
                    <div class="col-md-7 border rounded">
                        <div class="row mx-auto p-2 text-center" v-if="section_code !== ''">
                            <p class="fs-3"><em><strong>{{section_description}}</strong></em> - <strong>PROCESS FLOW ASSIGNMENT</strong></p>
                        </div>
                        <hr>
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
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <template v-for="flowSub in processFlowSub" :key="flowSub.flow_main_id">
                                    <tr>
                                        <td>{{flowSub.sequence_number}} .</td>
                                        <td>{{flowSub.Pname}}</td>
                                        <td>{{flowSub.SubPname}}</td>
                                        <td>{{flowSub.process_type}}</td>
                                        <td>{{flowSub.standard_time}}</td>
                                        <td>{{flowSub.machine_time}}</td>
                                        <td></td>
                                        <td></td>
                                        <td>
                                            <div class="form-check form-switch">
                                                <input :ref="'processFlowSub'+flowSub.flow_sub_id" :id="'processFlowSub'+flowSub.flow_sub_id" @change="processFlowSubStatus(flowSub.flow_sub_id)" class="form-check-input" type="checkbox" role="switch" checked>
                                                <label class="form-check-label" :for="'processFlowSub'+flowSub.flow_sub_id" :id="'processFlowSubLabel'+flowSub.flow_sub_id">
                                                    <span v-if="flowSub.status === 'Active'" class="badge rounded-pill text-bg-primary">{{flowSub.status}}</span>
                                                    <span v-if="flowSub.status === 'Inactive'" class="badge rounded-pill text-bg-secondary">{{flowSub.status}}</span>
                                                </label>
                                            </div>
                                        </td>
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
                                                            <th><small>No.</small></th>
                                                            <th><small>Process Detail Description</small></th>
                                                            <th><small>Typical Value</small></th>
                                                            <th><small>Minimum Value</small></th>
                                                            <th><small>Maximum Value</small></th>
                                                            <th><small>Condition Status</small></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <template v-for="item in itemCondition" :key="item.item_id">
                                                            <tr v-if="flowSub.SubPid == item.SubPid">
                                                                <td><small>{{item.sequence_number}} .</small></td>
                                                                <td><small>{{item.detail_description}}</small></td>
                                                                <td><small>{{item.typical_value}}</small></td>
                                                                <td>{{item.min_value}}</td>
                                                                <td>{{item.max_value}}</td>
                                                                <td>
                                                                    <div class="form-check form-switch">
                                                                        <input :ref="'itemCondition'+item.item_id" :id="'itemCondition'+item.item_id" @change="itemConditionStatus(item.item_id)" class="form-check-input" type="checkbox" role="switch" checked>
                                                                        <label class="form-check-label" :for="'itemCondition'+item.item_id" :id="'itemConditionLabel'+item.item_id">
                                                                            <span v-if="item.status === 'Active'" class="badge rounded-pill text-bg-primary">{{item.status}}</span>
                                                                            <span v-if="item.status === 'Inactive'" class="badge rounded-pill text-bg-secondary">{{item.status}}</span>
                                                                        </label>
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
            formAssignmentPostURL: 'http://172.16.2.69/tpcrequesthandlers/FormAssignmentRequestHandler.php',
            formAssignmentItemPostURL: 'http://172.16.2.69/tpcrequesthandlers/ProcessFlowSubPostRequestHandler.php',
            itemConditionPostURL: 'http://172.16.2.69/tpcrequesthandlers/ItemConditionPostRequestHandler.php',
            sectionURL: 'http://172.16.2.69/tpc/GetSection.php',
            processFlowURL: 'http://172.16.2.69/tpc/GetProcessFlow.php',
            keyProcessURL: 'http://172.16.2.69/tpc/GetKeyProcess.php',
            subProcessURL: 'http://172.16.2.69/tpc/GetSubProcess.php',
            processFlowSubURL: 'http://172.16.2.69/tpc/requestProcessFlowSub.php',
            itemConditionURL: 'http://172.16.2.69/tpcrequesthandlers/ItemConditionRequestHandler.php',

            CCILotRequestURL: 'http://172.16.2.69/tpc/HandleCCILotRequest.php',
            CCIPoRequestURL: 'http://172.16.2.69/tpc/HandleCCIPoRequest.php',
            CCICustomerDetailsURL: 'http://172.16.2.69/tpc/HandleCCICustomerDetails.php',
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
            customer_pn: '',
            order_quantity: 0,
            customer_name: '',
            delivery_date: '',
            jo_number: '',
            date_issued: '',

            hasAttachment: 0,
            hasInstruction: 0,

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
        this.itemCondition = [];

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
       attachmentSwitch(){
        const switchValue = this.$refs.attachment.checked;
            if(switchValue === false){
                this.hasAttachment = 0;
            } else {
                this.hasAttachment = 1;
            }
        console.log(this.hasAttachment);
       },
       instructionSwitch(){
            //still planning
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
        this.revision_number = '';
        let latestRevNo = -1;
        for(const flow of this.processFlow){
            if(parseInt(section_id) === parseInt(flow.section_id) && parts_number === flow.item_parts_number && item_code === flow.item_code && flow.flow_status === 'Posted'){
                if(flow.revision_number > latestRevNo){
                    latestRevNo = flow.revision_number;
                    this.revision_number = latestRevNo;
                    this.flow_main_id = flow.flow_main_id;

                    axios.get(this.processFlowSubURL,{
                        method: 'GET',
                        headers: {
                            'Content-type': 'application/x-www-form-urlencoded'
                        },
                        params: {
                            section_id: section_id,
                            parts_number: parts_number,
                            flow_main_id: flow.flow_main_id,
                            revision_number: this.revision_number
                        }
                    }).then(response => {
                        for(const flowSub of response.data){
                            for(const key of this.keyProcess){
                                if(flowSub.Pid === parseInt(key.Pid)){
                                    Object.assign(flowSub, {Pname: key.Pname});
                                    for(const sub of this.subProcess){
                                        if(flowSub.SubPid === parseInt(sub.SubPid)){
                                            Object.assign(flowSub, {
                                                SubPname: sub.SubPname,
                                                process_type: sub.process_type,
                                                status: 'Active'
                                            });
                                            console.log(flowSub);
                                            axios.get(this.itemConditionURL, {
                                                method: 'GET',
                                                headers: {
                                                    'Content-type': 'application/x-www-form-urlencoded'
                                                },
                                                params: {
                                                    SubPid: sub.SubPid
                                                }
                                            }).then(response => {
                                                for(const item of response.data){
                                                    this.itemCondition.push(item);
                                                    this.itemCondition.sort((a, b) => a.sequence_number - b.sequence_number);
                                                }
                                            }).catch(error => {
                                                console.log(error);
                                            });
                                        }
                                    }
                                }
                            }
                            this.processFlowSub.push(flowSub)
                        }
                        // this.processFlowSub.sort((a,b) => a.sequence_number - b.sequence_number);
                    }).catch(error => {
                        console.log(error);
                    });
                }
            }
            
        }
        
       },

       toggleItemCondition(SubPid){
            this.toggle[SubPid] = !this.toggle[SubPid];
       },

       async generateCCICustomerDetails(parts_number, po_number){
            if(this.section_code === 'CCI'){
                axios.get(this.CCICustomerDetailsURL, {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    },
                    params: {
                        po_number: po_number,
                        parts_number: parts_number
                    }
                }).then(response => {
                    for(const details of response.data){
                        this.customer_name = details.customer1;
                        this.customer_pn = details.p_n_2;
                        this.order_quantity = details.qty;
                        this.delivery_date = details.request_del;
                    }
                }).catch(error => {
                    console.log(error);
                })
            } else {
                this.customer_name = '',
                this.customer_pn = '';
                this.order_quantity = 0;
                this.delivery_date = '';
            }
       },
       processFlowSubStatus(flow_sub_id){
        const status = document.getElementById(`processFlowSub${flow_sub_id}`).checked;
        for(const flowSub of this.processFlowSub){
            if(flow_sub_id === flowSub.flow_sub_id){
                for(const item of this.itemCondition){
                    if(flowSub.SubPid === item.SubPid){
                        const itemEl = document.getElementById(`itemCondition${item.item_id}`);
                        if(status === false){
                            flowSub.status = 'Inactive';
                            item.status = 'Inactive';
                            itemEl.checked = false;
                            itemEl.disabled = true;
                        } else {
                            flowSub.status = 'Active';
                            item.status = 'Active';
                            itemEl.checked = true;
                            itemEl.disabled = false;
                        }
                    }
                }
            }
        }
       },
       itemConditionStatus(item_id){
        const status = document.getElementById(`itemCondition${item_id}`).checked;
        for(const item of this.itemCondition){
            if(item_id === item.item_id){
                if(status === false){
                    item.status = 'Inactive';
                } else {
                    item.status = 'Active';
                }
            }
        }
       },
       async submitFormAssignment(){
        console.log(this.processFlowSub);
                await axios.post(this.formAssignmentPostURL, {
                    assignment_id: this.formAssignmentId,
                    section_id: this.section_id,
                    lot_number: this.lot_number,
                    po_number: this.po_number,
                    parts_number: this.parts_number,
                    quantity: this.order_quantity,
                    delivery_date: this.delivery_date? this.delivery_date: null,
                    jo_number: this.jo_number,
                    revision_number: this.revision_number,
                    date_issued: this.date_issued,
                    assigned_by: this.assigned_by,
                    date_created: this.date_created,
                    wafer_number_from: this.wafer_number_from,
                    wafer_number_to: this.wafer_number_to,
                    item_code: this.item_code,
                    assignment_status: this.form_status,
                    has_attachment: this.hasAttachment,
                    has_instruction: this.hasInstruction
                }).then(response => {
                    if(response.data.message === 'Form Assignment inserted successfully'){
                        for(const flowSub of this.processFlowSub){
                            axios.post(this.formAssignmentItemPostURL, {
                                assignment_id: this.formAssignmentId,
                                sequence_number: flowSub.sequence_number,
                                Pid: flowSub.Pid,
                                SubPid: flowSub.SubPid,
                                standard_time: flowSub.standard_time,
                                machine_time: flowSub.machine_time,
                                assignment_status: flowSub.status
                            }).then(response => {
                                if(response.data.message === 'Process Flow Sub inserted successfully'){
                                    for(const item of this.itemCondition){
                                        console.log(response.data);
                                        axios.post(this.itemConditionPostURL, {
                                            assignment_id: this.formAssignmentId,
                                            sequence_number: item.sequence_number,
                                            SubPid: item.SubPid,
                                            detail_description: item.detail_description,
                                            field_type: item.field_type,
                                            min_value: item.min_value,
                                            max_value: item.max_value,
                                            typical_value: item.typical_value,
                                        }).then(response => {
                                            console.log(response.data);
                                        }).catch(error => {
                                            console.log(error);
                                        });
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