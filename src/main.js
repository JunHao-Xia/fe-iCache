import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css';
import VueJsonViewer from 'vue-json-viewer'
import STable from '@surely-vue/table';

const app = createApp(App)
app.use(router)
app.use(Antd)
app.use(VueJsonViewer)
app.use(STable);
app.mount('#app')