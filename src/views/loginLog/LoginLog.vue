<template>
  <div class="container">
    <div class="handle-box">
      <BaseTable
        :columns="columns"
        :page-total="pageTotal"
        :search-form-set="searchFormSet"
        :table-data="tableData"
        @getData="getData"
      >
        <template #searchForm>
          <div>
            <el-col :span="6">
              <el-form-item label="app名称" prop="appName">
                <el-input v-model="searchForm.appName"></el-input>
              </el-form-item>
            </el-col>
          </div>
        </template>

        <template #operation="{ scope }">
          <el-button
            icon="el-icon-document"
            type="text"
            @click="handleDetail(scope.row)"
            >详情
          </el-button>
        </template>
      </BaseTable>
    </div>

    <el-drawer
      :before-close="handleDrawerClose"
      :visible.sync="drawer"
      size="700px"
      title="崩溃日志"
    >
      <div class="error-log">{{ logDetail }}</div>
    </el-drawer>
  </div>
</template>

<script>
import { LogInfo } from "@/api/loginLog";
import { addTimeIcon } from "@/common/tableFormat";

export default {
  name: "LoginLog",
  data() {
    return {
      searchForm: {
        appid: "njebd81krqn",
        appName: ""
      },
      tableData: [],
      pageTotal: 0,
      drawer: false,
      logDetail: ""
    };
  },
  computed: {
    searchFormSet() {
      return {
        model: this.searchForm,
        ref: "searchForm",
        noAdd: true
      };
    },
    columns() {
      return [
        {
          label: "序号",
          width: "55",
          formatter: (row, column, val, index) => index + 1
        },
        {
          label: "app名称",
          prop: "appName",
          formatter: (row, column, val) => val || this.$nodata
        },
        {
          label: "版本代码",
          prop: "versionCode",
          formatter: (row, column, val) => val || this.$nodata
        },
        {
          label: "版本号",
          prop: "versionName",
          formatter: (row, column, val) => val || this.$nodata
        },
        {
          label: "品牌",
          prop: "brand",
          formatter: (row, column, val) => val || this.$nodata
        },
        {
          label: "型号",
          prop: "model",
          formatter: (row, column, val) => val || this.$nodata
        },
        {
          label: "设备id",
          prop: "deviceId",
          formatter: (row, column, val) => val || this.$nodata
        },
        {
          label: "sdk版本",
          prop: "sdk",
          formatter: (row, column, val) => val || this.$nodata
        },
        {
          label: "系统版本",
          prop: "systemVersion",
          formatter: (row, column, val) => val || this.$nodata
        },
        {
          label: "登录时间",
          prop: "createTime",
          formatter: (row, column, val) => addTimeIcon(row, column, val),
          sortable: true
        },
        {
          label: "操作",
          render: "operation",
          width: 90
        }
      ];
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData(query = { pageNum: 1, pageSize: 10 }) {
      let obj = Object.assign(query, this.searchForm);
      try {
        let res = await LogInfo(obj);
        if (res) {
          this.tableData = res.data.list.map(i => {
            return {
              ...i,
              createTime: i.createTime
                ? this.$dayjs(i.createTime)
                : this.$nodata
            };
          });
          this.pageTotal = res.data.total;
        }
      } catch (e) {
        throw new Error(e);
      }
    },
    formRest() {
      this.$refs.searchRorm.resetFields();
    },
    // 列表查询
    handleSearch() {
      this.query = {
        pageNum: 1,
        pageSize: 10
      };
      this.getData();
    },
    handleDetail(val) {
      if (val.logInfo) {
        this.logDetail = val.logInfo;
        this.drawer = true;
      } else {
        this.$message.info("当前没有崩溃日志");
      }
    },
    handleDrawerClose() {
      this.drawer = false;
    }
  }
};
</script>
