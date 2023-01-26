<template>
  <div class="container">
    <div class="handle-box">
      <BaseTable
        ref="tabbarConTable"
        :columns="columns"
        :pageTotal="pageTotal"
        :searchFormSet="searchFormSet"
        :tableData="tableData"
        @edit="judgeEdit"
        @getData="getData"
      >
        <template #searchForm>
          <div>
            <el-col :span="6">
              <el-form-item label="待办事件" prop="eventName">
                <el-input v-model="searchForm.eventName" placeholder="请输入">
                </el-input>
              </el-form-item>
            </el-col>
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
      </BaseTable>
    </div>

    <TodoListMan ref="tabbarConAdd" @refresh="getData"></TodoListMan>
  </div>
</template>

<script>
import TodoListMan from "@/views/todoList/TodoListMan.vue";
import { deleteEventInfo, eventInfoList } from "@/api/todoList";
import { addTimeIcon } from "@/common/tableFormat";

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
      editLoading: false,
      isEdit: false
    };
  },
  computed: {
    searchFormSet() {
      return {
        model: this.searchForm,
        ref: "searchForm"
      };
    },
    columns() {
      return [
        {
          label: "序号",
          width: "55",
          formatter: (row, column, val, index) => index + 1
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
          formatter: (row, column, val) => addTimeIcon(row, column, val),
          sortable: true
        },
        {
          label: "更新时间",
          prop: "updateTime",
          formatter: (row, column, val) => addTimeIcon(row, column, val),
          sortable: true
        },
        {
          label: "操作",
          operaBtn: {
            deleteFn: [deleteEventInfo, "id"],
            editFn: true
          }
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
    judgeEdit(row) {
      if (row) {
        this.isEdit = true;
        this.$refs.tabbarConAdd.editConfirm(row);
      } else {
        this.isEdit = false;
        this.$refs.tabbarConAdd.showDialog();
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
