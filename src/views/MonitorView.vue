<template>
  <div>monitor</div>
</template>


<script lang="ts" setup>
import {ref} from "vue";
import {GetCacheUserAppNameList,GetCacheUserAddressList} from '../api'
import {onMounted} from 'vue';

onMounted(() => {
  GetCacheAppNameList()
});
const CacheAppNameList = ref(null);
function GetCacheAppNameList(){
  GetCacheUserAppNameList().then(data => {
    CacheAppNameList.value = data;
  })
}

const CacheAddressList = ref(null);
function GetCacheAddressList(){
  GetCacheUserAddressList().then(data => {
    CacheAddressList.value = data;
  })
}


</script>


<style scoped>
</style>

