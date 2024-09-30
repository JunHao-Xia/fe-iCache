<template>
  <div>
    <a-select
        ref="select"
        style="width: 170px"
        :options="AppNameSelect"
        @change="selectAppName"
        :placeholder='defaultAppName'
        allow-clear="allow-clear"
    ></a-select>
    <a-select
        ref="select"
        style="width: 170px"
        :options="AppAddressSelect"
        @change="selectAppAddress"
        :placeholder='defaultAppAddress'
        allow-clear="allow-clear"
    ></a-select>
    <a-select
        ref="select"
        style="width: 200px"
        :options="CacheNameSelect"
        @change="selectCacheName"
        :placeholder='defaultCacheName'
        allow-clear="allow-clear"
    ></a-select>
  </div>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {GetAppNameList,GetAddressList,GetCacheNameList} from '../api'
import {onMounted} from 'vue';
import {SelectProps} from "ant-design-vue";
onMounted(() => {
  GetCacheAppNameList()
});


const defaultAppName = ref('AppName')
let AppNameList = ref([]);
let AppNameSelect = ref<SelectProps['options']>([]);
function GetCacheAppNameList(){
  GetAppNameList().then(data => {
    AppNameList.value = data;
    AppNameSelect.value = transformToOptions(data)
    })
}

const selectAppName = (value: string) => {
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

const selectAppAddress = (value: string) => {
  CacheNameList(value)
};


let CacheNameSelect = ref<SelectProps['options']>([]);
let defaultCacheName = ref('CacheName')
function CacheNameList(address){
  GetCacheNameList(address).then(data => {
    CacheNameSelect.value = transformToOptions(data)
  })
}

const selectCacheName = (value: string) => {
  console.log(value);
};



// 转换函数 string list to options
function transformToOptions(list) {
  if (!list || list.length === 0) return []; // 如果labels为空，则返回空数组
  return list.map((label, index) => {
    return {
      value: label,
      label,
    };
  });
}


</script>


<style scoped>
</style>

