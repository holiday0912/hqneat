<template>
  <div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      border
      class="table"
      header-cell-class-name="table-header"
    >
      <el-table-column
        v-for="(item, index) in columns"
        :key="index"
        v-bind="item"
      >
        <template v-if="item.render" v-slot="scope">
          <slot :name="item.render" :scope="scope"></slot>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        :current-page="query.pageNum"
        :page-size="query.pageSize"
        :page-sizes="[10, 20, 30, 40, 50]"
        :total="pageTotal"
        background
        layout="sizes, total, prev, pager, next"
        @current-change="pgaMethods.handlePageChange"
        @size-change="pgaMethods.handleSizeChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";

defineProps({
  tableData: {
    type: Array,
    default: () => []
  },
  pageTotal: {
    type: Number,
    default: 0
  },
  columns: {
    type: Array,
    default: () => []
  }
});

const emits = defineEmits(["getData"]);

const query = reactive({
  pageNum: 1,
  pageSize: 10
});

// 页码相关方法
const pgaMethods = {
  // 分页导航
  handlePageChange(val) {
    query.pageNum = val;
    getData();
  },
  // 改变页码
  handleSizeChange(val) {
    query.pageSize = val;
    getData();
  }
};

const getData = () => {
  emits("getData");
};
</script>

<script>
export default {
  name: "BaseTable"
};
</script>
