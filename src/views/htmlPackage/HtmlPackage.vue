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
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="账号ID"
          prop="id"
        ></el-table-column>

        <el-table-column
          align="center"
          label="内容"
          prop="content"
        ></el-table-column>

        <el-table-column
          align="center"
          label="创建时间"
          prop="createTime"
        ></el-table-column>
        <el-table-column
          align="center"
          label="更新时间"
          prop="updateTime"
        ></el-table-column>
        <el-table-column align="center" label="操作" width="220">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-delete"
              type="text"
              @click="handleDelete(scope.$index, scope.row)"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <BasePagination @getData="getData"></BasePagination>
    </div>

    <HtmlPckUpload ref="htmlPckUpload"></HtmlPckUpload>
  </div>
</template>

<script>
import { msgPushList } from "@/api/msgPush";
import HtmlPckUpload from "@/views/htmlPackage/HtmlPckUpload";

export default {
  name: "roleManage",
  components: {
    HtmlPckUpload
  },
  data() {
    return {
      searchForm: {
        roleName: "", // 角色名称
        roleDesc: "", // 角色描述
        isEnabled: "" // 角色是否启用
      },
      tableData: [],
      pageTotal: 0
    };
  },
  methods: {
    async getData(query = { pageNum: 1, pageSize: 10 }) {
      let obj = Object.assign(query, this.searchForm);
      try {
        let res = await msgPushList(obj);
        if (res) {
          this.tableData = res.map(i => {
            return {
              ...i,
              createTime: this.$dayjs(i.createTime),
              updateTime: this.$dayjs(i.updateTime)
            };
          });
          this.pageTotal = res.length;
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
    handleDelete() {
      console.log("delete");
    }
  }
};
</script>
