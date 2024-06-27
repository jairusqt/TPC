<template>
    <div class="row d-print-none">
        <div class="col-8">

        </div>
        <div class="col-4 row p-3">
            <div class="col-3"></div>
            <div class="col-3">
                <button class="btn btn-primary p-2 float-end w-100" data-bs-toggle="modal" data-bs-target="#editModal">
                    <span class="align-bottom material-symbols-outlined">edit</span>Edit Label
                </button>
            </div>
            <div class="col-3">
                <button class="btn btn-primary p-2 float-end w-100" data-bs-toggle="modal" data-bs-target="#settingsModal">
                    <span class="align-bottom material-symbols-outlined">settings</span>Settings
                </button>
            </div>
            <div class="col-3">
                <button class="btn btn-primary p-2 float-end w-100" @click="print">
                    <span class="align-bottom material-symbols-outlined">print</span>Print
                </button>
            </div>
        </div>
    </div>
    <div class="table-responsive px-5 pt-5 shadow gradient d-print-none">
      <DataTable
                ref="formTable"
                :data="formAssignment"
                :columns="columns"
                class="display table-hover table table-light shadow gradient p-5"
                @select="handleSelection"
                :options="tableOptions"
            />
    </div>
    <div class="custom-grid">
       <div class="custom-column" v-for="qr in qrData">
            <div class="label" :style="'background-color: '+qr.color" v-if="qr !== ''">
                <b style="font-size: 0.75em;" class="text-break">NEW TPC</b><br>
                <b style="font-size: 0.8em;" class="text-break">PN:{{qr.item_parts_number}}</b><br>
                <b style="font-size: 0.8em;" class="text-break">LN:{{qr.lot_number}}</b>
            </div>
            <div class="qr-code" v-if="qr !== ''">
                <img
                class="label" 
                :src="`https://api.qrserver.com/v1/create-qr-code/?data=`+qr.item_code + '|' + qr.item_parts_number + '|' + qr.lot_number + '|' + qr.date_issued + '|' + qr.revision_number + '|' + qr.assignment_id + `&amp;size=70x70`" 
                alt="" 
                title="" 
                />
            </div>
            <div v-else>

            </div>
       </div>
    </div>
    <div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">Label Color Selector</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="table-responsive shadow p-3">
                <table class="table">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Assignment Number</th>
                            <th>Section Code</th>
                            <th>Parts Number</th>
                            <th>Lot Number</th>
                            <th>Label Color</th>
                            <th>Duplicate</th>
                            <th>
                                Multi-Select<br>
                                <div class="form-check">
                                    <input class="form-check-input mx-auto" @change="checkAll" type="checkbox" id="checkAllGroup">
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="(qr, index) in qrData" :key="qr.assignment_id">
                            <tr :style="'background-color: '+qr.color">
                                <td class="bg-light">{{index + 1}}</td>
                                <td>{{qr.assignment_id}}</td>
                                <td>{{qr.section_code}}</td>
                                <td>{{qr.item_parts_number}}</td>
                                <td>{{qr.lot_number}}</td>
                                <td>
                                    <select v-if="qr.grouped === false" class="form-select" v-model="qr.color" :disabled="qr === ''">
                                        <option value="" selected disabled></option>
                                        <option value="#f472b6" style="background-color: #f472b6;">Pink</option>
                                        <option value="#60a5fa" style="background-color: #60a5fa;">Blue</option>
                                        <option value="#fef08a" style="background-color: #fef08a;">Yellow</option>
                                        <option value="#ffffff" style="background-color: #ffffff;">White</option>
                                        <option value="#fb923c" style="background-color: #fb923c;">Orange</option>
                                        <option value="#4ade80" style="background-color: #4ade80;">Green</option>
                                        <option value="#9ca3af" style="background-color: #9ca3af;">Gray</option>
                                        <option value="#f87171" style="background-color: #f87171;">Red</option>
                                        <option value="#c084fc" style="background-color: #c084fc;">Lavender</option>
                                        <option value="#9e826b" style="background-color: #9e826b;">Brown</option>
                                    </select>
                                    <p v-else>{{qr.color}}</p>
                                </td>
                                <td>
                                    <button v-if="qr.duplicate === false" class="btn btn-sm btn-light rounded-circle shadow-lg" @click="duplicate(index, qr.assignment_id)">
                                        <span class="material-symbols-outlined">
                                            add
                                        </span>
                                    </button>
                                    <button v-else class="btn btn-sm btn-light rounded-circle shadow-lg" @click="removeDuplicate(index, qr.assignment_id)">
                                        <span class="material-symbols-outlined">
                                            remove
                                        </span>
                                    </button>
                                </td>
                                <td>
                                    <div class="form-check">
                                        <input class="form-check-input mx-auto" @change="groupedChecked(index)" type="checkbox" :id="'group'+index" :checked="qr.grouped">
                                    </div>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                    <thead>
                        <tr>
                            <th colspan="5"></th>
                            <th>Group Color</th>
                            <th colspan="2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr :style="'background-color: '+this.groupColor">
                            <td colspan="5"></td>
                            <td>
                                <select @change="changeGroupColor" class="form-select" v-model="this.groupColor" :disabled="qr === ''">
                                    <option value="" selected disabled></option>
                                    <option value="#f472b6" style="background-color: #f472b6;">Pink</option>
                                    <option value="#60a5fa" style="background-color: #60a5fa;">Blue</option>
                                    <option value="#fef08a" style="background-color: #fef08a;">Yellow</option>
                                    <option value="#ffffff" style="background-color: #ffffff;">White</option>
                                    <option value="#fb923c" style="background-color: #fb923c;">Orange</option>
                                    <option value="#4ade80" style="background-color: #4ade80;">Green</option>
                                    <option value="#9ca3af" style="background-color: #9ca3af;">Gray</option>
                                    <option value="#f87171" style="background-color: #f87171;">Red</option>
                                    <option value="#c084fc" style="background-color: #c084fc;">Lavender</option>
                                    <option value="#9e826b" style="background-color: #9e826b;">Brown</option>
                                </select>
                            </td>
                            <td colspan="2">

                            </td>
                        </tr>
                    </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal fade" id="settingsModal" tabindex="-1" aria-labelledby="settingsModal" aria-hidden="true">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">Print Settings</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body row">
                <div class="col-6 p-3">
                    <label for="top">Top Margin :</label>
                    <input id="top" type="text" class="form-control" v-model="top">
                </div>
                <div class="col-6 p-3">
                    <label for="top">Used Label :</label>
                    <input id="top" type="text" class="form-control" v-model="used">
                </div>
                <div class="alert alert-warning col-12 p-12">
                    <b>Reminders!</b>
                    <br>
                    <br>
                    To ensure optimal printing, please follow these instructions:
                    <br>
                    1. Set Paper Size:
                    <br>
                    Set the paper size to Legal.
                    <br>
                    2. Adjust Margins and Scale:
                    <br>
                    Leave margins and scale at their default settings.
                    <br>
                    3. Headers and Footers:
                    <br>
                    Ensure that Headers and Footers are unchecked or disabled.
                    Do not use headers and footers for this print job.
                    <br>
                    4. Background Graphics:
                    <br>
                    Check the option for Background Graphics to include any necessary background elements.
                    <br>
                    5. Top Margin Adjustment:
                    <br>
                    If needed, adjust the top margin in the settings based on your requirements.
                    <br>
                    6. Number of Labels:
                    <br>
                    Specify the number of labels already used on the settings, if applicable.
                    <br>
                    <hr>
                    <b>
                        Once these settings are configured, proceed with your print job. If you encounter any issues or have specific requirements, please contact SD support.
                    </b>
                </div>
            </div>
            <div class="modal-footer"> 
              <button id="resetBtn" type="button" class="btn btn-primary" @click="reset">Reset</button>
              <button id="saveBtn" type="button" class="btn btn-primary" @click="saveSettings">Save changes</button>
            </div>
          </div>
        </div>
      </div>


      <div class="toast-container position-fixed top-0 end-0 p-3">
        <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="toast-header">
            <strong class="me-auto">System Alert!</strong>
            <small>a while ago</small>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div class="toast-body">
            Changes Saved.
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
          sectionURL: 'http://172.16.2.13/tpc-endpoint/GetSection.php',
          
        //   formAssignmentURL: 'http://172.16.2.13/tpc-endpointDev/GetFormAssignment.php',
        //   sectionURL: 'http://172.16.2.13/tpc-endpointDev/GetSection.php',

          top: 25.4,
          color: '',
          formAssignment: [],
          section: [],
          qrData: [],
          groupColor: '',
          used: 0,
          qr_code: 'BIOT SI JANDI',
          tableOptions: {
              order: [[0, 'desc']],
              select: true
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
          ],
      }
  },
  methods: {
    checkAll(){
        let checkValue = document.getElementById('checkAllGroup').checked;
        this.qrData.map(qr => qr.grouped = checkValue);
    },
    changeGroupColor(){
        this.qrData.filter(qr => {
            if(qr.grouped === true){
                qr.color = this.groupColor;
            }
        })
    },
    groupedChecked(index){
        let checkValue = document.getElementById(`group${index}`).checked;
        this.qrData.find((qr, i) => {
            if(i === index){
                qr.grouped = checkValue;
                qr.color = this.groupColor;
            }
        })

    },
    removeDuplicate(index){
        this.qrData.splice(index, 1);
    },
    duplicate(index, assignment_id){
        let dup;
        this.qrData.find(qr => {
            if(parseInt(assignment_id) === parseInt(qr.assignment_id)){
                console.log(qr)
                dup = {
                    assignment_id: qr.assignment_id,
                    section_code: qr.section_code,
                    item_parts_number: qr.item_parts_number,
                    lot_number: qr.lot_number,
                    item_code: qr.item_code,
                    date_issued: qr.date_issued,
                    revision_number: qr.revision_number,
                    color: qr.color,
                    grouped: qr.grouped,
                    duplicate: true
                }
            }
        })
        this.qrData.splice(index + 1, 0, dup);
        this.qrData.filter((qr, i) => {
            if(i === index + 1){
                qr.duplicate = true;
            }
        });
    },
    handleSelection(e){
        this.qrData = [];
        let rows = document.querySelectorAll('.selected');
        for(let i = 0; i < rows.length; i++){
            let td = rows[i].querySelectorAll('td');
            let assignment_id = parseInt(td[0].textContent);
            this.formAssignment.find(fa => {
                if(parseInt(assignment_id) === parseInt(fa.assignment_id)){
                    this.qrData.push(fa);
                    for(const qr of this.qrData){
                        Object.assign(qr, {color: '', duplicate: false, grouped: false,})
                    }
                }
            })
        }
        
    },
    saveSettings(){
        const toastLiveExample = document.getElementById('liveToast');
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
        let saveBtn = document.getElementById('saveBtn');
        saveBtn.disabled = true;
        const style = document.createElement('style');
        style.textContent = `
            @page {
              size: legal;
              margin: ${this.top}mm 12.7mm 0 12.7mm;
            }
        `
        const existingStyle = document.head.querySelector('#printStyles');
        if (existingStyle) {
          existingStyle.remove();
        }
        style.id = 'printStyles';
        document.head.appendChild(style);
        for(let i = 0; i < this.used; i++){
            this.qrData.unshift('');
        }
        toastBootstrap.show();
    },
    reset(){
        let saveBtn = document.getElementById('saveBtn');
        saveBtn.disabled = false;
        this.top = 25.4;
        this.used = 0;
        this.qrData = []
        let rows = document.querySelectorAll('.selected');
        for(let i = 0; i < rows.length; i++){
            let td = rows[i].querySelectorAll('td');
            let assignment_id = parseInt(td[0].textContent);
            this.formAssignment.find(fa => {
                if(parseInt(assignment_id) === parseInt(fa.assignment_id)){
                    this.qrData.push(fa);
                    for(const qr of this.qrData){
                        Object.assign(qr, {color: ''})
                    }
                }
            })
        }
    },
    print(){
        window.print();
    },
  },
  async created() {
      await axios.get(this.sectionURL, {}).
      then(response => {
          this.section = response.data;
      }).catch(error => {
          console.log(error);
      });

      await axios.get(this.formAssignmentURL, {
  
      }).then(response => {
          for(const fa of response.data){
            if(fa.assignment_status === 'Posted'){
                this.formAssignment.push(fa);
            }
          }
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
  

  },
  
  }
  </script>
  
  <style>
  @import 'datatables.net-bs5';
  @import 'animate.css';
  @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,300,0,0');
  @import '@splidejs/vue-splide/css/sea-green';

  @media print {
  @page {
    size: legal; 
    margin: 25.4mm 12.7mm 0 12.7mm;
  }

  body {
    margin: initial; /* Reset body margin for print */
  }
  
  .custom-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0;
    margin: 0;
    padding: 0;
  }

  .custom-column {
    /* border-style: solid;
    border-color: black; */
    box-sizing: border-box;
    width: 25%; /* Four columns with a small gap */
    height: 20mm;
    margin: 0;
    padding: 0;

    /* Nested grid for label and QR code */
    display: grid;
    grid-template-columns: 60% 40%;
  }

  /* Label style */
  .label {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    font-size: 10px;
    padding-top: 3mm;
    padding-left: 2mm;
    padding-right: 2mm;
  }

  /* QR code style */
  .qr-code {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    /* padding-top: 1mm; */
  }
}
@media screen {
    .custom-grid {
        display: none;
    }
}
</style>