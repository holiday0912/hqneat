<template>
  <el-drawer
    :before-close="handleDrawerClose"
    :visible.sync="drawer"
    size="600px"
    title="埋点数据详情"
  >
    <el-tabs v-model="activeName" class="event-record" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="first">
        <el-form ref="uploadMessage" :model="form" label-width="110px">
          <el-form-item
            :rules="[{ required: true, message: '请输入' }]"
            label="事件id"
            prop="eventId"
          >
            <el-input v-model="form.eventId"></el-input>
          </el-form-item>
          <el-form-item
            :rules="[{ required: true, message: '请输入' }]"
            label="事件名称"
            prop="eventName"
          >
            <el-input v-model="form.eventName"></el-input>
          </el-form-item>

          <el-form-item
            :rules="[{ required: true, message: '请输入' }]"
            label="触发时机"
            prop="triggerTiming"
          >
            <el-input v-model="form.triggerTiming" type="textarea"></el-input>
          </el-form-item>

          <el-form-item
            :rules="[{ required: true, message: '请输入' }]"
            label="类型"
            prop="type"
          >
            <el-input v-model="form.type"></el-input>
          </el-form-item>

          <el-form-item
            :rules="[{ required: true, message: '请输入' }]"
            label="分类标签"
            prop="classLabels"
          >
            <el-input v-model="form.classLabels"></el-input>
          </el-form-item>

          <!--      <el-form-item-->
          <!--        :rules="[{ required: true, message: '请输入' }]"-->
          <!--        label="属性"-->
          <!--        prop="classLabels"-->
          <!--      >-->
          <!--        <el-input v-model="form.classLabels"></el-input>-->
          <!--      </el-form-item>-->
        </el-form>
        <BuryDataChart
          v-if="chartLoaded"
          :chartData="chartData"
          :labelData="labelData"
        />
      </el-tab-pane>
      <el-tab-pane label="事件记录" name="second">
        <el-form
          :disabled="true"
          class="event-record"
          label-position="left"
          label-width="130px"
        >
          <el-form-item label="创建人">
            <el-input v-model="formData.createUser"></el-input>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-input v-model="formData.createTime"></el-input>
          </el-form-item>
          <el-form-item label="最近更新人">
            <el-input v-model="formData.updateUser"></el-input>
          </el-form-item>
          <el-form-item label="首次上报时间">
            <el-input v-model="formData.firstAppear"></el-input>
          </el-form-item>
          <el-form-item label="最近上报时间">
            <el-input v-model="formData.lastAppear"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </el-drawer>
</template>

<script>
import { searchDetailCount } from "@/api/buryData";
import BuryDataChart from "@/views/buryData/BuryDataChart.vue";

export default {
  name: "BuryDataDrawer",
  components: {
    BuryDataChart
  },
  data() {
    return {
      drawer: false,
      activeName: "first",
      formData: {},
      form: {
        triggerTiming: "",
        eventName: "",
        type: "",
        classLabels: "",
        collectionStatus: "",
        eventId: ""
      },
      chartData: [""],
      labelData: [""],
      chartLoaded: false
    };
  },
  methods: {
    showDrawer(val) {
      this.drawer = true;
      this.formData = val;
      this.getChartData();
    },
    handleDrawerClose() {
      this.chartLoaded = false;
      this.drawer = false;
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    async getChartData() {
      try {
        let res = await searchDetailCount({ eventId: this.formData.eventId });
        if (res.message === "请求成功") {
          this.labelData = res.data.map(i => i.staDay);
          this.chartData = res.data.map(i => i.detailCount);
          this.chartLoaded = true;
        }
      } catch (e) {
        throw new Error(e);
      }
    }
  }
};
</script>

<style scoped>
.event-record {
  padding: 20px;
}
</style>
