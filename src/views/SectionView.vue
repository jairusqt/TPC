<template>
    <div class="py-2 col-md-12 row">
        <div class="col-md-6">
            <h3>TPC - Setup Section</h3>
        </div>
        <div class="col-md-6"> 
            <div class="col-md-2 px-1 float-end">
                <button class="btn btn-light w-100 float-end"><span class=" align-bottom material-symbols-outlined">delete</span>Delete</button>
            </div>
            <div class="col-md-2 px-1 float-end">
                <button class="btn btn-light w-100 float-end" data-bs-toggle="modal" data-bs-target="#Edit"><span class=" align-bottom material-symbols-outlined">edit</span>Edit</button>
            </div>
            <div class="col-md-2 px-1 float-end">
                <button class="btn btn-light w-100 float-end" data-bs-toggle="modal" data-bs-target="#Create"><span class=" align-bottom material-symbols-outlined">add</span>Create</button>
            </div>
        </div>
    </div>
    <!--Datatable-->
    <div class="border rounded p-3">
        <DataTable
        :data="section"
        :columns="columns"
        class="display table table-hover rounded"
    />
    </div>

    <!-- Modal -->
    <div class="modal modal-lg fade" id="Create" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <form @submit.prevent="submitSection" autocomplete="off">
            <div class="modal-header">
              <div class="col-md-11"></div>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="col-md-12 row">
                  <div class="col-md-6 p-2">
                      <label for="">Section Description: </label>
                      <input id="section_description" type="text" v-model="section_description" name="section_description" class="form-control form-control-sm" required>
                  </div>
                  <div class="col-md-6 p-2">
                      <label for="">Section Code: </label>
                      <input id="section_code" type="text" v-model="section_code" name="section_code" class="form-control form-control-sm" required>
                  </div>
                  <div class="col-md-6 p-2"> 
                      <label for="">Section Status:</label>
                      <select id="section_status" class="form-select form-select-sm" v-model="section_status" disabled>
                          <option value="Active">Active</option>
                      </select>
                  </div>
                  <div class="col-md-6 p-2"> 
                      <label for="">Shared Section:</label>
                      <select id="shared_section" class="form-select form-select-sm" v-model="shared_section" name="shared_section" required>
                          <option value="1">True</option>
                          <option value="0">False</option>
                      </select>
                  </div>
                  <div class="col-md-6 p-2"> 
                      <label for="">Section Class:</label>
                      <select id="section_class" class="form-select form-select-sm" v-model="section_class" name="section_class" required>
                          <option value="Parent">Parent</option>
                          <option value="Children">Children</option>
                      </select>
                  </div>
                  <div class="col-md-6 p-2">
                      <label for="">Shared Group No.:</label>
                      <input id="shared_group_no" type="text" class="form-control form-control-sm" v-model="shared_group_no" name="shared_group_no" required>
                  </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="submit" class="btn btn-light">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal modal-lg fade" id="Edit" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog">
          <div class="modal-content">
            <form @submit.prevent="submitSection" autocomplete="off">
              <div class="modal-header">
                <div class="col-md-11"></div>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <div>
                    <VueMultiselect
                      v-model="selected"
                      :options="sectionOptions"
                      :close-on-select="true"
                      :clear-on-select="false"
                      @select="populateEditOptions"
                    ></VueMultiselect>
                </div>
                <div id="editableFields" class="col-md-12">

                </div>
                <!-- <div class="col-md-12 row">
                    <div class="col-md-6 p-2">
                        <label for="">Section Description: </label>
                        <input id="section_description" type="text" v-model="section_description" name="section_description" class="form-control form-control-sm" required>
                    </div>
                    <div class="col-md-6 p-2">
                        <label for="">Section Code: </label>
                        <input id="section_code" type="text" v-model="section_code" name="section_code" class="form-control form-control-sm" required>
                    </div>
                    <div class="col-md-6 p-2"> 
                        <label for="">Section Status:</label>
                        <select id="section_status" class="form-select form-select-sm" v-model="section_status" disabled>
                            <option value="Active">Active</option>
                        </select>
                    </div>
                    <div class="col-md-6 p-2"> 
                        <label for="">Shared Section:</label>
                        <select id="shared_section" class="form-select form-select-sm" v-model="shared_section" name="shared_section" required>
                            <option value="1">True</option>
                            <option value="0">False</option>
                        </select>
                    </div>
                    <div class="col-md-6 p-2"> 
                        <label for="">Section Class:</label>
                        <select id="section_class" class="form-select form-select-sm" v-model="section_class" name="section_class" required>
                            <option value="Parent">Parent</option>
                            <option value="Children">Children</option>
                        </select>
                    </div>
                    <div class="col-md-6 p-2">
                        <label for="">Shared Group No.:</label>
                        <input id="shared_group_no" type="text" class="form-control form-control-sm" v-model="shared_group_no" name="shared_group_no" required>
                    </div>
                </div> -->
              </div>
              <div class="modal-footer">
                <button type="submit" class="btn btn-light">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>

    <div class="toast-container position-fixed top-0 end-0 p-3">
      <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
          <strong id="alertHeader" class="me-auto"></strong>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div id="alert" class="toast-body">
          
        </div>
      </div>
    </div>
