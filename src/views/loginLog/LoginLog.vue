<template>
  <div class="container">
    <div class="handle-box">
      <el-form ref="searchRorm" :model="searchForm" label-width="120px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="app名称" prop="appName">
              <el-input v-model="searchForm.appName"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <div style="margin-left: 50px; display: inline-block">
              <el-button icon="el-icon-refresh" @click="formRest"
                >重置
              </el-button>
            </div>
            <div style="margin-left: 10px; display: inline-block">
              <el-button
                icon="el-icon-search"
                type="primary"
                @click="handleSearch"
                >查询
              </el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>

      <BaseTable
        :columns="columns"
        :pageTotal="pageTotal"
        :tableData="tableData"
        @getData="getData"
      >
        <template #ordinal="{scope}">
          <div>
            {{ scope.$index + 1 }}
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
    columns() {
      return [
        {
          label: "序号",
          width: "55",
          render: "ordinal"
        },
        {
          label: "app名称",
          prop: "appName"
        },
        {
          label: "版本代码",
          prop: "versionCode"
        },
        {
          label: "版本号",
          prop: "versionName"
        },
        {
          label: "品牌",
          prop: "brand"
        },
        {
          label: "型号",
          prop: "model"
        },
        {
          label: "设备id",
          prop: "deviceId"
        },
        {
          label: "sdk版本",
          prop: "sdk"
        },
        {
          label: "系统版本",
          prop: "systemVersion"
        },
        {
          label: "登录时间",
          prop: "createTime"
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

<style>
.error-log {
  padding: 20px;
}
</style>
