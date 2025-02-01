import { createWebHistory, createRouter } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import MonitorView from "../views/cahceMonitor/MonitorView.vue";
import MonitorCenter from "../views/cahceMonitor/MonitorCenter.vue";
import FlowListView from "../views/flowProcess/FlowListView.vue";
import FlowCreateView from "../views/flowProcess/FlowCreateView.vue";
import FlowQueryDetailView from "../views/flowProcess/FlowQueryDetail.vue";

const routes = [
    { path: '/', component: HomeView },
    { path: '/cache/monitor/view', component: MonitorView },
    { path: '/cache/monitor/center', component: MonitorCenter },
    { path: '/flow/list', component: FlowListView},
    { path: '/flow/create', component: FlowCreateView},
    {
        path: '/flow/query/detail/:record',
        name: 'flowQueryDetail',
        component: FlowQueryDetailView
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;