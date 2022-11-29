<template>
  <div class="container">
    <div class="handle-box">
      <el-form ref="searchRorm" :model="searchForm" label-width="120px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="时间" prop="createTime">
              <el-date-picker
                v-model="searchForm.createTime"
                placeholder="选择日期"
                style="width: 100%"
                type="date"
              >
              </el-date-picker>
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

      <el-table
        ref="multipleTable"
        :data="tableData"
        border
        class="table"
        header-cell-class-name="table-header"
      >
        <el-table-column align="center" label="序号" width="55">
          <template v-slot="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="app名称"
          prop="appName"
        ></el-table-column>

        <el-table-column
          align="center"
          label="版本代码"
          prop="versionCode"
        ></el-table-column>

        <el-table-column
          align="center"
          label="版本号"
          prop="versionName"
        ></el-table-column>

        <el-table-column
          align="center"
          label="品牌"
          prop="brand"
        ></el-table-column>

        <el-table-column
          align="center"
          label="型号"
          prop="model"
        ></el-table-column>

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

        <el-table-column
          align="center"
          label="系统版本"
          prop="systemVersion"
        ></el-table-column>

        <!-- 时间-->
        <el-table-column
          align="center"
          label="登录时间"
          prop="createTime"
        ></el-table-column>

        <el-table-column align="center" label="操作" width="90">
          <template v-slot="scope">
            <!--            <el-popconfirm-->
            <!--              title="确定删除吗？"-->
            <!--              @confirm="handleDelete(scope.row)"-->
            <!--            >-->
            <!--              <el-button slot="reference" icon="el-icon-delete" type="text"-->
            <!--                >删除-->
            <!--              </el-button>-->
            <!--            </el-popconfirm>-->
            <el-button
              icon="el-icon-document"
              type="text"
              @click="handleDetail(scope.row)"
              >详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <BasePagination
        :pageTotal="pageTotal"
        @getData="getData"
      ></BasePagination>
    </div>
    <el-drawer
      :before-close="handleDrawerClose"
      :visible.sync="drawer"
      size="60%"
      title="崩溃日志"
    >
      <div class="error-log">{{ logDetail }}</div>
    </el-drawer>
  </div>
</template>

<script>
// import HtmlPckUpload from "@/views/htmlPackage/HtmlPckUpload";
import { deleteVersion } from "@/api/htmlPackage";
import { LogInfo } from "@/api/loginLog";

export default {
  name: "LoginLog",
  components: {
    // HtmlPckUpload
  },
  data() {
    return {
      searchForm: {
        appid: "njebd81krqn",
        descr: "", //描述
        versionCode: "", //版本号
        type: "", //类型，
        createTime: ""
      },
      tableData: [],
      pageTotal: 0,
      drawer: false,
      logDetail: ""
    };
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
              createTime: this.$dayjs(i.createTime)
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
    // 新增推送
    handleAdd() {
      this.$refs.htmlPckUpload.showDialog();
    },
    async handleDelete({ id }) {
      try {
        let res = await deleteVersion({ body: id, channel: "" });
        if (res.message === "请求成功") {
          this.$message.success("删除成功");
          this.getData();
        }
      } catch (e) {
        throw new Error(e);
      }
    },
    handleDetail(val) {
      console.log(val);
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
