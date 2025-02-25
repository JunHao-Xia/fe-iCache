<template>
  <div class="drawAreaDetail">
    <div class="containerDetail" ref="container"> </div>
    <div class="operateAreaDetail">
      <h1>流程详情信息</h1>
      <br>
      <a-input v-model:value="this.rowData.applicationName" placeholder="请输入流程挂载的服务名称" />
      <br>
      <br>
      <a-input v-model:value="this.rowData.chainName" placeholder="请输入流程名称" />
      <br>
      <br>
      <a-textarea v-model:value="this.rowData.chainDesc" placeholder="请输入流程描述" :rows="4" />
      <br>
      <br>
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

export default {
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
      this.settingGraphData()
      //this.loadFLowChainUpdateInfo()
    },
    settingGraphData() {
      if (this.$route.params.record) {
        this.rowData = JSON.parse(this.$route.params.record);
        console.log(this.rowData)
        //渲染加载
        const graphData = JSON.parse(this.rowData.jsonData);
        this.lf.render(graphData);
        this.lf.translateCenter();
      }
    },
    // loadFLowChainUpdateInfo(){
    //   this.beObjectUpdate.id = this.rowData.id;
    //   this.beObjectUpdate.applicationName = this.rowData.applicationName;
    //   this.beObjectUpdate.chainName = this.rowData.chainName;
    //   this.beObjectUpdate.chainDesc = this.rowData.chainDesc;
    // },
  },
  data() {
    return {
      gridData: {},
      lf: null,
      rowData:{},
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
  width: 80%;
  height: 100%;
  border: #333333 solid 1px;
}
.operateAreaDetail {
  width: 20%;
  height: 100%;
  border: #333333 solid 1px;
}
</style>