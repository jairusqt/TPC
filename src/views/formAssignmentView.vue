ng<template>
    <div class="col-md-12 row shadow mx-auto bg-light">
        <div class="col-md-4 mx-auto row p-3">
            <div class="col-md-4 p-2">
                <button class="btn btn-outline-primary w-100 shadow" @click="DeleteForm" :disabled="form_status === 'Posted'">
                    Delete
                </button>
            </div>
            <div class="col-md-4 p-2">
                <button class="btn btn-outline-primary w-100 shadow" ref="saveBtn" data-bs-toggle="modal" data-bs-target="#staticBackdrop" @click="Posting" disabled >
                    Save
                </button>
            </div>
            <div class="col-md-4 p-2">
                <button class="btn btn-outline-primary w-100 shadow" @click="returnForm">
                    Return
                </button>
            </div>
            <div class="col-md-4 p-2">
                <button class="btn btn-outline-primary w-100 shadow" @click="generateQrCode" ref="qrBtn" :disabled="form_status === 'Unposted'">
                    QR Code
                </button>
            </div>
            <div class="col-md-8 p-2">
                <button class="btn btn-outline-primary w-100 shadow" @click="routeAttachment" :disabled="hasAttachment === 0">
                    Attachments
                </button>
            </div>
            <div class="col-md-3">
                Assignment Number: {{assignment_id}}
            </div>
            <div class="col-md-3">
                <p>Assigned by : <em>{{assigned_by}}</em></p>
            </div>
            <div class="col-md-3">
                <p>Date Created : <em>{{date_created}}</em></p>
            </div>
            <div class="col-md-3">
                <label for="status" v-if="form_status === 'Unposted'">Form Status :</label>
                <select v-if="form_status === 'Unposted'" class="form-select" id="status" @change="enableSaveBtn" v-model="form_status">
                    <option value="Posted">Posted</option>
                    <option value="Unposted">Unposted</option>
                </select>
                <p v-else>Form Status : {{form_status}}</p>
            </div>
            <div class="col-md-3">
                <button class="btn btn-sm w-100 btn-outline-dark" data-bs-toggle="modal" data-bs-target="#withMixing">
                    Assignment Status
                </button>
            </div>
            <div class="col-md-3"></div>
            <div class="col-md-3"></div>
            <div class="col-md-3">
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" role="switch" id="hasAttachment" :checked="hasAttachment === 1" disabled>
                  <label class="form-check-label" for="hasAttachment">Attachment</label>
                </div>
            </div>
        </div>
        <div class="col-md-8 mx-auto row rounded border border-primary shadow-lg overflow-scroll" style="height: 200px;">
                <template v-if="section_code === 'CWP'">
                    <p class="text-center"><em><b>Input Main Header - {{ section_description }}</b></em></p>
                    <div class="row">
                        <div class="col">
                            <ul>
                                <li><small>Item Code: {{ item_code }}</small></li>
                                <li><small>Item Parts Number: {{ item_parts_number }}</small></li>
                                <li><small>Lot Number: {{ lot_number }}</small></li>
                                <li><small>JO Number: {{ jo_number }}</small></li>
                                <li><small>Date Issued: {{ date_issued }}</small></li>
                                <li><small>Specs: {{ specs }}</small></li>
                            </ul>
                        </div>
                        <div class="col">
                            <ul>
                                <li><small>K Value: {{ k_value }}</small></li>
                                <li><small>K Value Level: {{ k_value_level }}</small></li>
                                <li><small>Material Lot Number: {{ material_lot_number }}</small></li>
                                <li><small>Main Material Lot Number: {{ main_material_lot_number }}</small></li>
                                <li><small>Seed Crystal Lot Number: {{ seed_crystal_lot_number }}</small></li>
                                <li><small>Ceramic Lot: {{ ceramic_lot }}</small></li>
                            </ul>
                        </div>
                        <div class="col">
                            <ul>
                                <li><small>SWR SLI Number: {{ swr_sli_number }}</small></li>
                                <li><small>Wafer Size: {{ wafer_size }}</small></li>
                                <li><small>Quantity: {{ qty }}</small></li>
                                <li><small>Seed Material Lot: {{ seed_material_lot }}</small></li>
                                <li><small>Size: {{ size }}</small></li>
                                <li><small>Lot Number Sub: {{ lot_number_sub }}</small></li>
                            </ul>
                        </div>
                        <p><small>Remarks: {{ remarks }}</small></p>
                        <p><small>SWR Remarks: {{ remarks_swr }}</small></p>
                    </div>
                </template>
                <!-- <template v-if="section_code === 'CWP' && item_parts_number !== ''">
                    <p class="text-center"><em><b>Input Main Header - {{ section_description }}</b></em></p>
                    <div class="col-6">
                        <ul>
                            <li><em>JO Number - <b>{{jo_number }}</b></em></li>
                            <li><em>Quantity - <b>{{quantity}}</b></em></li>
                            <li><em>Wafer Size - <b>{{wafer_size}}</b></em></li>
                            <li><em>Thickness - <b>{{thickness}}</b></em></li>
                        </ul>
                    </div>
                    <div class="col-6">
                        <ul>
                            <li><em>Material Lot Number - <b>{{material_lot_number}}</b></em></li>
                            <li><em>K Value - <b>{{k_value}}</b></em></li>
                            <li><em>K Value Level - <b>{{k_value_level }}</b></em></li>
                            <li><em>Seed Crystal Lot Number - <b>{{seed_crystal_lot_number }}</b></em></li>
                        </ul>
                    </div>
                    <div class="col-md-4">
                        <label for=""><em>Production Head:</em></label>
                        <p class="text-center"><em><b><u>{{ prod_head }}</u></b></em></p>
                    </div>
                    <div class="col-md-4">
                        <label for=""><em>Production Control:</em></label>
                        <p class="text-center"><em><b><u>{{ prod_control }}</u></b></em></p>
                    </div>
                    <div class="col-md-4">
                        <label for=""><em>Prepared By:</em></label>
                        <p class="text-center"><em><b><u>{{ prepared_by }}</u></b></em></p>
                    </div>
                </template>
                <template v-if="section_code === 'CWP' && item_parts_number === '' && seed_material_lot === null && lot_number_sub === null">
                    <p class="text-center"><em><b>Input Main Header - {{ section_description }}</b></em></p>
                    <div class="col-4">
                        <ul>
                            <li><em>Lot Number - <b>{{lot_number }}</b></em></li>
                            <li><em>Thickness - <b>{{ thickness }}</b></em></li>
                        </ul>
                    </div>
                    <div class="col-4">
                        <ul>
                            <li><em>K Value - <b>{{k_value}}</b></em></li>
                            <li><em>Wafer Size - <b>{{ wafer_size }}</b></em></li>
                        </ul>
                    </div>
                    <div class="col-4">
                        <ul>
                            <li><em>Quantity - <b>{{qty}}</b></em></li>
                            <li><em>Date Issued - <b>{{date_issued}}</b></em></li>
                        </ul>
                    </div>
                    <div>
                        SWR Remarks: {{ remarks_swr }}
                    </div>
                    <div>
                        Remarks: {{remarks}}
                    </div>
                </template>
                <template v-if="section_code === 'CWP' && seed_material_lot !== null && k_value_level === ''">
                    <p class="text-center"><em><b>Input Main Header - {{ section_description }} - Seed Crystal</b></em></p>
                        <div class="col-6">
                            <p class="text-center p-3"><em>Material Lot Number - <b>{{ seed_material_lot }}</b></em></p>
                        </div>
                        <div class="col-6">
                            <p class="text-center p-3"><em>Seed Crystal Lot Number - <b>{{ seed_crystal_lot_number }}</b></em></p>
                        </div>
                        <div class="col-6">
                            <p class="text-center p-3"><em>Size - <b>{{ size }}</b></em></p>
                        </div>
                        <div class="col-6">
                            <p class="text-center p-3"><em>Specs - <b>{{ specs }}</b></em></p>
                        </div>
                </template>
                <template v-if="section_code === 'CWP' && lot_number_sub !== null && k_value_level === ''">
                    <p class="text-center"><em><b>Input Main Header - {{ section_description }} - Lanthanum</b></em></p>
                        <div class="col-6">
                            <p class="text-center p-3"><em>Lot Number - <b>{{ lot_number }}</b></em></p>
                        </div>
                        <div class="col-6">
                            <p class="text-center p-3"><em>Sub Lot Number - <b>{{ lot_number_sub }}</b></em></p>
                        </div>
                        <div class="col-6">
                            <p class="text-center p-3"><em>Applied Ceramic Lot - <b>{{ ceramic_lot }}</b></em></p>
                        </div>
                        <div class="col-6">
                            <p class="text-center p-3"><em>K Value - <b>{{ k_value }}</b></em></p>
                        </div>
                </template> -->
                <template v-if="section_code === 'CCI'">
                            <p class="text-center"><em><b>Input Main Header - {{ section_description }}</b></em></p>
                            <div class="col-3">
                                <ul>
                                    <li><em>Order P/N - <b>{{order_pn }}</b></em></li>
                                    <li><em>Parts Number - <b>{{item_parts_number}}</b></em></li>
                                    <li><em>Lot Number - <b>{{lot_number}}</b></em></li>
                                    <li><em>PO Number - <b>{{po_number}}</b></em></li>
                                    <li><em>Customer's P/N - <b>{{customer_pn}}</b></em></li>
                                </ul>
                            </div>
                            <div class="col-3">
                                <ul>
                                    <li><em>Customer's Name2 - <b>{{customer_name2}}</b></em></li>
                                    <li><em>Order Quantity - <b>{{order_quantity}}</b></em></li>
                                    <li><em>Quantity of Pack - <b>{{quantity_of_pack }}</b></em></li>
                                    <li><em>Shipping Destination - <b>{{shipping_destination }}</b></em></li>
                                    <li><em>Date of Delivery - <b>{{delivery_date}}</b></em></li>
                                </ul>
                            </div>
                            <div class="col-3">
                                <ul>
                                    <li><em>EQI - <b>{{eqi}}</b></em></li>
                                    <li><em>Customer's Name - <b>{{customer_name}}</b></em></li>
                                    <li><em>Model of Tray - <b>{{tray_model}}</b></em></li>
                                    <li><em>Original Quantity in - <b>{{ original_quantity_in }}</b></em></li>
                                    <li><em>STD Thickness - <b>{{ std_thickness }}</b></em></li>
                                </ul>
                            </div>
                            <div class="col-md-3">
                                <ul>
                                    <li><em>K Value - <b>{{k_value}}</b></em></li>
                                    <li><em>Clip - <b>{{clip}}</b></em></li>
                                    <li><em>Cover - <b>{{cover}}</b></em></li>
                                    <li><em>POCat - <b>{{ po_cat }}</b></em></li>
                                    <li><em>IO Code - <b>{{ io_code }}</b></em></li>
                                </ul>
                            </div>
                    </template>
                    <template v-if="section_code === 'LWP'">
                            <p class="text-center"><em><b>Input Main Header - {{ section_description }}</b></em></p>
                            <div class="col-4">
                                <ul>
                                    <li><em>Parts Number - <b>{{ item_parts_number }}</b></em></li>
                                    <li><em>Lot Number - <b>{{ lot_number }}</b></em></li>
                                    <li><em>Thickness - <b>{{ thickness }}</b></em></li>
                                </ul>
                            </div>
                            <div class="col-4">
                                <ul>
                                    <li><em>Order Number - <b>{{ order_no}}</b></em></li>
                                    <li><em>K value - <b>{{ k_value}}</b></em></li>
                                    <li><em>Surface A/B Face - <b>{{ surface }}</b></em></li>
                                </ul>
                            </div>
                            <div class="col-4">
                                <ul>
                                    <li><em>Material Lot Number - <b>{{material_lot_number}}</b></em></li>
                                    <li><em>Quantity - <b>{{ quantity }}</b></em></li>
                                    <li><em>Shape : <b>{{ shape }}</b></em></li>
                                    
                                </ul>
                            </div>
                    </template>
                    <template v-if="section_code === 'SWP' || section_code === 'CCD'">
                            <p class="text-center"><em><b>Input Main Header - {{ section_description }}</b></em></p>
                            <div class="col-4">
                                <ul>
                                    <li><em><b>{{ category_1 }}</b></em></li>
                                    <li><em>Parts Number - <b>{{ item_parts_number }}</b></em></li>
                                    <li><em>Lot Number - <b>{{ lot_number }}</b></em></li>
                                    <li><em>Tan Lot Number - <b>{{ tan_lot_number }}</b></em></li>
                                    <li><em>Thickness - <b>{{ thickness }}</b></em></li>
                                    <li><em>Dimension - <b>{{ dimension }}</b></em></li>
                                    <li><em>Make - <b>{{ make }}</b></em></li>
                                    <li><em>Mark - <b>{{ mark }}</b></em></li>
                                    <li><em>Remarks - <b>{{ remark }}</b></em></li>
                                    <li><em>Remarks 1 - <b>{{ remark1 }}</b></em></li>
                                    <li><em>Remarks 2 - <b>{{ remark2 }}</b></em></li>
                                    <li><em>Remarks 3 - <b>{{ remark3 }}</b></em></li>
                                    <li><em>Remarks 4 - <b>{{ remark4 }}</b></em></li>
                                </ul>
                            </div>
                            <div class="col-4">
                                <ul>
                                    <li><em>Au Sputter Lot Number - <b>{{ au_sputter_lot_number }}</b></em></li>
                                    <li><em>Surface A/B Face - <b>{{ surface }}</b></em></li>
                                    <li><em>Range - <b>{{ range }}</b></em></li>
                                    <li><em>K value - <b>{{ k_value }}</b></em></li>
                                    <li><em>Quantity - <b>{{ quantity }}</b></em></li>
                                </ul>
                            </div>
                            <div class="col-4">
                                
                                <ul>
                                    <li><em>Type - <b>{{ type }}</b></em></li>
                                    <li><em>Metalization Layers :</em></li>
                                    <li><em>A - <b>{{a_face}}</b></em></li>
                                    <li><em>B - <b>{{b_face}}</b></em></li>
                                    <li><em>Notes : {{ notes }}</em></li>
                                </ul>
                            </div>
                    </template>
            </div>
        </div>
                    <div v-if="section_code === 'CWP'" class="col-md-12 row shadow mx-auto bg-light p-2 sticky-top">
                        <div class="mx-auto row px-5 py-2">
                            <div class="col-md-2 rounded">
                                <label for="">Section :</label>
                                <p class="text-center"><em><b>{{section_code}}</b></em></p>
                            </div>
                            <div class="col-md-2 rounded">
                                <label for="">Item Code :</label>
                                <p class="text-center"><em><b>{{item_code}}</b></em></p>
                            </div>
                            <div class="col-md-2 rounded">
                                <label for="">Item Parts Number :</label>
                                <p class="text-center"><em><b>{{item_parts_number}}</b></em></p>
                            </div>
                            <div class="col-md-2 rounded">
                                <label for="">Lot Number :</label>
                                <p class="text-center"><em><b>{{lot_number}}</b></em></p>
                            </div>
                            <div class="col-md-2">
                                <label for="">Date Issued :</label>
                                <p class="text-center"><em><b>{{date_issued}}</b></em></p>
                             </div>
                            <div class="col-md-1 rounded">
                                <label for="">Wafer From :</label>
                                <p class="text-center"><em><b>{{wafer_from}}</b></em></p>
                            </div>
                            <div class="col-md-1 rounded">
                                <label for="">Wafer To :</label>
                                <p class="text-center"><em><b>{{wafer_to}}</b></em></p>
                            </div>
                        </div>
                    </div>
                    <div v-else-if="section_code === 'CCI'" class="col-md-12 row shadow mx-auto bg-light p-2 sticky-top">
                        <div class="mx-auto row px-5 py-2">
                            <div class="col-md-2 rounded">
                                <label for="">Section :</label>
                                <p class="text-center"><em><b>{{section_code}}</b></em></p>
                            </div>
                            <div class="col-md-2 rounded">
                                <label for="">Item Code :</label>
                                <p class="text-center"><em><b>{{item_code}}</b></em></p>
                            </div>
                            <div class="col-md-2 rounded">
                                <label for="">Item Parts Number :</label>
                                <p class="text-center"><em><b>{{item_parts_number}}</b></em></p>
                            </div>
                            <div class="col-md-2 rounded">
                                <label for="">Lot Number :</label>
                                <p class="text-center"><em><b>{{lot_number}}</b></em></p>
                            </div>
                            <div class="col-md-2">
                                <label for="">PO Number :</label>
                                <p class="text-center"><em><b>{{po_number}}</b></em></p>
                             </div>
                            <div class="col-md-1 rounded">
                                <label for="">Wafer From :</label>
                                <p class="text-center"><em><b>{{wafer_from}}</b></em></p>
                            </div>
                            <div class="col-md-1 rounded">
                                <label for="">Wafer To :</label>
                                <p class="text-center"><em><b>{{wafer_to}}</b></em></p>
                            </div>
                            <div class="col-md-6"></div>
                            <div class="col-md-6">
                                <label for="">Remarks :</label>
                                <p class="text-center text-danger"><em><b>{{remarks}}</b></em></p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-12 row shadow mx-auto bg-light p-2 sticky-top" v-else>
                        <div class="col-md-1">
                            <p>Section : <em><b>{{section_code}}</b></em></p>
                        </div>
                        <div class="col-md-3">
                            <p>Item Parts Number : <em><b>{{item_parts_number}}</b></em></p>
                        </div>
                        <div class="col-md-3">
                            <p>Item Code : <em><b>{{item_code}}</b></em></p>
                        </div>
                        <div class="col-md-2">
                            <p>Lot Number : <em><b>{{lot_number}}</b></em></p>
                        </div>
                        <div class="col-md-1">
                            <p>Revision No. : <em><b>{{revision_number}}</b></em></p>
                        </div>
                        <div class="col-md-1">
                            <p>Wafer From : <em><b>{{wafer_from}}</b></em></p>
                        </div>
                        <div class="col-md-1">
                            <p>Wafer To : <em><b>{{wafer_to}}</b></em></p>
                        </div>
                    </div>
    <div class="table-responsive rounded shadow border p-3">
        <table class="table table-hover">
            <thead class="text-bg-primary bg-gradient">
                <tr>
                    <th><em><small>Sequence No.</small></em></th>
                    <th><em><small>Key Process</small></em></th>
                    <th><em><small>Sub Process</small></em></th>
                    <th><em><small>Process Type</small></em></th>
                    <th><em><small>Standard Time</small></em></th>
                    <th><em><small>Machine Time</small></em></th>
                    <th><em><small>Sampling</small></em></th>
                    <th><em><small>Uncontrolled</small></em></th>
                    <th><em><small>Batching Type</small></em></th>
                    <th><em><small>Result Type</small></em></th>
                    <th><em><small>Status</small></em></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <template v-for="i of item" :key="item.SubPid">
                    <tr :class="i.assignment_status === 'Active' ? 'table-light' : 'table-secondary'" v-if="i.sequence_number > 0">
                        <td>{{i.sequence_number}}.</td>
                        <td><em><b>{{i.Pname}}</b></em></td>
                        <td><em><b>{{i.SubPname}}</b></em></td>
                        <td>{{i.process_type}}</td>
                        <td>{{i.Stdtime}}</td>
                        <td>{{i.Machtime}}</td>
                        <td>
                            <span :class="i.sampling === true ? 'badge text-bg-primary mx-auto' : 'badge text-bg-secondary'">
                                {{i.sampling === true ? 'With Sampling' : 'Without Sampling'}}
                            </span>
                        </td>
                        <td>
                            <span :class="i.uncontrolled === true ? 'badge text-bg-primary mx-auto' : 'badge text-bg-secondary'">
                                {{i.uncontrolled === true ? 'Uncontrolled Quantity' : 'Controlled Quantity'}}
                            </span>
                        </td>
                        <td>
                            <span :class="i.batching_type === 'Parallel' ? 'badge text-bg-primary fs-6' : 'badge text-bg-secondary fs-6'">
                                {{i.batching_type}}
                            </span>
                        </td>
                        <td>
                            <span :class="i.result_type === 'Chips' ? 'badge text-bg-primary mx-auto fs-6' : 'badge text-bg-secondary fs-6'">
                                {{i.result_type}}
                            </span>
                        </td>
                        <td>
                            <span :class="i.assignment_status === 'Active' ? 'badge text-bg-success' : 'badge text-bg-secondary'">
                                {{i.assignment_status}}
                            </span>
                        </td>
                        <td>
                            <button @click="toggleAccordion(i.SubPid)" class="btn btn-light">
                                <span class="material-symbols-outlined">
                                    {{ toggle[i.SubPid]? 'expand_less' : 'expand_more' }}
                                </span>
                            </button>
                        </td>
                    </tr>
                    <tr v-show="toggle[i.SubPid]">
                        <td colspan="12">
                            <div class="table-responsive border rounded shadow">
                                <table class="table shadow table-hover">
                                    <thead class="text-bg-primary bg-gradient">
                                        <tr>
                                            <th><em><small>Sequence No.</small></em></th>
                                            <th><em><small>Process Detail Description</small></em></th>
                                            <th><em><small>Typical Value</small></em></th>
                                            <th><em><small>Minimum Value</small></em></th>
                                            <th><em><small>Maximum Value</small></em></th>
                                            <th><em><small>Visibility Status</small></em></th>
                                            <th><em><small>Condition Status</small></em></th>
                                        </tr>
                                    </thead>
                                    <tbody class="table-light">
                                        <template v-for="c in i.itemCondition" :key="c.condition_item_id">
                                            <tr>
                                                <td>{{c.sequence_number}}.</td>
                                                <td><em><b>{{c.detail_description}}</b></em></td>
                                                <td><em><b><u>{{c.typical_value}}</u></b></em></td>
                                                <td>{{c.min_value}}</td>
                                                <td>{{c.max_value}}</td>
                                                <td>
                                                    <span :class="c.visibility_status_checked === true ? 'badge text-bg-primary mx-auto' : 'badge text-bg-secondary'">
                                                        {{i.visibility_status_checked === true ? 'Visible' : 'Not Visible'}}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div class="form-check form-switch">
                                                        <span :class="c.condition_status === 'Active' ? 'badge text-bg-success' : 'badge text-bg-secondary'">
                                                            {{c.condition_status}}
                                                        </span>
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
            <tbody>
                    <tr>
                        <td colspan="11">Hidden Sub Process List</td>
                        <td>
                            <button class="btn btn-outline-dark btn-sm w-100" @click="showHidden">
                                <span class="material-symbols-outlined fs-6">
                                    visibility
                                </span>
                            </button>
                        </td>
                    </tr>
                <template v-for="i of item" :key="item.SubPid" v-if="showHiddenSubs">
                    <tr :class="i.assignment_status === 'Active' ? 'table-light' : 'table-secondary'" v-if="i.sequence_number === 0">
                        <td>{{i.sequence_number}}.</td>
                        <td><em><b>{{i.Pname}}</b></em></td>
                        <td><em><b>{{i.SubPname}}</b></em></td>
                        <td>{{i.process_type}}</td>
                        <td>{{i.Stdtime}}</td>
                        <td>{{i.Machtime}}</td>
                        <td>
                            <span :class="i.sampling === true ? 'badge text-bg-primary mx-auto' : 'badge text-bg-secondary'">
                                {{i.sampling === true ? 'With Sampling' : 'Without Sampling'}}
                            </span>
                        </td>
                        <td>
                            <span :class="i.uncontrolled === true ? 'badge text-bg-primary mx-auto' : 'badge text-bg-secondary'">
                                {{i.uncontrolled === true ? 'Uncontrolled Quantity' : 'Controlled Quantity'}}
                            </span>
                        </td>
                        <td>
                            <span :class="i.batching_type === 'Parallel' ? 'badge text-bg-primary fs-6' : 'badge text-bg-secondary fs-6'">
                                {{i.batching_type}}
                            </span>
                        </td>
                        <td>
                            <span :class="i.result_type === 'Chips' ? 'badge text-bg-primary mx-auto fs-6' : 'badge text-bg-secondary fs-6'">
                                {{i.result_type}}
                            </span>
                        </td>
                        <td>
                            <span :class="i.assignment_status === 'Active' ? 'badge text-bg-success' : 'badge text-bg-secondary'">
                                {{i.assignment_status}}
                            </span>
                        </td>
                        <td>
                            <button @click="toggleAccordion(i.SubPid)" class="btn btn-light">
                                <span class="material-symbols-outlined">
                                    {{ toggle[i.SubPid]? 'expand_less' : 'expand_more' }}
                                </span>
                            </button>
                        </td>
                    </tr>
                    <tr v-show="toggle[i.SubPid]">
                        <td colspan="12">
                            <div class="table-responsive border rounded shadow">
                                <table class="table shadow table-hover">
                                    <thead class="text-bg-primary bg-gradient">
                                        <tr>
                                            <th><em><small>Sequence No.</small></em></th>
                                            <th><em><small>Process Detail Description</small></em></th>
                                            <th><em><small>Typical Value</small></em></th>
                                            <th><em><small>Minimum Value</small></em></th>
                                            <th><em><small>Maximum Value</small></em></th>
                                            <th><em><small>Visibility Status</small></em></th>
                                            <th><em><small>Condition Status</small></em></th>
                                        </tr>
                                    </thead>
                                    <tbody class="table-light">
                                        <template v-for="c in i.itemCondition" :key="c.condition_item_id">
                                            <tr>
                                                <td>{{c.sequence_number}}.</td>
                                                <td><em><b>{{c.detail_description}}</b></em></td>
                                                <td><em><b><u>{{c.typical_value}}</u></b></em></td>
                                                <td>{{c.min_value}}</td>
                                                <td>{{c.max_value}}</td>
                                                <td>
                                                    <!-- <div class="form-check form-switch">
                                                        <input class="form-check-input" type="checkbox" role="switch" :checked="c.visibility_status_checked" disabled>
                                                    </div> -->
                                                    <span :class="c.visibility_status_checked === true ? 'badge text-bg-primary mx-auto' : 'badge text-bg-secondary'">
                                                        {{i.visibility_status_checked === true ? 'Visible' : 'Not Visible'}}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div class="form-check form-switch">
                                                        <!-- <input class="form-check-input" :id="'condition_status'+c.condition_item_id" type="checkbox" role="switch" :checked="c.condition_status_checked" disabled>
                                                        <label :for="'condition_status'+c.condition_item_id">
                                                            
                                                        </label> -->
                                                        <span :class="c.condition_status === 'Active' ? 'badge text-bg-success' : 'badge text-bg-secondary'">
                                                            {{c.condition_status}}
                                                        </span>
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

    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="staticBackdropLabel">Posting Form ... {{SubPnameLoaded}}</h5>
              <button type="button" id="closeBtn" class="btn-close d-none" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="pt-3">
                    <p>Item Update Percent: {{itemLoader.toFixed(2)}}% / 100%</p>
                    <div class="progress" role="progressbar" aria-label="Animated striped example" :aria-valuenow="itemLoader" aria-valuemin="0" aria-valuemax="100">
                        <div class="progress-bar progress-bar-striped progress-bar-animated" :style="'width: '+itemLoader+'%'"></div>
                    </div>
                </div>
                
                <div class="pt-3">
                    <p>Insert Main Percent: {{mainLoader.toFixed(2)}}% / 100%</p>
                    <div class="progress" role="progressbar" aria-label="Animated striped example" :aria-valuenow="mainLoader" aria-valuemin="0" aria-valuemax="100">
                        <div class="progress-bar progress-bar-striped progress-bar-animated" :style="'width: '+mainLoader+'%'"></div>
                    </div>
                </div>
            </div>
            
          </div>
        </div>
      </div>
      <div class="modal fade" id="withMixing" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">Assignment Status
              </h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="table-responsive border rounded border-1 border-success">
                <div class="col-4 float-end p-2">
                    <label for="searchSub">Search Process:</label>
                    <input class="form-control" type="text" v-model="search">
                </div>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Key Process Name</th>
                            <th>Sub Process Name</th>
                            <th>
                                <div class="row">
                                    <div class="col-6">
                                        <small>Status</small>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-check form-switch">
                                          <input id="statusUpdate" class="form-check-input" type="checkbox" role="switch" :checked="true" @change="statusUpdate">
                                        </div>
                                    </div>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="i in filterList()">
                            <tr>
                                <td>{{i.Pname}}</td>
                                <td>{{i.SubPname}}</td>
                                <td>
                                    <div class="form-check form-switch">
                                        <input class="form-check-input" type="checkbox" role="switch" :id="i.SubPid+'-assignmentStatus'" :checked="i.assignment_status === 'Active' ? true : false" @change="assignmentStatus(i.SubPid)">
                                        <label class="form-check-label" :for="i.SubPid+'-assignmentStatus'">
                                            <span :class="i.assignment_status === 'Active' ? 'badge text-bg-success' : 'badge text-bg-secondary'">
                                                {{i.assignment_status}}
                                            </span>
                                        </label>
                                    </div>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
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
        import * as bootstrap from 'bootstrap';
        DataTable.use(DataTablesCore);
        export default {
        components: {
            DataTable,
        },
        data() {
            return {
                requestFormAssignmentURL: 'http://172.16.2.13/tpc-endpoint/GetFormAssignment.php',
                formAssignmentURL: 'http://172.16.2.13/tpc-endpoint/GetFormAssignment.php',
                formAssignmentPostURL: 'http://172.16.2.13/tpc-endpoint/PostFormAssignment.php',
                formAssignmentItemPostURL: 'http://172.16.2.13/tpc-endpoint/PostFormAssignmentItem.php',
                itemConditionPostURL: 'http://172.16.2.13/tpc-endpoint/PostFormAssignmentItemCondition.php',
                sectionURL: 'http://172.16.2.13/tpc-endpoint/GetSection.php',
                processFlowURL: 'http://172.16.2.13/tpc-endpoint/GetProcessFlow.php',
                keyProcessURL: 'http://172.16.2.13/tpc-endpoint/GetKeyProcess.php',
                subProcessURL: 'http://172.16.2.13/tpc-endpoint/GetSubProcess.php',
                processFlowSubURL: 'http://172.16.2.13/tpc-endpoint/requestProcessFlowSub.php',
                itemConditionDetailsURL: 'http://172.16.2.13/tpc-endpoint/requestItemConditionFlow.php',
                StatusPostingURL: 'http://172.16.2.13/tpc-endpoint/PutFormAssignmentStatus.php',
                insertTPCMainURL: 'http://172.16.2.13/tpc-endpoint/PostTPCMain.php',
    
                CWPInputMainURL: 'http://172.16.2.13/tpc-endpoint/requestCWPInputMain.php',
                CCIInputMainURL: 'http://172.16.2.13/tpc-endpoint/requestCCIInputMain.php',
                LWPInputMainURL: 'http://172.16.2.13/tpc-endpoint/requestLWPInputMain.php',
                SWPInputMainURL: 'http://172.16.2.13/tpc-endpoint/requestSWPInputMain.php',

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
                updateItemConditionURL: 'http://172.16.2.13/tpc-endpoint/PutFormAssignmentItemCondition.php',
    
                searchRequestURL: 'http://172.16.2.13/tpc-endpoint/requestSearchFormAssignment.php',
    
                itemURL: 'http://172.16.2.13/tpc-endpoint/GetItem.php',

               // itemConditionURL: 'http://172.16.2.13/tpc-endpoint/GetItemCondition.php',
               itemConditionURL: '',
               
                requestCondition: 'http://172.16.2.13/tpc-endpoint/requestCondition.php',

                // uncomment the top endpoint for production
                // development endpointDev  below
                // requestFormAssignmentURL: 'http://172.16.2.13/tpc-endpointDev/GetFormAssignment.php',
                // formAssignmentURL: 'http://172.16.2.13/tpc-endpointDev/GetFormAssignment.php',
                // formAssignmentPostURL: 'http://172.16.2.13/tpc-endpointDev/PostFormAssignment.php',
                // formAssignmentItemPostURL: 'http://172.16.2.13/tpc-endpointDev/PostFormAssignmentItem.php',
                // itemConditionPostURL: 'http://172.16.2.13/tpc-endpointDev/PostFormAssignmentItemCondition.php',
                // sectionURL: 'http://172.16.2.13/tpc-endpointDev/GetSection.php',
                // processFlowURL: 'http://172.16.2.13/tpc-endpointDev/GetProcessFlow.php',
                // keyProcessURL: 'http://172.16.2.13/tpc-endpointDev/GetKeyProcess.php',
                // subProcessURL: 'http://172.16.2.13/tpc-endpointDev/GetSubProcess.php',
                // processFlowSubURL: 'http://172.16.2.13/tpc-endpointDev/requestProcessFlowSub.php',
                // itemConditionDetailsURL: 'http://172.16.2.13/tpc-endpointDev/requestItemConditionFlow.php',
                // StatusPostingURL: 'http://172.16.2.13/tpc-endpointDev/PutFormAssignmentStatus.php',
                // insertTPCMainURL: 'http://172.16.2.13/tpc-endpointDev/PostTPCMain.php',
    
                // CWPInputMainURL: 'http://172.16.2.13/tpc-endpointDev/requestCWPInputMain.php',
                // CCIInputMainURL: 'http://172.16.2.13/tpc-endpointDev/requestCCIInputMain.php',
                // LWPInputMainURL: 'http://172.16.2.13/tpc-endpointDev/requestLWPInputMain.php',
                // SWPInputMainURL: 'http://172.16.2.13/tpc-endpointDev/requestSWPInputMain.php',

                // DeleteFormURL: 'http://172.16.2.13/tpc-endpointDev/DeleteForm.php',
                // DeleteItemURL: 'http://172.16.2.13/tpc-endpointDev/DeleteItem.php',
                // DeleteItemConditionURL: 'http://172.16.2.13/tpc-endpointDev/DeleteItemCondition.php',
    
                // CCILotRequestURL: 'http://172.16.2.13/tpc-endpointDev/HandleCCILotRequest.php',
                // CCIPoRequestURL: 'http://172.16.2.13/tpc-endpointDev/HandleCCIPoRequest.php',
                // CCICustomerDetailsURL: 'http://172.16.2.13/tpc-endpointDev/HandleCCICustomerDetails.php',
                // POLRequestURL: 'http://172.16.2.13/tpc-endpointDev/HandlePOLRequest.php',
                // CWPRequestURL: 'http://172.16.2.13/tpc-endpointDev/HandleCWPRequest.php',
                // SWPRequestURL: 'http://172.16.2.13/tpc-endpointDev/HandleSWPRequest.php',
                // FormRequestURL: 'http://172.16.2.13/tpc-endpointDev/requestFormAssignment.php',

                // CWPQuantityURL: 'http://172.16.2.13/tpc-endpointDev/GenerateCWPQuantity.php',
                // POLQuantityURL: 'http://172.16.2.13/tpc-endpointDev/GeneratePOLQuantity.php',
                // SWPQuantityURL: 'http://172.16.2.13/tpc-endpointDev/GenerateSWPQuantity.php',
    
                // updateItemStatusURL: 'http://172.16.2.13/tpc-endpointDev/PutFormAssignmentItemStatus.php',
                // updateItemConditionURL: 'http://172.16.2.13/tpc-endpointDev/PutFormAssignmentItemCondition.php',
    
                // searchRequestURL: 'http://172.16.2.13/tpc-endpointDev/requestSearchFormAssignment.php',
    
                // itemURL: 'http://172.16.2.13/tpc-endpointDev/GetItem.php',
                // itemConditionURL: 'http://172.16.2.13/tpc-endpointDev/GetItemCondition.php',
                // requestCondition: 'http://172.16.2.13/tpc-endpointDev/requestCondition.php',
                
                alert: '',
    
                toggle: {},
    
                formAssignment: [],
                section: [],
                keyProcess: [],
                subProcess: [],
                processFlow: [],
                itemCondition: [],
    
                partsNumber: [],
                lotNumberList: [],
                poNumber: [],
                itemCodeList: [],
                revisionNumberList: [],
    
                item: [],
                itemCondition: [],

                last_assignment_id: 0,
                form_status: '',
                assigned_by: '3141',
                date_created: '',
                item_parts_number: '',
                section_id: '',
                section_code: '',
                section_description: '',
                lot_number: '',
                po_number: '',
                item_code: '',
                material_lot_number: '',
                revision_number: '',
                customer_pn: '',
                quantity: '',
                customer_name: '',
                delivery_date: '',
                jo_number: '',
                date_issued: '',
                
                prod_head: '',
                prod_control: '',
                prepared_by: '',

                swr_sli_number: '',
                k_value_level: '',
                k_value:'',
                wafer_size: '',
                thickness: '',
                seed_crystal_lot_number: '',

                seed_material_lot: '',
                lot_number_sub: '',

                assignment_id: '',

                hasAttachment: 0,
                hasInstruction: 0,
                
                submitting: false,

                itemLoader: 0,
                mainLoader: 0,

                SubPnameLoaded: '',

                flow_main_id: '',
                flow: '',

                flowSub: [],

                tableOptions: {
                    order: [[0, 'desc']]
                },
                search: '',

                deleteSuccess: false,

                showHiddenSubs: false,
            }
        },
        computed: {
            
        },
        methods: {
            showHidden(){
                this.showHiddenSubs = !this.showHiddenSubs
            },
            statusUpdate(){
                let checked = document.getElementById('statusUpdate').checked;
                this.filterList().filter(i => {
                    i.assignment_status = checked === true ? 'Active' : 'Inactive';
                })
            },
            assignmentStatus(SubPid){
                let checked = document.getElementById(`${SubPid}-assignmentStatus`).checked;
                let i = this.item.find(i => {
                    if(parseInt(i.SubPid) === parseInt(SubPid)){
                        return i;
                    }
                });
                i.assignment_status = checked === true ? 'Active' : 'Inactive';
            },
            filterList(){
                return this.item.filter(i => {
                  const Pname = i.Pname?.toLowerCase() || '';
                  const subPname = i.SubPname?.toLowerCase() || '';
                  return Pname.includes(this.search.toLowerCase()) || subPname.includes(this.search.toLowerCase());
                });
            },
            withMixing(){
                let check = document.getElementById('mixing').checked;
                if(!check){
                    this.item.find(i => {
                        if(i.Pname === 'CWP Mixing'){
                            i.assignment_status = 'Inactive';
                        }
                    })
                } else {
                    this.item.find(i => {
                        if(i.Pname === 'CWP Mixing'){
                            i.assignment_status = 'Active';
                        }
                    })
                }
               
            },
            routeAttachment(){
                this.$router.push({ name: 'formAttachments', query: { assignment_id: this.assignment_id} });
            },
            returnForm(){
                this.$router.push({ name: 'formAssignment'});
            },
            async DeleteForm(){
                await this.deleteItemCondition();
                await this.deleteItem();
                await this.deleteForm();
                await this.$router.push({ name: 'formAssignment', query: { deleteSuccess: true}});
            },
            async deleteForm(){
                await axios.post(this.DeleteFormURL, {
                    assignment_id: this.assignment_id
                }).then(response => {
                }).catch(error => {
                    console.log(error);
                });
            },
            async deleteItem(){
                await axios.post(this.DeleteItemURL, {
                    assignment_id: this.assignment_id
                }).then(response => {
                }).catch(error => {
                    console.log(error);
                });
            },
            async deleteItemCondition(){
                await axios.post(this.DeleteItemConditionURL, {
                    assignment_id: this.assignment_id
                }).then(response => {
                }).catch(error => {
                    console.log(error);
                });
            },
            
            generateQrCode(){
                this.$router.push({ name: 'GenerateQrCode', query: { assignment_id: this.assignment_id, item_code: this.item_code, parts_number: this.item_parts_number, lot_number: this.lot_number, date_issued: this.date_issued, revision_number: this.revision_number} });
            },
            toggleAccordion(SubPid){
                this.toggle[SubPid] = !this.toggle[SubPid];
            },
            checkSampling(SubPid){
                let sampling = document.getElementById(`sampling${SubPid}`).checked;
                let i = this.item.find(i => parseInt(i.SubPid) === SubPid);
                i.sampling = sampling
                i.check_sampling = sampling === true ? 'True' : 'False'
            },
            checkUncontrolled(SubPid){
                let uncontrolled = document.getElementById(`uncontrolled${SubPid}`).checked;
                let i = this.item.find(i => parseInt(i.SubPid) === SubPid);
                i.uncontrolled = uncontrolled
                i.check_uncontrolled = uncontrolled === true ? 'True' : 'False'
            },
            handleStatus(id){
                let status = document.getElementById(`status${id}`).checked;
                let i = this.item.find(i => i.assignment_item_id === id);
                i.assignment_checked = status;
                i.assignment_status = status === true ? 'Active' : 'Inactive';
                for(const c of i.itemCondition){
                    c.condition_status_checked = status;
                    c.condition_status = status === true ? 'Active' : 'Inactive';
                }
            },
            enableSaveBtn(){
                this.$refs.saveBtn.disabled = false;
                this.$refs.qrBtn.disabled = true;
            },
            async Posting(){
                this.$refs.saveBtn.disabled = true;

                let localItemLoader = 0;
                let localMainLoader = 0;
                let itemLimit = this.item.length;

                await axios.put(this.StatusPostingURL, {
                    assignment_status: this.form_status,
                    assignment_id: this.assignment_id,
                }).then(response => {
                }).catch(error => {
                    console.log(error);
                });

                for(const i of this.item){
                    this.SubPnameLoaded = i.SubPname;
                    await axios.put(this.updateItemStatusURL, {
                        item_status: i.assignment_status,
                        check_sampling: i.check_sampling,
                        check_uncontrolled: i.check_uncontrolled,
                        batching_type: i.batching_type,
                        result_type: i.result_type,
                        assignment_item_id: i.assignment_item_id,
                    }).then(response => {
                        if(response.data.message === 'Form Assignment item Status updated successfully'){
                            localItemLoader++;
                            this.itemLoader = (localItemLoader / itemLimit) * 100;
                        }
                    }).catch(error => {
                        console.log(error);
                    });
                    
                    await axios.post(this.insertTPCMainURL, {
                        assignment_id: this.assignment_id,
                        section_id: this.section_id,
                        sequence_number: i.sequence_number,
                        SubPid: i.SubPid,
                        parts_number: this.item_parts_number,
                        item_code: this.item_code,
                        revision_number: this.revision_number,
                        lot_number: this.lot_number,
                        item_status: i.status,
                        sampling: i.check_sampling,
                        uncontrolled: i.check_uncontrolled,
                        date_issued: this.date_issued,
                        quantity: this.quantity,
                        batching_type: i.batching_type,
                        result_type: i.result_type,
                        status: i.assignment_status,
                        with_quantity: i.with_quantity
                    }).then(response => {
                        if(response.data.message === 'TPC Main inserted successfully'){
                            localMainLoader++
                            this.mainLoader = (localMainLoader / itemLimit) * 100;
                            if(localItemLoader === itemLimit){
                                let close = document.getElementById('closeBtn');
                                close.click();
                                this.$refs.qrBtn.disabled = false;
                            }
                        }
                    }).catch(error => {
                        console.log(error);
                    });
                }
            }
        },
            
        async created() {
            this.assignment_id = parseInt(this.$route.query.assignment_id);
            console.log(this.assignment_id)
            await axios.get(this.sectionURL, {}).
            then(response => {
                this.section = response.data;
            }).catch(error => {
                console.log(error);
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

            await axios.get(this.processFlowURL, {}).
            then(response => {
                this.processFlow = response.data;
            }).catch(error => {
                console.log(error);
            });
        
            await axios.get(this.FormRequestURL, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                params: {
                    assignment_id: this.assignment_id
                }
            }).then(response => {
                console.log(response.data)
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
            
            this.formAssignment.filter((form) => {
                if(this.assignment_id === parseInt(form.assignment_id)){
                    this.hasAttachment = parseInt(form.attachment);
                    this.hasInstruction = parseInt(form.special_instruction);
                    this.form_status = form.assignment_status;
                    this.section_id = form.section_id;
                    this.section.filter((sec) => {
                        if(parseInt(sec.section_id) === parseInt(form.section_id)){
                            this.section_code = sec.section_code;
                            this.section_description = sec.section_description;
                        }
                    })
                    this.item_code = form.item_code;
                    this.item_parts_number = form.item_parts_number;
                    this.revision_number = form.revision_number;
                    this.lot_number = form.lot_number;
                    this.wafer_from = form.wafer_number_from;
                    this.wafer_to = form.wafer_number_to;
                    this.jo_number = form.jo_number;
                    this.quantity = form.quantity;
                    this.date_issued = form.date_issued;
                }
            })

            await axios.get(this.itemURL,{
                method: 'GET',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                params: {
                    assignment_id: this.assignment_id
                }
            }).then(response => {
                this.item = response.data;
            
            }).catch(error => {
                console.log(error);
            });
            this.itemConditionURL = `http://172.16.2.13:3000/getItemCondition/${this.assignment_id}`
            await axios.get(this.itemConditionURL, {
                assignment_id: this.assignment_id
            }).then(response => {
                this.itemCondition = response.data;
            }).catch(error => {
                console.log(error)
            })
            console.log(this.section_id)
            this.flow = this.processFlow.find(flow => parseInt(flow.section_id) === parseInt(this.section_id) && flow.item_code === this.item_code && parseInt(flow.revision_number) === parseInt(this.revision_number) && flow.flow_status === 'Posted');
            console.log(this.flow)
            this.flow_main_id = this.flow.flow_main_id === null ? '' : this.flow.flow_main_id;

            await axios.get(this.processFlowSubURL,{
                method: 'GET',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                params: {
                    section_id: this.section_id,
                    parts_number: this.item_parts_number,
                    flow_main_id: this.flow_main_id,
                    revision_number: this.revision_number
                }
            }).then(response => {
                this.flowSub = response.data;
            }).catch(error => {
                console.log(error);
            })
            
            for(const item of this.item){
                let sub = this.flowSub.find(s => parseInt(s.SubPid) === parseInt(item.SubPid));
                Object.assign(item, {
                    itemCondition: [],
                    assignment_checked: item.assignment_status === "Active" ? true : false,
                    sampling: item.check_sampling === "True" ? true : false,
                    uncontrolled: item.check_uncontrolled === "True" ? true : false, 
                    status: sub.status,
                    with_quantity: sub.with_quantity
                })
                this.subProcess.filter((sub) => {
                    if(parseInt(item.SubPid) === parseInt(sub.SubPid)){
                        Object.assign(item, {
                            Pid: sub.Pid,
                            SubPname: sub.SubPname,
                            process_type: sub.process_type
                        })
                    }
                })
                this.keyProcess.filter((key) => {
                    if(parseInt(item.Pid) === parseInt(key.Pid)){
                        Object.assign(item, {
                            Pname: key.Pname
                        })
                    }
                })

                this.itemCondition.filter((condition) => {
                    Object.assign(condition, {
                        condition_status_checked: condition.condition_status === 'Active' ? true : false,
                        visibility_status_checked: condition.visibility_status === 1 ? true : false
                    })
                    if(parseInt(item.SubPid) === parseInt(condition.SubPid)){
                        item.itemCondition.push(condition);
                    }
                })
            }
            switch(this.section_code){
                case 'CWP':
                await axios.get(this.CWPInputMainURL, {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    },
                    params: {
                        assignment_id: this.assignment_id
                    }
                }).then(response => {
                    for(const d of response.data){
                        this.material_lot_number = d.material_lot_number;
                        this.jo_number = d.jo_number;
                        this.k_value = d.k_value;
                        this.k_value_level = d.k_value_level;
                        this.seed_crystal_lot_number = d.seed_crystal_lot_number;
                        this.swr_sli_number = d.swr_sli_number;
                        this.thickness = d.thickness;
                        this.wafer_size = d.wafer_size;
                        this.prepared_by = d.prepared_by;
                        this.prod_control = d.prod_control;
                        this.prod_head = d.prod_head;
                        this.qty = d.qty;
                        this.remarks_swr = d.remarks_swr;
                        this.remarks = d.remarks;
                        this.seed_material_lot = d.seed_material_lot;
                        this.size = d.size;
                        this.specs = d.specs;
                        this.lot_number_sub = d.lot_number_sub;
                        this.lot_number = d.lot_number;
                        this.ceramic_lot = d.ceramic_lot;
                    }   
                }).catch(error => {
                    console.log(error)
                });
                break;
                case 'CCI':
                await axios.get(this.CCIInputMainURL, {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    },
                    params: {
                        assignment_id: this.assignment_id
                    }
                }).then(response => {
                    for(const d of response.data){
                        this.order_pn = d.order_pn;
                        this.po_number = d.po_number;
                        this.customer_pn = d.customer_pn;
                        this.customer_name = d.customer_name;
                        this.customer_name2 = d.customer_name2;
                        this.order_quantity = d.order_quantity;
                        this.quantity_of_pack = d.quantity_of_pack;
                        this.shipping_destination = d.shipping_destination;
                        this.delivery_date = d.delivery_date;
                        this.eqi = d.eqi;
                        this.tray_model = d.tray_model;
                        this.original_quantity_in = d.original_quantity_in;
                        this.std_thickness = d.std_thickness;
                        this.k_value = d.k_value;
                        this.clip = d.clip;
                        this.cover = d.cover;
                        this.po_cat = d.po_cat;
                        this.io_code = d.io_code;
                        this.remarks = d.remarks
                    }
                }).catch(error => {
                    console.log(error);
                })
                break;
                case 'LWP':
                await axios.get(this.LWPInputMainURL, {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    },
                    params: {
                        assignment_id: this.assignment_id
                    }
                }).then(response => {
                    for(const d of response.data){
                        this.thickness = d.thickness;
                        this.order_no = d.order_number;
                        this.k_value = d.k_value;
                        this.surface = d.surface;
                        this.material_lot_number = d.material_lot_number;
                        this.shape = d.shape;
                    }
                }).catch(error => {
                    console.log(error)
                });
                break;
                case 'SWP':
                await axios.get(this.SWPInputMainURL, {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    },
                    params: {
                        assignment_id: this.assignment_id
                    }
                }).then(response => {
                    for(const d of response.data){
                        this.thickness = d.thickness;
                        this.au_sputter_lot_number = d.au_sputter_lot_number;
                        this.dimension = d.dimension;
                        this.surface = d.surface;
                        this.type = d.type;
                        this.a_face = d.a_face;
                        this.b_face = d.b_face;
                        this.range = d.range_spec;
                        this.k_value = d.k_value;
                        this.tan_lot_number = d.tan_lot_number;
                        this.notes = d.notes;
                        this.category_1 = d.category_1;
                        this.category_2 = d.category_2;
                        this.remarks = d.remarks;
                        this.remarks_2 = d.remarks_2;                  
                        this.plate = d.plate
                    }
                }).catch(error => {
                    console.log(error)
                });
                break;
            }

            this.date_created = new Date().toJSON().slice(0, 10);
            let curDate = new Date();
        },
        
        }
        </script>
        
        <style>
        @import 'datatables.net-bs5';
        @import 'animate.css';
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,300,0,0');
        @import '@splidejs/vue-splide/css/sea-green';
        </style>