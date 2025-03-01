<template>
  <div class="drawAreaDetail">
    <div class="containerDetail" ref="container"> </div>
    <div class="operateAreaDetail">
      <h1>流程详情信息</h1>
      <br>
      <a-input disabled v-model:value="this.rowData.applicationName" placeholder="请输入流程挂载的服务名称" />
      <br>
      <br>
      <a-input disabled v-model:value="this.rowData.chainName" placeholder="请输入流程名称" />
      <br>
      <br>
      <a-textarea disabled v-model:value="this.rowData.chainDesc" placeholder="请输入流程描述" :rows="4" />
      <br>
      <br>
      <br>
      <br>
      <h1>当前节点信息</h1>
      <br>
      <a-form
          :model="this.currentNodeInfo"
          name="basic"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 17 }"
          autocomplete="off"
      >
        <a-form-item
            label="节点名称:"
            name="NodeName"
        >
          <a-input disabled v-model:value="this.currentNodeInfo.name"/>
        </a-form-item>

        <a-form-item
            label="节点类名:"
            name="NodeClassName"
        >
          <a-input disabled v-model:value="this.currentNodeInfo.className"/>
        </a-form-item>
        <a-form-item label="节点类型:" name="NodeType">
          <a-input disabled v-model:value="this.currentNodeInfo.type"/>
        </a-form-item>

        <a-form-item
            label="节点参数:"
            name="NodeParam"
        >
          <a-form
              ref="formRef"
              name="dynamic_form_nest_item"
              :model="this.currentNodeInfo"
          >
            <a-space
                v-for="(param, index) in this.currentNodeInfo.dynamicParams"
                style="display: flex; margin-bottom: 5px"
                align="baseline"
            >
              <a-form-item
                  :name="['dynamicParams', index, 'paramName']"
                  :rules="{required: false,message: 'Missing param name',}"
              >
                <a-input disabled v-model:value="param.paramName" placeholder="Param Name"/>
              </a-form-item>
              :
              <a-form-item
                  :name="['dynamicParams', index, 'paramValue']"
                  :rules="{required: false,message: 'Missing param value',}"
              >
                <a-input disabled v-model:value="param.paramValue" placeholder="Param Value"/>
              </a-form-item>
            </a-space>
          </a-form>

        </a-form-item>
      </a-form>

    </div>
  </div>
</template>
<script>
//样式
import "@logicflow/core/dist/style/index.css";
import '@logicflow/extension/lib/style/index.css'
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
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons-vue";

export default {
  components: {PlusOutlined, MinusCircleOutlined},
  //初次加载时候 挂载
  mounted() {
    this.init();
  },

  methods: {
    init() {
      //初始化
      this.lf = new LogicFlow({
        //插件注册
        plugins: [Highlight,DndPanel,Menu,Control,MiniMap,SelectionSelect,InsertNodeInPolyline,Snapshot],
        container: this.$refs.container,
        //是否显示网格
        grid: true,
        stopMoveGraph: true,
        //开启快捷键
        keyboard: {
          enabled: true,
        },
        //边类型 'line' | 'polyline' | 'bezier'
        edgeType: 'line',
        //对齐线 只有网格属性打开才能显示对齐线
        snapline: true,
      });
      //自定义对齐线样式
      this.lf.setTheme({
        snapline: {
          stroke: '#1E90FF', // 对齐线颜色
          strokeWidth: 1, // 对齐线宽度
        },
      })
      this.lf.extension.selectionSelect.openSelectionSelect();
      this.lf.extension.selectionSelect.setSelectionSense(false, false);
      this.lf.render();
      this.settingGraphData()
      //节点被单击
      this.lf.on("node:click", (data) => {
        this.currentNodeInfo =this.getNodeInfoByNodeId(data.data.id)
      });
    },
    settingGraphData() {
      if (this.$route.params.record) {
        this.rowData = JSON.parse(this.$route.params.record);
        //渲染加载
        if (this.rowData.jsonData!==null&&this.rowData.jsonData!==''){
          console.log(this.rowData.json)
          const graphData = JSON.parse(this.rowData.jsonData);
          this.lf.render(graphData);
          this.lf.translateCenter();
        }
        if(this.rowData.allNodeInfo!==null&&this.rowData.allNodeInfo!==''){
          this.allNodeInfo = JSON.parse(this.rowData.allNodeInfo);
        }
      }
    },
    getNodeInfoByNodeId(nodeIdOrigin){
      const nodeId = this.getTinyNodeId(nodeIdOrigin)
      return this.allNodeInfo[nodeId]
    },
    getTinyNodeId(nodeId){
      const parts = nodeId.split('-'); // 按-分割成数组
      return parts.slice(0, 2).join(''); // 取前两个部分并用-连接
    },
  },
  data() {
    return {
      gridData: {},
      lf: null,
      rowData:{},
      allNodeInfo:{},
      currentNodeInfo: {},
    };
  },
};

</script>
<style scoped>
.drawAreaDetail {
  width: 100%;
  height: 95%;
  margin-top: 2%;
  border: #333333 solid 1px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.containerDetail {
  width: 65%;
  height: 100%;
  border: #333333 solid 1px;
}
.operateAreaDetail {
  width: 35%;
  height: 100%;
  border: #333333 solid 1px;
}
</style>