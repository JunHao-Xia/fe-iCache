<template>
<div>·1111111</div>
<demo/>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import demo from '../components/demo.vue'
const collapsed = ref<boolean>(true);
const selectedKeys = ref<string[]>(['1']);
</script>
<style scoped>
</style>
