<template>
  <div class="drawArea">
    <div class="container" ref="container">
    </div>
    <div class="operateArea">
      <h1>输入流程信息</h1>
      <br>
      <a-input v-model:value="this.beObject.applicationName" placeholder="请输入流程挂载的服务名称"/>
      <br>
      <br>
      <a-input v-model:value="this.beObject.chainName" placeholder="请输入流程名称"/>
      <br>
      <br>
      <a-textarea v-model:value="this.beObject.chainDesc" placeholder="请输入流程描述" :rows="4"/>
      <br>
      <br>
      <a-button type="primary" @click="saveFlow" ghost>保存流程</a-button>
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
          <a-input v-model:value="this.currentNodeInfo.name"/>
        </a-form-item>

        <a-form-item
            label="节点类名:"
            name="NodeClassName"
        >
          <a-input v-model:value="this.currentNodeInfo.param.name"/>
        </a-form-item>
        <a-form-item label="节点类型:" name="NodeType">
          <a-input disabled v-model:value="this.currentNodeInfo.param.type"/>
        </a-form-item>

        <!--        <a-form-item label="节点参数:" name="NodeParam">-->
        <!--          <br>-->
        <!--          <br>-->
        <!--          <a-form v-if="currentNodeInfo.param">-->
        <!--            <template v-for="(value, key) in currentNodeInfo.param" :key="key">-->
        <!--              <a-form-item-->
        <!--                  :label=key-->
        <!--                  :name= key-->
        <!--              >-->
        <!--                <a-input-->
        <!--                    :value = value-->
        <!--                />-->
        <!--              </a-form-item>-->
        <!--            </template>-->
        <!--          </a-form>-->
        <!--          <div v-else class="param-empty">-->
        <!--            暂无节点参数-->
        <!--          </div>-->
        <!--        </a-form-item>-->
        <a-form-item
            label="节点参数:"
            name="NodeParam"
        >
          <a-form
              ref="formRef"
              name="dynamic_form_nest_item"
              :model="dynamicValidateForm"
          >
            <a-space
                v-for="(param, index) in dynamicValidateForm.params"
                style="display: flex; margin-bottom: 5px"
                align="baseline"
            >
              <a-form-item
                  :name="['params', index, 'paramName']"
                  :rules="{required: false,message: 'Missing param name',}"
              >
                <a-input v-model:value="param.paramName" placeholder="Param Name"/>
              </a-form-item>
              :
              <a-form-item
                  :name="['params', index, 'paramValue']"
                  :rules="{required: false,message: 'Missing param value',}"
              >
                <a-input v-model:value="param.paramValue" placeholder="Param Value"/>
              </a-form-item>

              <MinusCircleOutlined @click="removeUser(param)"/>
            </a-space>
            <a-form-item>
              <a-button type="dashed" block @click="addParam">
                <PlusOutlined/>
                添加参数
              </a-button>
            </a-form-item>
          </a-form>

        </a-form-item>
        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <a-button type="primary" @click="saveNodeInfo(this.currentNodeInfo)" ghost>保存节点信息</a-button>
        </a-form-item>

      </a-form>
    </div>
  </div>
</template>

<script>
//样式
import "@logicflow/core/dist/style/index.css";
import '@logicflow/extension/lib/style/index.css'
import {PlusOutlined, MinusCircleOutlined,} from '@ant-design/icons-vue';


//插件组件
import LogicFlow from "@logicflow/core";
import {
  Highlight,
  DndPanel,
  Menu,
  Control,
  MiniMap,
  SelectionSelect,
  InsertNodeInPolyline,
  Snapshot
} from '@logicflow/extension';

//方法
import {getProcessNodeList, save} from '../../../api/flowProcess.js';
// import {
//   PieChartOutlined,
//   CodeOutlined,
//   HomeOutlined,
//   ShareAltOutlined,
//   EditOutlined
// } from '@ant-design/icons-vue';

export default {

  //注册组件
  components: {
    PlusOutlined,MinusCircleOutlined
  },

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
        plugins: [Highlight, DndPanel, Menu, Control, MiniMap, SelectionSelect, InsertNodeInPolyline, Snapshot],
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

      this.lf.on("node:click", (data, e, position) => {
        console.log(data.data)
        this.currentNodeInfo.id = data.data.id;
        this.currentNodeInfo.name = data.data.text.value;
        this.currentNodeInfo.param = data.data.properties;
      });

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
          if (resp != null && resp.data !== null) {
            console.log("流程创建成功")
            console.log(resp.data)
            const graphData = JSON.parse(resp.data.jsonData);
            console.log(graphData)
            //回显数据
            this.lf.render(graphData);
            this.lf.translateCenter();
            this.beObject.applicationName = resp.data.applicationName;
            this.beObject.chainName = resp.data.chainName;
            this.beObject.chainDesc = resp.data.chainDesc;
          }
        })
        this.beObject = {
          nodeEntities: [],
          nodeEdges: [],
          jsonData: ''
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
          if (edge.text !== undefined && edge.text !== null && edge.text.value !== "") {
            if (edge.text.value !== "true" && edge.text.value !== "false") {
              //switch 语句 设置 tag 才能判断
              tag = edge.text.value;
            } else {
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
    },

    saveNodeInfo(info) {
      console.log('Success:', info);
      console.log('Success:', this.dynamicValidateForm);
    },

    removeUser(item) {
      const index = this.dynamicValidateForm.params.indexOf(item);
      if (index !== -1) {
        this.dynamicValidateForm.params.splice(index, 1);
      }
    },
    addParam() {
      this.dynamicValidateForm.params.push({
        paramName: '',
        paramValue: '',
        NodeInfo: this.currentNodeInfo,
      });
    },
  },
  data() {
    return {
      gridData: {},
      lf: null,
      businessNodeList: [],
      beObject: {
        nodeEntities: [],
        nodeEdges: [],
        jsonData: '',
        chainName: '',
        applicationName: '',
        chainDesc: '',
        enable: 0
      },
      currentNodeInfo: {
        id: '',
        name: '',
        param: '',
      },
      dynamicValidateForm: {
        params: [],
      },

    };
  },
};


</script>

<style scoped>
.drawArea {
  width: 100%;
  height: 95%;
  margin-top: 2%;
  border: #333333 solid 1px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.container {
  width: 65%;
  height: 100%;
  border: #333333 solid 1px;
}

.operateArea {
  width: 35%;
  height: 100%;
  border: #333333 solid 1px;
}

.inputStyle {
  width: 50%;
  margin-left: 50%
}
</style>