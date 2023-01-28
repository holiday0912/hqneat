<template>
  <div class="error-page">
    <div class="error-code">4<span>0</span>4</div>
    <div class="error-desc">啊哦~ 你所访问的页面不存在</div>
    <div class="error-handle">
      <router-link to="/dashboard">
        <el-button size="large" type="primary">返回首页</el-button>
      </router-link>
      <el-button class="error-btn" size="large" type="primary" @click="goBack">
        返回上一页
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>
