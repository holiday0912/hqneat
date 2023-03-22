<template>
<div>
  <el-pagination
    background
    @current-change="handleCurrentChange"
    :current-page.sync="paginationData.currentPage"
    :page-size="paginationData.pageSize"
    layout="total, prev, pager, next"
    :total="paginationData.totalSize"
  ></el-pagination>
</div>
</template>

<script>
export default {
  props: {
    paginationData: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.$emit("curPageChange", val);
    }
  }
};
</script>

<style>
</style>
