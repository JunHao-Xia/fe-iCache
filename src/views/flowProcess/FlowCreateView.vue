<template>
  <div class="steps">
    <a-steps :current="current" :items="items"></a-steps>
    <div class="steps-content">
      <FlowCreateInfoView v-if="current === 0" ref="flowCreateInfoViewRef" />
      <FlowDesignView v-if="current === 1" />
    </div>
    <div class="steps-action">
      <a-button v-if="current < steps.length - 1" type="primary" @click="next">下一步</a-button>
      <a-button v-if="current === steps.length - 1" type="primary">
        完成
      </a-button>
      <a-button v-if="current > 0" style="margin-left: 8px" @click="prev">上一步</a-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import FlowCreateInfoView from './FlowCreateInfoView.vue';
import FlowDesignView from './FlowDesignView.vue';

const current = ref(0);
const flowCreateInfoViewRef = ref(null); // 添加引用

const next = () => {
    current.value++;
};

const prev = () => {
  current.value--;
};

const steps = [
  {
    title: '流程基本信息设置',
    content: 'First-content',
  },
  {
    title: '流程编排绘制',
    content: 'Second-content',
  },
];

const items = steps.map(item => ({
  key: item.title,
  title: item.title,
}));
</script>

<style scoped>
.steps-content {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  background-color: #fafafa;
  text-align: center;
  width: 100%;
  height: 100%;
}

.steps-action {
  margin-top: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.steps {
  width: 100%;
  height: 80%;
  margin-top: 1%;
}

[data-theme='dark'] .steps-content {
  background-color: #2f2f2f;
  border: 1px dashed #404040;
}
</style>
