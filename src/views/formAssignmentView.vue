
<template>
<div class="px-5">
    <div class="col-md-12 row">
        <div class="col-md-1">
            <button data-bs-target="#createFormAssignment" class="btn btn-light btn-sm w-100" data-bs-toggle="modal">Create</button>
        </div>
    </div>
    <hr>
    <DataTable
    :data="formAssignment"
    :columns="columns"
    class="display table"
    @click="getRowData"
    />
</div>

<div class="modal fade " id="createFormAssignment" aria-hidden="true" aria-labelledby="createFormAssignment" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered modal-fullscreen">
    <div class="modal-content">
      <div class="modal-body bg-light">
        <div class="col-md-12 mx-auto row">
            <div class="col-md-5 border rounded">
                <div class="col-md-12 row mx-auto p-3">
                    <div class="col-md-4 p-1">
                        <button ref="new" class="btn btn-lg btn-primary w-100" @click="newForm" disabled>
                            <span class="material-symbols-outlined align-bottom pb-1 px-1">feed</span>New</button>
                    </div>
                    <div class="col-md-4 p-1">
                        <button class="btn btn-lg btn-primary w-100" data-bs-target="#reviewForm" data-bs-toggle="modal">
                            <span class="material-symbols-outlined align-bottom pb-1 px-1">save</span>Save</button>
                    </div>
                    <div class="col-md-4 p-1">
                        <button class="btn btn-lg btn-primary w-100" data-bs-dismiss="modal" aria-label="Close">
                            <span class="material-symbols-outlined align-bottom pb-1 px-1">close_fullscreen</span>Close</button>
                    </div>
                    <div class="col-md-4 p-1">
                        <button class="btn btn-lg btn-primary w-100">
                            <span class="material-symbols-outlined align-bottom pb-1 px-1">qr_code_2_add</span>Generate QR Code</button>
                    </div>
                    <div class="col-md-4 p-1">
                        <button ref="instructionBtn" class="btn btn-lg btn-primary w-100" disabled>
                            <span class="material-symbols-outlined align-bottom pb-1 px-1">folder_special</span>Special Instruction</button>
                    </div>
                    <div class="col-md-4 p-1">
                        <button ref="attachmentBtn" class="btn btn-lg btn-primary w-100" data-bs-target="#attachmentView" data-bs-toggle="modal" disabled>
                            <span class="material-symbols-outlined align-bottom pb-1 px-1">attach_file</span>Attachment</button>
                    </div>
                </div>
                <hr>
                <div class="col-md-6 mx-auto px-1 row">
                    <h4 class="text-primary">Form Assignment Number : <strong>{{ formAssignmentId }}</strong></h4>
                </div>
                <hr>
                <div class="col-md-12 row p-1 mx-auto">
                    <div class="col-md-4">
                        <label for="status">Status</label>
                        <select ref="status" id="status" class="form-select" disabled>
                            <option value="Unposted">Unposted</option>
                            <option value="Posted">Posted</option>
                        </select>
                    </div>
                    <div class="col-md-4">
                        <label for="assigned_by">Assigned By</label>
                        <input type="text" class="form-control" id="assigned_by" value="3141 - Jairus Jo Casul" disabled>
                    </div>
                    <div class="col-md-4">
                        <label for="date_created">Date Created</label>
                        <input type="text" class="form-control" id="date_created" v-model="currentDate" disabled>
                    </div>
                    <div class="col-md-6 p-3">
                        <div class="form-check form-switch">
                          <input class="form-check-input" ref="hasAttachment" type="checkbox" role="switch" v-model="hasAttachment" id="attachmentSwitch">
                          <label class="form-check-label" for="attachmentSwitch">With Attachment</label>
                        </div>
                    </div>
                    <div class="col-md-6 p-3">
                        <div class="form-check form-switch">
                          <input class="form-check-input" ref="hasInstruction" type="checkbox" role="switch" v-model="hasInstruction" id="instructionSwitch">
                          <label class="form-check-label" for="instructionSwitch">With Special Instruction</label>
                        </div>
                    </div>
                </div>
                <hr>
                <div class="col-md-12 row p-3 mx-auto">
                    <div class="col-md-4 p-1">
                        <label for="section">Section</label>
                        <select ref="section" id="section" class="form-select" v-model="selectedSection" @change="populatePartsNumber(selectedSection)">
                            <option v-for="value in section">{{ value.section_code }}</option>
                        </select>
                    </div>
                    <div class="col-md-4 p-1">
                        <label for="input_parts_number">Parts Number</label>
                        <input ref="parts_number" id="input_parts_number" v-model="partsNumber" class="form-select" list="parts_number" type="text" @input="getItemCodeAndLotNumber(selectedSection, partsNumber)">
                        <datalist id="parts_number">
                            <option :value="value.item_parts_number"  v-for="value in partsNumberOptions">{{ value.item_parts_number }}</option>
                        </datalist>
                    </div>
                    <div class="col-md-4 p-1">
                        <label for="lot_number">Lot Number</label>
                        <select ref="lot_number" v-model="lotNumber" class="form-select" id="lot_number">
                            <option :value="value.lot_number" v-for="value in lotNumberOptions">{{ value.lot_number }}</option>
                        </select>
                    </div>
                    <div class="col-md-6 p-1">
                        <label for="waferNoFrom">Wafer Number From</label>
                        <input ref="wafer_no_from" id="waferNoFrom" type="text" class="form-control" v-model="waferNoFrom">
                    </div>
                    <div class="col-md-6 p-1">
                        <label for="waferNoTo">Wafer Number To</label>
                        <input ref="wafer_no_to" id="waferNoTo" type="text" class="form-control" v-model="waferNoTo">
                    </div>
                    <div v-if="selectedSection === 'CCI'" class="col-md-6 p-1 animate__animated animate__zoomIn">
                        <label for="input_po_number">PO Number</label>
                        <input ref="po_number" id="input_po_number" v-model="poNumber" list="po_number" type="text" class="form-control" @input="getCCIdetails(partsNumber, poNumber)">
                        <datalist id="po_number">
                            <option :value="value.po_number" v-for="value in poNumberOptions">{{ value.po_number }}</option>
                        </datalist>
                    </div>
                    <div v-if="selectedSection === 'CCI'" class="col-md-6 p-1 animate__animated animate__zoomIn">
                        <label for="order_pn">Order PN</label>
                        <input ref="order_pn" id="order_pn" type="text" class="form-control" v-model="orderPn">
                    </div>
                    <div class="col-md-8 p-1">
                        <label for="input_item_code">Item Code</label>
                        <input ref="item_code" id="input_item_code" v-model="itemCode" type="text" class="form-select" list="item_code" @input="getRevisionNumber(selectedSection, partsNumber, itemCode, keyProcess, subProcess, )">
                        <datalist id="item_code">
                            <option :value="value.item_code" v-for="value in itemCodeOptions">{{ value.item_code }}</option>
                        </datalist>
                    </div> 
                    <div class="col-md-4 p-1">
                        <label for="material_lot_no">Material Lot Number</label>
                        <input ref="material_lot_no" id="material_lot_no" type="text" class="form-control" readonly>
                    </div>
                    <div v-if="selectedSection === 'CCI'" class="col-md-3 p-1 animate__animated animate__zoomIn">
                        <label for="customer_pn">Customer PN</label>
                        <input ref="customer_pn" id="customer_pn" type="text" class="form-control" v-model="customerPn" readonly>
                    </div>
                    <div v-if="selectedSection === 'CCI'" class="col-md-6 p-1 animate__animated animate__zoomIn">
                        <label for="customer_name">Customer Name</label>
                        <input ref="customer_name" id="customer_name" type="text" class="form-control" v-model="customerName" readonly>
                    </div>
                    <div v-if="selectedSection === 'CCI'" class="col-md-3 p-1 animate__animated animate__zoomIn">
                        <label for="delivery_date">Delivery Date</label>
                        <input ref="delivery_date" id="delivery_date" type="text" class="form-control" v-model="deliveryDate" readonly>
                    </div>
                    <div class="col-md-4 p-1">
                        <label for="order_quantity">Order Quantity</label>
                        <input ref="order_quantity" id="order_quantity" type="text" class="form-control" v-model="orderQuantity" readonly>
                    </div>
                    <div class="col-md-8 p-1">
                        <label for="jo_number">JO  Number</label>
                        <input ref="jo_number" id="jo_number" type="text" class="form-control" v-model="joNumber">
                    </div>
                    <div class="col-md-6 p-1">
                        <label for="revision_number">Revision Number</label>
                        <input ref="revision_number" id="revision_number" type="text" v-model="revisionNumber" class="form-control" readonly>
                    </div> 
                    <div class="col-md-6 p-1">
                        <label for="date_issued">Date Issued</label>
                        <input ref="date_issued" id="date_issued" type="date" class="form-control" v-model="dateIssued">
                    </div> 
                </div>
            </div>
            <div class="col-md-7">
                <div class="col-md-12 row mx-auto">
                    <div class="col-md-12">
                        <p class="float-end">Date : {{ currentDate }}</p>
                    </div>
                    <div class="col-md-12">
                        <h5 class="text-center pb-2 animate__animated animate__backInLeft" v-if="sectionDescription != null">{{ sectionDescription }} - PROCESS FLOW ASSIGNMENT</h5>
                    </div>
                    <table class="table table-responsive table-hover">
                        <thead class="animate__animated animate__backInLeft">
                            <tr>
                                <th>Seq. No.</th>
                                <th>Key Process</th>
                                <th>Sub Process</th>
                                <th>Process Type</th>
                                <th>Standard Time</th>
                                <th>Machine Time</th>
                                <th>Attachment Count</th>
                                <th>Instruction Count</th>
                                <th>Assignment Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody class="animate__animated animate__backInLeft">
                            <template v-for="flowSub in processFlowSub" :key="flowSub.flow_sub_id">
                                <tr>
                                <td>{{ flowSub.sequence_number }}</td>
                                <td>{{ flowSub.Pname }}</td>
                                <td>{{ flowSub.SubPname }}</td>
                                <td>{{ flowSub.process_type }}</td>
                                <td>{{ flowSub.standard_time }}</td>
                                <td>{{ flowSub.machine_time }}</td>
                                <td></td>
                                <td></td>
                                <td>
                                    <div class="form-check form-switch">
                                        <input :ref="'status-'+flowSub.flow_sub_id" class="form-check-input" type="checkbox" role="switch" :id="'status-'+flowSub.flow_sub_id" @change="changeStatus(flowSub.flow_sub_id)" checked>
                                        <label class="form-check-label" :for="'status-'+flowSub.flow_sub_id" :id="'label-'+flowSub.flow_sub_id">Active</label>
                                    </div>
                                </td>
                                <td>
                                    <button class="btn w-100" @click="showDetails(flowSub.SubPid)">
                                        <span class="material-symbols-outlined">
                                            {{ show[flowSub.SubPid]? 'expand_less' : 'expand_more' }}
                                        </span>
                                    </button>
                                </td>
                                
                            </tr>
                            <tr class="animate__animated animate__slideInDown" v-show="show[flowSub.SubPid]">
                                <td colspan="10" class="p-3">
                                   <div class="table-responsive">
                                    <table class="table table-borderless table-hover ">
                                        <thead class="animate__animated animate__backInLeft">
                                            <th><small>Seq No</small></th>
                                            <th><small>Process Details Description</small></th>
                                            <th><small>Typical Value</small></th>
                                            <th><small>Minimum Value</small></th>
                                            <th><small>Maximum Value</small></th>
                                            <th><small>Condition Status</small></th>
                                        </thead>
                                        <tbody class="animate__animated animate__backInLeft">
                                            <template v-for="condition in itemConditions" :key="condition.item_id">
                                                <tr v-if="condition.SubPid == flowSub.SubPid">
                                                    <td><small>{{ condition.sequence_number }}</small></td>
                                                    <td><small>{{ condition.detail_description }}</small></td>
                                                    <td><small>{{ condition.typical_value }}</small></td>
                                                    <td><small>{{ condition.min_value }}</small></td>
                                                    <td><small>{{ condition.max_value }}</small></td>
                                                    <td>
                                                        <div class="form-check form-switch">
                                                            <input class="form-check-input" type="checkbox" role="switch" :id="'itemStatus-'+condition.item_id" @change="changeItemStatus(condition.item_id)" checked>
                                                            <label class="form-check-label" :for="'itemStatus-'+condition.item_id" :id="'itemLabel-'+condition.item_id">Active</label>
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
</div>
<div class="modal fade" id="reviewForm" aria-hidden="true" aria-labelledby="reviewForm" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered modal-fullscreen">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="refiewForm2">Review Form Before Submitting!</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
            <div class="p-5">
                <div class="col-md-12 row">
                    <p class="text-center"><strong>{{ sectionDescription }} - FORM ASSIGNMENT</strong></p>
                    
                </div>
                <div class="col-md-12 row">
                    <div class="col-md-6">
                        <div class="col-md-12 row">
                            <div class="col-md-6">
                                <p>Form Assignment No. : <strong>{{ formAssignmentId }}</strong></p>
                            </div>
                            <div class="col-md-6">
                                <p class="text-end">Delivery Date - {{ currentDate }}</p>
                            </div>
                        </div>
                        <div class="card">
                          <div class="card-header">
                            {{ selectedSection }} - {{ sectionDescription }} - {{ formAssignmentId }}
                          </div>
                          <div class="card-body">
                            <h5 class="card-title text-center">Form Assignment</h5>
                            <div class="col-md-12 row p-3">
                                <div class="col-md-4">
                                    <p>Section : {{ selectedSection }}</p>
                                </div>
                                <div class="col-md-4">
                                    <p>Parts Number : {{ partsNumber }}</p>
                                </div>
                                <div class="col-md-4">
                                    <p>Lot Number : {{ lotNumber }}</p>
                                </div>
                                <div class="col-md-6">
                                    <p>Wafer Number From : {{ waferNoFrom }}</p>
                                </div>
                                <div class="col-md-6">
                                    <p>Wafer Number To : {{ waferNoTo }}</p>
                                </div>
                                <div class="col-md-6">
                                    <p>PO Number : {{ poNumber }}</p>
                                </div>
                                <div class="col-md-6">
                                    <p>Order PN : {{ orderPn }}</p>
                                </div>
                                <div class="col-md-6">
                                    <p>Item Code : {{ itemCode }}</p>
                                </div>
                                <div class="col-md-6">
                                    <p>Material Lot Number : {{ materialLotNo }}</p>
                                </div>
                                <div class="col-md-6">
                                    <p>Customer PN : {{ customerPn }}</p>
                                </div>
                                <div class="col-md-6">
                                    <p>Customer Name : {{ customerName }}</p>
                                </div>
                                <div class="col-md-6">
                                    <p>Order Quantity : {{ orderQuantity }}</p>
                                </div>
                                <div class="col-md-6">
                                    <p>JO Number : {{ joNumber }}</p>
                                </div>
                                <div class="col-md-6">
                                    <p>Revision Number : {{ revisionNumber }}</p>
                                </div>
                                <div class="col-md-6">
                                    <p>Date Issued : {{ dateIssued }}</p>
                                </div>
                                <div class="col-md-12">
                                    <p class="text-end">Status : {{ formAssignmentStatus }}</p>
                                </div>
                            </div>
                            
                          </div>
                          <div class="card-footer text-body-secondary text-end">
                            Assigned By : {{ assignedBy }}
                          </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <table class="table table-responsive table-hover">
                            <thead class="animate__animated animate__backInLeft">
                                <tr>
                                    <th>Seq. No.</th>
                                    <th>Key Process</th>
                                    <th>Sub Process</th>
                                    <th>Process Type</th>
                                    <th>Standard Time</th>
                                    <th>Machine Time</th>
                                    <th>Attachment Count</th>
                                    <th>Instruction Count</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody class="animate__animated animate__backInLeft">
                                <template v-for="flowSub in processFlowSub" :key="flowSub.flow_sub_id">
                                    <tr v-if="flowSub.assignment_status == 'Active'">
                                        <td>{{ flowSub.sequence_number }}</td>
                                        <td>{{ flowSub.Pname }}</td>
                                        <td>{{ flowSub.SubPname }}</td>
                                        <td>{{ flowSub.process_type }}</td>
                                        <td>{{ flowSub.standard_time }}</td>
                                        <td>{{ flowSub.machine_time }}</td>
                                        <td></td>
                                        <td></td>
                                        <td>
                                            <button class="btn w-100" @click="showDetails(flowSub.SubPid)">
                                                <span class="material-symbols-outlined">
                                                    {{ show[flowSub.SubPid]? 'expand_less' : 'expand_more' }}
                                                </span>
                                            </button>
                                        </td>
                                    </tr>
                                    
                                <tr class="animate__animated animate__slideInDown" v-show="show[flowSub.SubPid]">
                                    <td colspan="10" class="p-3">
                                       <div class="table-responsive">
                                        <table class="table table-borderless table-hover ">
                                            <thead class="animate__animated animate__backInLeft">
                                                <th><small>Seq No</small></th>
                                                <th><small>Process Details Description</small></th>
                                                <th><small>Typical Value</small></th>
                                                <th><small>Minimum Value</small></th>
                                                <th><small>Maximum Value</small></th>
                                            </thead>
                                            <tbody class="animate__animated animate__backInLeft">
                                                <template v-for="condition in itemConditions" :key="condition.item_id">
                                                    <tr v-if="condition.SubPid == flowSub.SubPid && condition.item_status == 'Active'">
                                                        <td><small>{{ condition.sequence_number }}</small></td>
                                                        <td><small>{{ condition.detail_description }}</small></td>
                                                        <td><small>{{ condition.typical_value }}</small></td>
                                                        <td><small>{{ condition.min_value }}</small></td>
                                                        <td><small>{{ condition.max_value }}</small></td>
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
      <div class="modal-footer">
        <!-- <button class="btn btn-primary" data-bs-target="#createFormAssignment" data-bs-toggle="modal">Back to first</button> -->
        <div class="col-md-12">
            <div class="col-md-1 float-end">
                <button @click="submitData" data-bs-target="#createFormAssignment" data-bs-toggle="modal" class="btn btn-primary w-100">Submit</button>
            </div>
        </div>
      </div>
    </div>
  </div>
