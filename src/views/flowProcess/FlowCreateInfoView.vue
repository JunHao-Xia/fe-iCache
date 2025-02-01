<template>
  <div>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
  </div>
  <a-form
      :model="formState"
      v-bind="layout"
      name="nest-messages"
      :validate-messages="validateMessages"
      @finish="onFinish">
    <a-form-item :name="['flowCreateInfo', 'chainName']" label="流程名称" :rules="[{ required: true }]">
      <a-input v-model:value="formState.flowCreateInfo.chainName" />
    </a-form-item>
    <a-form-item :name="['flowCreateInfo', 'bindingServiceName']" label="绑定服务名称">
      <a-input v-model:value="formState.flowCreateInfo.bindingServiceName" />
    </a-form-item>
    <a-form-item :name="['flowCreateInfo', 'distribution']" label="流程描述">
      <a-textarea v-model:value="formState.flowCreateInfo.distribution" />
    </a-form-item>
<!--    <a-form-item :wrapper-col="{ ...layout.wrapperCol, offset: 8 }">-->
<!--      <a-button type="primary" html-type="submit">Submit</a-button>-->
<!--    </a-form-item>-->
  </a-form>
</template>
<script setup>
import {computed, reactive} from 'vue';
const layout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 10,
  },
};
const validateMessages = {
  required: '请填写${label}',
};
const formState = reactive({
  flowCreateInfo: {
    chainName: '',
    bindingServiceName: '',
    distribution: '',
  },
});
const onFinish = values => {
  console.log('Success:', values);
};

const validate = () => {
  if (!formState.flowCreateInfo.chainName.value) {
    errors.processName = '流程名称不能为空';
  }
  if (!formState.flowCreateInfo.bindingServiceName.value) {
    errors.startDate = '绑定服务名称';
  }
  return errors;
};

const errors = computed(() => validate());

const isValid = computed(() => Object.keys(errors.value).length === 0);

defineExpose({
  isValid,
  errors,
});

</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

label {
  font-weight: bold;
}

input, textarea {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
