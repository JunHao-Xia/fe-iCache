<template>
  <div style="margin-bottom: 15px">
    <a-select
        ref="select"
        style="width: 200px;margin-top: 20px;margin-right: 10px;margin-left: 5px"
        :options="AppNameSelect"
        @change="selectAppName"
        :placeholder='defaultAppName'
        allow-clear="allow-clear"
    ></a-select>
    <a-select
        ref="select"
        style="width: 200px;margin-top: 20px;margin-right: 10px"
        :options="AppAddressSelect"
        @change="selectAppAddress"
        :placeholder='defaultAppAddress'
        allow-clear="allow-clear"
    ></a-select>
    <a-select
        ref="select"
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
import {GetAddressList, GetAppNameList, GetCacheNameList,GetCacheMetrics} from "../api";

const memoryUsageChart = ref(null);
const cacheSizeChart = ref(null);
const cpuUsageChart = ref(null);
const cacheHitRateChart = ref(null);

let charts = [];

onMounted(() => {
  //查询app name、app address、cache name
  GetCacheAppNameList()

  // 内存使用图表
  const memoryChart = echarts.init(memoryUsageChart.value);
  memoryChart.setOption({
    title: { text: '内存使用' },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value} KB'
      }
    },
    series: [{
      data: [350, 370, 250, 300, 320, 280],
      type: 'line',
      smooth: true
    }]
  });

  // 缓存大小分类图表
  const cacheChart = echarts.init(cacheSizeChart.value);
  cacheChart.setOption({
    title: { text: '缓存大小分类' },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center'
    },
    series: [{
      name: '缓存大小',
      type: 'pie',
      radius: ['50%', '70%'],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '20',
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 590, name: 'user_cache' },
        { value: 142, name: 'stock_cache' },
        { value: 340, name: 'rule_cache' },
        { value: 410, name: 'trade-cache' }
      ]
    }]
  });

  // CPU占比图表
  const cpuChart = echarts.init(cpuUsageChart.value);
  cpuChart.setOption({
    title: { text: 'CPU占比' },
    xAxis: {
      type: 'category',
      data: ['0:12', '1:12', '2:12', '3:12', '4:12']
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}k'
      }
    },
    series: [{
      data: [5, 0.5, 7, 0.1, 5],
      type: 'line',
      smooth: true
    }]
  });

  // 缓存命中率图表
  const hitRateChart = echarts.init(cacheHitRateChart.value);
  hitRateChart.setOption({
    title: {
      text: '缓存命中率',
      subtext: '70%',
      x: 'center',
      y: 'center',
      textStyle: {
        fontSize: 20,
        fontWeight: 'normal'
      },
      subtextStyle: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#4e7afa'
      }
    },
    series: [{
      name: '缓存命中率',
      type: 'pie',
      radius: ['65%', '80%'],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: false
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 70, name: '命中', itemStyle: { color: '#4e7afa' } },
        { value: 30, name: '未命中', itemStyle: { color: '#e6e8f0' } }
      ]
    }]
  });

  charts = [memoryChart, cacheChart, cpuChart, hitRateChart];

  // 响应式调整
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  charts.forEach(chart => chart.dispose());
  window.removeEventListener('resize', handleResize);
});

const handleResize = () => {
  charts.forEach(chart => chart.resize());
};



const defaultAppName = ref('AppName')
let AppNameList = ref([]);
let AppNameSelect = ref<SelectProps['options']>([]);
function GetCacheAppNameList(){
  GetAppNameList().then(data => {
    AppNameList.value = data;
    AppNameSelect.value = transformToOptions(data)
  })
}

let appName =ref("")
const selectAppName = (value: string) => {
  appName.value = value
  GetCacheAppAddressList(value)
};

let AppAddressList = ref([]);
let AppAddressSelect = ref<SelectProps['options']>([]);
let defaultAppAddress = ref('Address')
function GetCacheAppAddressList(appName){
  GetAddressList(appName).then(data => {
    AppAddressList.value = data;
    AppAddressSelect.value = transformToOptions(data)
  })
}

let selectAddress =ref("")
const selectAppAddress = (value: string) => {
  if (!value||value.length==0){
    return
  }
  selectAddress.value = value
  CacheNameList(value)
};


let CacheNameSelect = ref<SelectProps['options']>([]);
let defaultCacheName = ref('CacheName')
function CacheNameList(address){
  GetCacheNameList(address).then(data => {
    CacheNameSelect.value = transformToOptions(data)
  })
}
let selectName =ref("")
const selectCacheName = (value: string) => {
  if (!value||value.length==0){
    return
  }
  selectName.value = value
  GetMetrics(selectAddress.value,selectName.value)
};
let CacheMetrics = ref()
function GetMetrics(address,cacheName) {
  GetCacheMetrics(address,cacheName).then(data => {
    CacheMetrics.value = data
    console.log(CacheMetrics)
  })
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

