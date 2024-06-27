<template>
    <div class="container d-print-none"> 
        <div class="col-md-12 shadow-lg">
            <p class="fs-3 text-center pt-3 "><em>Form Assignment - Generate QR Code</em> 
            </p>
            <div class=" col-md-12 mx-auto">
                <div class="col-md-12 row">
                    <div class="col-md-3 p-3 mx-auto">
                        <vue-qrcode :value="qr_code" :options="{ margin: 3, width: 300 }" class="rounded shadow-lg rounded"></vue-qrcode>
                        <p class="text-center fs-3 p-"><em>SCAN ME!</em></p>
                    </div>
                </div>
                <div class="card-body">
                  <h5 class="card-title text-center p-3"><em>Form Assignment Identification: {{assignment_id}}</em></h5>
                  <p class="card-text p-3 fs-5 text-center"><em>The data encoded within this QR code is designed to facilitate the process of managing form assignments.</em></p>
                </div>
                <ul class="list-group list-group-flush border">
                    <li class="list-group-item"><em>Item Code: <b><u>{{item_code}}</u></b></em></li>
                    <li class="list-group-item"><em>Parts Number: <b><u>{{parts_number}}</u></b></em></li>
                    <li class="list-group-item"><em>Lot Number: <b><u>{{lot_number}}</u></b></em></li>
                    <li class="list-group-item"><em>Date Issued: <b><u>{{date_issued}}</u></b></em></li>
                    <li class="list-group-item"><em>Revision Number: <b><u>{{revision_number}}</u></b></em></li>
                </ul>
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
    import print from 'print-js'
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
      },
    },
    
    created() {
        this.assignment_id = this.$route.query.assignment_id;
        this.item_code = this.$route.query.item_code;
        this.parts_number = this.$route.query.parts_number;
        this.lot_number = this.$route.query.lot_number;
        this.date_issued = this.$route.query.date_issued;
        this.revision_number = this.$route.query.revision_number;
        this.qr_code = this.item_code + '|' + this.parts_number + '|' + this.lot_number + '|' + this.date_issued + '|' + this.revision_number + '|' + this.assignment_id;
        this.qr_data.push({
            parts_number: this.parts_number,
            lot_number: this.lot_number,
            item_code: this.item_code,
            date_issued: this.date_issued,
            revision_number: this.revision_number,
            assignment_id: this.assignment_id
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
  