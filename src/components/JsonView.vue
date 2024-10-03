<template>
  <vue-json-viewer :value="value"
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
const {value} = defineProps({
  value: {
    type: Object,
  }
});
</script>