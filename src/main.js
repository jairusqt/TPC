import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net';
import 'datatables.net-select';
import 'datatables.net-responsive';
import 'bootstrap/dist/css/bootstrap.css';

const app = createApp(App)

import * as bootstrap from 'bootstrap';
app.use(router)
app.use(DataTable)
DataTable.use(DataTablesCore)
app.mount('#app')
