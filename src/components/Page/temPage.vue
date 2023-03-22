<template>
  <!--简易封装带分页面板 包含主标题 新增按钮 中间插槽为table预留 底部带分页
      详见贷款交易查询（第一次使用）具体使用-->
  <el-card class="box-card">
    <div slot="header">
      <span>{{h_tit}}</span>
      <el-button v-show="showAdd" type="primary" class="elbtn" size="mini" @click="handleAdd">{{$t('message.add')}}</el-button>
      <el-button v-show="showExport" type="primary" class="elbtn" size="mini" @click="handleExport">{{$t('message.export')}}</el-button>
    </div>
    <slot></slot>
    <!--<slot name="table"></slot>为中间table列表预留插槽，use:<el slot="table"></el>-->
    <slot name="table"></slot>
    <!-- 分页 -->
    <div class="block">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page.sync="paginationData.currentPage"
        :page-size="paginationData.pageSize"
        layout="total, prev, pager, next"
        :total="paginationData.totalSize"
      ></el-pagination>
    </div>
  </el-card>
</template>

<script>
export default {
  props: {
    h_tit: {
      type: String
    },
    showAdd: {
      type: Boolean,
      default: false
    },
    showExport: {
      type: Boolean,
      default: false
    },
    paginationData: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleAdd() {
      this.$emit("add");
    },
    handleExport() {
      this.$emit("exp");
    },
    handleCurrentChange(val) {
      this.$emit("curPageChange", val);
    }
  }
};
</script>

<style lang="scss" scoped>
.box-card {
  .elbtn {
    float: right;
    padding: 3px 5px;
    font-size: 14px;
    margin-right:10px;
  }
}
.block {
  text-align: right;
  margin-top: 12px;
}
</style>
