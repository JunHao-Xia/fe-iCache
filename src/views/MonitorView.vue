<template>
  <div>
    <a-input-search
        v-model:value="searchCacheKey"
        placeholder="CacheKey"
        size="middle"
        style="width: 200px;margin-top: 20px;margin-right: 3px;margin-left: 5px"
        @search="searchCache"
        allow-clear="allow-clear"
    />
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

  <a-flex wrap="wrap" gap="small">
    <div>
      <a-list size="small" bordered
              :data-source="cacheKeyList"
              style="width: 200px; height:470px;margin-top: 20px;margin-left: 5px;background-color:white"
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
      <json-view :value="cacheValueRow"
                 style="width: 620px; height:470px;margin-top: 20px;">
      </json-view>
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
let cacheValueRow = ref({})
function CacheValue(cacheName,cacheKey,address) {
  GetCacheValue(cacheName,cacheKey,address).then(data => {
      cacheValueRow.value = ref(data)
  })
}

// search
let searchCacheKey =ref("")
function searchCache(cacheKey: string) {
  //if cacheKey is empty then search all cache key list
  if(cacheKey.length == 0){
    CacheKeyList(selectAddress.value,selectName.value)
  }else {
    //if cacheKey is not empty then only search input cache key
    //filter from all cache key list
  }

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

