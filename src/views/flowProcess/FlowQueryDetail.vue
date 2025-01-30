<template>
  <div class="container" ref="container"></div>
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
    },
    settingGraphData() {
      if (this.$route.params.record) {
        const record = JSON.parse(this.$route.params.record);
        console.log(record)
        //渲染加载
        const graphData = JSON.parse(record.jsonData);
        this.lf.render(graphData);
        this.lf.translateCenter();
      }
    },
  },
  data() {
    return {
      gridData: {},
      lf: null,
    };
  },
};

</script>
<style scoped>
.container {
  width: 100%;
  height: 90%;
  margin-top: 2%;
  border: #333333 solid 1px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>