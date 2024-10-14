<template>
    <div class="container mx-auto">
        <div class="col-md-10 mx-auto p-5">
            <label for="">Search Form Assignment:</label>
            <div class="input-group mb-3">
                <span class="input-group-text material-symbols-outlined fs-5" id="basic-addon1">
                    qr_code
                </span>
                <input type="text" id="qr" class="form-control" placeholder="Scan your QR Code here" v-model="qr_data" @keyup.enter="collectData">
                <div class="invalid-feedback">
                    Please provide a valid QR Code.
                </div>
            </div>
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Assignment No.</th>
                            <th>Delivery Date</th>
                            <th>PO Number</th>
                            <th>Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="a in formsList"> 
                            <td>{{ a.assignment_id }}</td>
                            <td>
                                <input type="date" class="form-control" v-model="a.delivery_date">
                            </td>
                            <td><input type="text" :id="`poNumber_${a.assignment_id}`" :value="`${a.po_number}`" class="form-control" @keyup.enter="getPOData(a.assignment_id)"></td>
                            <td><input type="text" :id="`poQuantity_${a.assignment_id}`" :value="`${a.quantity}`" class="form-control" readonly></td>
                        </tr>
                    </tbody>
                    <tbody>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>
                                <button class="btn btn-outline-primary float-end" @click="updateDeliveryDate">
                                    Update
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import * as bootstrap from 'bootstrap';
import axios from 'axios';
    export default{
        data(){
            return{
                qr_data: '',
                formsList: [],
            }
        },
        methods: {
            collectData(){
                if(this.qr_data.split('|').length === 6){
                    qr.classList.remove('is-invalid');
                    const assignment_id = this.qr_data.split('|')[5];
                    this.fetchForm(assignment_id);
                } else {
                    const qr = document.getElementById('qr');
                    qr.classList.add('is-invalid')
                }
            },
            fetchForm(assignment_id){
                axios.get(`http://172.16.2.13:3000/getFormAssignment/${assignment_id}`, {
                }).then(response => {
                    response.data.forEach(d => {
                        console.log(d)
                        d.delivery_date = d.delivery_date.split('T')[0];
                        this.formsList.push(d)
                        this.qr_data = '';
                    })
                }).catch(error => {
                    console.log(error)
                })
            },
            updateDeliveryDate(){
                this.formsList.forEach(f => {
                    const po_number= document.getElementById(`poNumber_${f.assignment_id}`).value;
                    const quantity = document.getElementById(`poQuantity_${f.assignment_id}`).value;
                    axios.post('http://172.16.2.13:3000/updateDeliveryDate',{
                        assignment_id: f.assignment_id,
                        delivery_date: f.delivery_date,
                        po_number: po_number,
                        quantity: quantity
                    }).then(response => {
                        console.log(response.data);
                    }).catch(error => {
                        console.log(error)
                    })
                    axios.post('http://172.16.2.13:3000/updateDeliveryDateHeader',{
                        assignment_id: f.assignment_id,
                        delivery_date: f.delivery_date,
                        po_number: po_number,
                        quantity: quantity
                    }).then(response => {
                        console.log(response.data);
                    }).catch(error => {
                        console.log(error)
                    })
                })
            }
            ,
            getPOData(assignment_id){
                const po_number = document.getElementById(`poNumber_${assignment_id}`);
                axios.get(`http://172.16.2.13:3000/getPoNumber/${po_number.value}`,{
                })
                .then(response => {
                    const po_quantity = document.getElementById(`poQuantity_${assignment_id}`);
                    for(let d of response.data.result){
                        po_quantity.value = d.hct_OrderQuantity;
                    }
                })
                .catch(error => {
                    console.error(error);
                })
            }
        },
        created(){
            
        }
    }
</script>