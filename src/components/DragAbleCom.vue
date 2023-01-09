<template>
  <transition-group class="list" name="drag" tag="ul">
    <li
      v-for="(item, index) in list"
      :key="item.id"
      class="list-item"
      draggable
      @dragenter="dragenter($event, index)"
      @dragover="dragover($event)"
      @dragstart="dragstart(index)"
    >
      {{ item.text }}
      <el-switch v-model="item.status"></el-switch>
    </li>
  </transition-group>
</template>

<script>
export default {
  name: "DragAbleCom",
  props: ["value"],
  data() {
    return {
      list: [
        { label: "列表1", id: 1 },
        { label: "列表2", id: 2 },
        { label: "列表3", id: 3 },
        { label: "列表4", id: 4 },
        { label: "列表5", id: 5 },
        { label: "列表6", id: 6 }
      ],
      dragIndex: "",
      enterIndex: "",
      value1: true
    };
  },
  mounted() {
    this.list = this.value;
  },
  methods: {
    dragenter(e, index) {
      e.preventDefault();
      if (this.dragIndex !== index) {
        const source = this.list[this.dragIndex];
        this.list.splice(this.dragIndex, 1);
        this.list.splice(index, 0, source);
        this.dragIndex = index;
      }
    },
    dragover(e) {
      e.preventDefault();
    },
    dragstart(index) {
      this.dragIndex = index;
    }
  }
};
</script>

<style lang="scss" scoped>
.list {
  list-style: none;
  display: flex;

  .drag-move {
    transition: transform 0.3s;
  }

  .list-item {
    cursor: move;
    width: 300px;
    background: red;
    border-radius: 4px;
    color: #fff;
    margin-bottom: 6px;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }
}
</style>
