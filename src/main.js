import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net';
import 'datatables.net-select';
import 'datatables.net-responsive';
import 'bootstrap/dist/css/bootstrap.css';
import VueQrcode from '@chenfengyuan/vue-qrcode';
const app = createApp(App)

app.use(router)
app.use(DataTable)
app.component(VueQrcode.name, VueQrcode)
DataTable.use(DataTablesCore)
app.mount('#app')
