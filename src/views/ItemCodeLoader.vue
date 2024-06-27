<template>
    <div class="container mx-auto">
        <div>
            <h4 class="p-3 text-center">
                <em>
                    Item Code Loader
                </em>
            </h4>
        </div>
        <div class="table-responsive shadow p-3 rounded">
            <div class="col-12 row py-3">
                <div class="col-2">
                    <button class="btn btn-sm btn-outline-dark w-100 shadow"  data-bs-toggle="modal" data-bs-target="#exampleModal">Load Item Code</button>
                </div>
                <div class="col-7"></div>
                <div class="col-3">
                    <input type="text" class="form-control shadow">
                </div>
            </div>
            <table class="table border shadow">
                <thead>
                    <tr>
                        <th>Item Code</th>
                        <th>Item Parts Number</th>
                        <th>Item Description</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="i of itemmaster">
                        <tr>
                            <td>{{ i.item_code }}</td>
                            <td>{{ i.item_parts_number }}</td>
                            <td>{{ i.item_description }}</td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
    </div>

    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Item Code Loader</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row">
                <div :class="'row mx-auto p-3 rounded shadow border-1 border ' + this.border">
                    <div class="col-md-6 mx-auto">
                        <label for="">Item Code :</label>
                        <input type="text" class="form-control" v-model="item_code">
                    </div>
                    <div class="col-md-6">
                        <label for="">Item Parts Number :</label>
                        <input type="text" class="form-control" v-model="item_parts_number">
                    </div>
                    <div class="col-md-12">
                        <label for="">Item Description :</label>
                        <textarea  id="" class="form-control" v-model="item_description"></textarea>
                    </div>
                    <div class="col-md-10">
                        <small>{{ prompt }}</small>
                    </div>
                    <div class="col-md-2 float-end p-2">
                        
                    </div>
                </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary btn-sm" data-bs-dismiss="modal">Cancel</button>
            <button class="btn btn-sm btn-outline-dark" @click="load">
                Load
            </button>
          </div>
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
                prompt: '',
                success: '',
                border: 'border-dark',
                itemmasterURL: '',
                itemmasterInsertURL: '',
                itemmaster: [],
                search_param: '',
                item_code: '',
                item_parts_number: '',
                item_description: '',
            }
        },
        methods: {
            search(){
                this.itemmasterURL = `http://172.16.2.99:3000/itemMaster/${this.search_param}`;
                axios.get(this.itemmasterURL, {
                }).then(response => {
                    this.itemmaster = response.data;;
                    console.log(this.itemmaster);
                }).catch(error => {
                    console.log(error)
                })
            },
            load(){
                this.itemmasterInsertURL = 'http://172.16.2.99:3000/insertItemCode';
                axios.post(this.itemmasterInsertURL, {
                    item_code: this.item_code,
                    item_parts_number: this.item_parts_number,
                    item_description: this.item_description,
                }).then(response => {
                    if(response.data.message === 'Item Code inserted successfully'){
                        this.item_code = '';
                        this.item_parts_number = '';
                        this.item_description = '';
                        this.border = 'border-success';
                        this.prompt = 'Data inserted successfully, please check it on the Process Flow';
                    }
                }).catch(error => {
                    if(error) {
                        this.border = 'border-warning';
                        this.prompt = 'Data Not inserted';
                    }
                })
            },
        },
        created(){
            axios.get('http://172.16.2.99:3000/itemmaster_main', {
            }).then(response => {
                this.itemmaster = response.data
            }).catch(error => {
                console.log(error)
            })
        }
    }
</script>

<style></style>