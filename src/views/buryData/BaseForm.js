export default {
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    searchForm: {
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
      pageTotal: 20,
      defaultTable: (
        <template>
          <el-table-column
            align="center"
            label="设备id"
            prop="deviceId"
          ></el-table-column>

          <el-table-column
            align="center"
            label="sdk版本"
            prop="sdk"
          ></el-table-column>
        </template>
      )
    };
  },
  mounted() {
    console.log("mounted jsx", this.$slots);
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
      this.$emit("getData", this.query);
    },
    formRest() {
      this.$refs.searchForm.resetFields();
    },
    handleSearch() {
      console.log("form search");
    }
  },
  render() {
    return (
      <div class="container">
        <div class="handle-box">
          <el-form ref="searchForm" model={this.searchForm} label-width="120px">
            {this.$slots.searchForm}
            <el-button icon="el-icon-refresh" onClick={this.formRest}>
              重置
            </el-button>
            <el-button
              icon="el-icon-search"
              type="primary"
              onClick={this.handleSearch}
            >
              查询
            </el-button>
            <el-button
              icon="el-icon-plus"
              type="primary"
              onClick={this.handleAdd}
            >
              新增
            </el-button>
          </el-form>

          <el-table
            data={this.tableData}
            border
            class="table"
            header-cell-class-name="table-header"
          >
            {this.$slots.table ?? this.defaultTable}
          </el-table>

          <div class="pagination">
            <el-pagination
              current-page={this.query.pageNum}
              page-size={this.query.pageSize}
              page-sizes={[10, 20, 30, 40, 50]}
              total={this.pageTotal}
              background
              layout="sizes, total, prev, pager, next"
              on-current-change={this.handlePageChange}
              on-size-change={this.hanleSizeChange}
            ></el-pagination>
          </div>
        </div>
      </div>
    );
  }
};
