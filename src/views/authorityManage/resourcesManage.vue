<template>
  <div class="container">
    <div class="handle-box">
      <el-form ref="searchRorm" :model="searchForm" label-width="120px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="资源名称" prop="resourceName">
              <el-input v-model="searchForm.resourceName" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="资源类型" prop="type">
              <el-select
                v-model="searchForm.type"
                clearable
                placeholder="请选择资源类型"
                style="width: 100%"
              >
                <el-option
                  v-for="(item, index) in typeList"
                  :key="index"
                  :label="item.code + '-' + item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
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
          >新增一级菜单
        </el-button>
      </div>

      <BaseTable
        ref="resourceTable"
        row-key="resourceId"
        :columns="columns"
        :pageTotal="pageTotal"
        :tableData="tableData"
        :tree-props="{ children: 'children' }"
        @getData="getData"
      >
        <template #ordinal="{scope}">
          <div>
            {{ scope.$index + 1 }}
          </div>
        </template>

        <template #operation="{ scope }">
          <el-button
            v-if="scope.row.type"
            icon="el-icon-document"
            type="text"
            @click="handleAddChild(scope.$index, scope.row)"
            >新增子资源
          </el-button>

          <el-button
            icon="el-icon-edit"
            type="text"
            @click="handleEdit(scope.$index, scope.row)"
            >修改
          </el-button>

          <el-button
            slot="reference"
            icon="el-icon-delete"
            type="text"
            @click="handleDelete(scope.$index, scope.row)"
            >删除
          </el-button>
        </template>
      </BaseTable>
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
        <el-row v-if="dialogTitle === '新增子资源' || addItem.parentId !== 0">
          <el-col :span="24">
            <el-form-item label="父资源名称">
              <el-input v-model="resourceNameF" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              :rules="[
                {
                  required: false,
                  message: '请输入资源id',
                  trigger: 'blur'
                }
              ]"
              label="资源id"
              prop="resourceId"
            >
              <el-input
                v-model="addItem.resourceId"
                clearable
                placeholder="请输入资源id"
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
                  message: '请输入资源名称',
                  trigger: 'blur'
                }
              ]"
              label="资源名称"
              prop="resourceName"
            >
              <el-input
                v-model="addItem.resourceName"
                clearable
                placeholder="请输入资源名称"
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
                  message: '请选择资源类型',
                  trigger: 'change'
                }
              ]"
              label="资源类型"
              prop="type"
            >
              <el-select
                v-model="addItem.type"
                :disabled="dialogTitle === '新增一级菜单'"
                placeholder="请选择资源类型"
                style="width: 100%"
              >
                <el-option
                  v-for="(item, index) in typeList"
                  :key="index"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="addItem.type">
          <el-col :span="24">
            <el-form-item label="菜单路由地址" prop="router">
              <el-input
                v-model="addItem.router"
                clearable
                placeholder="请输入菜单路由地址"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="资源请求后台地址" prop="handlerUrl">
              <el-input
                v-model="addItem.handlerUrl"
                clearable
                placeholder="请输入资源请求后台地址"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="资源描述" prop="resourceDesc">
              <el-input
                v-model="addItem.resourceDesc"
                clearable
                placeholder="请输入资源描述"
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
import {
  addItem,
  deleteBatch,
  editItem,
  pageList
} from "@/api/system/sysResource";

export default {
  name: "accountManage",
  data() {
    return {
      searchForm: {
        resourceName: "", // 资源名称
        type: "" // 资源类型
      },
      tableData: [],
      pageTotal: 0,
      dialogFormVisible: false,
      dialogTitle: "",
      addItem: {
        handlerUrl: "", // 资源对应接口地址
        id: "",
        router: "", // 菜单对应的前端路由
        parentId: 0,
        resourceDesc: "",
        resourceIdentifi: "", // 资源标识
        resourceName: "", // 资源名称
        type: true // 资源类型 false - 按钮 true - 菜单
      },
      resourceNameF: "" // 父资源名称
    };
  },
  computed: {
    typeList() {
      return [
        {
          code: false,
          name: "按钮"
        },
        {
          code: true,
          name: "菜单"
        }
      ];
    },
    columns() {
      return [
        {
          label: "序号",
          width: "55",
          render: "ordinal"
        },
        {
          label: "资源ID",
          prop: "resourceId"
        },
        {
          label: "父资源ID",
          prop: "parentId"
        },
        // {
        //   label: "父资源名称",
        //   prop: "parentResourceName"
        // },
        {
          label: "资源名称",
          prop: "resourceName"
        },
        {
          label: "前端路由",
          prop: "router"
        },
        {
          label: "资源类型",
          prop: "type"
        },
        {
          label: "资源描述",
          prop: "resourceDesc"
        },
        {
          label: "操作",
          render: "operation",
          width: 220
        }
      ];
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    // 表单重置
    formRest() {
      this.$refs.searchRorm.resetFields();
    },
    getData(query = { pageNum: 1, pageSize: 10 }) {
      let obj = { ...query, ...this.searchForm };
      pageList(obj).then(res => {
        if (res) {
          this.tableData = res.data.list.map(i => {
            let temp = {
              ...i,
              type: i.type ? "菜单" : "按钮",
              router: i.router ?? this.$nodata,
              resourceName: i.resourceName ?? this.$nodata,
              parentResourceName: i.parentResourceName ?? this.$nodata,
              parentId: i.parentId ?? this.$nodata,
              resourceId: i.resourceId ?? this.$nodata,
              resourceDesc: i.resourceDesc ?? this.$nodata
            };
            return temp;
          });
          this.pageTotal = res.data.total;
        }
      });
    },
    handleSearch() {
      this.getData(this.$refs.resourceTable.query);
    },
    // 新增资源
    handleAdd() {
      this.dialogTitle = "新增一级菜单";
      this.dialogFormVisible = true;
    },
    // 关闭弹窗
    dialogClose() {
      this.dialogFormVisible = false;
      this.addItem = {
        handlerUrl: "", // 资源对应接口地址
        router: "", // 菜单对应的前端路由
        parentId: 0,
        resourceDesc: "",
        resourceIdentifi: "", // 资源标识
        resourceName: "", // 资源名称
        type: true // 资源类型 false - 按钮 true - 菜单
      };
    },
    // 删除资源
    handleDelete(index, row) {
      this.$confirm("您确定要删除" + row.resourceName + "资源么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let arr = [row.resourceId];
          deleteBatch(arr).then(res => {
            if (res) {
              this.$message.success("删除成功");
              this.handleSearch();
            }
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 增加子资源
    handleAddChild(index, row) {
      this.dialogTitle = "新增子资源";
      this.addItem.parentId = row.resourceId;
      this.resourceNameF = row.resourceName;
      this.dialogFormVisible = true;
    },
    // 修改资源
    handleEdit(index, row) {
      this.dialogTitle = "修改资源";
      this.addItem = JSON.parse(JSON.stringify(row));
      if(row.type === "菜单") {
        this.addItem.type = true
      } else if(row.type === "按钮") {
        this.addItem.type = false
      }
      this.resourceNameF = row.resourceName;
      this.dialogFormVisible = true;
    },
    // 新增资源提交
    handleComfire() {
      this.$refs.add.validate(valid => {
        if (valid) {
          if (this.dialogTitle === "修改资源") {
            editItem(this.addItem).then(res => {
              if (res) {
                this.$message.success("修改成功");
                this.dialogClose();
                this.handleSearch();
              }
            });
          } else {
            addItem(this.addItem).then(res => {
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
