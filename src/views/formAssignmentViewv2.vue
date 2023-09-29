
<template>
    <div class="row col-md-12 col-sm-12 mx-auto p-3 px-5">
        <div class="col-md-6">
            <h3>Tablet Process Card - <em>Form Assignment</em></h3>
          </div>
          <div class="col-md-3 float-end">
            <button class="btn btn-outline-info w-100 float-end" data-bs-toggle="modal" data-bs-target="#createForm" @click="newFormAssignment"><span class=" align-bottom material-symbols-outlined">add</span>Create</button>
          </div>
          <div class="col-md-3">
            <button class="btn btn-outline-info w-100 float-end" type="button" data-bs-toggle="collapse" data-bs-target="#collapseWidthExample" aria-expanded="false" aria-controls="collapseWidthExample">
                View Form Assignments Archive
              </button>
          </div>
    </div>

    <div class="col-md-6 mx-auto ">
        <div class="form-floating mb-3">
            <input type="text" class="form-control" id="floatingInput" v-model="search" @input="querySearch(search)">
            <label for="floatingInput">Form Assignment Search</label>
        </div>
    </div>
    <div class="table-responsive border rounded p-3">
        <table class="table">
            <thead>
                <tr>
                    <th>No.</th>
                    <th>Status</th>
                    <th>Section</th>
                    <th>Lot No.</th>
                    <th>Parts No.</th>
                    <th>Item Code</th>
                    <th>Quantity Ordered</th>
                    <th>Delivery Date</th>
                    <th>JO No.</th>
                    <th>Revision No.</th>
                    <th>Wafer No. From</th>
                    <th>Wafer No. To</th>
                    <th>Assigned By</th>
                    <th>Date Created</th>
                    <th>Date Issued</th>
                    <th>View</th>
                </tr>
            </thead>
            <tbody>
                <template v-for="form in fetchForm">
                    <tr>
                        <td>{{form.assignment_id}}</td>
                        <td>{{form.assignment_status}}</td>
                        <td>{{form.section_code}}</td>
                        <td>{{form.lot_number}}</td>
                        <td>{{form.item_parts_number}}</td>
                        <td>{{form.item_code}}</td>
                        <td>{{form.quantity}}</td>
                        <td>{{form.delivery_date ? form.delivery_date : '-'}}</td>
                        <td>{{form.jo_number ? form.jo_number : '-'}}</td>
                        <td>{{form.revision_number}}</td>
                        <td>{{form.wafer_number_from}}</td>
                        <td>{{form.wafer_number_to}}</td>
                        <td>{{form.assigned_by}}</td>
                        <td>{{form.date_created}}</td>
                        <td>{{form.date_issued}}</td>
                        <td>
                            <button data-bs-toggle="modal" data-bs-target="#viewForm" class="btn w-100"><span class="material-symbols-outlined">visibility</span></button>
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>
    </div>

    <div class="collapse collapse-horizontal show" id="collapseWidthExample">
        <div class="table-responsive px-5 pt-5">
            <DataTable
                :data="formAssignment"
                :columns="columns"
                class="display table"
                @click="getData"
                :options="tableOptions"
            />
        </div>
    </div>
    
    

    <div class="modal fade" id="createForm" tabindex="-1" aria-labelledby="createFormAssignment" aria-hidden="true">
        <div class="modal-dialog modal-fullscreen">
          <div class="modal-content">
            <div class="modal-body">
                <div class="col-md-12 row">
                    <div class="col-xl-4 col-lg-6 mx-auto row h-100 sticky-top">
                        <div class="col-lg-6 col-xl-4 p-2">
                            <button ref="new" class="btn btn-outline-primary w-100" @click="newFormAssignment" disabled>New</button>
                        </div>
                        <div class="col-lg-6 col-xl-4 p-2">
                            <button ref="save" class="btn btn-outline-primary w-100" @click="submitFormAssignment">Save</button>
                        </div>
                        <div class="col-lg-6 col-xl-4 p-2">
                            <button class="btn btn-outline-primary w-100 h-100" data-bs-dismiss="modal">Close</button>
                        </div>
                        <div class="col-lg-6 col-xl-4 p-2">
                            <button class="btn btn-outline-primary w-100 h-100" disabled>View QR Code</button>
                        </div>
                        <div class="col-lg-6 col-xl-4 p-2">
                            <button class="btn btn-outline-primary w-100 h-100" disabled>Special Instructions</button>
                        </div>
                        <div class="col-lg-6 col-xl-4 p-2">
                            <button class="btn btn-outline-primary w-100 h-100" disabled>Attachments</button>
                        </div>
                        <hr>
                        <div class="col-md-6">
                            <div class="form-check form-switch">
                                <input ref="instruction" class="form-check-input" @change="instructionSwitch" type="checkbox" role="switch" id="special_instruction">
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
                            <input type="text" class="form-control" v-model="form_status" id="status" disabled>
                        </div>
                        <div class="col-md-4 p-2">
                            <label for="assigned_by">Assigned By:</label>
                            <input type="text" class="form-control" v-model="assigned_by" id="assigned_by" disabled>
                        </div>
                        <div class="col-md-4 p-2">
                            <label for="date_created">Date Created:</label>
                            <input type="text" class="form-control" v-model="date_created" id="date_created" disabled>
                        </div>
                        <hr>
                        <div class="col-xl-2 col-lg-4 p-2">
                            <label for="section_code">Section:</label>
                            <select ref="section" id="section_code" class="form-select" v-model="section_id" @change="generatePartsNumber(section_id)">
                                <option v-for="sec in section" :value="sec.section_id">{{sec.section_code}}</option>
                            </select>
                        </div>
                        <div class="col-xl-5 col-lg-4 p-2">
                            <label  for="parts_number">Parts Number: </label>
                            <input ref="parts_number" list="parts_number_list" type="text" id="parts_number" v-model="parts_number" class="form-select" autocomplete="off" @input="generateSectionRequest(section_id, parts_number)">
                            <datalist id="parts_number_list">
                                <option v-for="pn in partsNumber" :value="pn.parts_number">{{pn.parts_number}}</option>
                            </datalist>
                        </div>
                        <div class="col-xl-5 col-lg-4 p-2">
                            <label for="lot_number">Lot Number: </label>
                            <select ref="lot_number" id="lot_number" class="form-select" v-model="lot_number" @change="generateQuantity">
                                <option v-for="ln in lotNumber" :value="ln.lot_number">{{ln.lot_number}}</option>
                            </select>
                        </div>
                        <div class="col-md-6 p-2">
                            <label  for="wafer_no_from">Wafer Number From:</label>
                            <input ref="wafer_no_from" id="wafer_no_from" type="number" class="form-control" v-model="wafer_number_from">
                        </div>
                        <div class="col-md-6 p-2">
                            <label  for="wafer_no_to">Wafer Number To:</label>
                            <input ref="wafer_no_to" id="wafer_no_to" type="number" class="form-control" v-model="wafer_number_to">
                        </div>
                        <div v-if="section_code === 'CCI'" class="col-md-6 p-2">
                            <label for="po_number">PO Number: </label>
                            <input ref="po_number" list="po_number_list" @input="generateCCICustomerDetails(parts_number, po_number)" type="text" id="po_number" v-model="po_number" class="form-select" autocomplete="off" >
                            <datalist id="po_number_list">
                                <option v-for="po in poNumber" :value="po.po_number">{{po.po_number}}</option>
                            </datalist>
                        </div>
                        <div v-if="section_code === 'CCI'" class="col-md-6 p-2">
                            <label for="order_pn">Order PN:</label>
                            <input ref="order_pn" type="text" id="order_pn" class="form-control">
                        </div>
                        <div class="col-xl-6 col-lg-6 p-2">
                            <label for="item_code">Item Code:</label>
                            <input ref="item_code" @input="generateRevisionNumber(section_id, parts_number, item_code)" list="item_code_list" type="text" id="item_code" class="form-select" v-model="item_code" autocomplete="off">
                            <datalist id="item_code_list">
                                <option v-for="ic in itemCode" :value="ic.item_code">{{ic.item_code}}</option>
                            </datalist>
                        </div>
                        <div v-if="section_code === 'CCI'" class="col-xl-6 col-lg-6 p-2">
                            <label for="material_lot_number">Material Lot Number:</label>
                            <input type="text" id="material_lot_number" class="form-control" disabled>
                        </div>
                        <div v-else class="col-xl-6 col-lg-6 p-2">
                            <label for="material_lot_number">Material Lot Number:</label>
                            <input ref="material_lot_number" type="text" id="material_lot_number" v-model="material_lot_number" class="form-control">
                        </div>
                        <div v-if="section_code ==='CCI'" class="col-md-3 p-2">
                            <label for="customer_pn">Customer PN:</label>
                            <input id="customer_pn" type="text" v-model="customer_pn" class="form-control" disabled>
                        </div>
                        <div v-if="section_code ==='CCI'" class="col-md-6 p-2">
                            <label for="customer_name">Customer Name:</label>
                            <input id="customer_name" type="text" v-model="customer_name" class="form-control" disabled>
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
                            <input id="jo_number" ref="jo_number" type="text" v-model="jo_number" class="form-control">
                        </div>
                        <div class="col-md-6 p-2">
                            <label for="revision_number">Revision Number: </label>
                            <input type="text" id="revision_number" v-model="revision_number" class="form-control" disabled>
                        </div>
                        <div class="col-md-6 p-2">
                            <label for="date_issued">Date Issued: </label>
                            <input ref="date_issued" type="date" v-model="date_issued" id="date_issued" class="form-control">
                        </div>
                    </div>
    
                    <div class="col-xl-8 col-lg-6 border rounded table-responsive">
                        <div class="row mx-auto p-2 text-center" v-if="section_code !== ''">
                            <p class="fs-4"><em><strong>{{section_description}}</strong></em> - <strong>PROCESS FLOW ASSIGNMENT</strong></p>
                        </div>
                        <div class="progress" role="progressbar" aria-label="Default striped example" aria-valuenow="{{conditionLoader}}" aria-valuemin="0" aria-valuemax="100">
                            <div class="progress-bar progress-bar-striped" :style="'width: '+conditionLoader+'%'"></div>
                        </div>
                        <hr>
                        <table class="table ">
                            <thead>
                                <tr>
                                    <th>Seq No.</th>
                                    <th>Key Process</th>
                                    <th>Sub Process</th>
                                    <th>Process Type</th>
                                    <th style="width: 6%">Standard Time</th>
                                    <th style="width: 6%">Machine Time</th>
                                    <th>Sampling</th>
                                    <th>Uncontrolled</th>
                                    <th style="width: 12%">Batching Type</th>
                                    <th style="width: 10%">Result Type</th>
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
                                        <td>
                                            <div class="form-check form-switch">
                                                <input 
                                                ref="sampling"
                                                class="form-check-input" 
                                                @change="samplingStatus(flowSub.flow_sub_id)" 
                                                :id="'sampling'+flowSub.flow_sub_id" 
                                                type="checkbox" 
                                                role="switch" 
                                                :checked="flowSub.check_sampling_status"
                                                >
                                            </div>
                                        </td>
                                        <td>
                                            <div class="form-check form-switch">
                                                <input 
                                                ref="uncontrolled"
                                                class="form-check-input" 
                                                @change="uncontrolledStatus(flowSub.flow_sub_id)" 
                                                :id="'uncontrolled'+flowSub.flow_sub_id" 
                                                type="checkbox" 
                                                role="switch" 
                                                :checked="flowSub.check_uncontrolled_status"
                                                >
                                            </div>
                                        </td>
                                        <td>
                                            <select ref="batching" class="form-select" :id="'batching'+flowSub.flow_sub_id" v-model="flowSub.batching_type">
                                                <option value="Standard">Standard</option>
                                                <option value="Parallel">Parallel</option>
                                            </select>
                                        </td>
                                        <td>
                                            <select ref="result" class="form-select" :id="'result'+flowSub.flow_sub_id" v-model="flowSub.result_type">
                                                <option value="Chips">Chips</option>
                                                <option value="Wafer">Wafer</option>
                                            </select>
                                        </td>
                                        <td>
                                            <div class="form-check form-switch">
                                                <input ref="item_status" :id="'processFlowSub'+flowSub.flow_sub_id" @change="processFlowSubStatus(flowSub.flow_sub_id)" class="form-check-input" type="checkbox" role="switch" :checked="flowSub.sub_status_checked">
                                                <label class="form-check-label" :for="'processFlowSub'+flowSub.flow_sub_id" :id="'processFlowSubLabel'+flowSub.flow_sub_id">
                                                    <span>{{flowSub.sub_status}}</span>
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
                                        <td colspan="12">
                                            <div class="p-3">
                                                <table class="table table-responsive">
                                                    <thead>
                                                        <tr>
                                                            <th><small>No.</small></th>
                                                            <th><small>Process Detail Description</small></th>
                                                            <th><small>Typical Value</small></th>
                                                            <th><small>Minimum Value</small></th>
                                                            <th><small>Maximum Value</small></th>
                                                            <th><small>Target Value Visibility </small></th>
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
                                                                        <input ref="visibility_status" :id="'visibility'+item.item_id" @change="visibilityStatus(item.item_id)" class="form-check-input" type="checkbox" role="switch" :checked="item.visibility_checked">
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div class="form-check form-switch">
                                                                        <input ref="condition_status" :id="'itemCondition'+item.item_id" @change="itemConditionStatus(item.item_id)" class="form-check-input" type="checkbox" role="switch" :checked="item.status_checked">
                                                                        <label class="form-check-label" :for="'itemCondition'+item.item_id" :id="'itemConditionLabel'+item.item_id">
                                                                            <span>{{item.status}}</span>
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

      <div class="modal fade" id="viewForm" tabindex="-1" aria-labelledby="viewFormAssignment" aria-hidden="true">
        <div class="modal-dialog modal-fullscreen">
          <div class="modal-content">
            <div class="modal-body">
                <div class="col-md-12 row">
                    <div class="col-md-4 mx-auto row h-100 sticky-top align-items-center">
                        <div class="col-md-4 p-2">
                            <button ref="viewDeleteBtn" @click="deleteFormAssignment" data-bs-dismiss="modal" class="btn btn-outline-primary w-100" >Delete</button>
                        </div>
                        <div class="col-md-4 p-2">
                            <button ref="viewSaveBtn" @click="updatePosting" class="btn btn-outline-primary w-100" >Save</button>
                        </div>
                        <div class="col-md-4 p-2">
                            <button class="btn btn-outline-primary w-100" data-bs-dismiss="modal">Close</button>
                        </div>
                        <div class="col-md-4 p-2">
                            <button ref="viewQRCode" class="btn btn-outline-primary w-100" @click="generateQrCode" data-bs-dismiss="modal">View QR Code</button>
                        </div>
                        <div class="col-md-4 p-2">
                            <button ref="viewInstructionBtn" @click="routeViewInstruction" class="btn btn-outline-primary w-100" disabled>Special Instructions</button>
                        </div>
                        <div class="col-md-4 p-2">
                            <button ref="viewAttachmentBtn" @click="routeViewAttachment" data-bs-dismiss="modal" class="btn btn-outline-primary w-100" disabled>Attachments</button>
                        </div>
                        
                        <hr>
                        <div class="col-md-9">
                            <p class="fs-5">Form Assignment No. : <strong>{{viewForm_Id}}</strong></p> 
                        </div>
                        <hr>
                        <div class="col-md-6">
                            <div class="form-check form-switch">
                                <input ref="viewInstruction" class="form-check-input" type="checkbox" role="switch" id="viewSpecial_instruction" disabled>
                                <label class="form-check-label" for="viewSpecial_instruction">Special Instruction</label>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-check form-switch">
                                <input ref="viewAttachment" class="form-check-input" type="checkbox" role="switch" id="viewAttachment" disabled>
                                <label class="form-check-label" for="viewAttachment">Attachment</label>
                            </div>
                        </div>
                        <div class="col-md-4 p-2">
                            <label for="viewStatus">Form Status:</label>
                            <select @change="posting" ref="viewStatus" id="viewStatus" class="form-select" v-model="viewStatus">
                                <option value="Posted">Posted</option>
                                <option value="Unposted">Unposted</option>
                            </select>
                        </div>
                        <div class="col-md-4 p-2">
                            <label for="status">Assigned By:</label>
                            <input type="text" class="form-control" v-model="viewAssigned_by" disabled>
                        </div>
                        <div class="col-md-4 p-2">
                            <label for="status">Date Created:</label>
                            <input type="text" class="form-control" v-model="viewDate_Created" disabled>
                        </div>
                        <hr>
                        <div class="col-md-2 p-2">
                            <label for="viewSection_code">Section:</label>
                            <input id="viewSection_code" type="text" class="form-select" v-model="viewSection_Code" disabled>
                        </div>
                        <div class="col-md-5 p-2">
                            <label for="viewparts_number">Parts Number: </label>
                            <input type="text" id="viewparts_number" v-model="viewParts_Number" class="form-select" disabled>
                        </div>
                        <div class="col-md-5 p-2">
                            <label for="viewlot_number">Lot Number: </label>
                            <input id="viewlot_number" type="text" class="form-select" v-model="viewLot_Number" disabled>
                        </div>
                        <div class="col-md-6 p-2">
                            <label for="viewwafer_no_from">Wafer Number From:</label>
                            <input id="viewwafer_no_from" type="number" class="form-control" v-model="viewWafer_number_from" disabled>
                        </div>
                        <div class="col-md-6 p-2">
                            <label for="viewwafer_no_to">Wafer Number To:</label>
                            <input id="viewwafer_no_to" type="number" class="form-control" v-model="viewWafer_number_to" disabled>
                        </div>
                        <div v-if="viewSection_Code === 'CCI'" class="col-md-6 p-2">
                            <label for="viewpo_number">PO Number: </label>
                            <input type="text" id="viewpo_number" v-model="viewPo_Number" class="form-select" disabled>
                        </div>
                        <div v-if="viewSection_Code === 'CCI'" class="col-md-6 p-2">
                            <label for="vieworder_pn">Order PN:</label>
                            <input type="text" id="vieworder_pn" class="form-control" v-model="viewOrder_Pn" disabled>
                        </div>
                        <div class="col-md-8 p-2">
                            <label for="viewitem_code">Item Code:</label>
                            <input type="text" id="viewitem_code" class="form-select" v-model="viewItem_Code" disabled>
                        </div>
                        <div class="col-md-4 p-2">
                            <label for="viewmaterial_lot_number">Material Lot Number:</label>
                            <input type="text" id="viewmaterial_lot_number" class="form-control" disabled>
                        </div>
                        <div v-if="viewSection_Code ==='CCI'" class="col-md-3 p-2">
                            <label for="viewcustomer_pn">Customer PN:</label>
                            <input type="text" id="viewcustomer_pn" v-model="viewCustomer_Pn" class="form-control" disabled>
                        </div>
                        <div v-if="viewSection_Code ==='CCI'" class="col-md-6 p-2">
                            <label for="viewcustomer_name">Customer Name:</label>
                            <input type="text" id="viewcustomer_name" v-model="viewCustomer_Name" class="form-control" disabled>
                        </div>
                        <div v-if="viewSection_Code ==='CCI'" class="col-md-3 p-2">
                            <label for="viewdelivery_date">Delivery Date:</label>
                            <input type="text" v-model="viewDelivery_Date" id="viewdelivery_date" class="form-control" disabled>
                        </div>
                        <div class="col-md-4 p-2">
                            <label for="vieworder_quantity">Order Quantity:</label>
                            <input type="text" v-model="viewQuantity" id="vieworder_quantity" class="form-control" disabled>
                        </div>
                        <div class="col-md-8 p-2">
                            <label for="viewjo_number">JO number: </label>
                            <input type="text" id="viewjo_number" v-model="viewJo_Number" class="form-control" disabled>
                        </div>
                        <div class="col-md-6 p-2">
                            <label for="viewrevision_number">Revision Number: </label>
                            <input type="text" id="viewrevision_number" v-model="viewRevision_Number" class="form-control" disabled>
                        </div>
                        <div class="col-md-6 p-2">
                            <label for="viewdate_issued">Date Issued: </label>
                            <input type="text" v-model="viewDate_Issued" id="viewdate_issued" class="form-control" disabled>
                        </div>
                    </div>
    
                    <div class="col-md-8 border rounded">
                        <div class="col-md-12 row align-items-center">
                            <p class="fs-5 p-3">PROCESS FLOW ASSIGNMENT</p>
                            <p class="fs-3 text-center" v-if="viewSection_Code !== ''"><em>{{viewSection_Description}}</em></p>
                        </div>
                        <hr>
                        <table class="table table-responsive">
                            <thead>
                                <tr>
                                    <th>Seq No.</th>
                                    <th>Key Process</th>
                                    <th>Sub Process</th>
                                    <th>Process Type</th>
                                    <th style="width: 5%;">Standard Time</th>
                                    <th style="width: 5%;">Machine Time</th>
                                    <th>Sampling</th>
                                    <th>Uncontrolled</th>
                                    <th style="width: 10%">Batching Type</th>
                                    <th style="width: 10%">Result Type</th>
                                    <th>Status</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <template v-for="item in viewItem" :key="item.assignment_item_id">
                                    <tr>
                                        <td>{{item.sequence_number}} .</td>
                                        <td>{{item.Pname}}</td>
                                        <td>{{item.SubPname}}</td>
                                        <td>{{item.process_type}}</td>
                                        <td>{{parseFloat(item.Stdtime).toFixed(2)}}</td>
                                        <td>{{parseFloat(item.Machtime).toFixed(2)}}</td>
                                        <td>
                                            <div class="form-check form-switch">
                                                <input 
                                                class="form-check-input"  
                                                @change="viewSamplingSwitch(item.assignment_item_id)" 
                                                :id="'viewSampling'+item.assignment_item_id" 
                                                type="checkbox" 
                                                role="switch" 
                                                :checked="item.sampling_status"
                                                :disabled="viewStatus === 'Posted'"
                                                >
                                            </div>
                                        </td>
                                        <td>
                                            <div class="form-check form-switch">
                                                <input 
                                                class="form-check-input"
                                                @change="viewUncontrolledSwitch(item.assignment_item_id)"
                                                :id="'viewUncontrolled'+item.assignment_item_id" 
                                                type="checkbox" 
                                                role="switch" 
                                                :checked="item.uncontrolled_status"
                                                :disabled="viewStatus === 'Posted'"
                                                >
                                            </div>
                                        </td>
                                        <td>    
                                            <select class="form-select" :id="'batching'+item.SubPid" v-model="item.batching_type" :disabled="viewStatus === 'Posted'">
                                                <option value="Standard">Standard</option>
                                                <option value="Parallel">Parallel</option>
                                            </select>
                                        </td>
                                        <td>    
                                            <select class="form-select" :id="'batching'+item.SubPid" v-model="item.result_type" :disabled="viewStatus === 'Posted'">
                                                <option value="Chips">Chips</option>
                                                <option value="Wafer">Wafer</option>
                                            </select>
                                        </td>
                                        <td>
                                            <div class="form-check form-switch">
                                                <input :id="'item'+item.assignment_item_id" class="form-check-input" @change="viewStatusSwitch(item.assignment_item_id)" type="checkbox" role="switch" :checked="item.assignment_status" :disabled="viewStatus === 'Posted'">
                                                <label :for="'item'+item.assignment_item_id">{{ item.assignment_status === true ? 'Active' : 'Inactive'}}</label>
                                            </div>
                                        </td>
                                        <td>
                                            <button @click="toggleItemCondition(item.SubPid)" class="btn">
                                                <span class="material-symbols-outlined">
                                                    {{ toggle[item.SubPid]? 'expand_less' : 'expand_more' }}
                                                </span>
                                            </button>
                                        </td>
                                    </tr>
                                    <tr v-show="toggle[item.SubPid]">
                                        <td colspan="12">
                                            <div class="p-3">
                                                <table class="table table-responsive">
                                                    <thead>
                                                        <tr>
                                                            <th><small>No.</small></th>
                                                            <th><small>Process Detail Description</small></th>
                                                            <th><small>Typical Value</small></th>
                                                            <th><small>Minimum Value</small></th>
                                                            <th><small>Maximum Value</small></th>
                                                            <th><small>Target Value Visibility</small></th>
                                                            <th><small>Condition Status</small></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <template v-for="itemCondition in viewItemCondition" :key="itemCondition.condition_item_id">
                                                            <tr v-if="item.SubPid == itemCondition.SubPid">
                                                                <td><small>{{itemCondition.sequence_number}} .</small></td>
                                                                <td><small>{{itemCondition.detail_description}}</small></td>
                                                                <td><small>{{itemCondition.typical_value}}</small></td>
                                                                <td>{{itemCondition.min_value}}</td>
                                                                <td>{{itemCondition.max_value}}</td>
                                                                <td>
                                                                    <div class="form-check form-switch">
                                                                        <input :id="'visibility'+itemCondition.condition_item_id" class="form-check-input" type="checkbox" role="switch" :checked="itemCondition.visibility_status" disabled>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div class="form-check form-switch">
                                                                        <input :id="'itemCondition'+itemCondition.condition_item_id" class="form-check-input" type="checkbox" role="switch" :checked="itemCondition.condition_status" disabled>
                                                                        <label v-if="itemCondition.condition_status === true" :for="'itemCondition'+itemCondition.condition_item_id">Active</label>
                                                                        <label v-else :for="'itemCondition'+itemCondition.condition_item_id">Inactive</label>
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
    import DataTablesCore from 'datatables.net-bs5';
    import DataTable from 'datatables.net-vue3';
    import 'datatables.net-responsive';
    import 'datatables.net-select';
    import axios from 'axios';
    import * as bootstrap from 'bootstrap';
    DataTable.use(DataTablesCore);
    export default {
    components: {
        DataTable,
    },
    data() {
        return {
            formAssignmentURL: 'http://172.16.2.13/tpc-endpoint/GetFormAssignment.php',
            formAssignmentPostURL: 'http://172.16.2.13/tpc-endpoint/PostFormAssignment.php',
            formAssignmentItemPostURL: 'http://172.16.2.13/tpc-endpoint/PostFormAssignmentItem.php',
            itemConditionPostURL: 'http://172.16.2.13/tpc-endpoint/PostFormAssignmentItemCondition.php',
            sectionURL: 'http://172.16.2.13/tpc-endpoint/GetSection.php',
            processFlowURL: 'http://172.16.2.13/tpc-endpoint/GetProcessFlow.php',
            keyProcessURL: 'http://172.16.2.13/tpc-endpoint/GetKeyProcess.php',
            subProcessURL: 'http://172.16.2.13/tpc-endpoint/GetSubProcess.php',
            processFlowSubURL: 'http://172.16.2.13/tpc-endpoint/requestProcessFlowSub.php',
            // itemConditionDetailsURL: 'http://172.16.2.60/tpcrequesthandlers/ItemConditionRequestHandler.php',
            itemConditionDetailsURL: 'http://172.16.2.13/tpc-endpoint/requestItemConditionFlow.php',
            StatusPostingURL: 'http://172.16.2.13/tpc-endpoint/PutFormAssignmentStatus.php',
            insertTPCMainURL: 'http://172.16.2.13/tpc-endpoint/PostTPCMain.php',

            DeleteFormURL: 'http://172.16.2.13/tpc-endpoint/DeleteForm.php',
            DeleteItemURL: 'http://172.16.2.13/tpc-endpoint/DeleteItem.php',
            DeleteItemConditionURL: 'http://172.16.2.13/tpc-endpoint/DeleteItemCondition.php',

            CCILotRequestURL: 'http://172.16.2.13/tpc-endpoint/HandleCCILotRequest.php',
            CCIPoRequestURL: 'http://172.16.2.13/tpc-endpoint/HandleCCIPoRequest.php',
            CCICustomerDetailsURL: 'http://172.16.2.13/tpc-endpoint/HandleCCICustomerDetails.php',
            POLRequestURL: 'http://172.16.2.13/tpc-endpoint/HandlePOLRequest.php',
            CWPRequestURL: 'http://172.16.2.13/tpc-endpoint/HandleCWPRequest.php',
            SWPRequestURL: 'http://172.16.2.13/tpc-endpoint/HandleSWPRequest.php',
            FormRequestURL: 'http://172.16.2.13/tpc-endpoint/requestFormAssignment.php',

            CWPQuantityURL: 'http://172.16.2.13/tpc-endpoint/GenerateCWPQuantity.php',
            POLQuantityURL: 'http://172.16.2.13/tpc-endpoint/GeneratePOLQuantity.php',
            SWPQuantityURL: 'http://172.16.2.13/tpc-endpoint/GenerateSWPQuantity.php',

            updateItemStatusURL: 'http://172.16.2.13/tpc-endpoint/PutFormAssignmentItemStatus.php',

            searchRequestURL: 'http://172.16.2.13/tpc-endpoint/requestSearchFormAssignment.php',

            itemURL: 'http://172.16.2.13/tpc-endpoint/GetItem.php',
            itemConditionURL: 'http://172.16.2.13/tpc-endpoint/GetItemCondition.php',
            
            alert: '',

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

            fetchForm: [],

            message: '',

            last_assignment_id: 0,
            form_status: 'Unposted',
            assigned_by: '3141',
            date_created: '',
            parts_number: '',
            section_id: '',
            lot_number: '',
            po_number: '',
            item_code: '',
            material_lot_number: '',
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

            viewHas_Attachment: '',
            viewHas_Instruction: '',
            viewSection_Id: '',
            viewSection_Code: '',
            viewSection_Description: '',
            viewForm_Id: '',
            viewStatus: '',
            viewAssigned_by: '',
            viewDate_Created: '',
            viewParts_Number: '',
            viewPo_Number: '',
            viewOrder_Pn: '',
            viewCustomer_name: '',
            viewCustomer_pn: '',
            viewQuantity: 0,
            viewDelivery_date:'',
            viewJo_Number: '',
            viewRevision_Number: '',
            viewDate_Issued: '',

            viewItem: [],
            viewItemConditon: [],

            conditionLoader: 0,

            section_code: '',
            flow_main_id: '',
            tableOptions: {
                order: [[0, 'desc']]
            },
            search: '',
            columns: [
              { title: 'Assign No.', data: 'assignment_id'},
              { title: 'Status', data: 'assignment_status' },
              { title: 'Section', data: 'section_code' },
              { title: 'Lot Number', data: 'lot_number' },
              { title: 'PO Number', data: 'po_number' },
              { title: 'Parts Number', data: 'item_parts_number' },
              { title: 'Item Code', data: 'item_code' },
              { title: 'Quantity Ordered', data: 'quantity' },
              { title: 'Delivery Date', data: 'delivery_date' },
              { title: 'JO Number', data: 'jo_number' },
              { title: 'Revision No.', data: 'revision_number' },
              { title: 'Wafer No From', data: 'wafer_number_from' },
              { title: 'Wafer No To', data: 'wafer_number_to' },
              { title: 'Assigned By', data: 'assigned_by' },
              { title: 'Date Created', data: 'date_created' },
              { title: 'Date Issued', data: 'date_issued' },
              { title: 'View', data: null, 
                orderable: false, 
                render: function (data) { 
                            return '<button data-bs-toggle="modal" data-bs-target="#viewForm" class="btn w-100"><span class="material-symbols-outlined">visibility</span></button'} 
                        },
            ],
            socket: '',
        }
    },
    methods: {
        querySearch(key){
            this.fetchForm = [];
            axios.get(this.searchRequestURL, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                params: {
                    key_word: key
                }  
            }).then(response => {
                for(const form of response.data){
                    for(const sec of this.section){
                        if(parseInt(form.section_id) === parseInt(sec.section_id)){
                            Object.assign(form, {section_code: sec.section_code});
                            this.fetchForm.push(form);
                        }
                    }
                }                
            }).catch(error => {
                console.log(error);
            })
        },
        viewSamplingSwitch(id){
            let status = document.getElementById(`viewSampling${id}`).checked;
            for(const item of this.viewItem){
                if(parseInt(id) === parseInt(item.assignment_item_id)){
                    item.sampling_status = status;
                    item.check_sampling = status ? "True" : "False";
                }
            }
        },
        viewUncontrolledSwitch(id){
            let status = document.getElementById(`viewUncontrolled${id}`).checked;
            for(const item of this.viewItem){
                if(parseInt(id) === parseInt(item.assignment_item_id)){
                    item.uncontrolled_status = status;
                    item.check_uncontrolled = status ? "True" : "False";
                }
            }
        },
        viewStatusSwitch(id){
            let status = document.getElementById(`item${id}`).checked;
            for(const item of this.viewItem){
                if(parseInt(id) === parseInt(item.assignment_item_id)){
                    item.assignment_status = status;
                    item.assignment_status_str = status ? "Active" : "Inactive";
                }
            }
        },
        generateQrCode(){
            this.$router.push({ name: 'GenerateQrCode', query: { assignment_id: this.viewForm_Id, item_code: this.viewItem_Code, parts_number: this.viewParts_Number, lot_number: this.viewLot_Number, date_issued: this.viewDate_Issued, revision_number: this.viewRevision_Number} });
        },
        routeViewAttachment(){
            this.$router.push({ name: 'formAttachments', query: { assignment_id: this.viewForm_Id} });
        },
        routeViewInstruction(){
           location.replace('http://172.16.2.13/SI-TPC/');
        },
        posting(){
            if(this.viewStatus === 'Posted'){
                this.$refs.viewDeleteBtn.disabled = true;
                this.$refs.viewSaveBtn.disabled = false;
            } else {
                this.$refs.viewDeleteBtn.disabled = false;
                this.$refs.viewSaveBtn.disabled = true;
            }
        },
        async updatePosting(){
            const toastLiveExample = document.getElementById('liveToast');
            const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
            const itemSub = this.viewItem.filter((item) => item.assignment_status == true).sort((a, b) => a.sequence_number - b.sequence_number).
            map((item, index) => {
              return Object.assign({}, item, { status: index === 0 ? 'Open' : 'Close' });
            });
            if(this.viewStatus === 'Posted'){
                await axios.put(this.StatusPostingURL, {
                    assignment_status: this.viewStatus,
                    assignment_id: this.viewForm_Id,
                }).then(response => {
                    if(response.data.message === 'Form Assignment Status updated successfully'){
                        this.alert = `Form Assignment: ${this.viewForm_Id} has been posted to our system and is now available for processing in TPC Main`;
                        toastBootstrap.show();
                        for(const form of this.formAssignment){
                            if(parseInt(form.assignment_id) === parseInt(this.viewForm_Id)){
                                form.assignment_status = 'Posted';
                                for(const item of itemSub){
                                    axios.post(this.insertTPCMainURL, {
                                        assignment_id: this.viewForm_Id,
                                        section_id: this.viewSection_Id,
                                        sequence_number: item.sequence_number,
                                        SubPid: item.SubPid,
                                        parts_number: this.viewParts_Number,
                                        item_code: this.viewItem_Code,
                                        revision_number: this.viewRevision_Number,
                                        lot_number: this.viewLot_Number,
                                        item_status: item.status,
                                        sampling: item.check_sampling,
                                        uncontrolled: item.check_uncontrolled,
                                        date_issued: this.viewDate_Issued,
                                        quantity: this.viewQuantity,
                                        batching_type: item.batching_type,
                                        result_type: item.result_type
                                    }).then(response => {
                                    }).catch(error => {
                                        console.log(error);
                                    });
                                }
                                for(const item of this.viewItem){
                                    axios.put(this.updateItemStatusURL, {
                                        item_status: item.assignment_status_str,
                                        check_sampling: item.check_sampling,
                                        check_uncontrolled: item.check_uncontrolled,
                                        batching_type: item.batching_type,
                                        result_type: item.result_type,
                                        assignment_item_id: item.assignment_item_id,
                                    }).then(response => {
                                    }).catch(error => {
                                        console.log(error);
                                    });
                                }
                            }
                        }
                        this.$refs.viewSaveBtn.disabled = true;
                        this.$refs.viewStatus.disabled = true;
                    }
                }).catch(error => {
                    console.log(error)
                });
            } else {
                this.alert = `Please check the status it must be posted`;
                toastBootstrap.show();
            }
            
        },
        generateQuantity(){
            this.order_quantity = 0;
            const params = 
                 {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    },
                    params: {
                        parts_number: this.parts_number,
                        lot_number: this.lot_number,
                    }
                 }
            if(this.section_code.split('-').includes('CWP')){
                axios.get(this.CWPQuantityURL, params)
                .then(response => {
                    for(const res of response.data){
                        this.material_lot_number = res.cwp_input_plan_lotno;
                        this.order_quantity = res.cwp_input_plan_wfr;
                    }
                }).catch(error => {
                    console.log(error);
                });
            } else if(this.section_code.split('-').includes('POL')){
                axios.get(this.POLQuantityURL, params)
                .then(response => {
                    let totalQuantity = 0;
                    for(const res of response.data){
                        this.material_lot_number = res.cwp_input_plan_pol_matLotno;
                        totalQuantity += parseInt(res.cwp_input_plan_pol_qty);
                        this.order_quantity = totalQuantity;
                    }
                }).catch(error => {
                    console.log(error);
                });
            } else if(this.section_code.split('-').includes('SWP')){
                axios.get(this.SWPQuantityURL, params)
                .then(response => {
                    for(const res of response.data){
                        this.material_lot_number = '-';
                        this.$refs.material_lot_number.disabled = true;
                        this.order_quantity = res.wafer_quantity;
                    }
                }).catch(error => {
                    console.log(error);
                });
            } else if(this.section_code.split('-').includes('CCI')){

            }
        },   
       async getData(){
        if(event.target.tagName == 'BUTTON'){
            const row = event.target.parentNode.parentNode;
            const cell = row.querySelector('td');
            this.viewForm_Id = cell.textContent;
        }
        if(event.target.tagName == 'SPAN'){
            const row = event.target.parentNode.parentNode.parentNode;
            const cell = row.querySelector('td');
            this.viewForm_Id = cell.textContent;
        }
        if(this.viewForm_Id){
            await axios.get(this.FormRequestURL, {
            method: 'GET',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
                assignment_id: this.viewForm_Id
            }  
            }).then(response => {
                for(const form of response.data){
                    this.viewStatus = form.assignment_status;
                    this.viewAssigned_by = form.assigned_by;
                    this.viewDate_Created = form.date_created; 
                    this.viewSection_Id = form.section_id;
                    this.viewParts_Number = form.item_parts_number;
                    this.viewLot_Number = form.lot_number;
                    this.viewWafer_number_from = form.wafer_number_from;
                    this.viewWafer_number_to = form.wafer_number_to;
                    this.viewItem_Code = form.item_code;
                    this.viewQuantity = form.quantity;
                    this.viewPo_Number = form.po_number;
                    this.viewOrder_Pn = form.order_pn;
                    this.viewJo_Number = form.jo_number;
                    this.viewRevision_Number = form.revision_number;
                    this.viewDate_Issued = form.date_issued;
                    this.viewHas_Attachment = form.attachment;
                    this.viewHas_Instruction = form.special_instruction;
                }
                for(const sec of this.section){
                    if(parseInt(this.viewSection_Id) === parseInt(sec.section_id) ){
                        this.viewSection_Description = sec.section_description;
                        this.viewSection_Code = sec.section_code;
                    }
                }
            }).catch(error => {
                console.log(error);
            });
            this.$refs.viewQRCode.disabled = (this.viewStatus === 'Unposted');
            this.$refs.viewDeleteBtn.disabled = (this.viewStatus === 'Posted');
        }

       
            if(this.viewSection_Code === 'CCI'){
             await axios.get(this.CCICustomerDetailsURL, {
                 method: 'GET',
                 headers: {
                     'Content-type': 'application/x-www-form-urlencoded'
                 },
                 params: {
                     po_number: this.viewPo_Number,
                     parts_number: this.viewParts_Number
                 }
             }).then(response => {
                 for(const details of response.data){
                     this.viewCustomer_Name = details.customer1;
                     this.viewCustomer_Pn = details.p_n_2;
                     this.viewQuantity = details.qty;
                     this.viewDelivery_Date = details.request_del;
                 }
             }).catch(error => {
                 console.log(error);
             })
         
             } else {
                 this.viewCustomer_Name = '',
                 this.viewCustomer_Pn = '';
                 this.viewDelivery_Date = '';
             }
             if(parseInt(this.viewHas_Attachment) === 1){
                this.$refs.viewAttachment.checked = true;
                this.$refs.viewAttachmentBtn.disabled = false;
             } else {
                this.$refs.viewAttachment.checked = false;
                this.$refs.viewAttachmentBtn.disabled = true;
             }
             if(parseInt(this.viewHas_Instruction) === 1){
                this.$refs.viewInstruction.checked = true;
                this.$refs.viewInstructionBtn.disabled = false;
             } else {
                this.$refs.viewInstruction.checked = false;
                this.$refs.viewInstructionBtn.disabled = true;
             }
             if(this.viewStatus === 'Posted'){
                this.$refs.viewStatus.disabled = true;
             } else {
                this.$refs.viewStatus.disabled = false;
             }

            await axios.get(this.itemURL,{
                method: 'GET',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                params: {
                    assignment_id: this.viewForm_Id
                }
            }).then(response => {
                this.viewItem = response.data;
                for(const item of this.viewItem){
                    for(const key of this.keyProcess){
                        if(parseInt(item.Pid) === parseInt(key.Pid)){
                            Object.assign(item, {Pname: key.Pname});
                        }
                    }
                    for(const sub of this.subProcess){
                        if(parseInt(item.SubPid) === parseInt(sub.SubPid)){
                            Object.assign(item, {SubPname: sub.SubPname, process_type: sub.process_type});
                        }        
                    }
                    Object.assign(item, {
                        sampling_status: item.check_sampling === 'True' ? true : false,
                        uncontrolled_status: item.check_uncontrolled === 'True' ? true : false 
                    });
                }
                this.viewItem.sort((a,b) => a.sequence_number - b.sequence_number).map((item) => {
                    if(item.assignment_status === 'Active'){
                        item.assignment_status = true;
                        item.assignment_status_str = 'Active';
                    } else {
                        item.assignment_status = false;
                        item.assignment_status_str = 'Inactive';
                    }
                });
            }).catch(error => {
                console.log(error);
            });
            await axios.get(this.itemConditionURL,{
                method: 'GET',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                params: {
                    assignment_id: this.viewForm_Id
                }
            }).then(response => {
                this.viewItemCondition = response.data;
                this.viewItemCondition.sort((a,b) => a.sequence_number - b.sequence_number).map((item) => { 
                    item.condition_status = item.condition_status === 'Active' ? true : false;
                    item.visibility_status = item.visibility_status === 1 ? true : false;
                    // if(item.condition_status === 'Active'){
                    //     item.condition_status = true;
                    // } else {
                    //     item.condition_status = false;
                    // }
                });
            }).catch(error => {
                console.log(error);
            });
       },
       async deleteFormAssignment(){
        const toastLiveExample = document.getElementById('liveToast');
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
        for(const condition of this.viewItemCondition){
            await axios.post(this.DeleteItemConditionURL, {
                assignment_id: condition.assignment_id
            }).then(response => {
            }).catch(error => {
                console.log(error);
            });
        }
        for(const item of this.viewItem){
            await axios.post(this.DeleteItemURL, {
                assignment_id: item.assignment_id
            }).then(response => {
            }).catch(error => {
                console.log(error);
            })
        }
        await axios.post(this.DeleteFormURL, {
            assignment_id: this.viewForm_Id
        }).then(response => {
            if(response.data.message === 'Form Assignment deleted successfully'){
                this.socket.send(`delete, ${this.viewForm_Id}`);
            }
        }).catch(error => {
            console.log(error);
        });
       },
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
       },
       instructionSwitch(){
            const switchValue = this.$refs.instruction.checked;
            if(switchValue === false){
                this.hasInstruction = 0;
            } else {
                this.hasInstruction = 1;
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
            if(parseInt(section_id) === parseInt(sec.section_id)){
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
                } else if(sec.section_code.split('-').includes('SWP') || sec.section_code.split('-').includes('CCD')){
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
                }
            }
        }
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
            for(const flowSub of response.data){
                console.log(flowSub);
                // console.log(this.revision_number);
                // console.log(this.flow_main_id);
                for(const key of this.keyProcess){
                    if(flowSub.Pid === parseInt(key.Pid)){
                        Object.assign(flowSub, {Pname: key.Pname});
                        for(const sub of this.subProcess){
                            if(flowSub.SubPid === parseInt(sub.SubPid)){
                                Object.assign(flowSub, {
                                    SubPname: sub.SubPname,
                                    process_type: sub.process_type,
                                    sub_status_checked: flowSub.sub_status === "Active" ? true : false,
                                    check_sampling_status: flowSub.check_sampling === "True" ? true: false,
                                    check_uncontrolled_status: flowSub.check_uncontrolled === "True" ? true: false,
                                });
                                
                            }
                        }
                    }
                }
                axios.get(this.itemConditionDetailsURL, {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    },
                    params: {
                        SubPid: flowSub.SubPid,
                        flow_main_id: this.flow_main_id
                    }
                }).then(response => {
                    for(const item of response.data){
                        Object.assign(item, {
                            visibility_checked: item.visibility_status === 1 ? true : false,
                            status: item.condition_status,
                            status_checked: item.condition_status === 'Active' ? true : false
                        });
                        this.itemCondition.push(item);
                        this.itemCondition.sort((a, b) => a.sequence_number - b.sequence_number);
                    }
                    console.log(this.itemCondition);
                }).catch(error => {
                    console.log(error);
                });
                this.processFlowSub.push(flowSub);
                this.processFlowSub.sort((a, b) => a.sequence_number - b.sequence_number);
            }
        }).catch(error => {
            console.log(error);
        });
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
       samplingStatus(flow_sub_id){
        let status = document.getElementById(`sampling${flow_sub_id}`).checked;
        for(const sub of this.processFlowSub){
            if(parseInt(flow_sub_id) === parseInt(sub.flow_sub_id)){
                sub.check_sampling_status = status;
                sub.check_sampling = status ? "True" : "False";
            }
        }
       },
       uncontrolledStatus(flow_sub_id){
        let status = document.getElementById(`uncontrolled${flow_sub_id}`).checked;
        for(const sub of this.processFlowSub){
            if(parseInt(flow_sub_id) === parseInt(sub.flow_sub_id)){
                sub.check_uncontrolled_status = status;
                sub.check_uncontrolled = status ? "True" : "False";
            }
        }
       },
       processFlowSubStatus(flow_sub_id){
        let status = document.getElementById(`processFlowSub${flow_sub_id}`).checked;
        for(const flowSub of this.processFlowSub){
            if(parseInt(flowSub.flow_sub_id) === parseInt(flow_sub_id)){
                if(status === true){
                    flowSub.sub_status_checked = true;
                    flowSub.sub_status = 'Active';
                } else { 
                    flowSub.sub_status_checked = false;
                    flowSub.sub_status = 'Inactive';
                }
                const itemWithSubPidExists = this.itemCondition.some(item => item.SubPid === flowSub.SubPid);
                if(itemWithSubPidExists){
                    for(const item of this.itemCondition){
                        if(flowSub.SubPid === item.SubPid){
                            const itemEl = document.getElementById(`itemCondition${item.item_id}`);
                            if(flowSub.sub_status_checked === false){
                                item.status = 'Inactive';
                                itemEl.checked = false;
                                itemEl.disabled = true;
                            } else {
                                item.status = 'Active';
                                itemEl.checked = true;
                                itemEl.disabled = false;
                            }
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
       visibilityStatus(item_id){
        const status = document.getElementById(`visibility${item_id}`).checked;
        console.log(status)
        for(const item of this.itemCondition){
            if(item_id === item.item_id){
                item.visibility_checked = status;
                item.visibility_status = status === true ? 1:0
                console.log(item);
            }
        }
       },
       async submitFormAssignment(){
        const toastLiveExample = document.getElementById('liveToast');
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
        let assignment_id = '';
        await axios.post(this.formAssignmentPostURL, {
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
            if(response.data.message === 'Form Assignment inserted successfully' && this.processFlowSub.length > 0){
                this.socket.send(`insert, ${response.data.assignment_id}`);
                assignment_id = response.data.assignment_id;
                this.$refs.section.disabled = true;
                this.$refs.parts_number.disabled = true;
                this.$refs.lot_number.disabled = true;
                this.$refs.wafer_no_from.disabled = true;
                this.$refs.wafer_no_to.disabled = true;
                this.$refs.instruction.disabled = true;
                this.$refs.material_lot_number.disabled = true;
                this.$refs.attachment.disabled = true;
                this.$refs.item_code.disabled = true;
                this.$refs.jo_number.disabled = true;
                this.$refs.date_issued.disabled = true;
                for(const sec of this.section){
                    if(parseInt(this.section_id) === parseInt(sec.section_id)){
                        if(sec.section_code === 'CCI'){
                            this.$refs.po_number.disabled = true;
                            this.$refs.order_pn.disabled = true;
                        }
                    }
                } 
            }
        }).catch(error => {
            console.log(error);
        })
        for(const flowSub of this.processFlowSub){
            for(const item of this.$refs.item_status){
                item.disabled = true;
            }
            for(const sampling of this.$refs.sampling){
                sampling.disabled = true;
            }
            for(const uncontrolled of this.$refs.uncontrolled){
                uncontrolled.disabled = true;
            }
            for(const batching of this.$refs.batching){
                batching.disabled = true;
            }
            for(const result of this.$refs.result){
                result.disabled = true;
            }
            if(assignment_id){
                await axios.post(this.formAssignmentItemPostURL, {
                    assignment_id: assignment_id,
                    sequence_number: flowSub.sequence_number,
                    Pid: flowSub.Pid,
                    SubPid: flowSub.SubPid,
                    standard_time: flowSub.standard_time,
                    machine_time: flowSub.machine_time,
                    assignment_status: flowSub.sub_status,
                    check_sampling: flowSub.check_sampling,
                    check_uncontrolled: flowSub.check_uncontrolled,
                    batching_type: flowSub.batching_type,
                    result_type: flowSub.result_type
                }).then(response => {
                    if(response.data.message === 'Process Flow Sub inserted successfully'){
                        for(const condition of this.$refs.condition_status){
                            condition.disabled = true;
                        }
                    }
                }).catch(error => {
                    console.log(error);
                });
            }
        }
        let limit = this.itemCondition.length;
        let loader = 0;
        console.log(limit);
        for(const item of this.itemCondition){
            await axios.post(this.itemConditionPostURL, {
                assignment_id: assignment_id,
                sequence_number: item.sequence_number,
                SubPid: item.SubPid,
                detail_description: item.detail_description,
                field_type: item.field_type,
                min_value: item.min_value,
                max_value: item.max_value,
                typical_value: item.typical_value,
                visibility_status: item.visibility_status,
                condition_status: item.status
            }).then(response => {
                if(response.data.message === 'Item Condition inserted successfully'){
                    loader++;
                    this.conditionLoader = (loader / limit) * 100;
                    if(loader === limit){
                        this.alert = 'Form Assignment Submission: Complete'
                        toastBootstrap.show();
                    }
                    this.$refs.save.disabled = true;
                    this.$refs.new.disabled = false;
                } else {
                
                }
            }).catch(error => {
                console.log(error);
            });
        }        
       },
       test(){
        
       },
       newFormAssignment(){
            this.$refs.section.disabled = false;
            this.$refs.parts_number.disabled = false;
            this.$refs.lot_number.disabled = false;
            this.$refs.wafer_no_from.disabled = false;
            this.$refs.wafer_no_to.disabled = false;
            this.$refs.item_code.disabled = false;
            this.$refs.jo_number.disabled = false;
            this.$refs.date_issued.disabled = false;
            this.$refs.material_lot_number.disabled = false;
            for(const sec of this.section){
                if(parseInt(this.section_id) === parseInt(sec.section_id)){
                    if(sec.section_code === 'CCI'){
                        this.$refs.po_number.disabled = true;
                        this.$refs.order_pn.disabled = true;
                        this.po_number = '';
                        this.order_pn = '';
                    }
                }
            }
            this.section_id = '';
            this.parts_number = '';
            this.lot_number = '';
            this.wafer_number_from = 0;
            this.wafer_number_to = 0;
            this.item_code = '';
            this.jo_number = '';
            this.revision_number = '';
            this.order_pn = '';
            this.processFlowSub = [];
            this.itemCondition = [];
            this.conditionLoader = 0;
            this.hasAttachment = false;
            this.hasInstruction = false;
            this.$refs.save.disabled = false;
            this.$refs.new.disabled = true;
       }
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
                let formatted = parseFloat(fa.quantity).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
                fa.quantity = formatted;
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

        this.socket = new WebSocket('ws://172.16.2.60:8080');
        
        this.socket.addEventListener('open', async(event) => {
            console.log('Socket Server Up');
        });
        this.socket.addEventListener('message', (event) => {
            const toastLiveExample = document.getElementById('liveToast');
            const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
            if(event.data.split(',').includes('insert')){
                let data = event.data.split(',');
                let id = data[1].trim();
                
                axios.get(this.FormRequestURL, {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    },
                    params: {
                        assignment_id: id
                    }  
                }).then(response => {
                    for(const form of response.data){
                        for(const sec of this.section){
                            if(parseInt(form.section_id ) === parseInt(sec.section_id)){
                                this.formAssignment.push({
                                   assignment_id: form.assignment_id,
                                   section_id: form.section_id,
                                   section_code: sec.section_code,
                                   lot_number: form.lot_number,
                                   po_number: form.po_number? this.po_number: '-',
                                   item_parts_number: form.item_parts_number,
                                   quantity: form.quantity,
                                   delivery_date: form.delivery_date? this.delivery_date: null,
                                   jo_number: form.jo_number? this.jo_number: '-',
                                   revision_number: form.revision_number,
                                   date_issued: form.date_issued,
                                   assigned_by: form.assigned_by,
                                   date_created: form.date_created,
                                   wafer_number_from: form.wafer_number_from,
                                   wafer_number_to: form.wafer_number_to,
                                   item_code: form.item_code,
                                   assignment_status: form.assignment_status,
                                   has_attachment: form.hasAttachment,
                                   has_instruction: form.hasInstruction
                                });
                            }
                        }
                    }
                }).catch(error => {
                    console.log(error);
                })
            }
            if(event.data.split(',').includes('delete')){
                let data = event.data.split(',');
                let id = data[1].trim();
                let idToRemove = parseInt(id);
                let index = this.formAssignment.findIndex((form) => form.assignment_id === idToRemove);
                this.formAssignment.splice(index, 1);
                this.alert = `Form Assignment: ${idToRemove} has been removed to the system successfully`;
                toastBootstrap.show();
            }
        });

        this.date_created = new Date().toJSON().slice(0, 10);
        this.hasAttachment = false;
        this.hasInstruction = false;
        let curDate = new Date();
        this.date_issued = new Date().toJSON().slice(0, 10);
    },
    
    }
    </script>
    
    <style>
    @import 'datatables.net-bs5';
    @import 'animate.css';
    @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,300,0,0');
    @import '@splidejs/vue-splide/css/sea-green';
    </style>