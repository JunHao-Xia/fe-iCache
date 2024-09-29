<template>
  <a-layout style="min-height: 100vh">

    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <div  class="logo">
      </div>
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <a-menu-item key="1">
          <HomeOutlined/>
          <span>Ocean Platform</span>
        </a-menu-item>
        <a-sub-menu key="sub1">
          <template #title>
            <span>
              <pie-chart-outlined />
              <span>Cache</span>
            </span>
          </template>
          <a-menu-item key="2">Cache Monitor</a-menu-item>
          <a-menu-item key="3">Cache Center</a-menu-item>
          <a-menu-item key="4">Cache Cron</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub2">
          <template #title>
            <span>
              <pie-chart-outlined />
              <span>StateMachine</span>
            </span>
          </template>
          <a-menu-item key="5">State Design</a-menu-item>
          <a-menu-item key="6">State Monitor</a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>

    <a-layout>
      <a-layout-content style="margin: 0 16px">
        <demo></demo>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        Ocean Platform Created By Zhangz1w3nCode.
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
import { ref } from 'vue';
import Demo from "../components/demo.vue";

const MyIcon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js', // 在 iconfont.cn 上生成
});


const collapsed = ref<boolean>(true);
const selectedKeys = ref<string[]>(['1']);


</script>
<style scoped>
#components-layout-demo-side .logo {
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.3);
}

.site-layout .site-layout-background {
  background: #fff;
}
[data-theme='dark'] .site-layout .site-layout-background {
  background: #141414;
}
</style>
