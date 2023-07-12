<template>
    <div class="col-md-12 row mx-auto py-3">
        <div class="col-md-9">
          <h3>TPC - Setup Section</h3>
        </div>
        <div class="col-md-3 float-end">
          <button class="btn btn-outline-primary w-100 float-end" data-bs-toggle="modal" data-bs-target="#create"><span class=" align-bottom material-symbols-outlined">add</span>Create</button>
        </div>
    </div>
    <!--Datatable-->
    <div class="border rounded p-3">
        <DataTable
        :data="section"
        :columns="columns"
        class=" display table table-hover rounded"
        @click="getSection_id"
    />
    </div>

    <div class="modal fade" id="create" tabindex="-1" aria-labelledby="createModal" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="createModal">Create New Section!</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="col-md-12 row mx-auto">
              <div class="col-md-9">
                <label for="description">Description:</label>
                <input @blur="validateDescription" @focus="resetValidateDescription" type="text" class="form-control" id="description" v-model="description" ref="description">
                <div v-if="validateDescriptionErr" class="invalid-feedback">
                  <p>The specified description '{{description}}' is already present in our system. Please select an alternative and unique description.</p>
                </div>
              </div>
              <div class="col-md-3">
                <label for="code">Code:</label>
                <input @blur="validateCode" @focus="resetValidateCode" type="text" class="form-control" id="code" v-model="code" ref="code">
                <div v-if="validateCodeErr" class="invalid-feedback">
                  <p>The section code '{{code}}' is already present in our system.</p>
                </div>
              </div>
              <div class="col-md-3">
                <label for="status">Status:</label>
                <input type="text" class="form-select" id="status" disabled v-model="status">
              </div>
              <div class="col-md-3">
                <label for="shared">Shared:</label>
                <select class="form-select" id="shared" v-model="shared" ref="shared">
                  <option value="1">True</option>
                  <option value="0">False</option>
                </select>
              </div>
              <div class="col-md-4">
                <label for="class">Class:</label>
                <select class="form-select" id="class" v-model="class" ref="class">
                  <option value="Child">Child</option>
                  <option value="Parent">Parent</option>
                </select>
              </div>
              <div class="col-md-2">
                <label for="group">Group No.</label>
                <input type="text" class="form-control" id="group" v-model="group" ref="group">
              </div>
              
              <div class="p-3">
                <div ref="alert" class="col-md-12">
                  <p class="text-center">{{submissionAlert}}</p>
                </div>
              </div>

            </div>
          </div>
          <div class="modal-footer">
            <button type="button" @click="newSection" class="btn btn-primary" disabled>New</button>
            <button ref="submit" type="submit" @click="submitSection" class="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="edit" tabindex="-1" aria-labelledby="editModal" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="editModal">Edit Section!</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="col-md-12 row mx-auto">
              <div class="col-md-9">
                <label for="edit_description">Description:</label>
                <input type="text" class="form-control" id="edit_description" v-model="e_section_description" ref="description">
              </div>
              <div class="col-md-3">
                <label for="edit_code">Code:</label>
                <input type="text" class="form-control" id="edit_code" v-model="e_section_code" ref="code">
              </div>
              <div class="col-md-3">
                <label for="edit_status">Status:</label>
                <input type="text" class="form-select" id="edit_status" disabled v-model="e_section_status">
              </div>
              <div class="col-md-3">
                <label for="edit_shared">Shared:</label>
                <select class="form-select" id="edit_shared" v-model="e_section_shared" ref="shared">
                  <option value="1">True</option>
                  <option value="0">False</option>
                </select>
              </div>
              <div class="col-md-4">
                <label for="edit_class">Class:</label>
                <select class="form-select" id="edit_class" v-model="e_section_class" ref="class">
                  <option value="Child">Child</option>
                  <option value="Parent">Parent</option>
                </select>
              </div>
              <div class="col-md-2">
                <label for="edit_group">Group No.</label>
                <input type="text" class="form-control" id="edit_group" v-model="e_section_group_no" ref="group">
              </div>
              
              <div class="p-3">
                <div ref="alert" class="col-md-12">
                  <p class="text-center">{{submissionAlert}}</p>
                </div>
              </div>

            </div>
          </div>
          <div class="modal-footer">
            <button ref="submit" type="submit" @click="updateSection" class="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="modal fade" id="delete" tabindex="-1" aria-labelledby="deleteModal" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="editModal">Delete Section!</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="alert alert-warning text-center">
              <p >YOU ARE GOING TO DELETE THIS SECTION: "{{e_section_description}}"</p>
              <h5 class="text-danger">Do you wish to proceed?</h5>
            </div>
          </div>
          <div class="modal-footer">
            <button ref="submit" type="submit" @click="deleteSection" class="btn btn-outline-primary">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
