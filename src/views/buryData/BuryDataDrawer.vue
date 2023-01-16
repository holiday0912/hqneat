<template>
  <el-drawer
    :before-close="handleDrawerClose"
    :visible.sync="drawer"
    size="600px"
    title="埋点数据详情"
  >
    <div v-if="drawer">
      <!--    <el-tabs v-model="activeName" class="event-record" @tab-click="handleClick">-->
      <!--      <el-tab-pane label="基本信息" name="first">-->
      <el-form ref="uploadMessage" :model="formData" label-width="110px">
        <el-form-item
          :rules="[{ required: true, message: '请输入' }]"
          label="事件id"
          prop="eventId"
        >
          <el-input v-model="formData.eventId"></el-input>
        </el-form-item>
        <el-form-item
          :rules="[{ required: true, message: '请输入' }]"
          label="事件名称"
          prop="eventName"
        >
          <el-input v-model="formData.eventName"></el-input>
        </el-form-item>

        <el-form-item
          :rules="[{ required: true, message: '请输入' }]"
          label="触发时机"
          prop="triggerTiming"
        >
          <el-input v-model="formData.triggerTiming" type="textarea"></el-input>
        </el-form-item>

        <el-form-item
          :rules="[{ required: true, message: '请输入' }]"
          label="类型"
          prop="type"
        >
          <el-input v-model="formData.type"></el-input>
        </el-form-item>

        <el-form-item
          :rules="[{ required: true, message: '请输入' }]"
          label="分类标签"
          prop="classLabels"
        >
          <el-input v-model="formData.classLabels"></el-input>
        </el-form-item>
      </el-form>

      <div id="myChart" style="width: 100%;height: 300px"></div>
      <!--      </el-tab-pane>-->

      <!--      <el-tab-pane label="事件记录" name="second">-->
      <!--        <el-form-->
      <!--          :disabled="true"-->
      <!--          class="event-record"-->
      <!--          label-position="left"-->
      <!--          label-width="130px"-->
      <!--        >-->
      <!--          <el-form-item label="创建人">-->
      <!--            <el-input v-model="formData.createUser"></el-input>-->
      <!--          </el-form-item>-->
      <!--          <el-form-item label="创建时间">-->
      <!--            <el-input v-model="formData.createTime"></el-input>-->
      <!--          </el-form-item>-->
      <!--          <el-form-item label="最近更新人">-->
      <!--            <el-input v-model="formData.updateUser"></el-input>-->
      <!--          </el-form-item>-->
      <!--          <el-form-item label="首次上报时间">-->
      <!--            <el-input v-model="formData.firstAppear"></el-input>-->
      <!--          </el-form-item>-->
      <!--          <el-form-item label="最近上报时间">-->
      <!--            <el-input v-model="formData.lastAppear"></el-input>-->
      <!--          </el-form-item>-->
      <!--        </el-form>-->
      <!--      </el-tab-pane>-->

      <!--      <el-tab-pane label="事件详情" name="third">-->
      <!--        <pre class="json-data">{{ jsonData }} </pre>-->
      <!--      </el-tab-pane>-->
      <!--    </el-tabs>-->
    </div>
  </el-drawer>
</template>

<script>
import { createCookieView } from "@/api/buryData";
import * as ECharts from "echarts";

export default {
  name: "BuryDataDrawer",
  data() {
    return {
      drawer: false,
      activeName: "first",
      formData: {},
      chartData: [""],
      labelData: [""],
      chartLoaded: false,
      jsonData: ""
    };
  },
  watch: {
    drawer: {
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            this.drawChart();
          });
        }
      }
    }
  },
  mounted() {},
  methods: {
    drawChart() {
      const myChart = ECharts.init(document.getElementById("myChart"), null, {
        renderer: "svg"
      });
      myChart.setOption({
        title: {
          text: "事件占比",
          left: "240"
        },
        tooltip: {},
        xAxis: {
          data: this.labelData
        },
        yAxis: {},
        series: [
          {
            name: "事件7天趋势",
            type: "line",
            data: this.chartData
          }
        ]
      });
    },
    showDrawer(val) {
      this.drawer = true;
      this.formData = val;
      this.getChartData();
    },
    handleDrawerClose() {
      this.chartLoaded = false;
      this.drawer = false;
    },
    // handleClick(tab) {
    //   console.log("tab click", tab);
    //   if (tab.index === "2") {
    //     this.getSearchNewsDetail();
    //   }
    // },
    async getChartData() {
      try {
        let res = await createCookieView({
          eventId: this.formData.eventId
        });
        if (res.message === "请求成功") {
          this.labelData = res.data.map(i => i.staDay);
          this.chartData = res.data.map(i => i.detailCount);
          this.chartLoaded = true;
        } else {
          this.$message.error(res.message);
        }
      } catch (e) {
        throw new Error(e);
      }
    }
    // async getSearchNewsDetail() {
    //   try {
    //     let res = await searchNewsDetail({ eventId: this.formData.eventId });
    //     if (res.message === "请求成功") {
    //       let temp = res.data;
    //       temp.jsonData = JSON.parse(temp.jsonData);
    //       this.jsonData = temp;
    //     } else {
    //       this.$message.error(res.message);
    //     }
    //   } catch (e) {
    //     throw new Error(e);
    //   }
    // }
  }
};
</script>

<style scoped>
.event-record {
  padding: 20px;
}

.json-data {
  font-size: 16px;
  font-weight: 600;
  font-family: monospace;
  overflow-x: auto;
}
</style>
