<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <div class="logo">
      </div>
      <a-menu v-model:selectedKeys="selectedKeys"  :theme="state.theme" :mode="state.mode">
        <a-menu-item key="/">
          <HomeOutlined/>
          <span><router-link to="/">Ocean Platform</router-link></span>
        </a-menu-item>

        <a-sub-menu key="sub1">
          <template #title>
              <span>
                <pie-chart-outlined/>
                <span>Cache</span>
              </span>
          </template>
          <a-menu-item key="/monitor">
            <router-link to="/monitor">Cache Monitor</router-link>
          </a-menu-item>
          <a-menu-item key="/center">
            <router-link to="/center">Cache Center</router-link>
          </a-menu-item>
          <a-menu-item key="/cron">
            <router-link to="/cron">Cache Cron</router-link>
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub2">
          <template #title>
              <span>
                <pie-chart-outlined/>
                <span>StateMachine</span>
              </span>
          </template>
          <a-menu-item key="/sdesign">
            <router-link to="/design">State Design</router-link>
          </a-menu-item>
          <a-menu-item key="/smonitor">
            <router-link to="/smonitor">State Monitor</router-link>
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>

    <a-layout class="container">

      <a-layout-header class="header_box">search</a-layout-header>

      <a-layout-content style="height: 100%; margin: 10px;">
        <div class="content_box">
          <router-view></router-view>
        </div>
      </a-layout-content>
      <a-layout-footer style="text-align: center">

      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script lang="ts" setup>
import {
  PieChartOutlined,
  RiseOutlined,
  CodeOutlined,
  HomeOutlined,
  createFromIconfontCN
} from '@ant-design/icons-vue';
import {RouterLink} from 'vue-router'
import {ref} from 'vue';
import type { MenuMode, MenuTheme } from 'ant-design-vue';
import { ItemType } from 'ant-design-vue';
const collapsed = ref<boolean>(true);
const selectedKeys = ref<string[]>(['1']);
const state = {
  mode: 'inline' as MenuMode,
  theme: 'light' as MenuTheme,
  selectedKeys: ['1'],
  openKeys: ['sub1'],
};

</script>
  