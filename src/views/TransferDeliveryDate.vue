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
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="a in formsList"> 
                            <td>{{ a.assignment_id }}</td>
                            <td>
                                <input type="date" class="form-control" v-model="a.delivery_date">
                            </td>
                        </tr>
                    </tbody>
                    <tbody>
                        <tr>
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
                formsList: []
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
                        console.log(d.delivery_date)
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
                    axios.post('http://172.16.2.13:3000/updateDeliveryDate',{
                        assignment_id: f.assignment_id,
                        delivery_date: f.delivery_date
                    }).then(response => {
                        console.log(response.data);
                    }).catch(error => {
                        console.log(error)
                    })
                    axios.post('http://172.16.2.13:3000/updateDeliveryDateHeader',{
                        assignment_id: f.assignment_id,
                        delivery_date: f.delivery_date
                    }).then(response => {
                        console.log(response.data);
                    }).catch(error => {
                        console.log(error)
                    })
                })
            }
        },
        created(){
            
        }
    }
</script>