</template>
<script>
    
    import bootstrap from 'bootstrap/dist/js/bootstrap';
    import VueMultiselect from 'vue-multiselect';
    import axios from 'axios';
    import DataTable from 'datatables.net-vue3';
    import DataTablesCore from 'datatables.net-bs5';
    import 'datatables.net-responsive';
    import 'datatables.net-select';

    DataTable.use(DataTablesCore);
    export default {
    props: ['sectionResponse'],
    components: {
        DataTable,
        VueMultiselect
    },
    data() {
      return {
        selected: '',
        options: [],
        sectionOptions: [],
        section: [],
        section_code: '',
        section_description: '',
        section_status: 'Active',
        shared_section: '',
        section_class: '',
        shared_group_no: '',
        date_created: '',
        columns: [
          { title: 'Section Description', data: 'section_description' },
          { title: 'Section Code', data: 'section_code' },
          { title: 'Shared Section', data: 'shared_section' },
          { title: 'Section Class', data: 'section_class' },
          { title: 'Shared Group No.', data: 'shared_group_no' },
          { title: 'Date Created', data: 'date_created' },
          { title: 'Section Status', data: 'section_status' },
        ]
      } 
    },
    computed: {
      
    },
    methods: {
      getCurrentDate(){
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        return year + '-' + month + '-' + day;
      },
      submitSection(){
        axios.post('http://172.16.2.69/tpcrequesthandlers/SectionRequestHandler.php', {
          section_code: this.section_code,
          section_description: this.section_description,
          shared_section: parseInt(this.shared_section),
          section_class: this.section_class,
          section_status: this.section_status,
          shared_group_no: this.shared_group_no
        })
        .then(response => {
          console.log(response);
          const toastLiveExample = document.getElementById('liveToast')
          const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
          const clearField = () => {
            this.section_description = '';
            this.section_code = '';
            this.shared_section = '';
            this.section_class = '';
            this.shared_group_no = '';
          }
          if(response.data.message === 'Data inserted successfully'){
            const appendSection = {
              section_code: this.section_code,
              section_description: this.section_description,
              shared_section: parseInt(this.shared_section),
              section_class: this.section_class,
              section_status: this.section_status,
              shared_group_no: this.shared_group_no,
              date_created: this.date_created,
            };            
            this.section.push(appendSection);
            this.sectionOptions.push(this.section_code);
            toastBootstrap.show()

            const alert = document.getElementById('alert');
            const alertHeader = document.getElementById('alertHeader');
            alert.innerText = `Section Description: ${this.section_description} and Section Code: ${this.section_code} Submitted Successfully`;
            alertHeader.innerText = 'Data Submitted Successfully!';
            clearField();
            
          } else {
            toastBootstrap.show()
            const alert = document.getElementById('alert');
            const alertHeader = document.getElementById('alertHeader');
            alert.innerText = `There appears to be an issue with submitting the data. Please verify if the data already exists or contact an SD (System Developer) or system maintenance for assistance.`;
            alert.innerHTML = response.data;
            alertHeader.innerText = 'Data Submission Failed';
          }
        })
        .catch(error => {
          console.log(error);
        })
      },
      populateEditOptions(selectedOption){
        const editableFields = document.getElementById('editableFields');
        for(const sec of this.section){
          if(selectedOption === sec.section_code){
            console.log(sec.section_description);
          }
        }
      },
    },
    
    created() {
        this.section = this.sectionResponse;
        this.date_created = this.getCurrentDate();
    },
    mounted(){
        for(const sec of this.section){
          this.sectionOptions.push(sec.section_code);
        }
    }
  }
</script>
  <style>
    @import 'bootstrap';
    @import 'datatables.net-bs5';
    @import 'vue-multiselect/dist/vue-multiselect.css';
  </style>
  