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
          <!-- <el-col :span="6">
            <el-form-item label="是否启用" prop="isEnabled">
              <el-select
                style="width: 100%"
                v-model="searchForm.isEnabled"
                clearable
                placeholder="请选择启用状态"
              >
                <el-option
                  v-for="(item, index) in isEnabledList"
                  :key="index"
                  :label="item.code + '-' + item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
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
          label="角色名称"
          prop="roleName"
        ></el-table-column>
        <el-table-column
          align="center"
          label="角色描述"
          prop="roleDesc"
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
            <!-- <el-button
              type="text"
              icon="el-icon-document"
              @click="handleDetail(scope.$index, scope.row)"
              >详情</el-button
            > -->
            <el-button
              icon="el-icon-edit"
              type="text"
              @click="handleEdit(scope.$index, scope.row)"
              >修改
            </el-button>
            <el-button
              icon="el-icon-setting"
              type="text"
              @click="handleSet(scope.$index, scope.row)"
              >绑定资源
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
    <!-- 新增角色 -->
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
                  message: '请输入角色名称',
                  trigger: 'blur'
                }
              ]"
              label="角色名称"
              prop="roleName"
            >
              <el-input
                v-model="addItem.roleName"
                clearable
                placeholder="请输入角色名称"
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
                  message: '请输入角色描述',
                  trigger: 'blur'
                }
              ]"
              label="角色描述"
              prop="roleDesc"
            >
              <el-input
                v-model="addItem.roleDesc"
                clearable
                placeholder="请输入角色描述"
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
    <!-- 角色绑定资源 -->
    <el-dialog
      v-dialogDrag
      :close-on-click-modal="false"
      :title="dialogTitle"
      :visible.sync="dialogFormEditVisible"
      width="680px"
      @close="dialogEditClose"
    >
      <el-form
        v-if="dialogFormEditVisible"
        ref="edit"
        :model="resourceInfo"
        label-width="150px"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="角色名称">
              <el-input
                v-model="resourceInfo.roleName"
                disabled
                placeholder="请输入角色名称"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="角色描述" prop="roleDesc">
              <el-input
                v-model="resourceInfo.roleDesc"
                disabled
                placeholder="请输入角色描述"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="绑定资源" prop="resourceList">
              <el-tree
                ref="tree"
                :data="resourceInfo.resourceList"
                :default-checked-keys="checkedKeys"
                :default-expanded-keys="expandedKeys"
                :props="props"
                node-key="resourceId"
                show-checkbox
              >
              </el-tree>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditClose">取 消</el-button>
        <el-button type="primary" @click="handleAuthComfire">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addItem, deleteBatch, editItem, pageList } from "@/api/system/sysRole";
import { authResource, queryResourceTree } from "@/api/system/sysRoleResource";
import { updateMenuMethod } from "@/common/toolFunc";

export default {
  name: "roleManage",
  data() {
    return {
      query: {
        pageNum: 1,
        pageSize: 10
      },
      searchForm: {
        roleName: "", // 角色名称
        roleDesc: "", // 角色描述
        isEnabled: "" // 角色是否启用
      },
      isEnabledList: [
        {
          code: false,
          name: "停用"
        },
        {
          code: true,
          name: "启用"
        }
      ],
      tableData: [],
      pageTotal: 0,
      dialogFormVisible: false,
      dialogTitle: "",
      addItem: {
        roleName: "", // 角色名称
        roleDesc: "" // 角色描述
      },
      dialogFormEditVisible: false,
      resourceInfo: {
        roleName: "", // 角色名称
        roleDesc: "", // 角色描述
        roleId: "", // 角色id
        resourceIdMd5: "", // 角色的Md5
        resourceList: [] // 角色列表
      },
      checkedKeys: [], // 默认选中的id
      expandedKeys: [], // 默认展开的节点
      props: {
        label: "resourceName",
        children: "resources"
      }
    };
  },
  components: {},
  computed: {},
  mounted() {
    this.getData();
  },
  methods: {
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
    // 新增资源
    handleAdd() {
      this.dialogTitle = "新增角色";
      this.dialogFormVisible = true;
    },
    // 修改角色信息
    handleEdit(index, row) {
      this.dialogTitle = "修改信息";
      this.addItem = {
        id: row.id,
        roleName: row.roleName, // 角色名称
        roleDesc: row.roleDesc // 角色描述
      };
      this.dialogFormVisible = true;
    },
    // 关闭弹窗
    dialogClose() {
      this.dialogFormVisible = false;
      this.addItem = {
        roleName: "", // 角色名称
        roleDesc: "" // 角色描述
      };
    },
    // 寻找选中的资源
    findChecked(arr) {
      if (arr && arr.length > 0) {
        arr.forEach(item => {
          if (item.selected) {
            this.checkedKeys.push(item.resourceId);
          }
          if (item.resources && item.resources.length > 0) {
            this.expandedKeys.push(item.resourceId);
            this.findChecked(item.resources);
          }
        });
      }
    },
    // 绑定资源
    handleSet(index, row) {
      this.dialogTitle = "绑定资源";
      queryResourceTree({ roleId: row.id }).then(res => {
        if (res) {
          this.resourceInfo = {
            roleName: row.roleName, // 角色名称
            roleDesc: row.roleDesc, // 角色描述
            roleId: row.id, // 角色id
            resourceIdMd5: row.resourceIdMd5, // 角色的Md5
            resourceList: res.data // 角色列表
          };
          this.checkedKeys = [];
          this.expandedKeys = [];
          this.findChecked(res.data);
          // this.resourceInfo.resourceList = res.body
          this.dialogFormEditVisible = true;
        }
      });
    },
    // 授权提交按钮authResource
    handleAuthComfire() {
      let idArr = this.$refs.tree.getCheckedKeys();
      if (idArr && idArr.length === 0) {
        this.$message.warning("请选择需要绑定的资源");
        return false;
      }
      let idArrs = [];
      idArr.forEach(item => {
        idArrs.push(item.toString());
      });
      let obj = {
        resourceIdMd5: this.resourceInfo.resourceIdMd5,
        roleId: this.resourceInfo.roleId,
        resourceIds: idArrs.join(",")
      };
      authResource(obj).then(async res => {
        if (res) {
          this.$message.success("授权成功");
          this.dialogEditClose();
          this.getData();
          await updateMenuMethod();
        }
      });
    },
    // 授权弹窗关闭
    dialogEditClose() {
      this.dialogFormEditVisible = false;
      this.resourceInfo = {
        roleName: "", // 角色名称
        roleDesc: "", // 角色描述
        roleId: "", // 角色id
        resourceIdMd5: "", // 角色的Md5
        resourceList: [] // 角色列表
      };
      this.checkedKeys = []; // 默认选中的id
      this.expandedKeys = []; // 默认展开的节点
    },
    // 新增角色提交
    handleComfire() {
      this.$refs.add.validate(valid => {
        if (valid) {
          if (this.dialogTitle === "新增角色") {
            addItem(this.addItem).then(res => {
              if (res) {
                this.$message.success("新增成功");
                this.dialogClose();
                this.handleSearch();
              }
            });
          } else {
            editItem(this.addItem).then(res => {
              if (res) {
                this.$message.success("修改成功");
                this.dialogClose();
                this.handleSearch();
              }
            });
          }
        }
      });
    },
    // 删除角色
    handleDelete(index, row) {
      this.$confirm("您确定要删除" + row.roleName + "角色么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let arr = [row.id];
          deleteBatch(arr).then(res => {
            if (res) {
              this.$message.success("删除成功");
              this.getData();
            }
          });
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
