<template>
  <div>
    <el-table
      :data="tableData"
      border
      class="table"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <el-table-column
        v-for="(item, index) in columns"
        :key="index"
        v-bind="{ align: 'center', ...item }"
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
  // 改变每页条数
  handleSizeChange(val) {
    query.pageSize = val;
    getData();
  }
};

const emits = defineEmits(["getData"]);

const getData = () => {
  emits("getData", query);
};

defineExpose({
  query
});
</script>

<script>
export default {
  name: "BaseTable"
};
</script>
