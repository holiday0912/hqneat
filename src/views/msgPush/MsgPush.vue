<template>
  <div class="container">
    <div class="handle-box">
      <el-form ref="searchRorm" :model="searchForm" label-width="120px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="通知栏提示文字" prop="ticker">
              <el-input v-model="searchForm.ticker"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="标题" prop="title">
              <el-input v-model="searchForm.title"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="内容" prop="content">
              <el-input v-model="searchForm.content"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div style="display: inline-block">
        <div style="margin-left: 10px; display: inline-block">
          <el-button icon="el-icon-refresh" @click="formRest">重置</el-button>
        </div>
        <div style="margin-left: 10px; display: inline-block">
          <el-button icon="el-icon-search" type="primary" @click="handleSearch"
            >查询
          </el-button>
        </div>
        <div style="margin-left: 10px; display: inline-block">
          <el-button icon="el-icon-plus" type="primary" @click="handleAdd"
            >新增
          </el-button>
        </div>
      </div>

      <div class="handle-box"></div>

      <el-table
        ref="multipleTable"
        :data="tableData"
        border
        class="table"
        header-cell-class-name="table-header"
      >
        <el-table-column
          :formatter="(row, column, val, index) => index + 1"
          align="center"
          label="序号"
          width="55"
        >
        </el-table-column>
        <!-- <el-table-column
          align="center"
          label="账号ID"
          prop="id"
        ></el-table-column> -->

        <el-table-column
          align="center"
          label="标题"
          prop="title"
        ></el-table-column>

        <el-table-column
          align="center"
          label="内容"
          prop="content"
        ></el-table-column>

        <el-table-column
          align="center"
          label="通知栏提示文字"
          prop="ticker"
        ></el-table-column>

        <el-table-column
          align="center"
          label="分组"
          prop="filterGroup"
        ></el-table-column>

        <el-table-column
          :sortable="true"
          align="center"
          label="创建时间"
          prop="createTime"
        >
          <template v-slot="{ row }">
            <div>
              <i class="el-icon-time" style="margin-right: 10px"></i>
              {{ row.createTime }}
            </div>
          </template>
        </el-table-column>

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
        <el-table-column align="center" label="操作" width="190">
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
              >修改
            </el-button>

            <el-popconfirm
              title="确定发送吗？"
              @confirm="handleSend(scope.row)"
            >
              <el-button slot="reference" icon="el-icon-position" type="text"
                >发送
              </el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <BasePagination
        :page-total="pageTotal"
        @getdata="getData"
      ></BasePagination>
    </div>

    <MsgAddNew ref="msgAddNew" @refresh="getData"></MsgAddNew>
    <MsgPushEdit ref="msgPushEdit" @refresh="getData"></MsgPushEdit>
  </div>
</template>

<script>
import { deletePush, msgPushList, sendPush } from "@/api/msgPush";
import MsgAddNew from "@/views/msgPush/MsgAddNew";
import MsgPushEdit from "@/views/msgPush/MsgPushEdit.vue";

export default {
  name: "MsgPush",
  components: {
    MsgAddNew,
    MsgPushEdit
  },
  data() {
    return {
      searchForm: {
        title: "",
        content: "",
        ticker: ""
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
        let res = await msgPushList(obj);
        if (res) {
          this.tableData = res.list.map(i => {
            return {
              ...i,
              createTime: this.$dayjs(i.createTime),
              updateTime: i.updateTime
                ? this.$dayjs(i.updateTime)
                : this.$nodata
            };
          });
          this.pageTotal = res.total;
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
    // 新增推送消息
    handleAdd() {
      this.$refs.msgAddNew.showDialog();
    },
    // 删除推送消息
    async handleDelete({ id }) {
      try {
        let res = await deletePush(id);
        if (res.message === "请求成功") {
          this.$message.success("删除成功");
          await this.getData();
        }
      } catch (e) {
        throw new Error(e);
      }
    },
    // 发布消息
    async handleSend({ id }) {
      try {
        let res = await sendPush(id);
        if (res.message === "请求成功") {
          this.$message.success("发送成功");
          await this.getData();
        }
      } catch (e) {
        throw new Error(e);
      }
    },
    handleEdit(val) {
      this.$refs.msgPushEdit.showDialog(val);
    }
  }
};
</script>
