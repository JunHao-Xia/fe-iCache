<template>
  <div class="flowList">
    <a-table size="large" :columns="columns" :data-source="dataSource" bordered :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)">
      <template #headerCell="{ column }">
        <template v-if="column.key === 'title'">
        <span>
          {{column.flowChainID}}
        </span>
        </template>
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.flowChainName === 'flowChainName'">
          <a>
            {{ record.flowChainName }}
          </a>
        </template>
        <template v-else-if="column.key === 'tags'">
        <span>
          <a-tag
              v-for="tag in record.tags"
              :key="tag"
              :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'"
          >
            {{ tag.toUpperCase() }}
          </a-tag>
        </span>
        </template>
        <template v-else-if="column.key === 'action'">
        <span>
          <a>查看</a>
          <a-divider type="vertical" />
          <a>编辑</a>
        </span>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script>
import {getFlowChainList} from '../../api/flowProcess.js';
import {SmileOutlined, DownOutlined} from '@ant-design/icons-vue';

export default {
  //注册组件
  components: {
    SmileOutlined, DownOutlined
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
      columns:[
        {
          title: '流程ID',
          dataIndex: 'flowChainID',
          key: 'flowChainID',
        },
        {
          title: '流程名称',
          dataIndex: 'flowChainName',
          flowChainName: 'flowChainName',
        },
        {
          title: '业务名称',
          dataIndex: 'bindingBiz',
          key: 'bindingBiz',
        },
        {
          title: '标签',
          key: 'tags',
          dataIndex: 'tags',
        },
        {
          title: '操作',
          key: 'action',
        },
      ],
      dataSource: [{
        flowChainID: '1',
        flowChainName: '流程名称1',
        bindingBiz: 'stock-lock',
        tags: ['nice', 'developer'],
      },
        {
          flowChainID: '2',
          flowChainName: '流程名称2',
          bindingBiz: 'stock-query',
          tags: ['loser'],
        },
        {
          flowChainID: '3',
          flowChainName: '流程名称3',
          bindingBiz: 'stock-sync',
          tags: ['cool', 'teacher'],
        },],
    };
  },

  //方法列表
  methods: {
    async loadData() {
      try {
        const resp = await getFlowChainList(this.flowChainListRequest);
        this.flowChainListResponse = resp.data;
        console.log('获取流程列表成功')
      } catch (error) {
        console.error('获取流程列表失败:', error);
      }
    },
  },
};


</script>

<style scoped>
.flowList {
  width: 100%;
  height: 90%;
  margin-top: 2%;
}

[data-doc-theme='light'] .ant-table-striped :deep(.table-striped) td {
  background-color: #fafafa;
}
[data-doc-theme='dark'] .ant-table-striped :deep(.table-striped) td {
  background-color: rgb(29, 29, 29);
}
</style>