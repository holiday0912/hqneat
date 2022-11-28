<template>
  <div class="container">
    <div class="handle-box">
      <el-form ref="searchRorm" :model="searchForm" label-width="120px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="账户名" prop="userName">
              <el-input v-model="searchForm.userName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="searchForm.phone"></el-input>
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
          label="账号名称"
          prop="userName"
        ></el-table-column>
        <el-table-column
          align="center"
          label="手机号"
          prop="phone"
        ></el-table-column>
        <el-table-column
          align="center"
          label="角色名称"
          prop="roleNames"
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
              icon="el-icon-edit"
              type="text"
              @click="handleEdit(scope.$index, scope.row)"
              >修改
            </el-button>
            <el-button
              icon="el-icon-delete"
              type="text"
              @click="handleDelete(scope.$index, scope.row)"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          :current-page="query.pageNum"
          :page-size="query.pageSize"
          :page-sizes="[10, 20, 30, 40, 50]"
          :total="pageTotal"
          background
          layout="sizes, total, prev, pager, next"
          @current-change="handlePageChange"
          @size-change="hanleSizeChange"
        ></el-pagination>
      </div>
    </div>
    <el-dialog
      v-dialogDrag
      :close-on-click-modal="false"
      :title="dialogTitle"
      :visible.sync="dialogFormVisible"
      width="680px"
      @close="dialogClose"
    >
      <el-form
        v-if="dialogFormVisible"
        ref="add"
        :model="addItem"
        label-width="150px"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item
              :rules="[
                {
                  required: true,
                  message: '请输入用户名',
                  trigger: 'blur'
                }
              ]"
              label="用户名"
              prop="userName"
            >
              <el-input
                v-model="addItem.userName"
                clearable
                placeholder="请输入用户名"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              :rules="[
                {
                  required: true,
                  message: '请输入手机号',
                  trigger: 'blur'
                },
                {
                  pattern: /^1[3|5|7|8|9]\d{9}$/,
                  message: '请输入正确的号码格式',
                  trigger: 'change'
                }
              ]"
              label="手机号"
              prop="phone"
            >
              <el-input
                v-model="addItem.phone"
                clearable
                placeholder="请输入手机号"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              :rules="[
                {
                  required: true,
                  message: '请选择需要绑定的角色',
                  trigger: 'blur'
                }
              ]"
              label="角色"
              prop="roleIds"
            >
              <el-select
                v-model="addItem.roleIds"
                clearable
                filterable
                multiple
                placeholder="请选择需要绑定的角色"
                style="width: 100%"
              >
                <el-option
                  v-for="item in roleList"
                  :key="item.id"
                  :label="
                    item.roleDesc
                      ? item.roleName + '-' + item.roleDesc
                      : item.roleName
                  "
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="密码" prop="password">
              <el-input
                v-model="addItem.password"
                clearable
                placeholder="请输入密码"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <el-button type="primary" @click="handleComfire">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addUser, editItem, pageList } from "../../api/system/sysUser";
import { list } from "../../api/system/sysRole";

export default {
  name: "accountManage",
  data() {
    return {
      query: {
        pageNum: 1,
        pageSize: 10
      },
      searchForm: {
        userName: "", // 用户名
        phone: "" // 手机号
      },
      tableData: [],
      pageTotal: 0,
      dialogTitle: "",
      dialogFormVisible: false,
      addItem: {
        password: "", // 登入密码
        phone: "", // 手机号
        roleIds: "", // 角色id
        userName: "" // 用户名
      },
      roleList: [] // 角色列表
    };
  },
  components: {},
  computed: {},
  mounted() {},
  methods: {
    // 查询角色列表
    searchRoleList() {
      list({}).then(res => {
        if (res) {
          console.log(res);
          this.roleList = res.data;
        }
      });
    },
    // 表单重置
    formRest() {
      this.$refs.searchRorm.resetFields();
    },
    getData() {
      let obj = Object.assign(this.query, this.searchForm);
      pageList(obj).then(res => {
        if (res) {
          this.tableData = res.data.list;
          this.pageTotal = res.data.total;
        }
      });
      // roleListByUserId({userId: 1}).then((res) => {
      //   if (res) {
      //     console.log(res)
      //   }
      // })
    },
    // 列表查询
    handleSearch() {
      this.query = {
        pageNum: 1,
        pageSize: 10
      };
      this.getData();
    },
    // 分页导航
    handlePageChange(val) {
      this.$set(this.query, "pageNum", val);
      this.getData();
    },
    // 改变页码
    hanleSizeChange(val) {
      this.$set(this.query, "pageSize", val);
      if (this.tableData.length > 0) {
        this.getData();
      }
    },
    // 新增
    handleAdd() {
      this.dialogTitle = "新增账号";
      this.dialogFormVisible = true;
      this.searchRoleList();
    },
    // 关闭弹窗
    dialogClose() {
      this.dialogFormVisible = false;
      this.addItem = {
        password: "", // 登入密码
        phone: "", // 手机号
        roleIds: "", // 角色id
        userName: "" // 用户名
      };
    },
    // 新增资源提交
    handleComfire() {
      this.$refs.add.validate(valid => {
        if (valid) {
          let obj = JSON.parse(JSON.stringify(this.addItem));
          obj.roleIds = obj.roleIds.length > 0 ? obj.roleIds.join(",") : "";
          if (this.dialogTitle === "修改账号") {
            editItem(obj).then(res => {
              if (res) {
                this.$message.success("修改成功");
                this.dialogClose();
                this.handleSearch();
              }
            });
          } else {
            addUser(obj).then(res => {
              if (res) {
                this.$message.success("新增成功");
                this.dialogClose();
                this.handleSearch();
              }
            });
          }
        }
      });
    }
  }
};
</script>
