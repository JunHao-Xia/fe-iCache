<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <div class="logo">
      </div>
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <a-menu-item key="/">
         <HomeOutlined/>
          <span><router-link to="/">Ocean</router-link></span>
        </a-menu-item>
        <a-sub-menu key="cache">
          <template #title>
              <span>
                <PieChartOutlined/>
                <span>Cache</span>
              </span>
          </template>
          <a-menu-item key="/cache/monitor/view">
            <router-link to="/cache/monitor/view">Cache Monitor</router-link>
          </a-menu-item>
          <a-menu-item key="/cache/monitor/center">
            <router-link to="/cache/monitor/center">Cache Center</router-link>
          </a-menu-item>
          <a-menu-item key="/cache/monitor/cron">
            <router-link to="/cache/monitor/cron">Cache Cron</router-link>
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="flowProcess">
          <template #title>
              <span>
                <ShareAltOutlined/>
                <span>FlowProcess</span>
              </span>
          </template>
          <a-menu-item key="/flow/list">
            <router-link to="/flow/list">
              <ShareAltOutlined/>
              Flow List
            </router-link>
          </a-menu-item>
          <a-menu-item key="/flow/design">
            <router-link to="/flow/design">
              <EditOutlined/>
              Flow Design
            </router-link>
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="stateMachine">
          <template #title>
              <span>
                <CodeOutlined/>
                <span>StateMachine</span>
              </span>
          </template>
          <a-menu-item key="/stateMachine/view">
            <router-link to="/stateMachine/view">State Design</router-link>
          </a-menu-item>
          <a-menu-item key="/stateMachine/monitor">
            <router-link to="/stateMachine/monitor">State Monitor</router-link>
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>

    <a-layout class="container">

      <a-layout-header class="header_box">
        <a-input-search
            v-model:value="value"
            placeholder="Search"
            size="middle"
            style="width: 200px"
            @search="onSearch"
            allow-clear="allow-clear"
        />
      </a-layout-header>

      <a-layout-content style="height: 100%; margin: 10px;">
        <div class="content_box">
          <router-view></router-view>
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>


<script lang="ts" setup>
import {
  PieChartOutlined,
  CodeOutlined,
  HomeOutlined,
ShareAltOutlined,
  EditOutlined
} from '@ant-design/icons-vue';

import {RouterLink} from 'vue-router'
import {ref} from 'vue';
const collapsed = ref<boolean>(false);
const selectedKeys = ref<string[]>(['1']);
const value = ref<string>('');
const onSearch = (searchValue: string) => {

}

</script>
<style scoped>
.container {
  background: aliceblue;
  height: 100vh;
}
.content_box {
  height: 100%;
  overflow: hidden;
  background: aliceblue;
  margin: 5px 5px;
}
.header_box {
  background: aliceblue;
  line-height: 0;
  padding: 10px;
  box-sizing: border-box;
  margin-left: 10px;
  margin-bottom: -40px;
}
</style>
