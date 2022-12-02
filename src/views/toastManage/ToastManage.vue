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

        <!--标题-->
        <el-table-column align="center" label="标题" prop="tittle">
        </el-table-column>

        <!--属性-->
        <el-table-column
          align="center"
          label="内容"
          prop="property"
        ></el-table-column>

        <!--类型-->
        <el-table-column
          align="center"
          label="类型"
          prop="type"
        ></el-table-column>

        <!--样式-->
        <el-table-column
          align="center"
          label="样式"
          prop="picPath"
        ></el-table-column>

        <el-table-column align="center" label="操作" width="150">
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
              icon="el-icon-edit"
              type="text"
              @click="handleEdit(scope.row)"
              >编辑
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
  </div>
</template>

<script>
import { toastDeleteById, toastManageList } from "@/api/toastManage";
import ToastEdit from "@/views/toastManage/ToastEdit.vue";
import ToastAddNew from "@/views/toastManage/ToastAddNew.vue";

export default {
  name: "roleManage",
  components: {
    ToastEdit,
    ToastAddNew
  },
  data() {
    return {
      searchForm: {
        title: "",
        property: "",
        type: ""
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
              createTime: this.$dayjs(i.createTime),
              updateTime: this.$dayjs(i.updateTime)
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
    async handleDelete({ id }) {
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
    }
  }
};
</script>