</template>
<script>
    
    import bootstrap from 'bootstrap/dist/js/bootstrap';
    import axios from 'axios';
    import DataTable from 'datatables.net-vue3';
    import DataTablesCore from 'datatables.net-bs5';
    import 'datatables.net-responsive';
    import 'datatables.net-select';

    DataTable.use(DataTablesCore);
    export default {
    components: {
        DataTable,
    },
    data() {
      return {
        sectionURL: 'http://192.168.1.97/TPC/GetSection.php',
        sectionPostURL: 'http://192.168.1.97/TPC/PostSection.php',
        sectionPutURL: 'http://192.168.1.97/TPC/PutSection.php',
        sectionDeleteURL: 'http://192.168.1.97/TPC/DeleteSection.php',
        section: [],

        validateDescriptionErr: false,
        validateCodeErr: false,
        submissionAlert: '',

        //Entry 
    
        description: '',
        code: '',
        status: 'Active',
        shared: 0,
        class: 'Parent',
        group: 0,

        // for edit and delete
        e_section_id: null,
        e_section_description: '',
        e_section_code: '',
        e_section_class: '',
        e_section_group_no: 0,
        e_section_shared: 0,
        e_section_status: '',

        columns: [
          { title: 'Section Description', data: 'section_description' },
          { title: 'Section Code', data: 'section_code' },
          { title: 'Shared Section', data: 'shared_section_boolString' },
          { title: 'Section Class', data: 'section_class' },
          { title: 'Shared Group No.', data: 'shared_group_no' },
          { title: 'Date Created', data: 'date_created' },
          { title: 'Section Status', data: 'section_status' },
          { title: 'Edit Section', data: null, 
                  orderable: false, 
                  render: function (data) { 
                                  return '<button data-bs-toggle="modal" data-bs-target="#edit" class="btn w-100 text-start"><span class="material-symbols-outlined">edit</span></button'
                              } 
                          },
          { title: 'Delete Section',data: null, 
                  orderable: false, 
                  render: function (data) { 
                                  return '<button data-bs-toggle="modal" data-bs-target="#delete" class="btn w-100 text-start"><span class="material-symbols-outlined">delete</span></button'
                              } 
                          },
        ]
      } 
    },
    computed: {
      
    },
    methods: {
      getSection_id(event){
        let row = null;
        let cell = null;
        if(event.target.tagName === 'BUTTON'){
          row = event.target.parentNode.parentNode;
          cell = row.querySelector('td');
          this.e_section_description = cell.textContent;
          //console.log(this.e_section_description);
        }
        if(event.target.tagName === 'SPAN'){
          const row = event.target.parentNode.parentNode.parentNode;
          const cell = row.querySelector('td');
          this.e_section_description = cell.textContent;
          //console.log(this.e_section_description);
        }
        for(const section of this.section){
          if(section.section_description === this.e_section_description){
            this.e_section_id = section.section_id;
            this.e_section_code = section.section_code;
            this.e_section_group_no = section.shared_group_no;
            this.e_section_shared = section.shared_section;
            this.e_section_class = section.section_class;
            this.e_section_status = section.section_status;
          }
        }

      },
      resetValidateCode(){
        this.$refs.code.className = 'form-control';
        this.validateCodeErr = false;
      },
      resetValidateDescription(){
        this.$refs.description.className = 'form-control'
        this.validateDescriptionErr = false;
      },
      validateCode(){
        for(const section of this.section){
          if(this.code.toUpperCase() == section.section_code.toUpperCase()){
            this.$refs.code.className = 'form-control is-invalid';
            this.validateCodeErr = true;
          } 
        }
      },
      validateDescription(){
        for(const section of this.section){
          if(this.description.toUpperCase() == section.section_description.toUpperCase()){
            this.$refs.description.className = 'form-control is-invalid';
            this.validateDescriptionErr = true;
          } 
        }
      },
      submitSection(){
       if(this.validateDescriptionErr == true || this.validateCodeErr == true){
        this.submissionAlert = 'Submission Error'
        this.$refs.alert.className = 'alert alert-danger mx-auto';
       } else {
        axios.post(this.sectionPostURL, {
          section_description: this.description,
          section_code: this.code,
          shared_section: this.shared,
          section_class: this.class,
          shared_group_no: this.group,
          section_status: this.status
        }).then(response => {
          if(response.data.message == 'Section inserted successfully'){
            this.submissionAlert = 'Submission Success'
            this.$refs.alert.className = 'alert alert-success mx-auto';
            this.section.push({
              section_description: this.description,
              section_code: this.code,
              shared_section: this.shared,
              section_class: this.class,
              shared_group_no: this.group,
              section_status: this.status
            });
          }
        }).catch(error => {
          console.error(error);
        }); 
       }
      },
      updateSection(){
        axios.put(this.sectionPutURL,{
          section_description: this.e_section_description,
          section_code: this.e_section_code,
          shared_section: this.e_section_shared,
          section_class: this.e_section_class,
          shared_group_no: this.e_section_group_no,
          section_status: this.e_section_status,
          section_id: this.e_section_id
        }).then(response => {
          console.log(response.data)
        }).catch(error => {
          console.log(error)
        });
      },
      deleteSection(){
        console.log(this.e_section_id);
        axios.post(this.sectionDeleteURL,{
          section_id: this.e_section_id
        }).then(response => {
          console.log(response.data)
        }).catch(error => {
          console.log(error)
        });
      }
    },
    
    created() {
        axios.get(this.sectionURL, {
        }).then(response => {
          this.section = response.data;
          for(const sec of this.section){
            if(sec.shared_section == 1){
              Object.assign(sec, {shared_section_boolString: 'True'});
            }
            else{
              Object.assign(sec, {shared_section_boolString: 'False'});
            }
          }
        }).catch(error => {
          console.error(error);
        })
    },
  }
</script>
  <style>
    @import 'bootstrap';
    @import 'datatables.net-bs5';
  </style>
  