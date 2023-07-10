<template>
    <div class="py-2 col-md-12 row">
        <div class="col-md-6">
            <h3>TPC - Setup Section</h3>
        </div>
        <div class="col-md-6"> 
            <div class="col-md-2 px-1 float-end">
                <button class="btn btn-light w-100 float-end"><span class=" align-bottom material-symbols-outlined" data-bs-toggle="modal" data-bs-target="#create">add</span>Create</button>
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

    <div class="modal fade" id="create" tabindex="-1" aria-labelledby="createModal" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="createModal">Create Section</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="col-md-12 row">
              <div class="col-md-6">
                <input type="text" class="form-control">
              </div>
              <div class="col-md-6">

              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
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
    components: {
        DataTable,
        VueMultiselect
    },
    data() {
      return {
        section: [],
        columns: [
          { title: 'Section Description', data: 'section_description' },
          { title: 'Section Code', data: 'section_code' },
          { title: 'Shared Section', data: 'shared_section' },
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

    },
    
    created() {
        axios.get('http://localhost/tpcrequesthandlers/sectionView.php', {

        }).then(response => {
          this.section = response.data;
        }).catch(error => {
          console.error(error);
        })
    },
  }
</script>
  <style>
    @import 'bootstrap';
    @import 'datatables.net-bs5';
    @import 'vue-multiselect/dist/vue-multiselect.css';
  </style>
  