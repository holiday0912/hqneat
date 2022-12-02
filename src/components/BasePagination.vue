<template>
  <div class="pagination">
    <el-pagination
      :current-page="query.pageNum"
      :page-size="query.pageSize"
      :page-sizes="[10, 20, 30, 40, 50]"
      :total="pageTotal"
      background
      layout="sizes, total, prev, pager, next"
      @current-change="handlePageChange"
      @size-change="hanleSizeChange"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  name: "BasePagination",
  props: {
    pageTotal: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      query: {
        pageNum: 1,
        pageSize: 10
      }
    };
  },
  methods: {
    // 分页导航
    handlePageChange(val) {
      this.query.pageNum = val;
      this.getData();
    },
    // 改变页码
    hanleSizeChange(val) {
      this.query.pageSize = val;
      this.getData();
    },
    getData() {
      this.$emit("getdata", this.query);
    }
  }
};
</script>
