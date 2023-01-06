<template>
  <div class="container">
    <div class="handle-box">
      <el-form ref="searchform" :model="searchForm" label-width="120px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="状态" prop="status">
              <el-select v-model="searchForm.status" placeholder="请选择">
                <el-option
                  v-for="item in carouStatus"
                  :key="item.key"
                  :label="item.val"
                  :value="item.key"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <div style="margin-left: 50px; display: inline-block">
              <el-button icon="el-icon-refresh" @click="formReset"
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

      <el-row>
        <el-col :span="8" style="margin-left: 20px">
          <div class="handle-box">
            <el-button icon="el-icon-plus" type="primary" @click="handleAdd"
              >新增
            </el-button>
          </div>
        </el-col>
      </el-row>

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

        <!--图片地址-->
        <el-table-column align="center" label="图片地址" prop="imgUrl">
          <template v-slot="scope">
            <el-image
              :preview-src-list="[scope.row.imgUrl]"
              :src="scope.row.imgUrl"
              lazy
              style="width: 350px;"
            />
          </template>
        </el-table-column>

        <!--导航地址-->
        <el-table-column
          align="center"
          label="导航地址"
          prop="forwardUrl"
        ></el-table-column>

        <!--广告名-->
        <el-table-column
          align="center"
          label="广告名"
          prop="adName"
          width="120"
        ></el-table-column>

        <!--是否登录-->
        <el-table-column
          align="center"
          label="是否登录"
          prop="isLogin"
          width="80"
        >
          <template v-slot="scope">
            {{ scope.row.isLogin === 1 ? "是" : "否" }}
          </template>
        </el-table-column>

        <!--状态-->
        <el-table-column align="center" label="状态" prop="status" width="80">
          <template v-slot="{ row }">
            {{ row.status | getStatus }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="180">
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
              icon="el-icon-edit"
              type="text"
              @click="handleEdit(scope.row)"
              >编辑
            </el-button>
            <!-- v-if="scope.row.status !== '2'" -->
            <el-button
              icon="el-icon-check"
              type="text"
              @click="handleAppro(scope.row)"
              >审核
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <BasePagination
        :pageTotal="pageTotal"
        @getData="getData"
      ></BasePagination>
    </div>

    <el-dialog
      v-dialogDrag
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      title="轮播图审核"
      width="680px"
      @close="dialogEditClose"
    >
      <el-image
        :preview-src-list="[imgUrl]"
        :src="imgUrl"
        style="width: 350px;"
      />
      <el-form ref="approForm" :model="form" label-width="100px">
        <el-form-item
          :rules="[{ required: true, message: '请选择' }]"
          label="审核："
          prop="approvalStatus"
        >
          <el-select
            v-model="form.approvalStatus"
            clearable
            placeholder="请选择"
          >
            <el-option label="不通过" value="1">不通过</el-option>
            <el-option label="通过" value="2">通过</el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div style="text-align: right;">
        <el-button type="primary" @click="approval">审核</el-button>
      </div>
    </el-dialog>

    <CarouselEdit ref="carouselEdit" @refresh="getData"></CarouselEdit>
    <CarouselAddNew ref="carouselAddNew" @refresh="getData"></CarouselAddNew>
  </div>
</template>

<script>
import CarouselEdit from "@/views/carouselManage/CarouselEdit.vue";
import CarouselAddNew from "@/views/carouselManage/CarouselAddNew.vue";
import {
  carouselImgDeleteVersion,
  carouselImgList,
  checkCarouselImg
} from "@/api/carouselManage";
import { carouStatus } from "@/config/enum";

export default {
  name: "carouselManage",
  components: {
    CarouselEdit,
    CarouselAddNew
  },
  data() {
    return {
      searchForm: {
        status: ""
      },
      carouStatus: carouStatus,
      tableData: [],
      pageTotal: 0,
      dialogVisible: false,
      id: "",
      imgUrl: "",
      form: {
        approvalStatus: ""
      }
    };
  },
  mounted() {
    this.getData();
  },
  filters: {
    getStatus(target) {
      return carouStatus.find(i => i.key === target).val;
    }
  },
  methods: {
    async getData(query = { pageNum: 1, pageSize: 10 }) {
      try {
        let res = await carouselImgList({
          ...query,
          ...this.searchForm,
          userId: sessionStorage.getItem("ud")
        });
        if (res.message === "请求成功") {
          this.tableData = res.data.list;
          this.pageTotal = res.data.total;
        } else {
          this.$message.error(res.message);
        }
      } catch (e) {
        throw new Error(e);
      }
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
      this.$refs.carouselAddNew.showDialog();
    },
    handleAppro({ id, imgUrl }) {
      this.id = id;
      this.imgUrl = imgUrl;
      this.dialogVisible = true;
    },
    dialogEditClose() {
      this.dialogVisible = false;
      this.getData();
    },
    approval() {
      this.$refs.approForm.validate(async valid => {
        if (valid) {
          try {
            let res = await checkCarouselImg({
              id: this.id,
              status: this.form.approvalStatus
            });
            if (res.code.slice(-5) === "00000") {
              this.$message.success("审核成功");
              this.dialogEditClose();
            }
          } catch (error) {
            throw new Error(error);
          }
        }
      });
    },
    // 删除toast
    async handleDelete({ id }) {
      try {
        let res = await carouselImgDeleteVersion(id);
        if (res.message === "请求成功") {
          this.$message.success("删除成功");
          await this.getData();
        } else {
          this.$message.error(res.message);
        }
      } catch (e) {
        throw new Error(e);
      }
    },
    handleEdit(val) {
      this.$refs.carouselEdit.showDialog(val);
    },
    formReset() {
      this.$refs.searchform.resetFields();
    }
  }
};
</script>

<style>
.el-dialog__body {
  text-align: center;
}
</style>
