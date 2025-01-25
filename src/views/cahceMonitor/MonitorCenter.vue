<template>
  <div style="margin-bottom: 15px">
    <a-select
        v-model:value="appName"
        style="width: 200px;margin-top: 20px;margin-right: 10px;margin-left: 5px"
        :options="AppNameSelect"
        @change="selectAppName"
        :placeholder='defaultAppName'
        allow-clear="allow-clear"
    ></a-select>
    <a-select
        v-model:value="selectAddress"
        style="width: 200px;margin-top: 20px;margin-right: 10px"
        :options="AppAddressSelect"
        @change="selectAppAddress"
        :placeholder='defaultAppAddress'
        allow-clear="allow-clear"
    ></a-select>
    <a-select
        v-model:value="selectName"
        style="width: 200px;margin-top: 20px;margin-right: 10px"
        :options="CacheNameSelect"
        @change="selectCacheName"
        :placeholder='defaultCacheName'
        allow-clear="allow-clear"
    ></a-select>
  </div>
  <div class="content_box">
    <div class="dashboard">
      <div class="chart-container">
        <div ref="memoryUsageChart" class="chart"></div>
      </div>
      <div class="chart-container">
        <div ref="cacheSizeChart" class="chart"></div>
      </div>
      <div class="chart-container">
        <div ref="cpuUsageChart" class="chart"></div>
      </div>
      <div class="chart-container">
        <h2>缓存命中率</h2>
        <div ref="cacheHitRateChart" class="chart"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import {SelectProps} from "ant-design-vue";
import {GetAddressList, GetAppNameList, GetCacheNameList, GetMetricsByCombination} from "../../api/mockApi";

const memoryUsageChart = ref(null);
const cacheSizeChart = ref(null);
const cpuUsageChart = ref(null);
const cacheHitRateChart = ref(null);

let charts = [];

onMounted(() => {
  GetCacheAppNameList();
  setupCharts();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  charts.forEach(chart => chart.dispose());
  window.removeEventListener('resize', handleResize);
});

const handleResize = () => {
  charts.forEach(chart => chart.resize());
};

function setupCharts() {
  const memoryChart = echarts.init(memoryUsageChart.value);
  const cacheChart = echarts.init(cacheSizeChart.value);
  const cpuChart = echarts.init(cpuUsageChart.value);
  const hitRateChart = echarts.init(cacheHitRateChart.value);

  memoryChart.setOption({
    title: { text: '内存使用' },
    xAxis: { type: 'category', data: ['1月', '2月', '3月'] },
    yAxis: { type: 'value', axisLabel: { formatter: '{value} KB' } },
    series: [{ data: [], type: 'line', smooth: true }]
  });

  cacheChart.setOption({
    title: { text: '缓存大小分类' },
    series: [{ name: '缓存大小', type: 'pie', radius: ['50%', '70%'], data: [] }]
  });

  cpuChart.setOption({
    title: { text: 'CPU占比' },
    xAxis: { type: 'category', data: ['0:12', '1:12', '2:12'] },
    yAxis: { type: 'value', axisLabel: { formatter: '{value}k' } },
    series: [{ data: [], type: 'line', smooth: true }]
  });

  hitRateChart.setOption({
    title: { text: '缓存命中率', subtext: '', x: 'center', y: 'center' },
    series: [{ name: '缓存命中率', type: 'pie', radius: ['65%', '80%'], data: [] }]
  });

  charts = [memoryChart, cacheChart, cpuChart, hitRateChart];
}

const defaultAppName = ref('AppName');
let AppNameList = ref([]);
let AppNameSelect = ref<SelectProps['options']>([]);
function GetCacheAppNameList() {
  GetAppNameList().then(data => {
    AppNameList.value = data;
    AppNameSelect.value = transformToOptions(data);
    if (AppNameSelect.value.length > 0) {
      selectAppName(AppNameSelect.value[0].value);
    }
  });
}

let appName = ref("");
const selectAppName = (value: string) => {
  appName.value = value;
  GetCacheAppAddressList(value);
};

let AppAddressList = ref([]);
let AppAddressSelect = ref<SelectProps['options']>([]);
let defaultAppAddress = ref('Address');
function GetCacheAppAddressList(appName) {
  GetAddressList(appName).then(data => {
    AppAddressList.value = data;
    AppAddressSelect.value = transformToOptions(data);
    if (AppAddressSelect.value.length > 0) {
      selectAppAddress(AppAddressSelect.value[0].value);
    }
  });
}

let selectAddress = ref("");
const selectAppAddress = (value: string) => {
  if (!value || value.length == 0) {
    return;
  }
  selectAddress.value = value;
  CacheNameList(value);
};

let CacheNameSelect = ref<SelectProps['options']>([]);
let defaultCacheName = ref('CacheName');
function CacheNameList(address) {
  GetCacheNameList(address).then(data => {
    CacheNameSelect.value = transformToOptions(data);
    if (CacheNameSelect.value.length > 0) {
      selectCacheName(CacheNameSelect.value[0].value);
    }
  });
}

let selectName = ref("");
const selectCacheName = (value: string) => {
  if (!value || value.length == 0) {
    return;
  }
  selectName.value = value;
  fetchMetrics(appName.value, selectAddress.value, selectName.value);
};

function fetchMetrics(appName, address, cacheName) {
  GetMetricsByCombination(appName, address, cacheName).then(data => {
    updateCharts(data);
  });
}

function updateCharts(data) {
  charts[0].setOption({ series: [{ data: data.memoryUsage }] });
  charts[1].setOption({ series: [{ data: data.cacheSizeDistribution }] });
  charts[2].setOption({ series: [{ data: data.cpuUsage }] });
  charts[3].setOption({
    title: { subtext: `${data.cacheHitRate}%` },
    series: [{
      data: [
        { value: data.cacheHitRate, name: '命中', itemStyle: { color: '#4e7afa' } },
        { value: 100 - data.cacheHitRate, name: '未命中', itemStyle: { color: '#e6e8f0' } }
      ]
    }]
  });
}

function transformToOptions(list) {
  if (!list || list.length === 0) return [];
  return list.map(label => ({ value: label, label }));
}
</script>

<style scoped>
.monitor-center {
  width: 100%;
  min-height: 100vh;
  background: aliceblue;
  padding: 10px;
  box-sizing: border-box;
  overflow-y: auto;
}

.dashboard {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  width: 100%;
  height: 50%;
  margin-left: 5px;
}

.chart-container {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: 18px;
  margin-bottom: 10px;
  color: #333;
}

.chart {
  width: 100%;
  height: 250px;
}

@media (max-width: 768px) {
  .dashboard {
    grid-template-columns: 1fr;
  }
}
</style>

