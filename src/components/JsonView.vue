<template>
  <vue-json-viewer :value="cacheValue"
                   show-double-quotes
                   boxed
                   sort
                   copyable
  >
  </vue-json-viewer>
</template>

<script setup>
import VueJsonViewer from "vue-json-viewer"
import {ref} from "vue";
let cacheValue = ref({
  "Data": {
    "ProductId": 1,
    "ProductName": "MockProductName_1",
    "ProductPrice": 2000,
    "ProductSku": 1001
  },
  "WriteTime": 1727885796,
  "AccessTime": 1727885796,
  "CacheValueMetrics": {
    "CacheSize": 16,
    "CacheHitCount": 1
  }
})
</script>