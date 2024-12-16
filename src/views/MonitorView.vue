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

  <a-flex wrap="wrap" gap="small">
    <div>
      <a-list size="small" bordered
              :data-source="filteredCacheKeyList"
              style="width: 200px; height:470px;margin-top: 20px;margin-left: 5px;background-color:white"
      >
        <template #renderItem="{item}">
          <a-list-item>
            <a-button 
              :style="{ backgroundColor: selectedCacheKey === item ? '#e6f7ff' : 'transparent' }"
              style="width: 250px;height: 30px" 
              @click="cacheKeyClick({item})">
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
import { ref, onMounted } from "vue";
import { GetAppNameList, GetAddressList, GetCacheNameList, GetCacheKeyList, GetCacheValue } from '../api/mockApi';
import { SelectProps } from "ant-design-vue";
import JsonView from "../components/JsonView.vue";

const defaultAppName = ref('AppName');
const appName = ref("");
const AppNameList = ref([]);
const AppNameSelect = ref<SelectProps['options']>([]);

const selectAddress = ref("");
const AppAddressList = ref([]);
const AppAddressSelect = ref<SelectProps['options']>([]);

const selectName = ref("");
const CacheNameSelect = ref<SelectProps['options']>([]);

const cacheKeyList = ref([]);
const filteredCacheKeyList = ref([]);
const cacheValueRow = ref({});
const selectedCacheKey = ref("");
const searchCacheKey = ref("");

onMounted(() => {
  GetCacheAppNameList();
});

function GetCacheAppNameList() {
  GetAppNameList().then(data => {
    AppNameList.value = data;
    AppNameSelect.value = transformToOptions(data);
    if (AppNameSelect.value.length > 0) {
      selectAppName(AppNameSelect.value[0].value);
    }
  });
}

const selectAppName = (value: string) => {
  appName.value = value;
  GetCacheAppAddressList(value);
};

function GetCacheAppAddressList(appName) {
  GetAddressList(appName).then(data => {
    AppAddressList.value = data;
    AppAddressSelect.value = transformToOptions(data);
    if (AppAddressSelect.value.length > 0) {
      selectAppAddress(AppAddressSelect.value[0].value);
    }
  });
}

const selectAppAddress = (value: string) => {
  if (!value || value.length == 0) {
    return;
  }
  selectAddress.value = value;
  CacheNameList(value);
};

function CacheNameList(address) {
  GetCacheNameList(address).then(data => {
    CacheNameSelect.value = transformToOptions(data);
    if (CacheNameSelect.value.length > 0) {
      selectCacheName(CacheNameSelect.value[0].value);
    }
  });
}

const selectCacheName = (value: string) => {
  if (!value || value.length == 0) {
    return;
  }
  selectName.value = value;
  CacheKeyList(selectAddress.value, selectName.value);
};

function CacheKeyList(address, cacheName) {
  GetCacheKeyList(cacheName, address).then(data => {
    cacheKeyList.value = data;
    filteredCacheKeyList.value = data;
    if (cacheKeyList.value.length > 0) {
      selectedCacheKey.value = cacheKeyList.value[0];
      cacheKeyClick({ item: selectedCacheKey.value });
    }
  });
}

function cacheKeyClick(row) {
  const cacheKeyRow = row.item;
  selectedCacheKey.value = cacheKeyRow;
  CacheValue(selectName.value, cacheKeyRow, selectAddress.value);
}

function CacheValue(cacheName, cacheKey, address) {
  GetCacheValue(cacheName, cacheKey, address).then(data => {
    cacheValueRow.value = data;
  });
}

function searchCache() {
  const searchTerm = searchCacheKey.value.toLowerCase();
  filteredCacheKeyList.value = cacheKeyList.value.filter(key => key.toLowerCase().includes(searchTerm));
  
  if (filteredCacheKeyList.value.length === 0) {
    cacheValueRow.value = {};
  } else if (filteredCacheKeyList.value.length > 0) {
    selectedCacheKey.value = filteredCacheKeyList.value[0];
    CacheValue(selectName.value, selectedCacheKey.value, selectAddress.value);
  }
}

function transformToOptions(list) {
  if (!list || list.length === 0) return [];
  return list.map(label => ({ value: label, label }));
}
</script>

<style scoped>
</style>

