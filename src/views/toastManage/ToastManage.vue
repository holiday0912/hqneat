<template>
  <div class="container">
    <div class="handle-box">
      <el-row>
        <el-form ref="searchRorm" :model="searchForm" label-width="120px">
          <el-col :span="6">
            <el-form-item label="标题" prop="title">
              <el-input v-model="searchForm.title"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="内容" prop="property">
              <el-input v-model="searchForm.property"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="类型" prop="type">
              <el-input v-model="searchForm.type"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="状态" prop="status">
              <el-select v-model="searchForm.status" placeholder="请选择">
                <el-option
                  v-for="item in ToastStatus"
                  :key="item.key"
                  :label="item.val"
                  :value="item.key"
                />
              </el-select>
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
        ></el-table-column>

        <!--操作人员-->
        <el-table-column
          align="center"
          label="操作人员"
          prop="createUserName"
        ></el-table-column>

        <!--更新时间-->
        <el-table-column
          align="center"
          label="更新时间"
          prop="updateTime"
        ></el-table-column>

        <!--状态-->
        <el-table-column align="center" label="状态" prop="status">
          <template v-slot="{ row }">
            <el-tag :type="row.status.color">{{ row.status.val }} </el-tag>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作">
          <template v-slot="{ row }">
            <el-button
              :disabled="row.status === '删除审核中' || row.status === '审核中'"
              icon="el-icon-delete"
              type="text"
              @click="handleDelete(row)"
              >删除
            </el-button>
            <el-button
              :disabled="row.status !== '复核生效' || row.status !== '复核拒绝'"
              icon="el-icon-edit"
              type="text"
              @click="handleEdit(row)"
              >编辑
            </el-button>
            <el-button
              icon="el-icon-check"
              type="text"
              @click="handleAppro(row)"
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

    <ToastEdit ref="toastEdit" @refresh="getData"></ToastEdit>
    <ToastAddNew ref="toastAddNew" @refresh="getData"></ToastAddNew>
    <ToastApproval ref="toastApproval" @refresh="getData"></ToastApproval>
  </div>
</template>

<script>
import { toastDeleteById, toastManageList } from "@/api/toastManage";
import ToastEdit from "@/views/toastManage/ToastEdit.vue";
import ToastAddNew from "@/views/toastManage/ToastAddNew.vue";
import ToastApproval from "@/views/toastManage/ToastApproval.vue";
import { ToastStatus } from "@/common/enum";

export default {
  name: "roleManage",
  components: {
    ToastEdit,
    ToastAddNew,
    ToastApproval
  },
  data() {
    return {
      searchForm: {
        title: "",
        property: "",
        type: "",
        status: ""
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
      try {
        let res = await toastManageList({ ...params, ...this.searchForm });
        if (res) {
          const { data, total } = res.data;
          this.tableData = data.map(i => {
            return {
              ...i,
              updateTime: i.updateTime
                ? this.$dayjs(i.updateTime)
                : this.$nodata,
              status: this.getStatus(i.status)
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
    },
    getStatus(target) {
      return ToastStatus.find(i => i.key === target);
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
      if (status === "审核通过") {
        this.$confirm(
          "生效状态的提示配置需审核才能删除，是否发起审核？",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then()
          .catch(error => {
            console.log(error);
          });
        return;
      }
      try {
        let res = await toastDeleteById({ id });
        if (res.message === "请求成功") {
          this.$message.success("删除成功");
          await this.getData();
        }
      } catch (e) {
        throw new Error(e);
      }
    },
    handleEdit(val) {
      this.$refs.toastEdit.showDialog(val);
    },
    handleAppro(target) {
      this.$refs.toastApproval.openDrawer(target);
    }
  }
};
</script>
