<template>
  <div class="drawArea">
    <div class="container" ref="container"> </div>
    <div class="operateArea">
      <a-button type="primary" @click="saveFlow" ghost>保存流程</a-button>
    </div>
  </div>
</template>

<script>
//样式
import "@logicflow/core/dist/style/index.css";
import '@logicflow/extension/lib/style/index.css'

//插件组件
import LogicFlow from "@logicflow/core";
import {Highlight,DndPanel,Menu,Control,MiniMap,SelectionSelect,InsertNodeInPolyline,Snapshot } from '@logicflow/extension';

//方法
import {getProcessNodeList,save} from '../../api/flowProcess.js';


export default {
  //初次加载时候 挂载
  mounted() {
    this.loadData().then(() => {
      this.init();
    });
  },

  methods: {
    async loadData() {
      try {
        const resp = await getProcessNodeList();
        this.businessNodeList = resp.data;
        console.log('获取流程节点成功')
        console.log(this.businessNodeList)
      } catch (error) {
        console.error('Error fetching node list:', error);
      }
    },

    init() {
      //初始化
      this.lf = new LogicFlow({
        //插件注册 方式2
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
      //渲染加载
      this.lf.render();
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
    },

    //保存节点信息
     saveFlow() {
      this.gridData = this.lf.getGraphData();
      try {
        this.transformFeToBe(this.gridData)
        console.log("transBeObject")
        console.log(this.beObject)

        //清空画布
        this.lf.clearData()

        save(this.beObject).then(resp => {
          if(resp!=null&&resp.data!==null){
            console.log(resp)
            const graphData = JSON.parse(resp.data);
            console.log(JSON.parse(resp.data))
            //回显数据
            this.lf.render(graphData);
            this.lf.translateCenter();
          }
        })
        this.beObject={
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
          this.beObject.nodeEntities.push({
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
          this.beObject.nodeEdges.push({
            source: edge.sourceNodeId,
            target: edge.targetNodeId,
            ifNodeFlag: ifNodeFlag, // 假设没有特殊需求
            tag: tag // 可以根据需要设置
          });
        });
      }

      this.beObject.jsonData = JSON.stringify(feObject);
    }


  },
  data() {
    return {
      gridData: {},
      lf: null,
      businessNodeList: [],
      beObject : {
        nodeEntities: [],
        nodeEdges: []
      },
    };
  },
};


</script>

<style scoped>
.drawArea {
  width: 100%;
  height: 100%;
  border: #333333 solid 1px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.container {
  width: 80%;
  height: 100%;
  border: #333333 solid 1px;
}
.operateArea {
  width: 20%;
  height: 100%;
  border: #333333 solid 1px;
}
</style>