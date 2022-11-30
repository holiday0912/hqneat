<template>
  <div>
    <Schart
      :data="chartData"
      :height="200"
      :options="options"
      canvasId="canvas2"
      class="wrapper"
      type="line"
      width="100%"
    />
  </div>
</template>

<script>
import Schart from "vue-schart";

export default {
  name: "BuryDataChart",
  components: {
    Schart
  },
  data() {
    return {
      chartData: [
        { name: "2014", value: 1342 },
        { name: "2015", value: 2123 },
        { name: "2016", value: 1654 },
        { name: "2017", value: 1795 }
      ],
      options: {
        title: "Total sales of stores in recent years"
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
