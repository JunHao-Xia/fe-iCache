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
  <div>
    <a-modal
        v-model:open="modalQueryOpen"
        title="Basic Modal"
        width="100%"
        @ok="modalHandleOk"
        wrap-class-name="full-modal"
    >
      <div class="container" ref="container"> </div>
    </a-modal>
  </div>
</template>

<script>
//样式
import "@logicflow/core/dist/style/index.css";
import '@logicflow/extension/lib/style/index.css'
import {getFlowChainList, updateFlowChain} from '../../api/flowProcess.js';
import {SmileOutlined, DownOutlined, SettingOutlined, SearchOutlined} from '@ant-design/icons-vue';
import LogicFlow from "@logicflow/core";
import {
  Control,
  DndPanel,
  Highlight,
  InsertNodeInPolyline,
  Menu,
  MiniMap,
  SelectionSelect,
  Snapshot
} from "@logicflow/extension";

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
        if(resp!=null&&resp.data!==null){
          record.enable =resp.data.enable;
        }
      })

    },
    clickRow(record, operatorType) {
      if(operatorType==='查看流程'){
        this.modalQueryOpen = true;
        this.selectedQueryRecord = record;
        const graphData = JSON.parse(record.jsonData);
        //回显数据
        this.setLogicFlowData(graphData);
      }
    },
    modalHandleOk() {
      this.modalQueryOpen = false;
    },
    setLogicFlowData(graphData) {
      if (this.lf) {
        this.initLogicFlow()
        this.lf.render(graphData);
      }
    },
    initLogicFlow() {
      //初始化
      this.lf = new LogicFlow({
        plugins: [Highlight,DndPanel,Menu,Control,MiniMap,SelectionSelect,InsertNodeInPolyline,Snapshot],
        container: this.$refs.container,
        grid: true,
        stopMoveGraph: true,
        keyboard: {
          enabled: true,
        },
        edgeType: 'line',
        snapline: true,
      });
      this.lf.render()
      this.lf.setTheme({
        snapline: {
          stroke: '#1E90FF', // 对齐线颜色
          strokeWidth: 1, // 对齐线宽度
        },
      })
      this.lf.extension.selectionSelect.openSelectionSelect();
      this.lf.extension.selectionSelect.setSelectionSense(true, true);
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

.full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
    height: 100vh; /* 设置模态框高度为视口高度 */
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: 100%; /* 设置内容高度为100% */
  }
  .ant-modal-body {
    flex: 1; /* 使主体内容占据剩余空间 */
    padding: 0; /* 可选：去除默认内边距 */
  }
}

.container {
  width: 100%;
  height: 100%;
  border: #333333 solid 1px;
}
</style>