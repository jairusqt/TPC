
<template>
<div class="py-2">
    <h3>TPC - Setup Key Process</h3>
</div>
<h1>{{ testData }}</h1>
<input type="text" class="form-control" v-model="testData">
<DataTable
    :data="keyProcess"
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
    props: ['keyProcessResponse'],
    components: {
        DataTable
    },
    data() {
        return {
        testData: '',
          keyProcess: [],
          columns: [
            { title: 'Section Code', data: 'section_code' },
            { title: 'Process Name', data: 'Pname' },
            { title: 'Status', data: 'key_process_status' },
            { title: 'Stock Point', data: 'stock_point' },
            { title: 'Date Created', data: 'date_created' },
          ]
        }
    },
    methods: {

    },
    created() {
        this.keyProcess = this.keyProcessResponse;
    }
}
</script>
<style>
@import 'bootstrap';
@import 'datatables.net-bs5';
</style>
