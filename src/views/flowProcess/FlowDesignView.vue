<template>
  <div class="drawArea">
    <div class="nodeArea">
      节点选择区域
    </div>
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
import {saveFlow,getProcessNodeList,toEL} from '../../api/flowProcess.js';


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
        snapline: true
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
         // saveFlow(this.gridData).then(data => {
         //   console.log(data);
         // })
        toEL(this.gridData).then(data => {
          console.log(data);
        })

      } catch (error) {
        console.error("请求失败，请检查网络或服务器状态", error);
      }
    },

    fetchBusinessNodeList() {
      try {
        const resp =  getProcessNodeList();
        resp.then(data => {
          this.businessNodeList = data.data;
        })
      } catch (error) {
        console.error('Error fetching node list:', error);
        return [];
      }
    }
  },
  data() {
    return {
      gridData: {},
      lf: null,
      businessNodeList: []
    };
  },
};


</script>

<style scoped>
.drawArea {
  width: 100%;
  height: 90%;
  margin-top: 2%;
  border: #333333 solid 1px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.nodeArea {
  width: 20%;
  height: 100%;
  border: #333333 solid 1px;
}
.container {
  width: 60%;
  height: 100%;
  border: #333333 solid 1px;
}
.operateArea {
  width: 20%;
  height: 100%;
  border: #333333 solid 1px;
}
</style>