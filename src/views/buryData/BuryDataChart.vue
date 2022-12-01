<template>
  <div class="wrapper">
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
        title: {
          text: "事件7天趋势"
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
  height: 200px;
}
</style>
