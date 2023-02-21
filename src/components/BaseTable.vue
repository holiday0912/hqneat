<template>
  <div>
    <el-form
      v-if="searchFormSet"
      v-bind="{ 'label-width': '120px', ...searchFormSet }"
    >
      <el-row>
        <slot name="searchForm"></slot>

        <el-col :span="6" :xs="12">
          <el-button
            icon="el-icon-refresh"
            style="margin-left: 50px; display: inline-block"
            @click="handleReset"
            >重置
          </el-button>

          <el-button
            icon="el-icon-search"
            style="margin-left: 10px; display: inline-block"
            type="primary"
            @click="handleSearch"
            >查询
          </el-button>
          <el-button
            v-if="!searchFormSet.noAdd"
            icon="el-icon-plus"
            type="primary"
            @click="handleAdd"
          >
            {{ searchFormSet.addBtnText || "新增" }}
          </el-button>
        </el-col>
      </el-row>
    </el-form>

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
        <template v-if="item.label === '操作'" v-slot="scope">
          <el-button
            v-if="item.operaBtn && item.operaBtn.deleteFn"
            icon="el-icon-delete"
            type="text"
            @click="handleDelete(scope.row)"
            >删除
          </el-button>

          <el-button
            v-if="item.operaBtn && item.operaBtn.editFn"
            icon="el-icon-edit"
            type="text"
            @click="handleEdit(scope.row)"
            >修改
          </el-button>
          <slot :name="item.render" :scope="scope"> </slot>
        </template>
        <template v-else-if="item.render" v-slot="scope">
          <slot :name="item.render" :scope="scope"> </slot>
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
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "BaseTable",
  props: {
    // 表格数据源
    tableData: {
      type: Array,
      default: () => []
    },
    // 分页数据
    pageTotal: {
      type: Number,
      default: 0
    },
    // 表格列配置项
    columns: {
      type: Array,
      default: () => []
    },
    // 搜索表格的配置项
    searchFormSet: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      query: {
        pageNum: 1,
        pageSize: 10
      },
      // 控制modal框开闭
      dialogFormVisible: false,
      operaBtn: this.columns[this.columns.length - 1].operaBtn
    };
  },
  computed: {
    dialog() {
      return {
        "close-on-click-modal": false,
        "destroy-on-close": true,
        width: "680px"
      };
    }
  },
  methods: {
    getData() {
      this.$emit("getData", this.query);
    },
    // 分页导航
    handlePageChange(val) {
      this.query.pageNum = val;
      this.getData();
    },
    // 改变每页条数
    handleSizeChange(val) {
      this.query.pageSize = val;
      this.getData();
    },
    handleReset() {
      this.$refs[this.searchFormSet.ref].resetFields();
      this.getData();
    },
    // 列表查询
    handleSearch() {
      this.query = {
        pageNum: 1,
        pageSize: 10
      };
      this.getData();
    },
    handleAdd() {
      this.dialogFormVisible = true;
      this.$emit("edit");
    },
    handleEdit(row) {
      this.dialogFormVisible = true;
      this.$emit("edit", row);
    },
    //表格的删除按钮
    handleDelete(row) {
      this.$confirm("确认删除？", "提示", {
        type: "warning"
      })
        .then(async () => {
          const [fn, id] = this.operaBtn.deleteFn;
          try {
            const res = await fn(row[id]);
            if (res) {
              this.$notify({
                title: "提示",
                message: "删除成功",
                type: "success"
              });
              if (this.tableData.length === 1) {
                if (this.query.pageNum === 0) {
                  return;
                }
                this.query.pageNum--;
              }
              await this.getData(this.query);
            }
          } catch (error) {
            throw new Error(error.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
