<template>
  <div class="container">
    <div class="handle-box">
      <el-form ref="searchForm" :model="searchForm" label-width="120px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="待办事件" prop="eventName">
              <el-input v-model="searchForm.eventName" placeholder="请输入">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-button
              icon="el-icon-refresh"
              style="margin-left: 50px; display: inline-block"
              @click="formReset"
              >重置
            </el-button>

            <el-button
              icon="el-icon-search"
              style="margin-left: 10px; display: inline-block"
              type="primary"
              @click="handleSearch"
              >查询
            </el-button>
            <el-button icon="el-icon-plus" type="primary" @click="handleAdd">
              新增
            </el-button>
          </el-col>
        </el-row>
      </el-form>

      <BaseTable
        ref="tabbarConTable"
        :columns="columns"
        :pageTotal="pageTotal"
        :tableData="tableData"
        @getData="getData"
      >
        <template #ordinal="{ scope }">
          <div>
            {{ scope.$index + 1 }}
          </div>
        </template>

        <template #iconUrl="{ scope }">
          <img :alt="scope.row.text" :src="scope.row.iconUrl" width="30px" />
        </template>

        <template #selectedIconUrl="{ scope }">
          <img
            :alt="scope.row.text"
            :src="scope.row.selectedIconUrl"
            width="30px"
          />
        </template>

        <template #operation="{ scope }">
          <el-button
            slot="reference"
            icon="el-icon-delete"
            type="text"
            @click="handleDelete(scope.row)"
            >删除
          </el-button>

          <el-button
            icon="el-icon-edit"
            type="text"
            @click="handleEdit(scope.row)"
            >修改
          </el-button>
        </template>
      </BaseTable>
    </div>

    <TodoListMan ref="tabbarConAdd" @refresh="getData"></TodoListMan>
  </div>
</template>

<script>
import TodoListMan from "@/views/todoList/TodoListMan.vue";
import { deleteEventInfo, eventInfoList } from "@/api/todoList";

export default {
  name: "TodoList",
  components: {
    TodoListMan
  },
  data() {
    return {
      searchForm: {
        eventName: ""
      },
      tableData: [],
      pageTotal: 0,
      dialogFormVisible: false,
      editLoading: false
    };
  },
  computed: {
    columns() {
      return [
        {
          label: "序号",
          width: "55",
          render: "ordinal"
        },
        {
          label: "图标",
          prop: "iconUrl",
          render: "iconUrl"
        },
        {
          label: "待办事件",
          prop: "eventName"
        },
        {
          label: "事件类型",
          prop: "eventType"
        },
        {
          label: "创建时间",
          prop: "createTime",
          sortable: true
        },
        {
          label: "更新时间",
          prop: "updateTime",
          sortable: true
        },
        {
          label: "操作",
          render: "operation"
        }
      ];
    }
  },
  created() {
    this.getData();
  },
  methods: {
    async getData(query = { pageNum: 1, pageSize: 10 }) {
      const obj = Object.assign(query, this.searchForm);
      try {
        const res = await eventInfoList(obj);
        if (res) {
          this.tableData = res.data.list.map(i => {
            return {
              ...i,
              createTime: i.createTime
                ? this.$dayjs(i.createTime)
                : this.$nodata,
              updateTime: i.updateTime
                ? this.$dayjs(i.updateTime)
                : this.$nodata
            };
          });
          this.menuOrderList = JSON.parse(JSON.stringify(this.tableData));
          this.pageTotal = res.data.total;
        }
      } catch (e) {
        throw new Error(e);
      }
    },
    formReset() {
      this.$refs.searchForm.resetFields();
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
    handleDelete({ id }) {
      this.$confirm("确认删除？", "提示", {
        type: "warning"
      })
        .then(async () => {
          try {
            const res = await deleteEventInfo(id);
            if (res) {
              this.$notify({
                title: "提示",
                message: "删除成功",
                type: "success"
              });
              if (this.tableData.length === 1) {
                this.$refs.tabbarConTable.query.pageNum--;
              }
              await this.getData();
            }
          } catch (error) {
            throw new Error(error.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleAdd() {
      this.$refs.tabbarConAdd.showDialog();
    },
    handleEdit(target) {
      this.$refs.tabbarConAdd.editConfirm(target);
    },
    openEditOrderModal() {
      if (this.tableData.length !== 0) {
        this.dialogFormVisible = true;
      } else {
        this.$message.error("请稍后重试");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.list {
  list-style: none;
  display: flex;

  .drag-move {
    transition: transform 0.3s;
  }

  .list-item {
    flex: 1 1 auto;
    cursor: grabbing;
    background-color: #66b1ff;
    margin: 0 1px;
    color: white;
    border-radius: 4px;
    text-align: center;
    padding: 10px;
  }
}

//.bg-phone {
//  font-size: 500px;
//  width: 400px;
//  display: inline-block;
//}
</style>
