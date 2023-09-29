<template>
    <div class="container row mx-auto">
        <table class="table table-bordered d-print-table d-none">
            <tbody v-for="test in 6">
                <tr>
                    <template v-for="item in 2">
                        <td>Item Code :</td>
                        <td>{{item_code}}</td>
                        <td rowspan="5" class=""><vue-qrcode :value="qr_code" :options="{ width: 175 }" class="p-3"></vue-qrcode></td>
                    </template>
                </tr>
                <tr>
                    <template v-for="parts in 2">
                        <td>Parts Number :</td>
                        <td>{{parts_number}}</td>
                    </template>

                </tr>
                <tr>
                    <template v-for="rev in 2">
                        <td>Revision Number :</td>
                        <td>{{revision_number}}</td>
                    </template>
                </tr>
                <tr>
                    <template v-for="lot in 2">
                        <td>Lot Number :</td>
                        <td>{{lot_number}}</td>
                    </template>
                </tr>
                <tr>
                    <template v-for="date in 2">
                        <td>Date Issued :</td>
                        <td>{{date_issued}}</td>
                    </template>
                </tr>
                <tr></tr>
            </tbody>
        </table>
        
    </div>
    <div class="container d-print-none"> 
        <div class="col-md-12">
            <p class="fs-3 text-center p-3 "><em>Form Assignment - Generate QR Code</em> 
            </p>
            <div class="card col-md-12 mx-auto">
                <div class="col-md-12 row">
                    <div class="col-md-3 p-3 mx-auto">
                        <vue-qrcode :value="qr_code" :options="{ width: 290 }" class="p-3 border rounded"></vue-qrcode>
                        <qrcode-stream></qrcode-stream>
                        <qrcode-drop-zone></qrcode-drop-zone>
                        <qrcode-capture></qrcode-capture>
                        <p class="fs-2 text-center px-1"><strong>Scan Me</strong></p>
                    </div>
                </div>
                <div class="card-body">
                  <h5 class="card-title text-center">Form Assignment Identification: {{assignment_id}}</h5>
                  <p class="card-text">The data encoded within this QR code is designed to facilitate the process of managing form assignments.</p>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">Item Code: {{item_code}}</li>
                    <li class="list-group-item">Parts Number: {{parts_number}}</li>
                    <li class="list-group-item">Lot Number: {{lot_number}}</li>
                    <li class="list-group-item">Date Issued: {{date_issued}}</li>
                    <li class="list-group-item">Revision Number: {{revision_number}}</li>
                </ul>
                <div class="card-footer">
                  <button class="btn btn-primary float-end" @click="print">Print QR Code</button>
                </div>
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
    import { useRouter } from "vue-router";
    import * as bootstrap from 'bootstrap';
    DataTable.use(DataTablesCore);
    export default {
    components: {
        DataTable,
    },
    data() {
      return {
        qr_data: [],
        qr_code: '',
        assignment_id: '',
        item_code: '',
        parts_number: '',
        lot_number: '',
        date_issued: '',
        revision_number: ''
      } 
    },
    computed: {
      
    },
    methods: {
      print(){
        window.print();
      }
    },
    
    created() {
        this.assignment_id = this.$route.query.assignment_id;
        this.item_code = this.$route.query.item_code;
        this.parts_number = this.$route.query.parts_number;
        this.lot_number = this.$route.query.lot_number;
        this.date_issued = this.$route.query.date_issued;
        this.revision_number = this.$route.query.revision_number;
        this.qr_code = this.item_code + '|' + this.parts_number + '|' + this.lot_number + '|' + this.date_issued + '|' + this.revision_number;
        this.qr_data.push({
            parts_number: this.parts_number,
            lot_number: this.lot_number,
            item_code: this.item_code,
            date_issued: this.date_issued,
            revision_number: this.revision_number
        })
    },
  }
</script>
  <style>
    @import 'bootstrap';
    @import 'datatables.net-bs5';
    @media print {
       /* Adjust the font size, line height, and other styles for better readability */
    .d-print-table td {
        font-size: 8px; /* Adjust as needed */
        line-height: 1.4;
    }
    
    /* Make sure the QR code doesn't overlap with other content */
    .d-print-table td:nth-child(3) {
        padding-top: 10px; /* Adjust as needed */
    }
    
    /* Center the QR code in its cell */
    .d-print-table td:nth-child(3) vue-qrcode {
        display: block;
        margin: 0 auto;
    }
    }
  </style>
  