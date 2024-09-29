<template>
  <div>
    <h1 style="font-size: xx-large">Dashboard</h1>
  </div>
  <demo></demo>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import demo from '../components/demo.vue'
import Demo from "../components/demo.vue";
const collapsed = ref<boolean>(true);
const selectedKeys = ref<string[]>(['1']);
</script>
<style scoped>
</style>