</div>
<div class="modal fade" id="attachmentView" aria-hidden="true" aria-labelledby="attachmentView" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered modal-fullscreen">
    <div class="modal-content">
      <div class="modal-header">
        <div class="col-md-12 row">
            <div class="col-md-4">
                <div class="col-md-12 row">
                    <div class="col-md-4">
                        <button class="btn btn-primary w-100">Save</button>
                    </div>
                    <div class="col-md-4">
                        <button @click="createCard(attachmentSelectedSubPid)" class="btn btn-primary w-100">Add New</button>
                    </div>
                    <div class="col-md-4">
                        <button class="btn btn-primary w-100">Close</button>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <h4 class="text-center">File Attachment</h4>
                <select name="" id="" class="form-select" v-model="attachmentSelectedSubPid">
                    <option v-for="attached in attachmentDetails" :value="attached.SubPid">{{ attached.SubPname }}</option>
                </select>
            </div>
        </div>
      </div>
      <div class="modal-body">
        <div class="col-md-12 row">
            <div class="col-md-2">
                <p><strong>Form Assignment No. : </strong>{{ formAssignmentId }}</p>
                <p><strong>Form Assignment No. : </strong>{{ formAssignmentId }}</p>
                <p><strong>Form Assignment No. : </strong>{{ formAssignmentId }}</p>
                <p><strong>Form Assignment No. : </strong>{{ formAssignmentId }}</p>
            </div>
            <div class="col-md-2">
                <p><strong>Form Assignment No. : </strong>{{ formAssignmentId }}</p>
                <p><strong>Form Assignment No. : </strong>{{ formAssignmentId }}</p>
                <p><strong>Form Assignment No. : </strong>{{ formAssignmentId }}</p>
                <p><strong>Form Assignment No. : </strong>{{ formAssignmentId }}</p>
            </div>
            <div class="col-md-2">
                <p><strong>Form Assignment No. : </strong>{{ formAssignmentId }}</p>
                <p><strong>Form Assignment No. : </strong>{{ formAssignmentId }}</p>
                <p><strong>Form Assignment No. : </strong>{{ formAssignmentId }}</p>
                <p><strong>Form Assignment No. : </strong>{{ formAssignmentId }}</p>
            </div>
            <div class="col-md-2">
                <p><strong>Form Assignment No. : </strong>{{ formAssignmentId }}</p>
                <p><strong>Form Assignment No. : </strong>{{ formAssignmentId }}</p>
                <p><strong>Form Assignment No. : </strong>{{ formAssignmentId }}</p>
                <p><strong>Form Assignment No. : </strong>{{ formAssignmentId }}</p>
            </div>
            <div class="col-md-2">
                <p><strong>Form Assignment No. : </strong>{{ formAssignmentId }}</p>
                <p><strong>Form Assignment No. : </strong>{{ formAssignmentId }}</p>
                <p><strong>Form Assignment No. : </strong>{{ formAssignmentId }}</p>
                <p><strong>Form Assignment No. : </strong>{{ formAssignmentId }}</p>
            </div>
        </div>
        <hr>
        <template v-for="attached in attachmentDetails">
            <div class="col-md-12 row" v-show="attachmentSelectedSubPid == attached.SubPid" :id="'card'+attached.SubPid">
                
            </div>
        </template>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" data-bs-target="#createFormAssignment" data-bs-toggle="modal">Back to first</button>
      </div>
    </div>
  </div>
