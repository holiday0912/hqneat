<template>
  <div class="container">
    <div class="handle-box">
      <el-form ref="searchRorm" :model="searchForm" label-width="120px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="版本号" prop="versionCode">
              <el-input v-model="searchForm.versionCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="描述" prop="descr">
              <el-input v-model="searchForm.descr"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="上传时间" prop="createTime">
              <el-date-picker
                v-model="searchForm.createTime"
                placeholder="选择日期"
                style="width: 100%"
                type="date"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="类型" prop="type">
              <el-select
                v-model="searchForm.type"
                :clearable="true"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in typeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div class="handle-box">
        <el-button icon="el-icon-refresh" @click="formRest">重置</el-button>
        <el-button icon="el-icon-search" type="primary" @click="handleSearch"
          >查询
        </el-button>
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

        <!--版本号-->
        <el-table-column
          align="center"
          label="版本号"
          prop="versionCode"
        ></el-table-column>

        <!--描述-->
        <el-table-column
          align="center"
          label="描述"
          prop="descr"
        ></el-table-column>

        <!--文件路径-->
        <el-table-column
          align="center"
          label="文件路径"
          prop="fileUrl"
        ></el-table-column>

        <!-- 上传时间-->
        <el-table-column
          :sortable="true"
          align="center"
          label="上传时间"
          prop="createTime"
        ></el-table-column>

        <!--是否最新-->
        <el-table-column
          align="center"
          label="是否最新"
          prop="isLatest"
        ></el-table-column>

        <!--是否强制更新-->
        <el-table-column
          align="center"
          label="是否强制更新"
          prop="isForce"
        ></el-table-column>

        <!--类型-->
        <el-table-column
          align="center"
          label="类型"
          prop="type"
        ></el-table-column>

        <el-table-column align="center" label="操作" width="140">
          <template v-slot="scope">
            <el-popconfirm
              title="确定删除吗？"
              @confirm="handleDelete(scope.row)"
            >
              <el-button slot="reference" icon="el-icon-delete" type="text"
                >删除
              </el-button>
            </el-popconfirm>
            <el-button
              slot="reference"
              icon="el-icon-download"
              style="margin-left: 10px"
              type="text"
              @click="handleDownload(scope.row)"
              >下载
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <BasePagination
        :pageTotal="pageTotal"
        @getdata="getData"
      ></BasePagination>
    </div>

    <HtmlPckUpload
      ref="htmlPckUpload"
      :maxVerionCode="maxVerionCode"
      @refresh="getData"
    ></HtmlPckUpload>
  </div>
</template>

<script>
import HtmlPckUpload from "@/views/htmlPackage/HtmlPckUpload";
import { deleteVersion, fileDownload, h5VersionList } from "@/api/htmlPackage";

export default {
  name: "HtmlPackage",
  components: {
    HtmlPckUpload
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
      maxVerionCode: 0
    };
  },
  computed: {
    // html安装包类型的枚举
    typeList() {
      return [
        {
          label: "离线包",
          value: "1"
        },
        {
          label: "安装包",
          value: "0"
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
        let res = await h5VersionList(obj);
        if (res) {
          this.tableData = res.data.list.map(i => {
            this.maxVerionCode =
              this.maxVerionCode > +i.versionCode
                ? this.maxVerionCode
                : +i.versionCode;
            return {
              ...i,
              createTime: this.$dayjs(i.createTime),
              isLatest: this.showIsLatestAndIsForce(i.isLatest),
              isForce: this.showIsLatestAndIsForce(i.isForce),
              type: this.showType(i.type)
            };
          });
          this.pageTotal = res.data.total;
        }
      } catch (e) {
        throw new Error(e);
      }
    },
    showIsLatestAndIsForce(target) {
      switch (target) {
        case "1":
          return "是";
        case "0":
          return "否";
        default:
          return "否";
      }
    },
    showType(target) {
      switch (target) {
        case "1":
          return "离线包";
        case "0":
          return "安装包";
        default:
          return "——";
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
          await this.getData();
        }
      } catch (e) {
        throw new Error(e);
      }
    },
    async handleDownload({ fileUrl }) {
      try {
        const res = await fileDownload(fileUrl);
        const url = res.config.data;
        const aLink = document.createElement("a");
        aLink.href = URL.createObjectURL(res.data);
        aLink.setAttribute("download", url.slice(url.lastIndexOf("%2F") + 3));
        document.body.appendChild(aLink);
        aLink.click();
        document.body.removeChild(aLink);
      } catch (e) {
        throw new Error(e);
      }
    }
  }
};
</script>
