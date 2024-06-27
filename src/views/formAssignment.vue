<template>
    <div class="p-3 px-5">
        <div class="form-check form-switch float-end">
          <input class="form-check-input" type="checkbox" role="switch" id="distinctSearch" @change="switchDistinctSearch">
          <label class="form-check-label" for="distinctSearch">
            <span class=" align-top material-symbols-outlined">search</span>
            Distinct Search
        </label>
        </div>
    </div>
    <div class="row col-md-12 col-sm-12 mx-auto p-3 px-5">
        <div class="col-md-10">
            <h3>Tablet Process Card - <em>Form Assignment</em></h3>
        </div>
        <div class="col-md-2 float-end">
            <button id="createFormBtn" class="btn btn-sm btn-outline-dark w-100 float-end shadow gradient" data-bs-toggle="modal" data-bs-target="#createForm">
                <span class=" align-top material-symbols-outlined">add</span>
                Create
            </button>
        </div>
    </div>
    <div class="px-5" v-if="distinctSearch">
        <div class="shadow rounded p-3">
            <div class="input-group mb-3">
              <span class="input-group-text material-symbols-outlined" id="basic-addon1">search</span>
              <input type="text" class="form-control" placeholder="Form Assignment Search By - Assignment Number / Lot Number / Item Parts Number / Date Issued / Revision Number" v-model="search" @input="querySearch(search)">
            </div>
            <div class="table table-responsive shadow border rounded">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Assignment No.</th>
                            <th>Status</th>
                            <th>Section</th>
                            <th>Lot Number</th>
                            <th>PO Number</th>
                            <th>Item Parts Number</th>
                            <th>Item Code</th>
                            <th>Quantity</th>
                            <th>Delivery Date</th>
                            <th>JO Number</th>
                            <th>Revision No.</th>
                            <th>Wafer From</th>
                            <th>Wafer To</th>
                            <th>Assigned By</th>
                            <th>Date Created</th>
                            <th>Date Issued</th>
                            <th>View</th>
                        </tr>
                    </thead>
                    <tbody>
                    <template v-for="form in displayedRows">
                        <tr>
                            <td>{{ form.assignment_id }}</td>
                            <td>{{ form.assignment_status }}</td>
                            <td>{{ form.section_code }}</td>
                            <td>{{ form.lot_number }}</td>
                            <td>{{ form.po_number }}</td>
                            <td>{{ form.item_parts_number }}</td>
                            <td>{{ form.item_code }}</td>
                            <td>{{ form.quantity }}</td>
                            <td>{{ form.delivery_date }}</td>
                            <td>{{ form.jo_number }}</td>
                            <td>{{ form.revision_number }}</td>
                            <td>{{ form.wafer_number_from }}</td>
                            <td>{{ form.wafer_number_to }}</td>
                            <td>{{ form.assigned_by }}</td>
                            <td>{{ form.date_created }}</td>
                            <td>{{ form.date_issued }}</td>
                            <td>
                                <button class="btn btn-sm" @click="viewForm(form.assignment_id)">
                                    <span class="material-symbols-outlined">visibility</span>
                                </button>
                            </td>
                        </tr>
                    </template>
                    </tbody>
                </table>
            </div>
            <div class="d-flex justify-content-center">
              <nav aria-label="Page navigation example">
                <ul class="pagination">
                  <li class="page-item" :disabled="currentPage === 1">
                    <a class="page-link" @click="previousPage" aria-label="Previous" >
                      <span aria-hidden="true">«</span>
                    </a>
                  </li>
                  <li class="page-item">
                    <a class="page-link" @click="nextPage" aria-label="Next">
                      <span aria-hidden="true">»</span>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
        </div>
    </div>
    <div class="collapse collapse-horizontal show" id="collapseWidthExample" v-else>
        <div class="table-responsive px-5 pt-5 shadow gradient">
            <DataTable
                :data="formAssignment"
                :columns="columns"
                class="display table-hover table table-light shadow gradient p-3"
                @click="getData"
                :options="tableOptions"
            />
        </div>
    </div>
    
    <div class="modal fade" id="createForm" tabindex="-1" aria-labelledby="createFormAssignment" aria-hidden="true">
        <div class="modal-dialog modal-fullscreen">
          <div class="modal-content">
            <div class="modal-body">
                <div class="col-md-12 bg-light row mx-auto">
                        <div class="col-md-4 mx-auto row h-100">
                            <div class="col-md-4 p-1">
                                <button class="btn btn-outline-primary w-100 h-100 shadow" @click="newForm">
                                    New
                                </button>
                            </div>
                            <div class="col-md-4 p-1">
                                <button class="btn btn-outline-primary w-100 h-100 shadow" data-bs-target="#loaderModal" data-bs-toggle="modal" @click="submitForm" ref="saveBtn">
                                    Save
                                </button>
                            </div>
                            <div class="col-md-4 p-1">
                                <button class="btn btn-outline-primary w-100 h-100 shadow" data-bs-dismiss="modal" ref="closeBtn">
                                    Close
                                </button>
                            </div>
                            <div class="col-md-4 p-1">
                                <button class="btn btn-outline-primary w-100 h-100 shadow" disabled>
                                    QR Code
                                </button>
                            </div>
                            <div class="col-md-8 p-1">
                                <button class="btn btn-outline-primary w-100 h-100 shadow" disabled>
                                    Attachments
                                </button>
                            </div>
                            <div class="col-md-4">
                                <label for="status">Form Status :</label>
                                <input id="status" type="text" class="form-select form-select-sm shadow" v-model="form_status" disabled>
                            </div>
                            <div class="col-md-4">
                                <label for="assigned_by">Assigned By :</label>
                                <input id="assigned_by" type="text" class="form-control form-control-sm shadow" v-model="assigned_by" disabled>
                            </div>
                            <div class="col-md-4">
                                <label for="date_created">Date Created :</label>
                                <input id="date_created" type="text" class="form-control form-control-sm shadow" v-model="date_created" disabled>
                            </div>
                            <div class="col-md-9"></div>
                            <div class="col-md-3 p-3 mx-auto">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" role="switch" id="has_attachment" @change="enableAttachment">
                                    <label class="form-check-label" for="has_attachment">Attachment</label>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-8 mx-auto row rounded shadow-lg overflow-scroll" style="height: 200px;">
                            <template v-if="section_code === 'CWP' && cwp_type === 'Hi-k'">
                            <p class="text-center"><em><b>Input Main Header - {{ section_description }}</b></em></p>
                            <div class="col-4">
                                <ul>
                                    <li><em>Lot Number - <b>{{lot_number }}</b></em></li>
                                    <li><em>Item Parts Number - <b>{{item_parts_number}}</b></em></li>
                                    <li><em>K Value Level - <b>{{k_value_level}}</b></em></li>
                                    <li><em>Main Material Lot Number - <b>{{main_material_lot_number}}</b></em></li>
                                </ul>
                            </div>
                            <div class="col-4">
                                <ul>
                                    <li><em>Wafer Size - <b>{{wafer_size}}</b></em></li>
                                    <li><em>Material Lot Number - <b>{{material_lot_number}}</b></em></li>
                                    <li><em>Seed Crystal Lot Number - <b>{{seed_crystal_lot_number }}</b></em></li>
                                    <li><em>Thickness - <b>{{thickness }}</b></em></li>
                                </ul>
                            </div>
                            <div class="col-4">
                                <ul>
                                    <li><em>Quantity - <b>{{quantity}}</b></em></li>
                                    <li><em>K Value - <b>{{k_value}}</b></em></li>
                                    <li><em>Date Issued - <b>{{ date_issued }}</b></em></li>
                                    <li><em>SWR/SLI Number - <b>{{ swr_sli_number }}</b></em></li>
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
                            <template v-if="section_code === 'CWP' && cwp_type === 'STD'">
                                <p class="text-center"><em><b>Input Main Header - {{ section_description }}</b></em></p>
                                <div class="col-4">
                                    <ul>
                                        <li><em>Lot Number - <b>{{lot_number }}</b></em></li>
                                        <li><em>Thickness: <input class="form-control" type="text" v-model="thickness"></em></li>
                                    </ul>
                                </div>
                                <div class="col-4">
                                    <ul>
                                        <li><em>K Value - <b>{{k_value}}</b></em></li>
                                        <li><em>Wafer Size: <input class="form-control" type="text" v-model="wafer_size"></em></li>
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
                            <template v-if="section_code === 'CWP' && cwp_type === 'Seed-Crystal'">
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
                            <template v-if="section_code === 'CWP' && cwp_type === 'Lanthanum'">
                                <div class="col-6">
                                    <p class="text-center p-3"><em>Lot Number - <b>{{ lanthanum_lot_number }}</b></em></p>
                                </div>
                                <div class="col-6">
                                    <p class="text-center p-3"><em>Sub Lot Number - <b>{{ lantha_lot_number_sub }}</b></em></p>
                                </div>
                                <div class="col-6">
                                    <p class="text-center p-3"><em>Applied Ceramic Lot - <b>{{ ceramic_lot }}</b></em></p>
                                </div>
                                <div class="col-6">
                                    <p class="text-center p-3"><em>K Value - <b>{{ k_value }}</b></em></p>
                                </div>
                            </template>
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
                                    <li><em>Shape :</em></li>
                                    <input type="text" class="form-control" v-model="shape">
                                </ul>
                            </div>
                            </template>
                            <template v-if="section_code === 'SWP'">
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
                            <template v-if="section_code === 'CCD'">
                            <p class="text-center"><em><b>Input Main Header - {{ section_description }}</b></em></p>
                          
                            </template>
                        </div>
                </div>
                <div class="col-md-12 row p-3 rounded border shadow bg-light bg-gradient mx-auto sticky-top">
                    <div class="col-md-1">
                        <label for="section">Section :</label>
                        <select id="section" @change="selectSection(section_id)" class="form-select shadow" v-model="section_id" :disabled="submittedSuccess === true">
                            <option v-for="sec in section" :value="sec.section_id">{{sec.section_code}}</option>
                        </select>
                    </div>
                    <div class="col-md-1" v-if="section_code === 'CWP'">
                        <label for="cwp_type"></label>
                        <select id="cwp_type" class="form-select shadow" v-model="cwp_type" :disabled="submittedSuccess === true">
                            <option value="Hi-k">Hi-k</option>
                            <option value="STD">STD</option>
                            <option value="Lanthanum">Lanthanum</option>
                            <option value="Seed-Crystal">Seed Crystal</option>
                        </select>
                    </div>  
                    <div class="col-md-2">
                        <label for="item_code">Item Code :</label>
                        <select id="item_code" @change="selectPartsNoAndRevNo(item_code)" class="form-select shadow" v-model="item_code" :disabled="submittedSuccess === true">
                            <option v-for="itemCode in itemCodeList" :value="itemCode.item_code">{{itemCode.item_code}}</option>
                        </select>
                    </div>  
                    <!-- <div class="col-md-2">
                        <label for="item_parts_number">Item Parts Number :</label>
                        <input type="text" class="form-control shadow" id="item_parts_number" v-model="item_parts_number" disabled>
                    </div> -->
                    <div class="col-md-1">
                        <label for="revision_number">Revision No. :</label>
                        <select id="revision_number" @change="getProcessFlow" class="form-select shadow" v-model="revision_number" :disabled="submittedSuccess === true">
                            <option v-for="revNo in revisionNumberList" :value="revNo.revision_number">{{revNo.revision_number}}</option>
                        </select>
                    </div>
                    <div class="col-md-1" v-if="section_code === 'CWP' && cwp_type === 'Hi-k' || cwp_type === 'STD'">
                        <label for="date_issued">Date Issued :</label>
                        <input type="date" class="form-control shadow" v-model="date_issued" @change="fetchCCPData">
                    </div>
                    <div class="col-md-2" v-else-if="section_code === 'CCI'">
                        <label for="po_number">PO Number :</label>
                        <input type="text" class="form-control shadow" id="po_number" v-model="po_number" @input="fetchCCPData">
                    </div>
                    <div class="col-md-2" v-else-if="section_code === 'LWP'">
                        <label for="lot_number">Lot Number :</label>
                        <input type="text" class="form-control shadow" id="lot_number" v-model="lot_number" @input="fetchCCPData">
                    </div>
                    <div class="col-md-2" v-if="section_code === 'SWP'">
                        <label for="parts_number">Parts Number :</label>
                        <input type="text" class="form-control shadow" id="parts_number" v-model="item_parts_number" @keyup.enter="fetchCCPData">
                    </div>
                    <div class="col-md-2" v-if="section_code === 'SWP'">
                        <label for="">Lot Number :</label>
                        <input type="text" class="form-control shadow" v-model="lot_number" @keyup.enter="requestSWPHeader">
                    </div> 
                    <div class="col-md-2" v-if="section_code === 'CCD'">
                        <label for="">Lot Number :</label>
                        <input type="text" class="form-control shadow" v-model="lot_number" @keyup.enter="requestCCDHeader">
                    </div>
                    <div class="col-md-2" v-if="section_code === 'CCD'">
                        <label for="">Parts Number :</label>
                        <input type="text" class="form-control shadow" v-model="item_parts_number">
                    </div>
                    <div v-if="section_code === 'LWP'" class="col-md-2">
                        <label for="lot_number">Standard Lot Number :</label>
                        <select id="lot_number" class="form-select shadow" v-model="std_lot_number" @change="getQuantityAndMaterialLotNo(section_code, item_parts_number, lot_number)" :disabled="submittedSuccess === true">
                            <option v-for="lot in lotNumberList" :value="lot.lot_number">{{lot.lot_number}}</option>
                        </select>
                    </div>
                    <div v-if="section_code === 'CWP' && cwp_type === 'Hi-k' || section_code === 'CCI'" class="col-md-2">
                        <label for="item_parts_number">Parts Number :</label>
                        <select id="item_parts_number" class="form-select shadow" v-model="item_parts_number" @change="requestLotNumber" :disabled="submittedSuccess === true">
                            <option value="" selected disabled></option>
                            <option v-for="pn in partsNumberList" :value="pn.parts_number">{{pn.parts_number}}</option>
                        </select>
                    </div>
                    <div v-if="section_code === 'CWP' && cwp_type === 'Hi-k'|| section_code === 'CWP' && cwp_type === 'STD' || section_code === 'CCI'" class="col-md-2">
                        <label for="lot_number">Lot Number :</label>
                        <select id="lot_number" class="form-select shadow" v-model="lot_number" @change="getQuantityAndMaterialLotNo(section_code, item_parts_number, lot_number)" :disabled="submittedSuccess === true">
                            <option v-for="lot in lotNumberList" :value="lot.lot_number">{{lot.lot_number}}</option>
                        </select>
                    </div>
                    <div v-if="section_code === 'CWP' && cwp_type === 'Seed-Crystal'" class="col-md-2">
                        <label for="">Seed Material Lot:</label>
                        <input type="text" v-model="seed_material_lot" class="form-control shadow" @input="fetchSeedLot(cwp_type, seed_material_lot)">
                    </div>
                    <div v-if="section_code === 'CWP' && cwp_type === 'Seed-Crystal'" class="col-md-2">
                        <label for="">Seed Crystal Lot Number: </label>
                        <select name="" id="" class="form-select shadow" v-model="seed_crystal_lot_number" @change="assignSeedHeader(seed_crystal_lot_number)">
                            <option v-for="lot in lotNumberList" :value="lot.lot_number">{{lot.lot_number}}</option>
                        </select>
                    </div>
                    <div v-if="section_code === 'CWP' && cwp_type === 'Lanthanum'" class="col-md-2">
                        <label for="lanthanum_lot">Lanthanum Lot Number</label>
                        <input type="text" class="form-control shadow" v-model="lanthanum_lot_number" @input="fetchLanthaLot(cwp_type, lanthanum_lot_number)">
                    </div>
                    <div v-if="section_code === 'CWP' && cwp_type === 'Lanthanum'" class="col-md-2">
                        <label for="">Lanthanum Lot Number Sub: </label>
                        <select name="" id="" class="form-select shadow" v-model="lantha_lot_number_sub" @change="assignLanthaHeader(lantha_lot_number_sub)">
                            <option v-for="lot in lotNumberList" :value="lot.lot_number">{{lot.lot_number}}</option>
                        </select>
                    </div>
                    <div class="col-md-1">
                        <label for="wafer_from">Wafer From :</label>
                        <input id="wafer_from" type="number" class="form-control shadow" v-model="wafer_from" :disabled="submittedSuccess === true">
                    </div>
                    <div class="col-md-1">
                        <label for="wafer_to">Wafer To :</label>
                        <input id="wafer_to" type="number" class="form-control shadow" v-model="wafer_to" :disabled="submittedSuccess === true">
                    </div>
                    <div class="col-md-2" v-if="section_code === 'CWP'">
                        <label for="quantity">Quantity :</label>
                        <input id="quantity" type="number" class="form-control shadow" v-model="quantity" :disabled="submittedSuccess === true">
                    </div>
                    <template v-if="section_code === 'CWP' || section_code === 'CCI'">
                        <div class="col-md-6"></div>
                        <div class="col-md-6">
                            <label for="remarks">Remarks :</label>
                            <textarea class="form-control" id="remarks" v-model="remarks"></textarea>
                        </div>
                    </template>
                    <template v-if="section_code === 'SWP' || section_code === 'CCD'">
                        <div class="col-md-2">
                            <label for="quantity">Quantity :</label>
                            <input class="form-control shadow" type="number" id="quantity" v-model="quantity">
                        </div>
                    </template>
                </div>
                
                <div class="table-responsive shadow border rounded overflow-auto h-100 position-sticky">
                    <table class="table table-hover">
                        <thead class="text-bg-primary bg-gradient sticky-top">
                            <tr>
                                <th></th>
                                <th><em><small>Sequence No.</small></em></th>
                                <th><em><small>Key Process</small></em></th>
                                <th><em><small>Sub Process</small></em></th>
                                <th><em><small>Process Type</small></em></th>
                                <th><em><small>Standard Time</small></em></th>
                                <th>Machine Time</th>
                                <th>Sampling</th>
                                <th>Uncontrolled</th>
                                <th>Batching Type</th>
                                <th>Result Type</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-for="flowSub in processFlowSub" :key="flowSub.flow_sub_id">
                                <tr>
                                    <td :style="'background-color: '+flowSub.color"></td>
                                    <td>{{flowSub.sequence_number}}</td>
                                    <td><em><b>{{flowSub.Pname}}</b></em></td>
                                    <td><em><b>{{flowSub.SubPname}}</b></em></td>
                                    <td>{{flowSub.process_type}}</td>
                                    <td>{{flowSub.standard_time}}</td>
                                    <td>{{flowSub.machine_time}}</td>
                                    <td>
                                        <span :class="flowSub.check_sampling === 'True' ? 'badge text-bg-primary' : 'badge text-bg-secondary'">
                                            {{flowSub.check_sampling === 'True' ? 'With Sampling' : 'Without Sampling'}}
                                        </span>
                                    </td>
                                    <td>
                                        <span :class="flowSub.check_uncontrolled === 'True' ? 'badge text-bg-primary' : 'badge text-bg-secondary'">
                                            {{flowSub.check_uncontrolled === 'True' ? 'Quantity Uncontrolled' : 'Quantity Controlled'}}
                                        </span>
                                    </td>
                                    <td>
                                        <span :class="flowSub.batching_type === 'Parallel' ? 'badge text-bg-primary fs-6' : 'badge text-bg-secondary fs-6'">
                                            {{flowSub.batching_type}}
                                        </span>
                                    </td>
                                    <td>
                                        <span :class="flowSub.result_type === 'Chips' ? 'badge text-bg-primary fs-6' : 'badge text-bg-secondary fs-6'">
                                            {{flowSub.result_type}}
                                        </span>
                                    </td>
                                    <td>
                                        <label :for="'status'+flowSub.flow_sub_id">
                                            <span :class="flowSub.sub_status === 'Active' ? 'badge text-bg-success' : 'badge text-bg-secondary'">
                                                {{flowSub.sub_status}}
                                            </span>
                                        </label>
                                    </td>
                                    <td>
                                        <button @click="toggleAccordion(flowSub.SubPid)" class="btn btn-light">
                                            <span class="material-symbols-outlined">
                                                {{ toggle[flowSub.SubPid]? 'expand_less' : 'expand_more' }}
                                            </span>
                                        </button>
                                    </td>
                                </tr>
                                <tr v-show="toggle[flowSub.SubPid]">
                                    <td colspan="14" :style="'background-color: '+flowSub.color">
                                        <div class="table-responsive bg-light border rounded shadow p-3">
                                            <table class="table table-hover">
                                                <thead class="text-bg-primary bg-gradient">
                                                    <tr>
                                                        <th>Sequence No.</th>
                                                        <th>Process Detail Description</th>
                                                        <th>Typical Value</th>
                                                        <th>Minimum Value</th>
                                                        <th>Maximum Value</th>
                                                        <th>Visibility Status</th>
                                                        <th>Condition Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <template v-for="condition in flowSub.condition">
                                                        <tr>
                                                            <td>{{condition.sequence_number}}</td>
                                                            <td><em><b>{{condition.detail_description}}</b></em></td>
                                                            <td>{{condition.typical_value}}</td>
                                                            <td>{{condition.min_value}}</td>
                                                            <td>{{condition.max_value}}</td>
                                                            <td>
                                                                <span :class="condition.visibility_status === 1 ? 'badge text-bg-primary mx-auto' : 'badge text-bg-secondary'">
                                                                    {{condition.visibility_bool === true ? 'Visible' : 'Not Visible'}}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <label :for="'condition_status'+condition.flow_condition_id">
                                                                    <span :class="condition.condition_status === 'Active' ? 'badge text-bg-success' : 'badge text-bg-secondary'">
                                                                        {{condition.condition_status}}
                                                                    </span>
                                                                </label>
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

    <div class="modal fade" id="loaderModal" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="exampleModalToggleLabel2" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalToggleLabel2">Saving Form</h1>
              <button type="button" id="loaderCloseBtn" class="btn-close d-none" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="pt-3">
                    <p>Item Percent: {{itemLoader.toFixed(2)}}% / 100% - Saving... {{ loaderSubPname }}</p>
                    <div class="progress" role="progressbar" aria-label="Animated striped example" :aria-valuenow="itemLoader" aria-valuemin="0" aria-valuemax="100">
                        <div class="progress-bar progress-bar-striped progress-bar-animated" :style="'width: '+itemLoader+'%'"></div>
                    </div>
                </div>
                
                <div class="pt-3">
                    <p>Condition Percent: {{conditionLoader.toFixed(2) }}% / 100% - Saving ... {{ loaderDetail }}</p>
                    <div class="progress" role="progressbar" aria-label="Animated striped example" :aria-valuenow="conditionLoader" aria-valuemin="0" aria-valuemax="100">
                        <div class="progress-bar progress-bar-striped progress-bar-animated" :style="'width: '+conditionLoader+'%'"></div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">

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
                
                formAssignmentCWPInputMainURL: 'http://172.16.2.13/tpc-endpoint/PostFormAssignmentCWPInputMain.php',
                formAssignmentLWPInputMainURL: 'http://172.16.2.13/tpc-endpoint/PostFormAssignmentLWPInputMain.php',
                formAssignmentCCIInputMainURL: 'http://172.16.2.13/tpc-endpoint/PostFormAssignmentCCIInputMain.php',
                formAssignmentSWPInputMainURL: 'http://172.16.2.13/tpc-endpoint/PostFormAssignmentSWPInputMain.php',

                formAssignmentURL: 'http://172.16.2.13/tpc-endpoint/GetFormAssignment.php',
                formAssignmentPostURL: 'http://172.16.2.13/tpc-endpoint/PostFormAssignment.php',

                // formAssignmentItemPostURL: 'http://172.16.2.13/tpc-endpoint/PostFormAssignmentItem.php',
                // itemConditionPostURL: 'http://172.16.2.13/tpc-endpoint/PostFormAssignmentItemCondition.php',

                formAssignmentItemPostURL: 'http://172.16.2.13:3000/insertFormAssignmentItem',
                itemConditionPostURL: 'http://172.16.2.13:3000/insertFormAssignmentItemCondition',

                sectionURL: 'http://172.16.2.13/tpc-endpoint/GetSection.php',
                processFlowURL: 'http://172.16.2.13/tpc-endpoint/GetProcessFlow.php',
                keyProcessURL: 'http://172.16.2.13/tpc-endpoint/GetKeyProcess.php',
                subProcessURL: 'http://172.16.2.13/tpc-endpoint/GetSubProcess.php',
                processFlowSubURL: 'http://172.16.2.13/tpc-endpoint/requestProcessFlowSub.php',
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
                SWPRequestHeaderURL: 'http://172.16.2.13/tpc-endpoint/HandleSWPHeaderRequest.php',
                FormRequestURL: 'http://172.16.2.13/tpc-endpoint/requestFormAssignment.php',

                CCIInOutAssign: 'http://172.16.2.13/tpc-endpoint/CCIInOutAssign.php',
                SWPLotRequest: 'http://172.16.2.13/tpc-endpoint/requestSWPLotInformation.php',

                CCPLotRequestURL: 'http://172.16.2.13/tpc-endpoint/LotRequestCWP.php',
                CWPLotInformationRequestURL: 'http://172.16.2.13/tpc-endpoint/lotInformationRequest.php',
                CWPLotInformationRequestSubURL: 'http://172.16.2.13/tpc-endpoint/lotInformationRequestSub.php',
    
                CWPQuantityURL: 'http://172.16.2.13/tpc-endpoint/GenerateCWPQuantity.php',
                POLQuantityURL: 'http://172.16.2.13/tpc-endpoint/GeneratePOLQuantity.php',
                SWPQuantityURL: 'http://172.16.2.13/tpc-endpoint/GenerateSWPQuantity.php',

                fetchSWPHeader: 'http://172.16.2.13/tpc-endpoint/fetchSWPHeader.php',
                fetchCCDHeader: 'http://172.16.2.13/tpc-endpoint/fetchCCDHeader.php',
    
                updateItemStatusURL: 'http://172.16.2.13/tpc-endpoint/PutFormAssignmentItemStatus.php',
                updateItemConditionURL: 'http://172.16.2.13/tpc-endpoint/PutFormAssignmentItemCondition.php',
    
                searchRequestURL: 'http://172.16.2.13/tpc-endpoint/requestSearchFormAssignment.php',
    
                itemURL: 'http://172.16.2.13/tpc-endpoint/GetItem.php',
                itemConditionURL: 'http://172.16.2.13/tpc-endpoint/GetItemCondition.php',
                requestCondition: 'http://172.16.2.13/tpc-endpoint/requestCondition.php',


                // uncomment the top endpoint for production
                // development endpointDev  below
                
                // formAssignmentCWPInputMainURL: 'http://172.16.2.13/tpc-endpointDev/PostFormAssignmentCWPInputMain.php',
                // formAssignmentLWPInputMainURL: 'http://172.16.2.13/tpc-endpointDev/PostFormAssignmentLWPInputMain.php',
                // formAssignmentCCIInputMainURL: 'http://172.16.2.13/tpc-endpointDev/PostFormAssignmentCCIInputMain.php',
                // formAssignmentSWPInputMainURL: 'http://172.16.2.13/tpc-endpointDev/PostFormAssignmentSWPInputMain.php',

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
                
                // DeleteFormURL: 'http://172.16.2.13/tpc-endpointDev/DeleteForm.php',
                // DeleteItemURL: 'http://172.16.2.13/tpc-endpointDev/DeleteItem.php',
                // DeleteItemConditionURL: 'http://172.16.2.13/tpc-endpointDev/DeleteItemCondition.php',
    
                // CCILotRequestURL: 'http://172.16.2.13/tpc-endpointDev/HandleCCILotRequest.php',
                // CCIPoRequestURL: 'http://172.16.2.13/tpc-endpointDev/HandleCCIPoRequest.php',
                // CCICustomerDetailsURL: 'http://172.16.2.13/tpc-endpointDev/HandleCCICustomerDetails.php',
                // POLRequestURL: 'http://172.16.2.13/tpc-endpointDev/HandlePOLRequest.php',
                // CWPRequestURL: 'http://172.16.2.13/tpc-endpointDev/HandleCWPRequest.php',
                // SWPRequestURL: 'http://172.16.2.13/tpc-endpointDev/HandleSWPRequest.php',
                // SWPRequestHeaderURL: 'http://172.16.2.13/tpc-endpointDev/HandleSWPHeaderRequest.php',
                // FormRequestURL: 'http://172.16.2.13/tpc-endpointDev/requestFormAssignment.php',

                // CCIInOutAssign: 'http://172.16.2.13/tpc-endpointDev/CCIInOutAssign.php',
                // SWPLotRequest: 'http://172.16.2.13/tpc-endpointDev/requestSWPLotInformation.php',

                // CCPLotRequestURL: 'http://172.16.2.13/tpc-endpointDev/LotRequestCWP.php',
                // CWPLotInformationRequestURL: 'http://172.16.2.13/tpc-endpointDev/lotInformationRequest.php',
                // CWPLotInformationRequestSubURL: 'http://172.16.2.13/tpc-endpointDev/lotInformationRequestSub.php',
    
                // CWPQuantityURL: 'http://172.16.2.13/tpc-endpointDev/GenerateCWPQuantity.php',
                // POLQuantityURL: 'http://172.16.2.13/tpc-endpointDev/GeneratePOLQuantity.php',
                // SWPQuantityURL: 'http://172.16.2.13/tpc-endpointDev/GenerateSWPQuantity.php',

                // fetchSWPHeader: 'http://172.16.2.13/tpc-endpointDev/fetchSWPHeader.php',
    
                // updateItemStatusURL: 'http://172.16.2.13/tpc-endpointDev/PutFormAssignmentItemStatus.php',
                // updateItemConditionURL: 'http://172.16.2.13/tpc-endpointDev/PutFormAssignmentItemCondition.php',
    
                // searchRequestURL: 'http://172.16.2.13/tpc-endpointDev/requestSearchFormAssignment.php',
    
                // itemURL: 'http://172.16.2.13/tpc-endpointDev/GetItem.php',
                // itemConditionURL: 'http://172.16.2.13/tpc-endpointDev/GetItemCondition.php',
                // requestCondition: 'http://172.16.2.13/tpc-endpointDev/requestCondition.php',

                // alert: '',
    
                toggle: {},
    
                formAssignment: [],
                searchedFormList: [],
                section: [],
                keyProcess: [],
                subProcess: [],
                processFlow: [],
                itemCondition: [],
                
                ccp_data: [],
                partsNumberList: [],
                lotNumberList: [],
                lotNumberDetails: [],
                poNumber: [],
                itemCodeList: [],
                revisionNumberList: [],
    
                processFlowSub: [],
                processFlowCondition: [],

                tempLotStorage: [],

                last_assignment_id: 0,
                form_status: 'Unposted',
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
                main_material_lot_number: '',
                swr_sli_number: '',
                remarks: '',
                revision_number: '',
                wafer_from: 1,
                wafer_to: 1,
                customer_pn: '',
                quantity: '',
                customer_name: '',
                delivery_date: '',
                jo_number: '',
                date_issued: '',
                
                input_date: '',

                viewAssignment_id: '',
                
                hasAttachment: 0,
                hasInstruction: 0,
                
                submittedSuccess: false,

                itemLoader: 0,
                conditionLoader: 0,

                loaderSubPname: '',
                loaderDetail: '',

                 // cwp header data

                cwp_type: '',

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
                size: '',
                specs: '',

                lanthanum_lot_number: '',
                lantha_lot_number_sub: '',
                // cci header data

                au_sputter_lot_number: '',
                range: '',
                k_value: '',
                type: '',
                tan_lot_number: '',
                category_1: '',
                quantity: '',
                notes: '',
                thickness: '',

                // swp header data

                tableOptions: {
                    order: [[0, 'desc']]
                },

                search: '',
                currentPage: 1,

                distinctSearch: false,
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
                                return `<button class="btn w-100">
                                            <span class="material-symbols-outlined">visibility</span>
                                        </button`} 
                            },
                ],
            }
        },
        computed: {
            displayedRows(){
                const startIndex = (this.currentPage - 1) * 10;
                const endIndex = startIndex + 10;
                return this.searchedFormList.slice(startIndex, endIndex);
            },
        },
        methods: {
            previousPage(){
                this.currentPage -= 1;
            },
            nextPage(){
                this.currentPage += 1;
            },
            switchDistinctSearch(){
                let value = document.getElementById('distinctSearch').checked;
                this.distinctSearch = value;
            },
            querySearch(key){
                this.searchedFormList = [];
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
                                this.searchedFormList.push(form);
                            }
                        }
                    }         
                }).catch(error => {
                    console.log(error);
                })
            },
            fetchCCPData(){
                switch(this.section_code){
                    case 'CWP':
                    this.requestPartsNumber(this.CCPLotRequestURL, this.date_issued);
                    break;
                    case 'LWP':
                    this.requestPartsNumber(this.CCPLotRequestURL, this.lot_number);
                    break;
                    case 'CCI':
                    this.requestPartsNumber(this.CCPLotRequestURL, this.po_number);
                    break;
                    case 'SWP':
                    this.requestPartsNumber(this.CCPLotRequestURL, this.item_parts_number);
                    break;
                    case 'CCD':
                    this.requestPartsNumber(this.CCPLotRequestURL, this.date_issued);
                    break;
                }
            },
            requestSWPHeader(){
                this.au_sputter_lot_number = this.lot_number.split('-')[0];
                this.wafer_no = this.lot_number.split('-')[1];
                let from = this.lot_number.split('-')[1].split('~')[0];
                let to = this.lot_number.split('-')[1].split('~')[1];
                this.wafer_from = from !== undefined ? from : 0;
                this.wafer_to = to !== undefined ? to : from;
                axios.get(this.fetchSWPHeader, {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    },
                    params: {
                        lot_number: this.au_sputter_lot_number,
                        wafer_no: this.wafer_no
                    }
                }).then(response => {
                    console.log(response.data)
                   for(const d of response.data){
                        this.category_1 = d.category;
                        this.type = d.type;
                        this.surface = d.surface;
                        this.thickness = d.thickness;
                        this.dimension = d.dimension;
                        this.k_value = d.kvalue;
                        this.quantity = d.qty;
                        this.a_face = d.aface + ' ' + d.aface_sub;
                        this.b_face = d.bface + ' ' +d.bface_sub;
                        this.notes = d.notes;
                   }
                }).catch(error => {
                    console.error(error);
                });
            },
            requestCCDHeader(){
                let lot_number = this.lot_number.split('-')[0];
                let wafer_no = this.lot_number.split('-')[1];
                axios.get(this.fetchCCDHeader, {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    },
                    params: {
                        lot_number: lot_number,
                        wafer_no: wafer_no
                    }
                }).then(response => {
                }).catch(error => {
                    console.error(error);
                });
            },
            async requestPartsNumber(url, data){  
                this.partsNumberList = [];
                this.lotNumberList = [];
                let ccp_params = {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    },
                    params: {
                        input_date: data,
                        section_code: this.section_code
                    }
                }
                let swp_params = {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    },
                    params: {
                        item_parts_number: data,
                        section_code: this.section_code
                    }
                }
                let cci_params = {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    },
                    params: {
                        po_number: data,
                        section_code: this.section_code
                    }
                }
                let std_params = {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    },
                    params: {
                        input_date: data,
                        section_code: 'STD'
                    }
                }
                const selectedPartsNumber = new Set();
                if(this.section_code === 'CCI'){
                    await axios.get(url, cci_params).
                    then(response => {
                        this.ccp_data = response.data;
                        for(const d of this.ccp_data){
                            if(!selectedPartsNumber.has(d.partsno)){
                            this.partsNumberList.push({parts_number: d.partsno})
                            selectedPartsNumber.add(d.partsno);
                        }
                        }
                    }).catch(error => {
                        console.log(error);
                    })
                } else if(this.section_code === 'CWP' && this.cwp_type === 'Hi-k') {
                    await axios.get(url, ccp_params).
                then(response => {
                    this.ccp_data = response.data;
                        for(const d of this.ccp_data){
                            if(!selectedPartsNumber.has(d.ceramic_pn)){
                                this.partsNumberList.push({parts_number: d.ceramic_pn});
                                selectedPartsNumber.add(d.ceramic_pn);
                            }
                        }
                    }).catch(error => {
                        console.log(error);
                    })
                } else if(this.section_code === 'CWP' && this.cwp_type === 'STD') {
                    this.lotNumberList = [];
                    const selectedLotNumber = new Set();
                    await axios.get(url, std_params).
                    then(response => {
                        this.ccp_data = response.data;
                        for(const d of this.ccp_data){
                            if(!selectedLotNumber.has(d.std_material_lot_number)){
                                this.lotNumberList.push({lot_number: d.std_material_lot_number});
                                selectedLotNumber.add(d.std_material_lot_number);
                            }
                        }
                    }).catch(error => {
                        console.log(error);
                    })
                } else if(this.section_code === 'LWP'){
                    this.lotNumberList = [];
                    const selectedLotNumber = new Set();
                    await axios.get(url, ccp_params).
                    then(response => {
                    this.ccp_data = response.data;
                    for(const d of this.ccp_data){
                        if(!selectedLotNumber.has(d.std_lot_number)){
                            this.lotNumberList.push({lot_number: d.std_lotnumber});
                            selectedLotNumber.add(d.std_lot_number);
                        }
                    }
                    }).catch(error => {
                        console.log(error);
                    })
                }  else if(this.section_code === 'CCD') {
                    await axios.get(url, ccp_params).
                    then(response => {
                        this.ccp_data = response.data;
                        for(const d of this.ccp_data){
                                if(!selectedPartsNumber.has(d.item_parts_number)){
                                this.partsNumberList.push({parts_number: d.item_parts_number})
                                selectedPartsNumber.add(d.item_parts_number);
                            }
                        }
                    }).catch(error => {
                        console.log(error);
                    })
                } else if(this.section_code === 'SWP'){
                    await axios.get(url, swp_params).
                    then(response => {
                        let latestRevNo = -1;
                        let id_itemmaster = ''; 
                        for(const d of response.data){
                            if(parseInt(d.item_revision) > latestRevNo){
                                latestRevNo = d.item_revision;
                            }
                        }
                        for(const d of response.data){
                            if(parseInt(d.item_revision) === parseInt(latestRevNo)){                           
                                id_itemmaster = d.id_itemmaster;
                                let tol = d.item_t_aps_tol;
                                let um = d.item_t_um;
                                let neg = parseInt(um) - parseInt(tol);
                                let pos = parseInt(um) + parseInt(tol);
                                this.range = neg + ' ~ ' + pos;

                                this.mark = d.item_mark;
                                this.make = d.item_make;
                                this.remarks = d.item_remark;
                                this.remarks1 = d.item_remark1;
                                this.remarks2 = d.item_remark2;
                                this.remarks3 = d.item_remark3;
                                this.remarks4 = d.item_remark4;

                               
                                // this.requestLotNumber();
                            }
                        }
                        
                    }).catch(error => {
                        console.log(error);
                    })
                }
                
            },
            fetchSeedLot(type, lot){
                this.lotNumberList = [];
                const selectedLotNumber = new Set();
                axios.get(this.CCPLotRequestURL, {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    },
                    params: {
                        seed_lot: lot,
                        section_code: type
                    }
                }).then(response => {
                    this.ccp_data = response.data;
                    for(const d of this.ccp_data){
                        if(!selectedLotNumber.has(d.seed_crystal_lotnumber)){
                            this.lotNumberList.push({lot_number: d.seed_crystal_lotnumber});
                            selectedLotNumber.add(d.seed_crystal_lotnumber);
                        }
                    }
                }).catch(error => {
                    console.log(error);
                })
            },
            assignSeedHeader(lot){
                this.ccp_data.find(d => {
                    if(lot === d.seed_crystal_lotnumber){
                        this.specs =  d.seed_crystal_spec_pos + '±' + d.seed_crystal_spec_nega;
                        this.size = d.seed_crystal_size;
                    }
                })
            },
            fetchLanthaLot(type, lot){
                this.lotNumberList = [];
                const selectedLotNumber = new Set();
                axios.get(this.CCPLotRequestURL, {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    },
                    params: {
                        lantha_lot: lot,
                        section_code: type
                    }
                }).then(response => {
                    this.ccp_data = response.data;
                    for(const d of this.ccp_data){
                        if(!selectedLotNumber.has(d.lantha_lotnumber_sub)){
                            this.lotNumberList.push({lot_number: d.lantha_lotnumber_sub});
                            selectedLotNumber.add(d.lantha_lotnumber_sub);
                        }
                    }
                }).catch(error => {
                    console.log(error);
                })
            },
            assignLanthaHeader(lot){
                this.lantha_lot_number_sub = lot;
                this.ccp_data.find(d => {
                    if(lot === d.lantha_lotnumber_sub){
                        this.ceramic_lot = d.lantha_applied_ceramic_lot;
                        this.k_value = d.lantha_kvalue;
                    }
                })
            },
            async requestLotNumber(){
                this.lotNumberList = [];
                if(this.section_code === 'CCI'){
                    this.ccp_data.find(d => {
                        if(this.item_parts_number === d.partsno){
                            this.lotNumberList.push({lot_number: d.lotno});
                        }
                    })
                } 
                else {
                    this.ccp_data.find(d => {
                        if(this.item_parts_number == d.ceramic_pn){
                            this.lotNumberList.push({lot_number: d.ceramic_ln_display});
                        }
                    })
                }
            },
            enableAttachment(){
                let has_attachment = document.getElementById('has_attachment').checked;
                this.hasAttachment = has_attachment === true ? 1 : 0;
            },
            newForm(){
                this.$refs.saveBtn.disabled = false;
                this.$refs.closeBtn.disabled = false;
                this.submittedSuccess = false;
                this.processFlowSub = [];
                this.item_parts_number = '';
                this.section_id = '';
                this.section_code = '';
                this.section_description = '';
                this.lot_number = '';
                this.po_number = '';
                this.item_code = '';
                this.material_lot_number = '';
                this.revision_number = '';
                this.wafer_from = 0;
                this.wafer_to = 0;
                this.customer_pn = '';
                this.quantity = '';
                this.customer_name = '';
                this.delivery_date = '';
                this.jo_number = '';
                this.date_issued = '';
            },
            getData(event){
                if(event.target.tagName == 'BUTTON'){
                    const row = event.target.parentNode.parentNode;
                    const cell = row.querySelector('td');
                    this.viewAssignment_id = parseInt(cell.textContent);
                    this.$router.push({ name: 'formAssignmentView', query: { assignment_id: this.viewAssignment_id} });
                }
                if(event.target.tagName == 'SPAN'){
                    const row = event.target.parentNode.parentNode.parentNode;
                    const cell = row.querySelector('td');
                    this.viewAssignment_id = parseInt(cell.textContent);
                    this.$router.push({ name: 'formAssignmentView', query: { assignment_id: this.viewAssignment_id} });
                }
                
            },
            viewForm(assignment_id){
                this.$router.push({ name: 'formAssignmentView', query: { assignment_id: parseInt(assignment_id)} });
            },
            async submitForm(){
                this.$refs.saveBtn.disabled = true;
                this.$refs.closeBtn.disabled = true;
                let assignment_id = ''
                await axios.post(this.formAssignmentPostURL, {
                    section_id: this.section_id,
                    lot_number: this.lot_number,
                    po_number: this.po_number,
                    parts_number: this.item_parts_number,
                    quantity: this.quantity,
                    delivery_date: this.delivery_date? this.delivery_date: null,
                    jo_number: this.jo_number,
                    revision_number: this.revision_number,
                    date_issued: this.date_issued,
                    assigned_by: this.assigned_by,
                    date_created: this.date_created,
                    wafer_number_from: this.wafer_from,
                    wafer_number_to: this.wafer_to,
                    item_code: this.item_code,
                    assignment_status: this.form_status,
                    has_attachment: this.hasAttachment,
                    has_instruction: this.hasInstruction
                }).then(response => {
                    if(response.data.message === 'Form Assignment inserted successfully' && this.processFlowSub.length > 0){
                        assignment_id = response.data.assignment_id;
                    }
                }).catch(error => {
                    console.log(error);
                });
                switch(this.section_code){
                    case 'CWP':
                        if(this.cwp_type === 'Hi-k'){
                            await axios.post(this.formAssignmentCWPInputMainURL, {
                                cwp_type: this.cwp_type,
                                section_id: this.section_id,
                                assignment_id: assignment_id,
                                item_code: this.item_code,
                                item_parts_number: this.item_parts_number,
                                lot_number: this.lot_number,
                                jo_number: this.jo_number,
                                date_issued: this.date_issued,
                                k_value: this.k_value,
                                k_value_level: this.k_value_level,
                                material_lot_number: this.material_lot_number,
                                swr_sli_number: this.swr_sli_number,
                                seed_crystal_lot_number: this.seed_crystal_lot_number,
                                wafer_size: this.wafer_size,
                                thickness: this.thickness,
                                prod_head: this.prod_head,
                                prod_control: this.prod_control,
                                prepared_by: this.prepared_by,
                                qty: this.quantity
                            }).then(response => {
                            }).catch(error => {
                                console.log(error);
                            })
                        } else if(this.cwp_type === 'STD') {
                            await axios.post(this.formAssignmentCWPInputMainURL, {
                                cwp_type: this.cwp_type,
                                section_id: this.section_id,
                                assignment_id: assignment_id,
                                item_code: this.item_code,
                                lot_number: this.lot_number,
                                material_lot_number: this.material_lot_number,
                                date_issued: this.date_issued,
                                k_value: this.k_value,
                                wafer_size: this.wafer_size,
                                thickness: this.thickness,
                                remarks_swr: this.remarks_swr,
                                remarks: this.remarks,
                                qty: this.quantity,
                            }).then(response => {
                            }).catch(error => {
                                console.log(error);
                            })
                        } else if(this.cwp_type === 'Seed-Crystal'){
                            await axios.post(this.formAssignmentCWPInputMainURL, {
                                cwp_type: this.cwp_type,
                                section_id: this.section_id,
                                assignment_id: assignment_id,
                                item_code: this.item_code,
                                seed_crystal_lot_number: this.seed_crystal_lot_number,
                                seed_material_lot: this.seed_material_lot,
                                size: this.size,
                                specs: this.specs,
                                remarks: this.remarks,
                                qty: this.quantity,
                            }).then(response => {
                            }).catch(error => {
                                console.log(error);
                            })
                        } else if(this.cwp_type === 'Lanthanum'){
                            await axios.post(this.formAssignmentCWPInputMainURL, {
                                cwp_type: this.cwp_type,
                                section_id: this.section_id,
                                assignment_id: assignment_id,
                                item_code: this.item_code,
                                lot_number: this.lanthanum_lot_number,
                                lantha_lot_number_sub: this.lantha_lot_number_sub,
                                ceramic_lot: this.ceramic_lot,
                                k_value: this.k_value,
                                remarks: this.remarks,
                                qty: this.quantity,
                            }).then(response => {
                            }).catch(error => {
                                console.log(error);
                            })
                        }
                    break;
                    case 'CCI':
                    await axios.post(this.formAssignmentCCIInputMainURL, {
                        section_id: this.section_id,
                        assignment_id: assignment_id,
                        item_code: this.item_code,
                        po_number: this.po_number,
                        item_parts_number: this.item_parts_number,
                        lot_number: this.lot_number,
                        order_pn: this.order_pn,
                        customer_pn: this.customer_pn,
                        customer_name: this.customer_name,
                        customer_name2: this.customer_name2,
                        order_quantity: this.order_quantity,
                        quantity_of_pack: this.quantity_of_pack,
                        shipping_destination: this.shipping_destination,
                        delivery_date: this.delivery_date,
                        eqi: this.eqi,
                        tray_model: this.tray_model,
                        original_quantity_in: this.original_quantity_in,
                        std_thickness: this.std_thickness,
                        k_value: this.k_value,
                        clip: this.clip,
                        cover: this.cover,
                        po_cat: this.po_cat,
                        io_code: this.io_code,
                        remarks: this.remarks
                    }).then(response => {
                    }).catch(error => {
                        console.log(error);
                    })
                    break;
                    case 'LWP':
                    await axios.post(this.formAssignmentLWPInputMainURL, {
                        section_id: this.section_id,
                        assignment_id: assignment_id,
                        item_parts_number: this.item_parts_number,
                        lot_number: this.lot_number,
                        thickness: this.thickness,
                        order_number: this.order_no,
                        k_value: this.k_value,
                        surface: this.surface,
                        material_lot_number: this.material_lot_number,
                        quantity: this.quantity,
                        shape: this.shape
                    }).then(response => {
                    }).catch(error => {
                        console.log(error);
                    })
                    break;
                    case 'SWP':
                    await axios.post(this.formAssignmentSWPInputMainURL, {
                        section_id: this.section_id,
                        assignment_id: assignment_id,
                        item_parts_number: this.item_parts_number,
                        lot_number: this.lot_number,
                        thickness: this.thickness,
                        au_sputter_lot_number: this.au_sputter_lot_number,
                        dimension: this.dimension,
                        surface: this.surface,
                        quantity: this.quantity,
                        a_face: this.a_face,
                        b_face: this.b_face,
                        category_1: this.category_1,
                        k_value: this.k_value,
                        range_spec: this.range,
                        tan_lot_number: this.tan_lot_number,
                        type: this.type,
                        mark: this.mark,
                        make: this.make,
                        remark: this.remarks,
                        remark_1: this.remarks1,
                        remark_2: this.remarks2,
                        remark_3: this.remarks3,
                        remark_4: this.remarks4,
                        notes: this.notes,
                    }).then(response => {
                    }).catch(error => {
                        console.log(error);
                    })
                    break;
                    case 'CCD':
                    // await axios.post(this.formAssignmentSWPInputMainURL, {
                    //     section_id: this.section_id,
                    //     assignment_id: assignment_id,
                    //     item_parts_number: this.item_parts_number,
                    //     lot_number: this.lot_number,
                    //     thickness: this.thickness,
                    //     au_sputter_lot_number: this.au_sputter_lot_number,
                    //     dimension: this.dimension,
                    //     surface: this.surface,
                    //     quantity: this.quantity,
                    //     a_face: this.a_face,
                    //     b_face: this.b_face,
                    // }).then(response => {
                    //     console.log(response.data)
                    // }).catch(error => {
                    //     console.log(error);
                    // })
                    break;
                }
                
                let itemLimit = this.processFlowSub.length;
                let localItemLoader = 0;
                for(const flowSub of this.processFlowSub){
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
                            localItemLoader++;
                            this.itemLoader = (localItemLoader / itemLimit) * 100;
                            this.loaderSubPname = flowSub.SubPname;
                            if(localItemLoader === itemLimit){
                                this.itemLoader = 0;
                                localItemLoader = 0;
                                this.$refs.closeBtn.disabled = false;
                                document.getElementById('loaderCloseBtn').click();
                                this.$refs.closeBtn.click();
                                this.submittedSuccess = true;
                                this.formAssignment.push({
                                    assignment_id: assignment_id,
                                    section_code: this.section_code,
                                    lot_number: this.lot_number,
                                    po_number: this.po_number,
                                    item_parts_number: this.item_parts_number,
                                    quantity: this.quantity,
                                    delivery_date: this.delivery_date? this.delivery_date: null,
                                    jo_number: this.jo_number,
                                    revision_number: this.revision_number,
                                    date_issued: this.date_issued,
                                    assigned_by: this.assigned_by,
                                    date_created: this.date_created,
                                    wafer_number_from: this.wafer_from,
                                    wafer_number_to: this.wafer_to,
                                    item_code: this.item_code,
                                    assignment_status: this.form_status,
                                    has_attachment: this.hasAttachment,
                                    has_instruction: this.hasInstruction
                                })
                            }
                        }
                    }).catch(error => {
                        console.log(error);
                    });
                    let conditionLimit = flowSub.condition.length;
                    let localConditionLoader = 0;
                    for(const itemCondition of flowSub.condition){
                        await axios.post(this.itemConditionPostURL, {
                            assignment_id: assignment_id,
                            item_id: itemCondition.item_id,
                            sequence_number: itemCondition.sequence_number,
                            SubPid: itemCondition.SubPid,
                            detail_description: itemCondition.detail_description,
                            field_type: itemCondition.field_type,
                            min_value: itemCondition.min_value,
                            max_value: itemCondition.max_value,
                            typical_value: itemCondition.typical_value,
                            condition_code: itemCondition.condition_code,
                            option_value: itemCondition.option_value,
                            with_judgement: itemCondition.with_judgement,
                            visibility_status: itemCondition.visibility_status,
                            condition_status: itemCondition.condition_status
                        }).then(response => {
                            if(response.data.message === 'Item Condition inserted successfully'){
                                localConditionLoader++;
                                this.loaderDetail = itemCondition.detail_description;
                                this.conditionLoader = (localConditionLoader / conditionLimit) * 100;
                                if(localConditionLoader === conditionLimit){
                                    this.conditionLoader = 0;
                                    localConditionLoader = 0;
                                }
                            }
                        }).catch(error => {
                            console.log(error);
                        });
                    }
                }
            },
            handleStatus(flow_sub_id){
                let status = document.getElementById(`status${flow_sub_id}`).checked;
                this.processFlowSub.filter((flowSub) => {
                    if(parseInt(flowSub.flow_sub_id) === parseInt(flow_sub_id)){
                        flowSub.status = status;
                        flowSub.sub_status = status === true ? 'Active' : 'Inactive';
                        flowSub.condition.filter((condition) => {
                            if(parseInt(flowSub.SubPid) === parseInt(condition.SubPid)){
                               condition.condition_bool = status;
                               condition.condition_status = status === true ? 'Active' : 'Inactive';
                            }
                        })
                    }
                })
            },
            handleSampling(flow_sub_id){
                let sampling = document.getElementById(`sampling${flow_sub_id}`).checked;
                this.processFlowSub.filter((flowSub) => {
                    if(parseInt(flowSub.flow_sub_id) === parseInt(flow_sub_id)){
                        flowSub.sampling = sampling;
                        flowSub.check_sampling = sampling === true ? 'True' : 'False';
                    }
                })
            },
            handleUncontrolled(flow_sub_id){
                let uncontrolled = document.getElementById(`uncontrolled${flow_sub_id}`).checked;
                this.processFlowSub.filter((flowSub) => {
                    if(parseInt(flowSub.flow_sub_id) === parseInt(flow_sub_id)){
                        flowSub.uncontrolled = uncontrolled;
                        flowSub.check_uncontrolled = uncontrolled === true ? 'True' : 'False';
                    }
                })
            },
            handleVisibility(flow_sub_id, flow_condition_id){
                let visibility = document.getElementById(`visibility${flow_condition_id}`).checked;
                this.processFlowSub.filter((flowSub) => {
                    if(parseInt(flowSub.flow_sub_id) === parseInt(flow_sub_id)){
                        flowSub.condition.filter((condition) => {
                            if(parseInt(condition.flow_condition_id) === parseInt(flow_condition_id)){
                                condition.visibility_bool = visibility;
                                condition.visibility_status = visibility === true ? 1 : 0;
                                
                            }
                        })
                    }
                })
            },
            handleCondition(flow_sub_id, flow_condition_id){
                let status = document.getElementById(`condition_status${flow_condition_id}`).checked;
                this.processFlowSub.filter((flowSub) => {
                    if(parseInt(flow_sub_id) === parseInt(flowSub.flow_sub_id)){
                        flowSub.condition.filter((condition) => {
                            if(parseInt(flow_condition_id) === parseInt(condition.flow_condition_id)){
                                condition.condition_bool = status;
                                condition.condition_status = status === true ? 'Active' : 'Inactive';
                            }
                        })
                    }
                })
            },
            toggleAccordion(SubPid){
                this.toggle[SubPid] = !this.toggle[SubPid];
            },
            selectSection(section_id){
                this.itemCodeList = [];
                this.revisionNumberList = [];
                this.item_parts_number = '';
                this.revision_number = '';
                this.section.filter((sec) => {
                    if(parseInt(sec.section_id) === parseInt(section_id)){
                        this.section_code = sec.section_code;
                        this.section_description = sec.section_description;
                    }
                });
                const selectedItemCode = new Set();
                this.processFlow.filter((flow) => {
                    if(parseInt(flow.section_id) === parseInt(section_id) && flow.flow_status === 'Posted'){
                        if(!selectedItemCode.has(flow.item_code)){
                            this.itemCodeList.push({item_code: flow.item_code});
                            selectedItemCode.add(flow.item_code);
                        }
                    }
                })
                this.section_code === 'CWP' ? this.date_issued = '' : this.date_issued = this.date_created;
            },
            selectPartsNoAndRevNo(item_code){
                this.revisionNumberList = [];
                this.item_parts_number = '';
                this.revision_number = '';
                let latestRevNo = -1
                this.processFlow.filter((flow) => {
                    if(this.section_id === flow.section_id && flow.item_code === item_code && flow.flow_status === 'Posted'){
                        if(flow.revision_number > latestRevNo){
                            latestRevNo = flow.revision_number;
                        }
                        this.revisionNumberList.push(flow);
                    }
                })
                this.revision_number = latestRevNo;
                this.getLotNumberList(this.section_code, this.item_parts_number);
                this.getProcessFlow();
            },
            getLotNumberList(section_code, item_parts_number){
                this.lotNumberList = [];
                const axiosParams = {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    },
                    params: {
                        parts_number: item_parts_number
                    }
                };
                const selectedItemCode = new Set();
                const selectedLotNumber = new Set();
                const selectedPoNumber = new Set();
                if(section_code.split('-').includes('CCI')){
                    const lotRequest = axios.get(this.CCILotRequestURL, axiosParams);
                    const poRequest = axios.get(this.CCIPoRequestURL, axiosParams);
                    Promise.all([lotRequest, poRequest], {
                    }).then(response => {
                        for(const lot of response[0].data){
                            if(!selectedLotNumber.has(lot.lotno)){
                                this.lotNumberList.push({lot_number: lot.lotno})
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
                } else if(section_code.split('-').includes('LWP')){
                    axios.get(this.POLRequestURL, axiosParams)
                    .then(response => {
                        for(const lot of response.data){
                            if(!selectedLotNumber.has(lot.cwp_input_plan_pol_orderno)){
                                this.lotNumberList.push({lot_number: lot.cwp_input_plan_pol_orderno});
                                selectedLotNumber.add(lot.cwp_input_plan_pol_orderno);
                            } 
                         }
                    }).catch(error => {console.log(error); });
                } 
            },
            async getQuantityAndMaterialLotNo(section_code, item_parts_number, lot_number){
                this.quantity = '';
                let pcard_id;
                let cap_order_id;
                const params = 
                    {
                        method: 'GET',
                        headers: {
                            'Content-type': 'application/x-www-form-urlencoded'
                        },
                        params: {
                            parts_number: item_parts_number,
                            lot_number: lot_number,
                        }
                     }
                if(section_code.split('-').includes('CWP') && this.cwp_type === 'Hi-k'){
                await axios.get(this.CWPLotInformationRequestURL, {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    },
                    params: {
                        lot_number: lot_number,
                    }
                }).then(response => {
                    for(const i of response.data){
                        this.material_lot_number = i.pcard_material_lot_no;
                        this.main_material_lot_number = i.pcard_main_material_lot_no;
                        this.swr_sli_number = i.swr_sli_number;
                        this.remarks = i.pcard_swrSLIfai_remarks;
                        this.prod_head = i.pcard_production_head;
                        this.prod_control = i.pcard_production_control;
                        this.prepared_by = i.pcard_prepared_by;
                        this.date_issued = i.pcard_date_issued;
                        this.swr_sli_number = i.pcard_swrSLIfai_refno;
                        pcard_id = i.pcard_id_main;
                        this.jo_number = lot_number;
                    }
                }).catch(error => {
                    console.log(error);
                })
                axios.get(this.CWPLotInformationRequestSubURL, {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    },
                    params: {
                        pcard_id: pcard_id,
                    }
                }).then(response => {
                    for(const s of response.data){
                        this.quantity = s.pcard_qty;
                        this.k_value = s.pcard_kvalue;
                        this.k_value_level = s.pcard_parts_number_sub;
                        this.seed_crystal_lot_number = s.pcard_Seed_Crystal;
                        this.wafer_size = s.pcard_wafer_size;
                        this.thickness = s.pcard_thickness_negative + '±' + s.pcard_thickness_positive
                    }
                }).catch(error => {
                    console.log(error);
                })
                } else if(section_code.split('-').includes('CWP') && this.cwp_type === 'STD'){
                    let d = this.ccp_data.find(d => {
                        if(d.std_material_lot_number === this.lot_number){
                            return d;
                        }
                    })
                    this.material_lot_number = d.std_material_lot_number;
                    this.k_value = d.std_k_value;
                    this.qty = d.std_qty;
                    this.remarks_swr = d.std_remarks_swr
                    this.remarks = d.std_remarks
                } else if(section_code.split('-').includes('LWP')){
                    this.ccp_data.find((d) => {
                        if(this.std_lot_number === d.std_lotnumber){
                            this.item_parts_number = d.cwp_input_plan_pol_AppliedPN;
                            this.order_no = d.std_applied_order;
                            this.material_lot_number = d.std_material_lot_number;
                            this.k_value = d.std_k_value;
                            this.quantity = d.cwp_input_plan_pol_qty;
                            this.thickness = d.std_actual_thickness + '±' + d.std_actual_thickness_tolerance;
                            this.surface = d.std_surface;
                        }
                    })
                } else if(section_code.split('-').includes('SWP') || section_code.split('-').includes('CCD')){   
                    this.au_sputter_lot_number = this.lot_number.split('-')[0];
                    for(const d of this.lotNumberSet){
                        if(this.au_sputter_lot_number === d.lot_no){
                            this.category_1 = d.category;
                            this.type = d.type;
                            this.surface = d.surface;
                            this.thickness = d.thickness;
                            this.dimension = d.dimension;
                            this.k_value = d.kvalue;
                            this.quantity = d.qty;
                            this.a_face = d.aface + ' ' + d.aface_sub;
                            this.b_face = d.bface + ' ' +d.bface_sub;
                            this.notes = d.notes;
                        }
                    }
                    let from = this.lot_number.split('-')[1].split('~')[0];
                    let to = this.lot_number.split('-')[1].split('~')[1];
                    this.wafer_from = from !== undefined ? from : 0;
                    this.wafer_to = to !== undefined ? to : from;
                } else if(section_code.split('-').includes('CCI')){
                    this.ccp_data.find((d) => {
                        if(d.lotno === this.lot_number){
                            cap_order_id = d.hct_id_cap_order;
                            this.delivery_date = d.shipdate;
                            this.eqi = d.eqi;
                            this.std_thickness = d.thickness;
                            this.k_value = d.kvalue;
                            this.original_quantity_in = d.qtyin;
                        }
                    })
                    axios.get(this.CCIInOutAssign, {
                        method: 'GET',
                        headers: {
                            'Content-type': 'application/x-www-form-urlencoded'
                        },
                        params: {
                            cap_order_id: cap_order_id,
                        }
                    }).then(response => {
                        for(const d of response.data){
                            this.order_pn = d.hct_PartsNumber;
                            this.customer_pn = d.hct_CustomerPartsNumber;
                            this.customer_name2 = d.hct_Customer ;
                            this.order_quantity = d.hct_OrderQuantity;
                            this.quantity_of_pack = d.hct_Packing;
                            this.shipping_destination = d.hct_destination;
                            this.customer_name = d.hct_Cmi_customer;
                            this.tray_model = d.hct_chiptray;
                            this.clip = d.hct_clip;
                            this.cover = d.hct_cover;
                            this.po_cat = d.hct_po_Cat;
                            this.io_code = d.hct_io_code;
                            this.remarks = d.hct_Remarks
                        }
                    }).catch(error => {
                        console.log(error);
                    })
                }
            },
            getProcessFlow(){
                this.processFlowSub = [];
                this.processFlow.find((flow) => {
                    if(parseInt(flow.section_id) === parseInt(this.section_id) && flow.item_code === this.item_code && parseInt(flow.revision_number) === parseInt(this.revision_number) && flow.flow_status === 'Posted'){
                        axios.get(this.processFlowSubURL,{
                            method: 'GET',
                            headers: {
                                'Content-type': 'application/x-www-form-urlencoded'
                            },
                            params: {
                                section_id: flow.section_id,
                                flow_main_id: flow.flow_main_id,
                                revision_number: flow.revision_number
                            }
                        }).then(response => {
                            for(const flowSub of response.data){
                                this.subProcess.filter((sub) => {
                                    if(parseInt(sub.SubPid) === parseInt(flowSub.SubPid)){
                                        this.keyProcess.filter((key) => {
                                            if(parseInt(sub.Pid) === parseInt(key.Pid)){
                                                Object.assign(flowSub, {
                                                    Pname: key.Pname,
                                                    SubPname: sub.SubPname,
                                                    process_type: sub.process_type,
                                                    sampling: flowSub.check_sampling === "True" ? true : false,
                                                    uncontrolled: flowSub.check_uncontrolled === "True" ? true : false,
                                                    status: flowSub.sub_status === "Active" ? true : false,
                                                    condition: [],
                                                });
                                            }
                                        })
                                    }
                                }),
                                this.processFlowSub.push(flowSub);
                                this.processFlowSub.sort((a,b) => a.sequence_number - b.sequence_number);
                            }
                        }).catch(error => {
                            console.log(error);
                        })
                        axios.get(this.itemConditionDetailsURL, {
                            method: 'GET',
                            headers: {
                                'Content-type': 'application/x-www-form-urlencoded'
                            },
                            params: {
                                flow_main_id: flow.flow_main_id
                            }
                        }).then(response => {
                            this.processFlowSub.forEach(flowSub => {
                                response.data.forEach(condition => {
                                    if(parseInt(flowSub.SubPid) === parseInt(condition.SubPid)){
                                        condition.with_judgement = condition.with_judgement === null ? 0 : condition.with_judgement;
                                        condition.min_value = condition.min_value === null ? 0 : condition.min_value;
                                        condition.max_value = condition.max_value === null ? 0 : condition.max_value;
                                        condition.condition_status = 'Active';
                                        flowSub.condition.push(condition)
                                    }
                                })
                            })
                            // for(const condition of response.data){
                            //     axios.get(this.requestCondition, {
                            //         method: 'GET',
                            //         headers: {
                            //             'Content-type': 'application/x-www-form-urlencoded'
                            //         },
                            //         params: {
                            //             item_id: condition.item_id,
                            //         }
                            //     }).then(response => {
                            //         if(response.data.length === 0){
                            //             Object.assign(condition, {
                            //                 condition_code: '',
                            //                 option_value: '',
                            //                 with_judgement: '',
                            //                 visibility_bool: condition.visibility_status === 1 ? true : false,
                            //                 condition_bool: condition.condition_status === 'Active' ? true : false,
                            //             })
                            //         }
                            //         for(const data of response.data){                                                
                            //             if(parseInt(condition.item_id) === parseInt(data.item_id)){
                            //                 Object.assign(condition, {
                            //                     condition_code: data.condition_code ? data.condition_code : '',
                            //                     option_value: data.option_value ? data.option_value : '',
                            //                     with_judgement: data.with_judgement ? data.with_judgement : 0,
                            //                     visibility_bool: condition.visibility_status === 1 ? true : false,
                            //                     condition_bool: condition.condition_status === 'Active' ? true : false,
                            //                 })
                            //             }
                            //         }
                            //     }).catch(error => {
                            //         console.log(error)
                            //     });
                            //     this.processFlowSub.find(flowSub => {
                            //         if(parseInt(flowSub.SubPid) === parseInt(condition.SubPid)){
                            //             flowSub.condition.push(condition)
                            //             flowSub.condition.sort((a,b) => a.sequence_number - b.sequence_number);
                            //         }
                            //     })
                            // }
                        }).catch(error => {
                            console.log(error);
                        })
                    }
                })
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
    
            this.date_created = new Date().toJSON().slice(0, 10);

        },
        
        }
        </script>
        
        <style>
        @import 'datatables.net-bs5';
        @import 'animate.css';
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,300,0,0');
        @import '@splidejs/vue-splide/css/sea-green';
        </style>