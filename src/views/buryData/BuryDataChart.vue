<template>
  <div class="wrapper">
    <h3 style="text-align: center;margin-bottom: 20px">事件占比</h3>
    <Schart ref="schart" :options="options" canvasId="canvas" class="wrapper" />
  </div>
</template>

<script>
import Schart from "vue-schart";

export default {
  components: {
    Schart
  },
  props: {
    labelData: {
      type: Array,
      default: () => []
    },
    chartData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      options: {
        type: "line",
        legend: {
          display: true
        },
        title: {
          text: "事件7天趋势",
          position: "bottom"
        },
        bgColor: "#fbfbfb",
        labels: this.labelData,
        datasets: [
          {
            data: this.chartData
          }
        ]
      }
    };
  }
};
</script>

<style>
.wrapper {
  width: 100%;
  height: 350px;
}
</style>
