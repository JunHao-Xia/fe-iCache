<template>
  <vue-json-viewer :value="cacheValue"
                   show-double-quotes
                   boxed
                   sort
                   copyable
                   :expand-depth="4"
  >
  </vue-json-viewer>
</template>

<script setup>
import VueJsonViewer from "vue-json-viewer"
import {ref} from "vue";
// 定义 props
const {value} = defineProps({
  value: {
    type: Object,
    default: () => ({})
  }
});
let cacheValue = ref(value)
</script>