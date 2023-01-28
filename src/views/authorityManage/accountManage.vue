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
              @click="handleEdit(scope.row)"
              >修改
            </el-button>
            <el-popconfirm
              title="确定删除吗？"
              @confirm="handleDelete(scope.row)"
            >
              <el-button slot="reference" icon="el-icon-delete" type="text"
                >删除
              </el-button>
            </el-popconfirm>
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
        :rules="rules"
        label-width="150px"
      >
        <el-form-item label="用户名" prop="userName">
          <el-input
            v-model="addItem.userName"
            clearable
            placeholder="请输入用户名"
          />
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="addItem.phone"
            :maxlength="11"
            clearable
            placeholder="请输入手机号"
          />
        </el-form-item>

        <el-form-item label="角色" prop="roleIds">
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
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="dialogTitle === '新增账号'"
          label="密码"
          prop="password"
        >
          <el-input
            v-model="addItem.password"
            clearable
            placeholder="请输入密码"
            show-password
            type="password"
          />
        </el-form-item>

        <el-form-item
          v-if="dialogTitle === '新增账号'"
          label="确认密码"
          prop="confirmPassword"
        >
          <el-input
            v-model="addItem.confirmPassword"
            clearable
            placeholder="请输入密码"
            show-password
            type="password"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <el-button type="primary" @click="handleComfire">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addUser,
  deleteUser,
  editItem,
  pageList,
  updateUserRoleById
} from "@/api/system/sysUser";
import { list } from "@/api/system/sysRole";
import { updateMenuMethod } from "@/common/toolFunc";
import { phoneValid } from "@/config";
import { md5 } from "@/utils/md5";

export default {
  name: "AccountManage",
  data() {
    const comPswRule = (rule, value, callback) => {
      if (this.addItem.password !== "") {
        if (value !== this.addItem.password) {
          callback(new Error("两次密码输入不一致"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
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
        userName: "", // 用户名
        id: "",
        confirmPassword: ""
      },
      roleList: [], // 角色列表
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: phoneValid,
            message: "请输入正确的号码格式",
            trigger: "change"
          }
        ],
        roleIds: [
          { required: true, message: "请选择需要绑定的角色", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码" },
          {
            // pattern: pasValid,
            message: "密码必须为8-16位的大写字母、小写字母、数字组合",
            trigger: "blur"
          }
        ],
        confirmPassword: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
          {
            // pattern: pasValid,
            message: "密码必须为8-16位的大写字母、小写字母、数字组合",
            trigger: "blur"
          },
          { validator: comPswRule, trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getData();
    this.searchRoleList();
  },
  methods: {
    // 查询角色列表
    searchRoleList() {
      list({}).then(res => {
        if (res) {
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
      // this.searchRoleList();
    },
    // 编辑账号
    handleEdit({ phone, roleNames, userName, id }) {
      this.dialogTitle = "修改账号";
      this.addItem.phone = phone;
      this.addItem.roleIds = roleNames.split(",").map(i => {
        return this.roleList.find(inner => inner.roleName === i).id;
      });
      this.addItem.userName = userName;
      this.addItem.id = id;
      this.dialogFormVisible = true;
    },
    // 删除账号
    async handleDelete({ id }) {
      try {
        let res = await deleteUser({ id });
        if (res?.code.slice(-5) === "00000") {
          this.$message.success("删除成功");
          this.handleSearch();
        } else {
          this.$message.error("请稍后重试");
        }
      } catch (e) {
        throw new Error(e);
      }
    },
    // 关闭弹窗
    dialogClose() {
      this.dialogFormVisible = false;
      this.addItem = {
        password: "", // 登入密码
        confirmPassword: "", // 登入密码
        phone: "", // 手机号
        roleIds: "", // 角色id
        userName: "" // 用户名
      };
    },
    // 新增资源提交
    handleComfire() {
      this.$refs.add.validate(async valid => {
        if (valid) {
          let obj = JSON.parse(JSON.stringify(this.addItem));
          obj.roleIds = obj.roleIds.length > 0 ? obj.roleIds.join(",") : "";
          if (this.dialogTitle === "修改账号") {
            delete obj.password;
            try {
              let res = await Promise.allSettled([
                editItem(obj),
                updateUserRoleById({ userId: obj.id, roleIds: obj.roleIds })
              ]);
              if (res.every(i => i.status === "fulfilled")) {
                this.$message.success("修改成功");
                this.dialogClose();
                this.handleSearch();
                await updateMenuMethod();
              }
            } catch (error) {
              throw new Error(error);
            }
          } else {
            delete obj.id;
            delete obj.confirmPassword;
            obj.password = md5(obj.password);
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
