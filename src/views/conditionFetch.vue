<template>
    <div class="container">
        <div class="row p-5">
            <div class="col-9 mx-auto">
                <small class="float-end p-3">Total Condition - {{ conditionLength }}</small>
                <div class="input-group mb-3">
                    <span class="input-group-text material-symbols-outlined fs-5" id="basic-addon1">
                        qr_code
                    </span>
                    <input type="text" id="qr" class="form-control" placeholder="Scan your QR Code here" v-model="qr_data" @keyup.enter="collectData">
                    <div class="invalid-feedback">
                        Please provide a valid QR Code.
                    </div>
                    <button class="btn btn-outline-dark" @click="saveConditions">
                        Save Conditions
                    </button>
                </div>
            </div>
        </div>
        <div class="row text-center" v-if="loader">
            <p>
                Condition Inserted - {{ conditionCount }}
            </p>
            <div class="col">
                <div class="p-5">
                    <div class="spinner-grow text-secondary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <div class="spinner-grow text-secondary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <div class="spinner-grow text-secondary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="table table-responsive border rounded shadow" v-else>
            <table class="table">
                <thead>
                    <tr>
                        <th>Condition Code</th>
                        <th>Detail Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="c in conditionList">

                        <td>{{ c.SubPid }}</td>
                        <td>{{ c.condition_code }}</td>
                        <td>{{ c.detail_description }}</td>
                    </tr>
                </tbody>                
            </table>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default{
        data(){
            return{
                item_code: '',
                revision_number: '',
                assignment_id: '',
                qr_data: '',
                flow_main_id: '',

                processFlow: [],
                conditionList: [],
                conditionCount: 0,
                conditionLength: 0,
                loader: false,

                sectionURL: 'http://172.16.2.13/tpc-endpoint/GetSection.php',
                processFlowURL: 'http://172.16.2.13/tpc-endpoint/GetProcessFlow.php',
                itemConditionDetailsURL: 'http://172.16.2.13/tpc-endpoint/requestItemConditionFlow.php',

                itemConditionPostURL: 'http://172.16.2.13:3000/insertFormAssignmentItemCondition',

                searchRequestURL: 'http://172.16.2.13/tpc-endpoint/requestSearchFormAssignment.php',

                DeleteItemConditionURL: 'http://172.16.2.13/tpc-endpoint/DeleteItemCondition.php',
            }
        },
        methods: {
            collectData(){
                if(this.qr_data.split('|').length === 6){
                    qr.classList.remove('is-invalid');
                    this.item_code = this.qr_data.split('|')[0];
                    this.revision_number = this.qr_data.split('|')[4];
                    this.assignment_id = parseInt(this.qr_data.split('|')[5]);
                    this.processFlow.find(f => {
                        if(f.item_code === this.item_code && parseInt(this.revision_number) === parseInt(f.revision_number)){
                            axios.get(this.itemConditionDetailsURL, {
                                method: 'GET',
                                headers: {
                                    'Content-type': 'application/x-www-form-urlencoded'
                                },
                                params: {
                                    flow_main_id: f.flow_main_id
                                }
                            }).then(response => {
                                console.log(response.data)
                                this.conditionList = response.data.map(item => {
                                    // Convert min_value and max_value to numbers (if they are not NaN or null)
                                    const min = isNaN(item.min_value) || item.min_value === null ? 0 : parseFloat(item.min_value);
                                    const max = isNaN(item.max_value) || item.max_value === null ? 0 : parseFloat(item.max_value);
                                    // Assign the converted values back to the item
                                    return {
                                        ...item,
                                        min_value: min,
                                        max_value: max,
                                    };
                                });
                                this.conditionLength = this.conditionList.length
                            }).catch(error => {
                                console.log(error)
                            })
                        }
                    })
                } else {
                    const qr = document.getElementById('qr');
                    qr.classList.add('is-invalid')
                }
            },
            async saveConditions(){
                await axios.post(this.DeleteItemConditionURL, {
                    assignment_id: this.assignment_id
                }).then(response => {
                    console.log(response.data)
                }).catch(error => {
                    console.log(error);
                }); 
                this.loader = true;
                for(const itemCondition of this.conditionList){
                    try {
                        const min = isNaN(itemCondition.min_value) ? null : parseFloat(itemCondition.min_value);
                        const max = isNaN(itemCondition.max_value) ? null : parseFloat(itemCondition.max_value);
                        let response = await axios.post(this.itemConditionPostURL, {
                            assignment_id: this.assignment_id,
                            item_id: itemCondition.item_id,
                            sequence_number: itemCondition.sequence_number,
                            SubPid: itemCondition.SubPid,
                            detail_description: itemCondition.detail_description,
                            field_type: itemCondition.field_type,
                            min_value: min,
                            max_value: max, 
                            typical_value: itemCondition.typical_value,
                            condition_code: itemCondition.condition_code,
                            option_value: itemCondition.option_value,
                            with_judgement: itemCondition.with_judgement,
                            visibility_status: itemCondition.visibility_status,
                            condition_status: 'Active'
                        })
                       if(response.data.message === 'Item Condition inserted successfully'){
                        this.conditionCount++
                       }
                    } catch (error) {
                        console.log(error)
                    }
                }
                this.loader = false;
            }
        },
        created(){
            axios.get(this.sectionURL, {
            }).then(response => {
                this.sectionList = response.data;
            }).catch(error => {
                console.log(error)
            })

            axios.get(this.processFlowURL, {}).
            then(response => {
                this.processFlow = response.data;
            }).catch(error => {
                console.log(error);
            });
        }
    }
</script>