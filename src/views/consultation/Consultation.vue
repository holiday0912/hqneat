<template>
  <div class="container">
    <div class="handle-box">
      <div class="handle-box">
        <el-button
          @click="addDialogVisible = true"
          icon="el-icon-plus"
          type="primary"
          >新增
        </el-button>
      </div>

      <el-table
        ref="multipleTable"
        :data="tableData"
        border
        class="table"
        header-cell-class-name="table-header"
      >
        <!-- <el-table-column align="center" label="序号" width="55">
          <template v-slot="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column> -->

        <el-table-column
          align="center"
          label="类型id"
          prop="typeId"
        ></el-table-column>

        <el-table-column
          align="center"
          label="类型名称"
          prop="typeName"
        ></el-table-column>

        <el-table-column
          align="center"
          label="标题"
          prop="title"
        ></el-table-column>

        <el-table-column align="center" label="图片" prop="imgUrl" width="350">
          <template v-slot="scope">
            <el-image
              :preview-src-list="[scope.row.imgUrl]"
              :src="scope.row.imgUrl"
              lazy
              style="width: 200px;"
            />
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="链接"
          prop="forwardUrl"
        ></el-table-column>

        <el-table-column align="center" label="创建时间" prop="createTime">
          <template v-slot="{ row }">
            <div>
              <i class="el-icon-time" style="margin-right: 10px"></i>
              {{ row.createTime }}
            </div>
          </template>
        </el-table-column>

        <!-- <el-table-column align="center" label="修改时间" prop="updateTime">
          <template v-slot="{ row }">
            <div>
              <i class="el-icon-time" style="margin-right: 10px"></i>
              {{ row.updateTime }}
            </div>
          </template>
        </el-table-column> -->

        <el-table-column align="center" label="操作" width="200">
          <template v-slot="scope">
            <el-button
              slot="reference"
              @click="handleClick(scope.row, 'query')"
              icon="el-icon-search"
              type="text"
              >详情
            </el-button>
            <el-button
              slot="reference"
              @click="handleClick(scope.row, 'edit')"
              icon="el-icon-edit"
              type="text"
              >编辑
            </el-button>
            <el-popconfirm
              title="确定删除吗？"
              style="margin-left: 10px"
              @confirm="handleDelete(scope.row)"
            >
              <el-button slot="reference" icon="el-icon-delete" type="text"
                >删除
              </el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <BasePagination
        :page-total="pageTotal"
        @getData="getDataList"
      ></BasePagination>
    </div>

    <!-- 新增弹窗 -->
    <el-dialog title="新增" :visible.sync="addDialogVisible" width="45%">
      <AddConsultation
        ref="son1"
        v-if="addDialogVisible"
        :type-list="typeList"
        @addCancel="addCancel"
        @addConfirm="addConfirm"
      />
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog
      :title="dialogType == 'edit' ? '编辑' : '详情'"
      :visible.sync="dialogVisible"
      width="45%"
    >
      <EditConsultation
        ref="son2"
        :form-data="formData"
        v-if="dialogVisible"
        :type-list="typeList"
        :dialog-type="dialogType"
        @confirm="confirm"
        @cancel="cancel"
      />
    </el-dialog>
  </div>
</template>

<script>
import {
  marketInfoTypeList,
  deleteConfig,
  getMarketInfoList
} from "@/api/consultation";
import { dateFormat } from "@/utils/file.js";
import EditConsultation from "./EditConsultation.vue";
import AddConsultation from "./AddConsultation.vue";

export default {
  name: "HtmlPackage",
  components: {
    EditConsultation,
    AddConsultation
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
      typeList: [], // 类型列表
      dialogVisible: false,
      dialogType: "",
      formData: [],
      pageTotal: 0,
      addDialogVisible: false
    };
  },
  mounted() {
    this.getPrdData();
    // this.getList();
    this.getDataList();
  },
  methods: {
    // 获取数字字典
    async getPrdData() {
      try {
        let res = await marketInfoTypeList();
        if (res) {
          this.typeList = res.data;
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    // async getList(query = { pageNum: 1, pageSize: 10 }) {
    //   let params = Object.assign({}, query);
    //   try {
    //     let res = await getConfigList(params);
    //     if (res) {
    //       console.log(res, 22);
    //       this.tableData = res.data.list.map(i => {
    //         return {
    //           ...i,
    //           createTime: i.createTime
    //             ? dateFormat(i.createTime, "yyyy-mm-dd HH:MM:ss")
    //             : "--",
    //           updateTime: i.updateTime
    //             ? dateFormat(i.updateTime, "yyyy-mm-dd HH:MM:ss")
    //             : "--"
    //         };
    //       });
    //       this.pageTotal = res.data.total;
    //     }
    //   } catch (e) {
    //     throw new Error(e);
    //   }
    // },
    async getDataList(query = { pageNum: 1, pageSize: 10 }) {
      let params = Object.assign({}, query);
      try {
        let res = await getMarketInfoList(params);
        if (res) {
          console.log(res, 11);
          this.tableData = res.data.list.map(i => {
            return {
              ...i,
              createTime: i.createTime
                ? dateFormat(i.createTime, "yyyy-mm-dd HH:MM:ss")
                : "--",
              updateTime: i.updateTime
                ? dateFormat(i.updateTime, "yyyy-mm-dd HH:MM:ss")
                : "--"
            };
          });
          this.pageTotal = res.data.total;
        }
      } catch (e) {
        throw new Error(e);
      }
    },
    statusValueForce(target) {
      switch (target) {
        case 1:
          return "启用";
        case 0:
          return "停用";
        default:
          return "停用";
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
    // 新增弹窗关闭
    addCancel() {
      this.$refs.son1.$refs.addForm.resetFields();
      this.addDialogVisible = false;
    },
    // 新增确认
    addConfirm() {
      this.$refs.son1.$refs.addForm.resetFields();
      this.getDataList();
      this.addDialogVisible = false;
    },
    // 详情与修改弹窗
    cancel() {
      this.$refs.son2.$refs.dialogForm.resetFields();
      this.dialogVisible = false;
    },
    // 详情与修改弹窗
    confirm() {
      this.$refs.son2.$refs.dialogForm.resetFields();
      this.getDataList();
      this.dialogVisible = false;
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
      // this.getData();
    },
    // 新增推送
    handleAdd() {
      this.$refs.ApkPckUpload.showDialog();
    },
    // 查看详情按钮
    handleClick(row, type) {
      this.formData = row;
      this.dialogType = type;
      this.dialogVisible = true;
    },
    async handleDelete({ id }) {
      try {
        let res = await deleteConfig({ id });
        if (res.message === "请求成功") {
          this.$message.success("删除成功");
          await this.getDataList();
        }
      } catch (e) {
        throw new Error(e);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  max-height: 597px;
  overflow-y: auto;
}
</style>
