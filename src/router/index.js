import { createWebHistory, createRouter } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import MonitorView from "../views/cahceMonitor/MonitorView.vue";
import MonitorCenter from "../views/cahceMonitor/MonitorCenter.vue";
import FlowDesignView from "../views/flowProcess/FlowDesignView.vue";

const routes = [
    { path: '/', component: HomeView },
    { path: '/cache/monitor/view', component: MonitorView },
    { path: '/cache/monitor/center', component: MonitorCenter },
    { path: '/flow/design', component: FlowDesignView },
    { path: '/flow/monitor', component: FlowDesignView },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;