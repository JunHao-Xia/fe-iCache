<template>
  <div class="drawAreaUpdate">
    <div class="containerUpdate" ref="container"> </div>
    <div class="operateAreaUpdate">
      <h1>流程详情信息</h1>
      <br>
      <a-input v-model:value="this.beObjectUpdate.applicationName" placeholder="请输入流程挂载的服务名称" />
      <br>
      <br>
      <a-input v-model:value="this.beObjectUpdate.chainName" placeholder="请输入流程名称" />
      <br>
      <br>
      <a-textarea v-model:value="this.beObjectUpdate.chainDesc" placeholder="请输入流程描述" :rows="4" />
      <br>
      <br>
      <a-button type="primary" @click="updateFlow" ghost>修改流程</a-button>
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
import {getProcessNodeList, updateFlowChain} from "../../../api/flowProcess.js";

export default {

  //初次加载时候 挂载
  mounted() {
    this.loadData().then(() => {
      this.init();
    });
  },

  methods: {
    //加载业务节点
    async loadData() {
      try {
        const resp = await getProcessNodeList();
        this.businessNodeList = resp.data;
        console.log('获取流程节点列表成功')
      } catch (error) {
        console.error('Error fetching node list:', error);
      }
    },

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
      this.lf.extension.dndPanel.setPatternItems(this.businessNodeList);
      this.settingGraphData()
      this.loadFLowChainUpdateInfo()
    },
    //渲染图数据
    settingGraphData() {
      if (this.$route.params.record) {
        this.rowData = JSON.parse(this.$route.params.record);
        //渲染加载
        const graphData = JSON.parse(this.rowData.jsonData);
        this.lf.render(graphData);
        this.lf.translateCenter();
        console.log('渲染流程图成功')
        console.log(this.rowData)
      }
    },
    loadFLowChainUpdateInfo(){
      this.beObjectUpdate.id = this.rowData.id;
      this.beObjectUpdate.applicationName = this.rowData.applicationName;
      this.beObjectUpdate.chainName = this.rowData.chainName;
      this.beObjectUpdate.chainDesc = this.rowData.chainDesc;
      this.beObjectUpdate.enable = this.rowData.enable;
    },
    //修改流程方法
    updateFlow() {
      this.gridData = this.lf.getGraphData();
      try {
        //将前端的流程图的边和结点json对象转为后端的语法树对象
        this.transformFeToBe(this.gridData)
        console.log("transToBeObjectUpdate")
        console.log(this.beObjectUpdate)

        //构建updateFlowChain方法需要的参数
        this.beObjectUpdate.jsonData = JSON.stringify(this.gridData);
        console.log(this.beObjectUpdate)

        //清空画布
        this.lf.clearData()

        //调用修改流程方法
        updateFlowChain(this.beObjectUpdate).then(resp => {
          if(resp!=null&&resp.data!==null){
            console.log('修改流程成功')
            console.log(resp.data)
            const graphData = JSON.parse(resp.data.jsonData);
            console.log(graphData)
            //回显数据
            this.lf.render(graphData);
            this.lf.translateCenter();
            this.beObjectUpdate.id = resp.data.id;
            this.beObjectUpdate.applicationName = resp.data.applicationName;
            this.beObjectUpdate.chainName = resp.data.chainName;
            this.beObjectUpdate.chainDesc = resp.data.chainDesc;
          }
        })
        //清空对象
        this.beObjectUpdate={
          nodeEntities: [],
          nodeEdges: [],
          jsonData:''
        };
      } catch (error) {
        console.error("请求失败，请检查网络或服务器状态", error);
      }
    },
    //对象转换方法
    transformFeToBe(feObject) {
      // 转换nodes到nodeEntities
      if (feObject.nodes) {
        feObject.nodes.forEach(node => {
          this.beObjectUpdate.nodeEntities.push({
            id: node.id,
            name: node.properties.name,
            label: node.text.value,
            nodeType: node.properties.type,
            x: node.x,
            y: node.y
          });
        });
      }

      // 转换edges到nodeEdges
      if (feObject.edges) {
        feObject.edges.forEach(edge => {
          let ifNodeFlag = false;
          let tag = '';
          if(edge.text !==undefined && edge.text !== null&& edge.text.value!==""){
            if(edge.text.value!=="true" && edge.text.value!=="false"){
              //switch 语句 设置 tag 才能判断
              tag = edge.text.value;
            }else {
              //if 节点 需要设置 ifNodeFlag判断符号
              ifNodeFlag = edge.text.value === "true";
            }
          }
          this.beObjectUpdate.nodeEdges.push({
            source: edge.sourceNodeId,
            target: edge.targetNodeId,
            ifNodeFlag: ifNodeFlag, // 假设没有特殊需求
            tag: tag // 可以根据需要设置
          });
        });
      }
    }
  },
  data() {
    return {
      gridData: {},
      businessNodeList: [],
      lf: null,
      rowData:{},
      beObjectUpdate : {
        nodeEntities: [],
        nodeEdges: [],
        jsonData:'',
        id: 0,
        chainName: '',
        applicationName: '',
        chainDesc: '',
        elData: '',
        enable: 0
      },
    }
}}
</script>
<style scoped>
.drawAreaUpdate {
  width: 100%;
  height: 95%;
  margin-top: 2%;
  border: #333333 solid 1px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.containerUpdate {
  width: 80%;
  height: 100%;
  border: #333333 solid 1px;
}
.operateAreaUpdate {
  width: 20%;
  height: 100%;
  border: #333333 solid 1px;
}
</style>