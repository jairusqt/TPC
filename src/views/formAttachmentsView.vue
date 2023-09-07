<template>
    <div class=" border rounded">
        <div class="col-md-12 mx-auto justify-content-end align-items-center row sticky-top bg-light p-2 border rounded">
            <div class="col-md-2">
                <span class="navbar-brand mb-0 h1 fs-3">Tablet Process Card</span>
            </div>
            <div class="col-md-8 mx-auto">
                <p class="fs-3 text-center">Form Assignment - File Attachment</p>
            </div>
            <div class="col-md-2 float-end">
                <button @click="returnForm" class="btn btn-outline-dark float-end w-100 h-50 "> <span class="material-symbols-outlined align-bottom">keyboard_return</span> Return</button>
            </div>
            <div class="col-md-12 mx-auto row bg-light border rounded p-3">
                <div class="col-md-3">
                    <p class=""><strong>Form Assignment No :</strong> {{assignment_id}}</p>
                    <p class=""><strong>Date Created :</strong> {{date_created}}</p>
                    <p class=""><strong>Section :</strong> {{section_code}}</p>
                    <p class=""><strong>Parts Number :</strong> {{parts_number}}</p>
                    
                </div>
                <div class="col-md-3">
                    <p><strong>Lot Number :</strong> {{lot_number}}</p>
                    <p><strong>Wafer Number From :</strong> {{wafer_number_from}}</p>
                    <p><strong>Wafer Number To :</strong> {{wafer_number_to}}</p>
                    <p><strong>Item Code :</strong> {{item_code}}</p>
                </div>
                <div class="col-md-3">
                    <p><strong>Revision Number :</strong> {{revision_number}}</p>
                    <p><strong>Quantity Ordered :</strong> {{quantity_ordered}}</p>
                    <p><strong>Delivery Date :</strong> {{delivery_date}}</p>
                    <p><strong>JO Number :</strong> {{jo_number}}</p>
                </div>
                <div class="col-md-3">
                    <p><strong>Date Issued :</strong> {{date_issued}}</p>
                    <p><strong>PO Number :</strong> {{po_number}}</p>
                    <p><strong>Assignment Status :</strong> {{assignment_status}}</p>
                    <p><strong>Total Sub Process Count :</strong></p>
                </div>
            </div>
        </div>
        <div class="container mx-auto p-3">
            <div class="col-md-12 row border rounded">
                <template v-for="sub in sortedItem" :key="sub.SubPid">
                    <div v-if="sub.assignment_status === 'Active'" class="col-md-3 p-2" >
                        <div class="card h-100">
                            <button class="btn" data-bs-toggle="modal" :data-bs-target="'#file'+sub.SubPid">
                                <span class="material-symbols-outlined border-bottom rounded text-center" style="font-size: 250px">
                                    folder
                                </span>
                            </button>
                            <div class="card-body d-flex flex-column bg-light">
                              <h5 class="card-title text-center">{{sub.sequence_number}} - {{sub.SubPname}}</h5>
                              <button v-if="assignment_status === 'Unposted'" type="button" class="btn btn-outline-primary w-100 mx-auto mt-auto" data-bs-toggle="modal" :data-bs-target="'#file'+sub.SubPid">
                                Upload Files
                              </button>
                              <button v-else type="button" class="btn btn-outline-primary w-100 mx-auto mt-auto" data-bs-toggle="modal" :data-bs-target="'#file'+sub.SubPid">
                                View Files
                              </button>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
    <div v-for="sub in item" :key="sub.SubPid" class="modal fade" :id="'file'+sub.SubPid" tabindex="-1" :aria-labelledby="'modal'+sub.SubPid" aria-hidden="true">
        <div class="modal-dialog modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" :id="'modal'+sub.SubPid">{{sub.SubPname}}</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="col-md-12 mx-auto row">
                <div v-if="assignment_status === 'Unposted'" class="col-md-12 border rounded bg-light mx-auto">
                        <div class="col-md-12 pt-2 text-center">
                            <span class="material-symbols-outlined" style="font-size:75px">
                                upload
                            </span>
                        </div>
                        <p class="text-center">Select a file to upload.</p>
                        <div class="col-md-2 pb-5 mx-auto">
                            <label class="btn btn-outline-primary w-100">
                                Select a file <input class="d-none" type="file" @change="previewFiles(sub.SubPid)" accept=".xlsx,.xls, .png, .jpeg, .jpg, .doc, .docx,.ppt, .pptx,.pdf" multiple>    
                            </label>
                        </div>
                </div>
                <div class="col-md-12 mx-auto row">
                    <div class="col-md-4 p-2" v-for="(file, index) in files" :key="index" v-show="sub.SubPid === file.SubPid">
                        <div class="card">
                            <div class="card-header">
                                <button @click="removeFile(index)" class="btn-close float-end"></button>
                            </div>
                            <img  v-if="file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg'" :src="file.src" class="card-img-top p-3" :width="200" :height="200">
                            <span v-else-if="file.type ==='application/pdf'" class="material-symbols-outlined mx-auto" style="font-size: 200px">
                                picture_as_pdf
                            </span>
                            <span v-else class="material-symbols-outlined mx-auto" style="font-size: 200px">
                                subject
                            </span>
                            <div class="card-body d-flex flex-column bg-light rounded border">
                              <h5 v-if="file.name.length > 15" class="card-title">{{file.name.split('.').map((name) => name.substring(0, 20)).join('.')}}</h5>
                              <h5 v-else class="card-title">{{file.name}}</h5>
                              <p v-if="file.type.length > 20" class="card-text">File Type: {{file.type.substring(0,20)}} ...</p>
                              <p v-else>File Type: {{file.type}}</p>
                              <label for="remarks">Remarks: </label>
                              <input v-if="file.id || assignment_status === 'Posted'" id="remarks" type="text" v-model="file.remarks" class="form-control w-100 mx-auto mt-auto" disabled>
                              <input ref="remarks" v-if="!file.id" id="remarks" type="text" v-model="file.remarks" class="form-control w-100 mx-auto mt-auto">
                              <p v-if="!file.id" class="card-text text-end"><small class="text-body-secondary">Size - {{file.size}} KB</small></p>
                              <p v-if="file.id" class="card-text text-end"><small class="text-body-secondary">Attachment Identification - {{file.id}}</small></p>
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button v-if="assignment_status === 'Unposted'" @click="saveAttachments(sub.SubPid)" type="button" class="btn btn-outline-primary">Save changes</button>
              <button v-else class="btn btn-outline-primary" disabled>Save changes</button>
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
            data() {
            return {
                formAssignmentURL: 'http://172.16.2.60/tpc/GetFormAssignment.php',
                sectionURL: 'http://172.16.2.60/tpc/GetSection.php',
                subProcessURL: 'http://172.16.2.60/tpc/GetSubProcess.php',
                keyProcessURL: 'http://172.16.2.60/tpc/GetKeyProcess.php',
                itemURL: 'http://172.16.2.60/tpc/GetItem.php',
                itemConditionURL: 'http://172.16.2.60/tpc/GetItemCondition.php',
                postFormAttachments: 'http://172.16.2.60/tpc/PostFormAttachments.php',
                requestFormAttachment: 'http://172.16.2.60/tpc/requestFormAttachment.php',
                formAssignment: [],
                section: [],
                keyProcess: [],
                subProcess: [],
                item: [],
                assignment_id: '',
                section_id: '',
                section_code: '',
                date_created: '',
                parts_number: '',
                lot_number: '',
                wafer_number_from: 0,
                wafer_number_to: 0,
                item_code: '',
                revision_number: '',
                quantity_ordered: 0,
                delivery_date: '',
                jo_number: '',
                date_issued: '',
                po_number: '',
                assignment_status: '',
                total_sub_count: 0,
                total_sub_active_count: 0,
                total_sub_inactive_count: 0,
                sequence_number: 0,
                attachment_count: 0,
                

                files: [],
              } 
            },
            methods: {
                previewFiles(SubPid){
                    for(const sub of this.item){
                        if(parseInt(sub.SubPid) === parseInt(SubPid)){
                            sub.files = event.target.files;
                            for(let i = 0; i < sub.files.length; i++){
                                const file = sub.files[i];
                                const reader = new FileReader();
                                reader.onload = (e) => {
                                    this.files.push({
                                        SubPid: sub.SubPid,
                                        src: e.target.result,
                                        name: file.name,
                                        size: ((file.size/1024)).toFixed(1),
                                        type: file.type,
                                        remarks: '',
                                    });
                                }
                                reader.readAsDataURL(file);
                            }
                        }
                    }
                },
                returnForm(){
                    this.$router.push({ name: 'formAssignmentv2' });
                },
                removeFile(i){
                    this.files.splice(i, 1);
                },
                saveAttachments(SubPid){
                    for(const item of this.item){
                        if(item.SubPid === SubPid){
                        
                        }
                    }
                    const toastLiveExample = document.getElementById('liveToast');
                    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
                    let disableRemarks = false;
                    for(const item of this.item){
                        if(SubPid === item.SubPid && item.assignment_status === 'Active'){
                            for(const file of this.files){
                                if(SubPid === parseInt(file.SubPid)){
                                    for(const fileDetails of item.files){
                                        if(file.name === fileDetails.name){
                                            Object.assign(fileDetails, {remarks: file.remarks});
                                        }
                                    }
                                }
                            }
                            for(let i = 0; i < item.files.length; i++){
                                const file = item.files[i];
                                const formData = new FormData();
                                formData.append('file', file);
                                formData.append('Details', JSON.stringify({
                                    SubPid: item.SubPid,
                                    assignment_id: this.assignment_id,
                                    lot_number: this.lot_number,
                                    item_parts_number: this.parts_number,
                                    item_code: this.item_code,
                                    revision_number: this.revision_number,
                                    assignment_status: this.assignment_status,
                                    attachment_remarks: item.files[i].remarks
                                }))
                                axios.post(this.postFormAttachments, formData, {
                                headers: {
                                  'Content-Type': 'multipart/form-data',
                                }
                                }).then(response => {
                                    if(response.data.message === 'File Attachment inserted successfully'){
                                        item.files = []
                                        if(this.$refs.remarks && Array.isArray(this.$refs.remarks)){
                                            this.$refs.remarks.forEach(remark => {
                                                remark.disabled = true;
                                            });
                                        }
                                    }
                                })
                            }
                            
                        }
                    }
                },
            },
            computed: {
                sortedItem(){
                    return this.item.sort((a,b) => a.sequence_number - b.sequence_number);
                },
            },
            async created() {
                    this.assignment_id = this.$route.query.assignment_id;
                    
                    await axios.get(this.sectionURL, {

                    }).then(response => {
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

                    await axios.get(this.formAssignmentURL, {
                    }).then(response => {
                        this.formAssignment = response.data;
                        for(const form of this.formAssignment){
                            if(parseInt(this.assignment_id) === parseInt(form.assignment_id)){
                                for(const sec of this.section){
                                    if(parseInt(form.section_id) === parseInt(sec.section_id)){
                                        this.section_code = sec.section_code;
                                    }
                                }
                                this.date_created = form.date_created;
                                this.parts_number = form.item_parts_number;
                                this.lot_number = form.lot_number;
                                this.wafer_number_from = form.wafer_number_from;
                                this.wafer_number_to = form.wafer_number_to;
                                this.item_code = form.item_code;
                                this.revision_number = form.revision_number;
                                this.quantity_ordered = form.quantity;
                                this.delivery_date = form.delivery_date? this.delivery_date: '-';
                                this.jo_number = form.jo_number;
                                this.date_issued = form.date_issued;
                                this.po_number = form.po_number? this.po_number: '-';
                                this.assignment_status = form.assignment_status;
                            }
                        }
                    }).catch(error => {
                        console.log(error)
                    });
                    await axios.get(this.itemURL, {
                        method: 'GET',
                        headers: {
                            'Content-type': 'application/x-www-form-urlencoded'
                        },
                        params: {
                            assignment_id: this.assignment_id
                        }
                    }).then(response => {
                        this.item = response.data;
                        for(const flowSub of this.item){
                            for(const key of this.keyProcess){
                                if(parseInt(flowSub.Pid) === parseInt(key.Pid)){
                                    Object.assign(flowSub, {Pname: key.Pname});
                                }
                            }
                            for(const sub of this.subProcess){
                                if(parseInt(flowSub.SubPid) === parseInt(sub.SubPid)){
                                    Object.assign(flowSub, {SubPname: sub.SubPname});
                                }
                            }
                            Object.assign(flowSub, {files: []});
                        }
                        console.log(this.item);
                    }).catch(error => {
                        console.log(error);
                    });
                    await axios.get(this.requestFormAttachment, {
                        method: 'GET',
                        headers: {
                            'Content-type': 'application/x-www-form-urlencoded'
                        },
                        params: {
                            assignment_id: this.assignment_id
                        }
                    }).then(response => {
                        for(const file of response.data){
                            let ext = file.file_name.split('.').splice(-1).toString();
                            let type = '';
                            if(ext === 'png' || ext === 'jpeg' || ext === 'jpg' ){
                                type = 'image/' + ext;
                            } else if(ext === 'pdf'){
                                type = 'application/' + ext;
                            }
                            this.files.push({
                                id: file.form_attachment_id,
                                SubPid: file.SubPid,
                                src: file.actual_file_directory,
                                name: file.file_name,
                                type: type,
                                size: '',
                                remarks: file.attachment_remarks
                            });
                        }
                    }).catch(error => {
                        console.log(error);
                    })

                    
            },
    }
</script>
  <style>
    @import 'bootstrap';
    @import 'datatables.net-bs5';
  </style>
  