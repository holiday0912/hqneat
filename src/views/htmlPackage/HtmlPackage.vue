<template>
  <div class="container">
    <div class="handle-box">
      <el-form ref="searchRorm" :model="searchForm" label-width="120px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="searchForm.roleName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="角色描述" prop="roleDesc">
              <el-input v-model="searchForm.roleDesc"></el-input>
            </el-form-item>
          </el-col>

          <div style="display: inline-block">
            <div style="margin-left: 10px; display: inline-block">
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
          </div>
        </el-row>
      </el-form>

      <div class="handle-box">
        <el-button icon="el-icon-plus" type="primary" @click="handleAdd"
          >文件上传
        </el-button>
      </div>

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
          label="是否最新"
          prop="isLatest"
        ></el-table-column>

        <el-table-column
          align="center"
          label="版本号"
          prop="versionCode"
        ></el-table-column>

        <el-table-column
          align="center"
          label="描述"
          prop="descr"
        ></el-table-column>

        <el-table-column
          align="center"
          label="文件路径"
          prop="fileUrl"
        ></el-table-column>

        <el-table-column
          align="center"
          label="上传时间"
          prop="createTime"
        ></el-table-column>

        <el-table-column align="center" label="操作" width="220">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-delete"
              type="text"
              @click="handleDelete(scope.row)"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <BasePagination
        :pageTotal="pageTotal"
        @getData="getData"
      ></BasePagination>
    </div>

    <HtmlPckUpload ref="htmlPckUpload" @refresh="getData"></HtmlPckUpload>
  </div>
</template>

<script>
import HtmlPckUpload from "@/views/htmlPackage/HtmlPckUpload";
import { deleteVersion, h5VersionList } from "@/api/htmlPackage";

export default {
  name: "roleManage",
  components: {
    HtmlPckUpload
  },
  data() {
    return {
      searchForm: {
        appid: "njebd81krqn",
        descr: "", //描述
        versionCode: "", //版本号
        type: "" //类型
      },
      tableData: [],
      pageTotal: 0
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData(query = { pageNum: 1, pageSize: 10 }) {
      let obj = Object.assign(query, this.searchForm);
      try {
        let res = await h5VersionList(obj);
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
    }
  }
};
</script>
