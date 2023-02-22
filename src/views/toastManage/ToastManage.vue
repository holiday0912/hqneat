<template>
  <div class="flex-wp">
    <div class="left">
      <h3 class="title">状态</h3>
      <ul>
        <li
          v-for="item in ToastStatus"
          :key="item.key"
          class="items"
          @click="statusBarClick(item.key)"
        >
          <span
            :style="{ backgroundColor: item.oColor }"
            class="status-flag"
          ></span>
          <span>{{ item.val }}</span>
        </li>
      </ul>
    </div>

    <div class="right">
      <el-row>
        <el-form ref="searchRorm" :model="searchForm" label-width="120px">
          <el-col :span="6">
            <el-form-item label="内容" prop="property">
              <el-input v-model="searchForm.property"></el-input>
            </el-form-item>
          </el-col>
        </el-form>
        <el-col :span="8" style="margin-left: 20px">
          <div class="handle-box">
            <el-button icon="el-icon-refresh" @click="formRest">重置</el-button>
            <el-button
              icon="el-icon-search"
              type="primary"
              @click="handleSearch"
              >查询
            </el-button>
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

        <!--业务类型-->
        <el-table-column align="center" label="业务类型" prop="serviceTypeName">
        </el-table-column>

        <!--温馨提示内容-->
        <el-table-column
          align="center"
          label="温馨提示内容"
          prop="property"
          show-overflow-tooltip
        ></el-table-column>

        <!--操作人员-->
        <el-table-column
          align="center"
          label="操作人员"
          prop="createUserName"
        ></el-table-column>

        <!--更新时间-->
        <el-table-column
          :sortable="true"
          align="center"
          label="更新时间"
          prop="updateTime"
        >
          <template v-slot="{ row }">
            <div>
              <i class="el-icon-time" style="margin-right: 10px"></i>
              {{ row.updateTime }}
            </div>
          </template>
        </el-table-column>

        <!--状态-->
        <el-table-column align="center" label="状态" prop="status">
          <template v-slot="{ row }">
            <el-tag v-if="row.status" :type="row.status.color"
              >{{ row.status.val }}
            </el-tag>
            <div v-else>{{ $nodata }}</div>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作">
          <template v-slot="{ row }">
            <el-button
              :disabled="
                row.status.val === '删除审核中' ||
                  row.status.val === '审核中' ||
                  row.status.val === '审核通过'
              "
              icon="el-icon-delete"
              type="text"
              @click="handleDelete(row)"
              >删除
            </el-button>
            <el-button
              :disabled="
                row.status.val === '删除审核中' ||
                  row.status.val === '审核中' ||
                  row.status.val === '审核通过'
              "
              icon="el-icon-edit"
              type="text"
              @click="handleEdit(row)"
              >编辑
            </el-button>
            <el-button
              :disabled="row.status.val === '审核通过'"
              icon="el-icon-check"
              type="text"
              @click="handleAppro(row)"
              >审核
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <BasePagination
        :page-total="pageTotal"
        @getData="getData"
      ></BasePagination>
    </div>

    <ToastEdit ref="toastEdit" @refresh="getData"></ToastEdit>
    <ToastAddNew ref="toastAddNew" @refresh="getData"></ToastAddNew>
    <ToastApproval ref="toastApproval" @refresh="getData"></ToastApproval>
  </div>
</template>

<script>
import {
  recheckTips,
  toastDeleteById,
  toastManageList
} from "@/api/toastManage";
import ToastEdit from "@/views/toastManage/ToastEdit.vue";
import ToastAddNew from "@/views/toastManage/ToastAddNew.vue";
import ToastApproval from "@/views/toastManage/ToastApproval.vue";
import { ToastStatus } from "@/common/enum";

export default {
  name: "RoleManage",
  components: {
    ToastEdit,
    ToastAddNew,
    ToastApproval
  },
  data() {
    return {
      searchForm: {
        // title: "",
        property: undefined,
        // type: "",
        status: undefined
      },
      tableData: [],
      pageTotal: 0,
      ToastStatus: ToastStatus
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData(query = { pageNum: 1, pageSize: 10 }) {
      const params = {
        current: query.pageNum,
        size: query.pageSize
      };
      const searchForm = JSON.parse(JSON.stringify(this.searchForm));
      try {
        let res = await toastManageList({ ...params, ...searchForm });
        if (res) {
          const { data, total } = res.data;
          this.tableData = data.map(i => {
            return {
              ...i,
              updateTime: i.updateTime
                ? this.$dayjs(i.updateTime)
                : this.$nodata,
              status: ToastStatus.find(o => o.key === i.status)
            };
          });
          this.pageTotal = total;
        }
      } catch (e) {
        throw new Error(e);
      }
    },
    formRest() {
      this.$refs.searchRorm.resetFields();
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
    // 新增推送
    handleAdd() {
      this.$refs.toastAddNew.showDialog();
    },
    // 删除toast
    async handleDelete({ id, status }) {
      if (status.val === "复核生效") {
        this.$confirm(
          "生效状态的提示配置需审核才能删除，是否发起审核？",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(async () => {
            try {
              let res = await recheckTips({
                id: id,
                status: "3",
                isDeleted: "1"
              });
              if (res) {
                this.approvalLoading = false;
                this.getData();
                this.$notify({
                  title: "提示",
                  message: "删除请求提交成功",
                  type: "success"
                });
              }
            } catch (error) {
              this.approvalLoading = false;
              throw new Error(error);
            }
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        try {
          let res = await toastDeleteById({ id });
          if (res.message === "请求成功") {
            this.$message.success("删除成功");
            await this.getData();
          }
        } catch (e) {
          throw new Error(e);
        }
      }
    },
    handleEdit(val) {
      this.$refs.toastEdit.showDialog(val);
    },
    handleAppro(target) {
      this.$refs.toastApproval.openDrawer(target);
    },
    statusBarClick(target) {
      this.searchForm.status = target;
      this.handleSearch();
    }
    // async DeleteApprove(target) {
    //   this.$confirm(
    //     "生效状态的提示配置需审核才能删除，是否发起审核？",
    //     "提示",
    //     {
    //       confirmButtonText: "确定",
    //       cancelButtonText: "取消",
    //       type: "warning"
    //     }
    //   )
    //     .then()
    //     .catch(error => {
    //       console.log(error);
    //     });
    // }
  }
};
</script>

<style>
.flex-wp {
  display: flex;
  min-height: 100%;
}

.left {
  background-color: #fff;
  padding: 16px;
  border-radius: 4px;
  margin-right: 12px;
}

.title {
  font-size: 14px;
  color: #606266;
  margin-bottom: 16px;
}

.items {
  width: 120px;
  list-style-type: none;
  font-size: 12px;
  color: #606266;
  line-height: 30px;
  cursor: pointer;
}

.items:hover {
  background-color: #f6f8fa;
}

.right {
  flex: 1;
  background-color: #fff;
  padding: 16px;
  border-radius: 4px;
}

.status-flag {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  vertical-align: middle;
  margin-right: 10px;
}
</style>