</div>
<div class="modal fade" id="viewForm" tabindex="-1" aria-labelledby="viewForm" aria-hidden="true">
  <div class="modal-dialog modal-fullscreen">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="col-md-12 mx-auto row">
            <div class="col-md-5 border rounded">
                <div class="col-md-12 row mx-auto p-3">
                    <div class="col-md-4 p-1">
                        <button ref="new" class="btn btn-lg btn-primary w-100">
                            <span class="material-symbols-outlined align-bottom pb-1 px-1">delete</span>Delete</button>
                    </div>
                    <div class="col-md-4 p-1">
                        <button class="btn btn-lg btn-primary w-100" data-bs-target="#reviewForm" data-bs-toggle="modal">
                            <span class="material-symbols-outlined align-bottom pb-1 px-1">save</span>Save</button>
                    </div>
                    <div class="col-md-4 p-1">
                        <button class="btn btn-lg btn-primary w-100" data-bs-dismiss="modal" aria-label="Close">
                            <span class="material-symbols-outlined align-bottom pb-1 px-1">close_fullscreen</span>Close</button>
                    </div>
                    <div class="col-md-4 p-1">
                        <button class="btn btn-lg btn-primary w-100">
                            <span class="material-symbols-outlined align-bottom pb-1 px-1">qr_code_2_add</span>Generate QR Code</button>
                    </div>
                    <div class="col-md-4 p-1">
                        <button class="btn btn-lg btn-primary w-100" disabled>
                            <span class="material-symbols-outlined align-bottom pb-1 px-1">folder_special</span>Special Instruction</button>
                    </div>
                    <div class="col-md-4 p-1">
                        <button class="btn btn-lg btn-primary w-100" data-bs-target="#attachmentView" data-bs-toggle="modal" disabled>
                            <span class="material-symbols-outlined align-bottom pb-1 px-1">attach_file</span>Attachment</button>
                    </div>
                </div>
                <hr>
                <div class="col-md-6 mx-auto px-1 row">
                    <h4 class="text-primary">Form Assignment Number : <strong>{{ viewAssignment_id }}</strong></h4>
                </div>
                <hr>
                <div class="col-md-12 row p-1 mx-auto">
                    <div class="col-md-4">
                        <label for="viewstatus">Status</label>
                        <select v-model="viewAssignment_Status" ref="viewstatus" id="viewstatus" class="form-select">
                            <option value="Unposted">Unposted</option>
                            <option value="Posted">Posted</option>
                        </select>
                    </div>
                    <div class="col-md-4">
                        <label for="viewassigned_by">Assigned By</label>
                        <input type="text" class="form-control" id="viewassigned_by" value="3141 - Casul" disabled>
                    </div>
                    <div class="col-md-4">
                        <label for="viewdate_created">Date Created</label>
                        <input type="text" class="form-control" id="viewdate_created" v-model="viewDate_Created" disabled>
                    </div>
                    <div class="col-md-6 p-3">
                        <div class="form-check form-switch">
                          <input class="form-check-input" ref="viewhasAttachment" type="checkbox" role="switch" v-model="hasAttachment" id="viewattachmentSwitch">
                          <label class="form-check-label" for="viewattachmentSwitch">With Attachment</label>
                        </div>
                    </div>
                    <div class="col-md-6 p-3">
                        <div class="form-check form-switch">
                          <input class="form-check-input" ref="viewhasInstruction" type="checkbox" role="switch" v-model="hasInstruction" id="viewinstructionSwitch">
                          <label class="form-check-label" for="viewinstructionSwitch">With Special Instruction</label>
                        </div>
                    </div>
                </div>
                <hr>
                <div class="col-md-12 row p-3 mx-auto">
                    <div class="col-md-4 p-1">
                        <label for="viewsection">Section</label>
                        <select id="viewsection" class="form-select" v-model="viewSection_Code" disabled>
                            <option v-for="value in section">{{ value.section_code }}</option>
                        </select>
                    </div>
                    <div class="col-md-4 p-1">
                        <label for="viewinput_parts_number">Parts Number</label>
                        <input id="viewinput_parts_number" v-model="viewItem_Parts_Number" class="form-select" type="text" disabled>
                    </div>
                    <div class="col-md-4 p-1">
                        <label for="viewlot_number">Lot Number</label>
                        <input id="viewlot_number" type="text" class="form-select" v-model="viewLot_Number" disabled>
                    </div>
                    <div class="col-md-6 p-1">
                        <label for="viewwaferNoFrom">Wafer Number From</label>
                        <input id="viewwaferNoFrom" type="text" class="form-control" v-model="viewWafer_No_From" disabled>
                    </div>
                    <div class="col-md-6 p-1">
                        <label for="viewwaferNoTo">Wafer Number To</label>
                        <input id="viewwaferNoTo" type="text" class="form-control" v-model="viewWafer_No_To" disabled>
                    </div>
                    <div v-if="viewSection_Code === 'CCI'" class="col-md-6 p-1 animate__animated animate__zoomIn">
                        <label for="viewinput_po_number">PO Number</label>
                        <input id="viewinput_po_number" v-model="viewPo_Number" type="text" class="form-control" disabled>
                    </div>
                    <div v-if="viewSection_Code === 'CCI'" class="col-md-6 p-1 animate__animated animate__zoomIn">
                        <label for="vieworder_pn">Order PN</label>
                        <input id="vieworder_pn" type="text" class="form-control" v-model="viewOrder_Pm" disabled>
                    </div>
                    <div class="col-md-8 p-1">
                        <label for="viewinput_item_code">Item Code</label>
                        <input id="viewinput_item_code" v-model="viewItem_Code" type="text" class="form-select" disabled>
                    </div> 
                    <div class="col-md-4 p-1">
                        <label for="viewmaterial_lot_no">Material Lot Number</label>
                        <input v-model="viewMaterial_Lot_Number" id="viewmaterial_lot_no" type="text" class="form-control" readonly disabled>
                    </div>
                    <div v-if="viewSection_Code === 'CCI'" class="col-md-3 p-1 animate__animated animate__zoomIn">
                        <label for="viewcustomer_pn">Customer PN</label>
                        <input  id="viewcustomer_pn" type="text" class="form-control" v-model="viewCustomer_Pn" disabled>
                    </div>
                    <div v-if="viewSection_Code === 'CCI'" class="col-md-6 p-1 animate__animated animate__zoomIn">
                        <label for="viewcustomer_name">Customer Name</label>
                        <input id="viewcustomer_name" type="text" class="form-control" v-model="viewCustomer_Name" readonly disabled>
                    </div>
                    <div v-if="viewSection_Code === 'CCI'" class="col-md-3 p-1 animate__animated animate__zoomIn">
                        <label for="viewdelivery_date">Delivery Date</label>
                        <input id="viewdelivery_date" type="text" class="form-control" v-model="viewDelivery_Date" readonly disabled>
                    </div>
                    <div class="col-md-4 p-1">
                        <label for="vieworder_quantity">Order Quantity</label>
                        <input id="vieworder_quantity" type="text" class="form-control" v-model="viewQuantity" readonly disabled>
                    </div>
                    <div class="col-md-8 p-1">
                        <label for="viewjo_number">JO  Number</label>
                        <input id="viewjo_number" type="text" class="form-control" v-model="viewJo_Number" disabled>
                    </div>
                    <div class="col-md-6 p-1">
                        <label for="viewrevision_number">Revision Number</label>
                        <input id="viewrevision_number" type="text" v-model="viewRevision_Number" class="form-control" disabled>
                    </div> 
                    <div class="col-md-6 p-1">
                        <label for="viewdate_issued">Date Issued</label>
                        <input id="viewdate_issued" type="date" class="form-control" v-model="viewDate_Issued" disabled>
                    </div> 
                </div>
            </div>
            <div class="col-md-7">
                <div class="col-md-12 row mx-auto">
                    <div class="col-md-12">
                        <p class="float-end">Date : {{ currentDate }}</p>
                    </div>
                    <div class="col-md-12">
                        <h5 class="text-center pb-2 animate__animated animate__backInLeft" v-if="sectionDescription != null">{{ sectionDescription }} - PROCESS FLOW ASSIGNMENT</h5>
                    </div>
                    <table class="table table-responsive table-hover">
                        <thead class="animate__animated animate__backInLeft">
                            <tr>
                                <th>Seq. No.</th>
                                <th>Key Process</th>
                                <th>Sub Process</th>
                                <th>Process Type</th>
                                <th>Standard Time</th>
                                <th>Machine Time</th>
                                <th>Attachment Count</th>
                                <th>Instruction Count</th>
                                <th>Assignment Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody class="animate__animated animate__backInLeft">
                            <template v-for="flowSub in processFlowSub" :key="flowSub.flow_sub_id">
                                <tr>
                                <td>{{ flowSub.sequence_number }}</td>
                                <td>{{ flowSub.Pname }}</td>
                                <td>{{ flowSub.SubPname }}</td>
                                <td>{{ flowSub.process_type }}</td>
                                <td>{{ flowSub.standard_time }}</td>
                                <td>{{ flowSub.machine_time }}</td>
                                <td></td>
                                <td></td>
                                <td>
                                    <div class="form-check form-switch">
                                        <input :ref="'status-'+flowSub.flow_sub_id" class="form-check-input" type="checkbox" role="switch" :id="'status-'+flowSub.flow_sub_id" @change="changeStatus(flowSub.flow_sub_id)" checked>
                                        <label class="form-check-label" :for="'status-'+flowSub.flow_sub_id" :id="'label-'+flowSub.flow_sub_id">Active</label>
                                    </div>
                                </td>
                                <td>
                                    <button class="btn w-100" @click="showDetails(flowSub.SubPid)">
                                        <span class="material-symbols-outlined">
                                            {{ show[flowSub.SubPid]? 'expand_less' : 'expand_more' }}
                                        </span>
                                    </button>
                                </td>
                                
                            </tr>
                            <tr class="animate__animated animate__slideInDown" v-show="show[flowSub.SubPid]">
                                <td colspan="10" class="p-3">
                                   <div class="table-responsive">
                                    <table class="table table-borderless table-hover ">
                                        <thead class="animate__animated animate__backInLeft">
                                            <th><small>Seq No</small></th>
                                            <th><small>Process Details Description</small></th>
                                            <th><small>Typical Value</small></th>
                                            <th><small>Minimum Value</small></th>
                                            <th><small>Maximum Value</small></th>
                                            <th><small>Condition Status</small></th>
                                        </thead>
                                        <tbody class="animate__animated animate__backInLeft">
                                            <template v-for="condition in itemConditions" :key="condition.item_id">
                                                <tr v-if="condition.SubPid == flowSub.SubPid">
                                                    <td><small>{{ condition.sequence_number }}</small></td>
                                                    <td><small>{{ condition.detail_description }}</small></td>
                                                    <td><small>{{ condition.typical_value }}</small></td>
                                                    <td><small>{{ condition.min_value }}</small></td>
                                                    <td><small>{{ condition.max_value }}</small></td>
                                                    <td>
                                                        <div class="form-check form-switch">
                                                            <input class="form-check-input" type="checkbox" role="switch" :id="'itemStatus-'+condition.item_id" @change="changeItemStatus(condition.item_id)" checked>
                                                            <label class="form-check-label" :for="'itemStatus-'+condition.item_id" :id="'itemLabel-'+condition.item_id">Active</label>
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
props: ['keyProcessResponse','subProcessResponse','formAssignmentResponse', 'sectionResponse','processFlowResponse'],
components: {
    DataTable,
},
data() {
    return {
        show: {},
        itemStatus: {},
        status: {},
        formAssignmentId: 0,
        selectedSection: '',
        selectedSectionId: '',
        attachmentSelectedSubPid: '',
        partsNumber: '',
        itemCode: '',
        revisionNumber: '',
        lotNumber: '',
        poNumber: '',
        flowMainId: '',
        currentDate: '',
        customerPn: '',
        customerName: '',
        deliveryDate: '',
        orderQuantity: '',
        waferNoFrom: '',
        waferNoTo: '',
        orderPn: '',
        dateIssued: '',
        assignedBy: '3141 - CASUL',
        materialLotNo: '',
        formAssignmentStatus: 'Posted',
        hasAttachment: Boolean,
        hasInstruction: Boolean,
        AttachmentVal: 0,
        InstructionVal:0,

        viewAssignment_id: '',
        viewSection_id: '',
        viewLot_Number: '',
        viewPo_Number: '',
        viewItem_Parts_Number: '',
        viewQuantity: '',
        viewDelivery_Date: '',
        viewJo_Number: '',
        viewRevision_Number: '',
        viewDate_Issued: '',
        viewAssigned_By: '',
        viewDate_Created: '',
        viewWafer_No_From: '',
        viewWafer_No_To: '',
        viewItem_Code: '',
        viewAssignment_Status: '',
        viewAttachment: '',
        viewSpecial_Instruction: '',

        attachmentDetails: [],
        customerDetails: [],
        section: [],
        processFlow: [],
        processFlowSub: [],
        processDetails: [],
        partsNumberOptions: [],
        itemCodeOptions: [],
        itemConditions: [],
        sectionOptions: [],
        lotNumberOptions: [],
        poNumberOptions: [],
        formAssignment: [],
        keyProcess: [],
        subProcess: [],

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
    getRowData(event){
        this.viewAssignment_id = '';
        this.viewSection_id = '';
        this.viewLot_Number = '';
        this.viewPo_Number = '';
        this.viewItem_Parts_Number = '';
        this.viewQuantity = '';
        this.viewDelivery_Date = '';
        this.viewJo_Number = '';
        this.viewRevision_Number = '';
        this.viewDate_Issued = '';
        this.viewAssigned_By = '';
        this.viewDate_Created = '';
        this.viewWafer_No_From = '';
        this.viewWafer_No_To = '';
        this.viewItem_Code = '';
        this.viewAssignment_Status = '';
        this.viewAttachment = '';
        this.viewSpecial_Instruction = '';
        if(event.target.tagName === 'SPAN'){
            const row = event.target.parentNode.parentNode.parentNode;
            const cell = row.querySelector('td');
            const assignment_id = cell.textContent;
            for(const form of this.formAssignment){
                if(assignment_id == form.assignment_id){
                    this.viewAssignment_id = form.assignment_id,
                    this.viewSection_Code = form.section_code,
                    this.viewLot_Number = form.lot_number,
                    this.viewPo_Number = form.po_number,
                    this.viewItem_Parts_Number = form.item_parts_number,
                    this.viewQuantity = form.quantity,
                    this.viewDelivery_Date = form.delivery_date,
                    this.viewJo_Number = form.jo_number,
                    this.viewRevision_Number =  form.revision_number,
                    this.viewDate_Issued = form.date_issued,
                    this.viewAssigned_By = form.assigned_by,
                    this.viewDate_Created = form.date_created,
                    this.viewWafer_No_From = form.wafer_number_from,
                    this.viewWafer_No_To = form.wafer_number_to,
                    this.viewItem_Code = form.item_code,
                    this.viewAssignment_Status = form.assignment_status,
                    this.viewAttachment = form.attachment,
                    this.viewSpecial_Instruction = form.special_instruction
                }
            }
        } else if(event.target.tagName === 'BUTTON'){
            const row = event.target.parentNode.parentNode;
            const cell = row.querySelector('td');
            const assignment_id = cell.textContent;
            for(const form of this.formAssignment){
                if(assignment_id == form.assignment_id){
                    this.viewAssignment_id = form.assignment_id,
                    this.viewSection_id = form.section_code,
                    this.viewLot_Number = form.lot_number,
                    this.viewPo_Number = form.po_number,
                    this.viewItem_Parts_Number = form.item_parts_number,
                    this.viewQuantity = form.quantity,
                    this.viewDelivery_Date = form.delivery_date,
                    this.viewJo_Number = form.jo_number,
                    this.viewRevision_Number =  form.revision_number,
                    this.viewDate_Issued = form.date_issued,
                    this.viewAssigned_By = form.assigned_by,
                    this.viewDate_Created = form.date_created,
                    this.viewWafer_No_From = form.wafer_number_from,
                    this.viewWafer_No_To = form.wafer_number_to,
                    this.viewItem_Code = form.item_code,
                    this.viewAssignment_Status = form.assignment_status,
                    this.viewAttachment = form.attachment,
                    this.viewSpecial_Instruction = form.special_instruction
                }
            }
        }
    },
    newForm(){
            this.$refs.section.disabled = false;
            this.$refs.parts_number.disabled = false;
            this.$refs.lot_number.disabled = false;
            this.$refs.wafer_no_from.disabled = false;
            this.$refs.wafer_no_to.disabled = false;
            this.$refs.po_number.disabled = false;
            this.$refs.order_pn.disabled = false;
            this.$refs.item_code.disabled = false;
            this.$refs.material_lot_no.disabled = false;
            this.$refs.customer_pn.disabled = false;
            this.$refs.customer_name.disabled = false;
            this.$refs.delivery_date.disabled = false;
            this.$refs.order_quantity.disabled = false;
            this.$refs.jo_number.disabled = false;
            this.$refs.revision_number.disabled = false;
            this.$refs.date_issued.disabled = false;
            this.$refs.status.disabled = true;
            this.$refs.hasAttachment.disabled = false;
            this.$refs.hasInstruction.disabled = false;
            this.formAssignmentId += 1; 
            this.selectedSection = '';
            this.selectedSectionId = '';
            this.partsNumber = '';
            this.lotNumber = '';
            this.waferNoFrom = '';
            this.waferNoTo = '';
            this.poNumber = '';
            this.orderPn = '';
            this.itemCode = '';
            this.materialLotNo = '';
            this.customerPn = '';
            this.customerName = '';
            this.deliveryDate = '';
            this.orderQuantity = '';
            this.joNumber = '';
            this.revisionNumber = '';
            this.dateIssued = '';
            this.processFlowSub = [];
            this.itemConditions = [];
            this.$refs.new.disabled = true;
    },
    async submitData(){
        const btnInstruction = this.$refs.instructionBtn;
        const btnAttachment = this.$refs.attachmentBtn;
        for(const section of this.section){
            if(this.selectedSection == section.section_code){
                this.selectedSectionId = section.section_id;
            }
        }
        if(this.hasInstruction === false){
            this.instructionVal = 0;
            btnInstruction.disabled = true;
        } else if(this.hasInstruction === true) {
            this.instructionVal = 1;
            btnInstruction.disabled = false;
        }
        if(this.hasAttachment === false){
            this.attachmentVal = 0;
            btnAttachment.disabled = true;
        } else if(this.hasAttachment === true) {
            this.attachmentVal = 1;
            btnAttachment.disabled = false;
        }
        await axios.post('http://172.16.2.69/tpcrequesthandlers/FormAssignmentRequestHandler.php', {
            assignment_id: this.formAssignmentId,
            section_id: this.selectedSectionId,
            lot_number: this.lotNumber,
            po_number: this.poNumber,
            parts_number: this.partsNumber,
            quantity: this.orderQuantity,
            delivery_date: this.deliveryDate,
            jo_number: this.joNumber,
            revision_number: this.revisionNumber,
            date_issued: this.dateIssued,
            assigned_by: this.assignedBy,
            date_created: this.currentDate,
            wafer_number_from: this.waferNoFrom,
            wafer_number_to: this.waferNoTo,
            item_code: this.itemCode,
            assignment_status: this.formAssignmentStatus,
            has_attachment: this.attachmentVal,
            has_instruction: this.instructionVal
        })
        .then(response => {
            console.log(response.data)
          if(response.data.message === 'Form Assignment inserted successfully'){
            this.$refs.section.disabled = true;
            this.$refs.parts_number.disabled = true;
            this.$refs.lot_number.disabled = true;
            this.$refs.wafer_no_from.disabled = true;
            this.$refs.wafer_no_to.disabled = true;
            this.$refs.po_number.disabled = true;
            this.$refs.order_pn.disabled = true;
            this.$refs.item_code.disabled = true;
            this.$refs.material_lot_no.disabled = true;
            this.$refs.customer_pn.disabled = true;
            this.$refs.customer_name.disabled = true;
            this.$refs.delivery_date.disabled = true;
            this.$refs.order_quantity.disabled = true;
            this.$refs.jo_number.disabled = true;
            this.$refs.revision_number.disabled = true;
            this.$refs.date_issued.disabled = true;
            this.$refs.status.disabled = false;
            this.$refs.hasAttachment.disabled = true;
            this.$refs.hasInstruction.disabled = true;
            const temp_append = {
                assignment_id: this.formAssignmentId,
                section_code: this.selectedSection,
                lot_number: this.lotNumber,
                po_number: this.poNumber,
                item_parts_number: this.partsNumber,
                quantity: this.orderQuantity,
                delivery_date: this.deliveryDate,
                jo_number: this.joNumber,
                revision_number: this.revisionNumber,
                date_issued: this.dateIssued,
                assigned_by: this.assignedBy,
                date_created: this.currentDate,
                wafer_number_from: this.waferNoFrom,
                wafer_number_to: this.waferNoTo,
                item_code: this.itemCode,
                assignment_status: this.formAssignmentStatus
            };
            this.formAssignment.push(temp_append);
          }
            for(const flowSub of this.processFlowSub){
                axios.post('http://172.16.2.69/tpcrequesthandlers/ProcessFlowSubPostRequestHandler.php', {
                        assignment_id: this.formAssignmentId,
                        sequence_number: flowSub.sequence_number,
                        Pid: flowSub.Pid,
                        SubPid: flowSub.SubPid,
                        standard_time: flowSub.standard_time,
                        machine_time: flowSub.machine_time,
                        assignment_status: flowSub.assignment_status
                    }).then(response => {
                        console.log(response.data);
                        if(response.data.message === 'Process Flow Sub inserted successfully'){
                            document.getElementById(`status-${flowSub.flow_sub_id}`).disabled = true;
                            for(const item of this.itemConditions){
                            if(flowSub.SubPid == item.SubPid && item.item_status === 'Active'){
                                    axios.post('http://172.16.2.69/tpcrequesthandlers/ItemConditionPostRequestHandler.php', {
                                        assignment_id: this.formAssignmentId,
                                        sequence_number: item.sequence_number,
                                        SubPid: item.SubPid,
                                        detail_description: item.detail_description,
                                        field_type: item.field_type,
                                        min_value: item.min_value,
                                        max_value: item.max_value,
                                        typical_value: item.typical_value,
                                    }).then(response => {
                                        console.log(response.data)
                                        if(response.data.message === 'Item Condition inserted successfully'){
                                            document.getElementById(`itemStatus-${item.item_id}`).disabled = true;
                                            this.$refs.new.disabled = false;
                                        }
                                    }).catch(error => {
                                    
                                    });
                                }
                            }
                        }
                    }).catch(error => {
                        console.log(error)
                    });
        
            }
            
        })
        .catch(error => {
          console.log(error);
        });   
    },
    getCCIdetails(parts_number,po_number){
        this.customerDetails = [];
        this.customerPn = '';
        this.customerName = '';
        this.deliveryDate = '';
        this.orderQuantity = '';
        axios.get('http://172.16.2.69/tpcrequesthandlers/CCICustomerDetailsHandler.php', {
            method: 'GET',
                 headers: {
                     'Content-type': 'application/x-www-form-urlencoded'
                 },
                 params: {
                     po_number: po_number,
                     parts_number: parts_number
                 }
             })
            .then(response => {
                this.customerDetails = response.data;
                for(const details of this.customerDetails){
                    if(parts_number === details.p_n){
                        this.customerPn = details.p_n_2;
                        this.orderQuantity = details.qty;
                        this.deliveryDate = details.request_del;
                        this.customerName = details.customer1;
                    }
                }
             })
            .catch(error => {
                 console.log(error);
            });
    },
    showDetails(SubPid){
        this.show[SubPid] = !this.show[SubPid]
    },
    changeStatus(flowSubId){
        const flowStatusValue = document.getElementById(`status-${flowSubId}`).checked;
        const flowStatusLabel = document.getElementById(`label-${flowSubId}`);
        for(const flow of this.processFlowSub){
            if(flowSubId === flow.flow_sub_id && flowStatusValue === false){
                console.log('false');
                flow.assignment_status = 'Inactive';
                flowStatusLabel.textContent = 'Inactive';
                for(const item of this.itemConditions){
                    if(item.SubPid == flow.SubPid){
                        item.item_status = 'Inactive'
                        const itemStatusValue = document.getElementById(`itemStatus-${item.item_id}`);
                        const itemStatusLabel = document.getElementById(`itemLabel-${item.item_id}`);
                        itemStatusValue.checked = false;
                        itemStatusLabel.textContent = 'Inactive';
                        itemStatusValue.disabled = true;
                    }
                }
            } else if(flowSubId === flow.flow_sub_id && flowStatusValue === true) {
                console.log('true')
                flow.assignment_status = 'Active';
                flowStatusLabel.textContent = 'Active';
                for(const item of this.itemConditions){
                    if(item.SubPid == flow.SubPid){
                        item.item_status = 'Active'
                        const itemStatusValue = document.getElementById(`itemStatus-${item.item_id}`);
                        const itemStatusLabel = document.getElementById(`itemLabel-${item.item_id}`);
                        itemStatusValue.checked = true;
                        itemStatusLabel.textContent = 'Active';
                        itemStatusValue.disabled = false;
                    }
                }
            }
        }
    },
    changeItemStatus(itemId){
        const itemStatus = document.getElementById(`itemStatus-${itemId}`).checked;
        const itemLabel = document.getElementById(`itemLabel-${itemId}`);
        for(const item of this.itemConditions){
            if(itemId == item.item_id && itemStatus === false){
                item.item_status = 'Inactive';
                itemLabel.textContent = 'Inactive';
            } else if(itemId == item.item_id && itemStatus === true){
                item.item_status = 'Active';
                itemLabel.textContent = 'Active';
            }
        }
    },
    populatePartsNumber(selectedSection){
        this.partsNumber = '';
        this.itemCode = '';
        this.sectionDescription = '';
        this.revisionNumber = '';
        this.partsNumberOptions = [];
        this.itemCodeOptions = [];
        this.processFlowSub = [];
        this.itemConditions = [];
        const selectedPartsNumber = new Set();
        for(const flow of this.processFlow){    
            if(selectedSection === flow.section_code && flow.flow_status === 'Posted'){
                const partsNumber = flow.item_parts_number;
                if(!selectedPartsNumber.has(partsNumber)){
                    this.partsNumberOptions.push({item_parts_number: partsNumber});
                    selectedPartsNumber.add(partsNumber);
                }
            }
        }
        for(const section of this.section){
            if(selectedSection === section.section_code){
                this.sectionDescription = section.section_description;
            }
        }
        
    },
    getItemCodeAndLotNumber(selectedSection,partsNumber){
        this.itemCode = '';
        this.revisionNumber = '';
        this.itemCodeOptions = [];
        this.lotNumberOptions = [];
        this.poNumberOptions = [];
        this.processFlowSub = [];
        this.itemConditions = [];
        const selectedItemCode = new Set();
        const selectedLotNumber = new Set();
        const selectedPoNumber = new Set();
        for(const flow of this.processFlow){
            if(selectedSection === flow.section_code && partsNumber === flow.item_parts_number && flow.flow_status === 'Posted'){
                const itemCode = flow.item_code;
                if(!selectedItemCode.has(itemCode)){
                    this.itemCodeOptions.push({item_code: itemCode});
                    selectedItemCode.add(itemCode);
                }
                const CCILotRequestURL = axios.get('http://172.16.2.69/tpcrequesthandlers/CCIrequestHandler.php', {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    },
                    params: {
                        parts_number: partsNumber
                    }
                });
                const CCIPORequestURL = axios.get('http://172.16.2.69/tpcrequesthandlers/CCIPOrequestHandler.php', {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    },
                    params: {
                        parts_number: partsNumber
                    }
                });
                if(selectedSection.split('-').includes('CCI')){
                    Promise.all([CCILotRequestURL, CCIPORequestURL])
                   .then(responses => {
                        const lotResponse = responses[0];
                        const poResponse = responses[1];
                        for(const lot of lotResponse.data){
                            if(!selectedLotNumber.has(lot.lotno)){
                                this.lotNumberOptions.push({lot_number: lot.lotno})
                                selectedLotNumber.add(lot.lotno);
                            }
                        }
                        for(const po of poResponse.data){
                            if(!selectedPoNumber.has(po.po_no)){
                                this.poNumberOptions.push({po_number: po.po_no})
                                selectedPoNumber.add(po.po_no);
                            }
                        }
                    })
                   .catch(error => {
                        console.log(error);
                    });
                } else if(selectedSection.split('-').includes('POL')){
                    axios.get('http://172.16.2.69/tpcrequesthandlers/POLrequestHandler.php', {
                         method: 'GET',
                         headers: {
                             'Content-type': 'application/x-www-form-urlencoded'
                         },
                         params: {
                             parts_number: partsNumber
                         }
                     })
                    .then(response => {
                         for(const lot of response.data){
                            if(!selectedLotNumber.has(lot.cwp_input_plan_pol_orderno)){
                                this.lotNumberOptions.push({lot_number: lot.cwp_input_plan_pol_orderno});
                                selectedLotNumber.add(lot.cwp_input_plan_pol_orderno);
                            }
                         }
                     })
                    .catch(error => {
                         console.log(error);
                     });
                } else if(selectedSection.split('-').includes('CWP')){
                    axios.get('http://172.16.2.69/tpcrequesthandlers/CWPrequestHandler.php', {
                         method: 'GET',
                         headers: {
                             'Content-type': 'application/x-www-form-urlencoded'
                         },
                         params: {
                             parts_number: partsNumber
                         }
                     })
                    .then(response => {
                         for(const lot of response.data){
                            if(!selectedLotNumber.has(lot.cwp_input_plan_lotno)){
                                this.lotNumberOptions.push({lot_number: lot.cwp_input_plan_lotno});
                                selectedLotNumber.add(lot.cwp_input_plan_lotno);
                            }
                         }
                     })
                    .catch(error => {
                         console.log(error);
                     });
                } else if(selectedSection.split('-').includes('SWP')){
                    axios.get('http://172.16.2.69/tpcrequesthandlers/SWPrequestHandler.php', {
                         method: 'GET',
                         headers: {
                             'Content-type': 'application/x-www-form-urlencoded'
                         },
                         params: {
                             parts_number: partsNumber
                         }
                     })
                    .then(response => {
                         for(const lot of response.data){
                            if(!selectedLotNumber.has(lot.lot_number)){
                                this.lotNumberOptions.push({lot_number: lot.lot_number});
                                selectedLotNumber.add(lot.lot_number);
                            }
                         }
                     })
                    .catch(error => {
                         console.log(error);
                     });
                }
            }
        }
    },
    getRevisionNumber(selectedSection, partsNumber, itemCode){
        this.revisionNumber = '';
        this.flowMainId = '';
        this.processFlowSub = [];
        this.itemConditions = [];
        this.attachmentDetails = [];
        let latestRevisionNumber = -1;
        for(const flow of this.processFlow){
            if(selectedSection === flow.section_code && partsNumber === flow.item_parts_number && itemCode === flow.item_code && flow.flow_status === 'Posted'){
                if(parseInt(flow.revision_number) > latestRevisionNumber){
                    latestRevisionNumber = flow.revision_number;
                    this.revisionNumber = latestRevisionNumber;
                }
                for(const section of this.section){
                    if(selectedSection === section.section_code){
                        axios.get('http://172.16.2.69/tpcrequesthandlers/FlowSubRequestHandler.php', {
                         method: 'GET',
                         headers: {
                             'Content-type': 'application/x-www-form-urlencoded'
                         },
                         params: {
                             section_id: section.section_id,
                             parts_number: partsNumber,
                             flow_main_id: flow.flow_main_id,
                             revision_number: this.revisionNumber
                         }
                     })
                     .then(response => {
                         for(const flowSub of response.data){
                            for(const key of this.keyProcess){
                                if(flowSub.Pid == key.Pid){
                                    for(const sub of this.subProcess){
                                        if(flowSub.SubPid == sub.SubPid){
                                            this.processFlowSub.push({
                                                flow_sub_id: flowSub.flow_sub_id,
                                                flow_main_id: flowSub.flow_main_id,
                                                Pid: key.Pid,
                                                Pname: key.Pname,
                                                SubPid: sub.SubPid,
                                                SubPname: sub.SubPname,
                                                process_type: sub.process_type,
                                                sequence_number: flowSub.sequence_number,
                                                standard_time: flowSub.standard_time,
                                                machine_time: flowSub.machine_time,
                                                assignment_status: 'Active',
                                            });
                                            this.attachmentDetails.push({
                                                SubPid: sub.SubPid,
                                                SubPname: sub.SubPname,
                                                files: [],
                                            });
                                            axios.get('http://172.16.2.69/tpcrequesthandlers/ItemConditionRequestHandler.php', {
                                                 method: 'GET',
                                                 headers: {
                                                     'Content-type': 'application/x-www-form-urlencoded'
                                                 },
                                                 params: {
                                                     SubPid: sub.SubPid
                                                 }
                                             })
                                            .then(response => {
                                                for(const item of response.data){
                                                    this.itemConditions.push({
                                                        item_id: item.item_id,
                                                        SubPid: item.SubPid,
                                                        sequence_number: item.sequence_number,
                                                        detail_description: item.detail_description,
                                                        field_type: item.field_type,
                                                        typical_value: item.typical_value,
                                                        min_value: item.min_value,
                                                        max_value: item.max_value,
                                                        item_status: 'Active'
                                                    });       
                                                }

                                             })
                                            .catch(error => {
                                                 console.log(error);
                                            });
                                        }
                                    }
                                }
                            }
                         }
                     })
                    .catch(error => {
                         console.log(error);
                     });
                    }
                }
                
            }   
        }
    },
    
},
created() {
    this.formAssignment = this.formAssignmentResponse;
    this.section = this.sectionResponse;
    this.processFlow = this.processFlowResponse;
    this.keyProcess = this.keyProcessResponse;
    this.subProcess = this.subProcessResponse;
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
</style>