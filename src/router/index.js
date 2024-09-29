import { createWebHistory, createRouter } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import MonitorView from "../views/MonitorView.vue";

const routes = [
    { path: '/', component: HomeView },
    { path: '/about', component: AboutView },
    { path: '/monitor', component: MonitorView },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;