<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { updateMenuMethod } from "@/common/toolFunc";

export default {
  data() {
    return {
      timer: ""
    };
  },
  mounted() {
    // 更新菜单
    const role = sessionStorage.getItem("tk");
    if (role) {
      updateMenuMethod();
    }
    // 设置10分钟检查一次菜单权限
    this.timer = setInterval(() => {
      updateMenuMethod();
    }, 10 * 60 * 1000);
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
};
</script>
