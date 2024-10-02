<template>
  <div>
    <a-select
        ref="select"
        style="width: 200px;margin-right: 10px;margin-left: 10px"
        :options="AppNameSelect"
        @change="selectAppName"
        :placeholder='defaultAppName'
        allow-clear="allow-clear"
    ></a-select>
    <a-select
        ref="select"
        style="width: 200px;margin-right: 10px"
        :options="AppAddressSelect"
        @change="selectAppAddress"
        :placeholder='defaultAppAddress'
        allow-clear="allow-clear"
    ></a-select>
    <a-select
        ref="select"
        style="width: 200px;margin-right: 10px"
        :options="CacheNameSelect"
        @change="selectCacheName"
        :placeholder='defaultCacheName'
        allow-clear="allow-clear"
    ></a-select>
  </div>
  <div>
    <a-input-search
        v-model:value="searchCacheKey"
        placeholder="Search"
        size="middle"
        style="width: 200px;margin-top: 20px;margin-right: 10px;margin-left: 10px"
        @search="searchCache"
        allow-clear="allow-clear"
    />
  </div>

  <a-flex wrap="wrap" gap="small">
    <div>
      <a-list size="small" bordered
              :data-source="cacheKeyList"
              style="width: 200px; height:470px;margin-top: 20px;margin-right: 5px;margin-left: 10px"
      >
        <template #renderItem="{item}">
          <a-list-item>
            <a-button style="width: 250px;height: 30px" @click="cacheKeyClick({item})" >
              {{item}}
            </a-button>
          </a-list-item>
        </template>
      </a-list>
    </div>
    <div>
      <json-view style="width: 410px; height:470px;margin-top: 20px;"></json-view>
<!--      <a-textarea-->
<!--          placeholder="empty cache"-->
<!--          :rows="4"-->
<!--          style="width: 410px; height:470px;margin-top: 20px;"-->
<!--      >-->
<!--      </a-textarea>-->

    </div>
    </a-flex>
</template>


<script lang="ts" setup>
import {ref} from "vue";
import {GetAppNameList,GetAddressList,GetCacheNameList,GetCacheKeyList,GetCacheValue} from '../api'
import {onMounted} from 'vue';
import {SelectProps} from "ant-design-vue";
import JsonView from "../components/JsonView.vue";

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
  CacheKeyList(selectAddress.value,selectName.value)
};


// search
let searchCacheKey =ref("")
function searchCache(value: string) {
  console.log(value)
}

// cacheKeyList
let cacheKeyList =ref([])
function CacheKeyList(address,cacheName) {
  GetCacheKeyList(cacheName,address).then(data => {
    cacheKeyList.value = data;
  })
}
// cache key item
let cacheKeyRow =ref("")
function cacheKeyClick(row){
   cacheKeyRow = row.item
  CacheValue(selectName.value,cacheKeyRow,selectAddress.value)
}

//cache value
let cacheValueRow =ref({})
function CacheValue(cacheName,cacheKey,address) {
  GetCacheValue(cacheName,cacheKey,address).then(data => {
    cacheValueRow.value = data;
  })
}


//string list to options param
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

