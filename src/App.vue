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
        <a-sub-menu key="sub1">
          <template #title>
              <span>
                <PieChartOutlined/>
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
                <CodeOutlined/>
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
<!--      <a-layout-footer style="text-align: center">-->
<!--        Power By Potential Space-->
<!--      </a-layout-footer>-->
    </a-layout>
  </a-layout>
</template>


<script lang="ts" setup>
import {
  PieChartOutlined,
  CodeOutlined,
  HomeOutlined,
} from '@ant-design/icons-vue';

import {RouterLink} from 'vue-router'
import {ref} from 'vue';
const collapsed = ref<boolean>(true);
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
