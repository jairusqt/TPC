
<template>
<DataTable
    :data="subProcess"
    :columns="columns"
    class="display table"
/>
</template>
<script>
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net-bs5';
import 'datatables.net-responsive';
import 'datatables.net-select';
DataTable.use(DataTablesCore);
export default {
props: ['subProcessResponse'],
components: {
  DataTable
},
data() {
  return {
    subProcess: [],
    columns: [
      { title: 'Section Code', data: 'section_code' },
      { title: 'Process Description', data: 'Pname' },
      { title: 'Sub Process Description', data: 'SubPname' },
      { title: 'Process Type', data: 'process_type' },
      { title: 'Sequence Number', data: 'sequence_number' },
      { title: 'Status', data: 'sub_process_status' },
      { title: 'Date Created', data: 'date_created' },
      // Add more columns as needed
    ]
  }
},
created() {
  this.subProcess = this.subProcessResponse;
}
}
</script>
<style>
@import 'bootstrap';
@import 'datatables.net-bs5';
</style>
