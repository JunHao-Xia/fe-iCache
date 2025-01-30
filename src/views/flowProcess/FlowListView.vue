<template>
  <div class="flowList">
    <a-table size="large" :columns="columns" :data-source="dataSource" bordered
             :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)">
      <template #headerCell="{ column }">
        <template v-if="column.key === 'title'">
        <span>
          {{ column.id }}
        </span>
        </template>
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'chainName'">
          {{ record.chainName }}
        </template>
        <template v-else-if="column.key === 'enable'">
        <span>
           <a-space direction="vertical">
            <a-switch :checked="record.enable===1" @change="handleEnableChange(record, $event)"/>
            </a-space>
        </span>
        </template>
        <template v-else-if="column.key === 'operators'">
          <a-tag v-for="op in operator"
                 :key="op"
                 :color=" op==='查看流程'?'blue':'green'"
                 @click="clickRow(record,op)">
           <span v-if="op === '查看流程'">
              <SearchOutlined/>
           </span>
            <span v-if="op === '编辑流程'">
              <SettingOutlined/>
           </span>
            {{ op }}
          </a-tag>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script>
//样式
import "@logicflow/core/dist/style/index.css";
import '@logicflow/extension/lib/style/index.css'
import {getFlowChainList, updateFlowChain} from '../../api/flowProcess.js';
import {SmileOutlined, DownOutlined, SettingOutlined, SearchOutlined} from '@ant-design/icons-vue';

export default {
  //注册组件
  components: {
    SmileOutlined, DownOutlined, SettingOutlined, SearchOutlined
  },

  //初始化
  mounted() {
    this.loadData().then(() => {
    });
  },
  //全局参数
  data() {
    return {
      flowChainListRequest: {
        currentPage: 1,
        pageSize: 10
      },
      flowChainListResponse: {},
      columns: [
        {
          title: '流程ID',
          dataIndex: 'id',
          key: 'id',
        },
        {
          title: '流程名称',
          dataIndex: 'chainName',
          key: 'chainName',
        },
        {
          title: '绑定业务',
          dataIndex: 'applicationName',
          key: 'applicationName',
        },
        {
          title: '流程状态',
          key: 'enable',
          dataIndex: 'enable',
        },
        {
          title: '其他操作',
          key: 'operators',
        },
      ],
      dataSource: [],
      operator: ['查看流程', '编辑流程'],
      modalQueryOpen: false,
      selectedQueryRecord: {},
      lf: {},
    };
  },

  //方法列表
  methods: {
    async loadData() {
      try {
        const resp = await getFlowChainList(this.flowChainListRequest);
        this.flowChainListResponse = resp.data;
        console.log('获取流程列表成功')
        this.dataSource = resp.data.records;
      } catch (error) {
        console.error('获取流程列表失败:', error);
      }
    },
    handleEnableChange(record, checked) {
      const param = {
        id: record.id,
        enable: checked ? 1 : 0
      };
      updateFlowChain(param).then(resp => {
        if (resp != null && resp.data !== null) {
          record.enable = resp.data.enable;
        }
      })

    },
    clickRow(record, operatorType) {
      if (operatorType === '查看流程') {
        this.$router.push({
          name: 'flowQueryDetail',
          params: { record: JSON.stringify(record) }
        });
      }
    },
  },
};


</script>

<style scoped>
.flowList {
  width: 100%;
  height: 100%;
  margin-top: 2%;
}

[data-doc-theme='light'] .ant-table-striped :deep(.table-striped) td {
  background-color: #fafafa;
}

[data-doc-theme='dark'] .ant-table-striped :deep(.table-striped) td {
  background-color: rgb(29, 29, 29);
}
</style>