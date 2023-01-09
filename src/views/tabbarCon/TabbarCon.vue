<template>
  <div class="container">
    <div class="handle-box">
      <el-form ref="searchRorm" :model="searchForm" label-width="120px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="业务类型代码" prop="serviceTypeCode">
              <!-- <el-select
                v-model="searchForm.serviceTypeCode"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in serviceType"
                  :key="item.key"
                  :label="item.val"
                  :value="item.key"
                />
              </el-select> -->
            </el-form-item>
          </el-col>

          <!-- <el-col :span="6">
            <el-form-item label="状态" prop="status">
              <el-input v-model="searchForm.status"></el-input>
            </el-form-item>
          </el-col> -->

          <el-col :span="12">
            <div style="margin-left: 50px; display: inline-block">
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
          </el-col>
        </el-row>
        <el-button icon="el-icon-plus" type="primary" @click="handleAdd">
          新增
        </el-button>
        <el-button type="primary" @click="dialogFormVisible = true">
          修改菜单顺序
        </el-button>
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
        </template>
      </BaseTable>
    </div>

    <el-dialog
      v-dialogDrag
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :visible.sync="dialogFormVisible"
      title="导航菜单顺序修改"
      width="680px"
      @close="dialogEditClose"
    >
      <i class="el-icon-mobile-phone bg-phone"></i>
      <transition-group class="list" name="drag" tag="ul">
        <li
          v-for="(item, index) in menuOrderList"
          :key="item.id"
          class="list-item"
          draggable
          @dragenter="dragenter($event, index)"
          @dragover="dragover($event)"
          @dragstart="dragstart(index)"
        >
          {{ item.text }}
          <el-switch v-model="item.status"></el-switch>
        </li>
      </transition-group>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditClose">取 消</el-button>
        <el-button type="primary" @click="handleConfirm"> 修 改</el-button>
      </div>
    </el-dialog>

    <TabbarConAdd ref="tabbarConAdd" @refresh="getData"></TabbarConAdd>
  </div>
</template>

<script>
import { deleteTabbarInfo, tabbarInfoList } from "@/api/tabbarCon";
import TabbarConAdd from "@/views/tabbarCon/TabbarConAdd.vue";

export default {
  name: "TabbarCon",
  components: {
    TabbarConAdd
  },
  data() {
    return {
      searchForm: {
        serviceTypeCode: ""
      },
      tableData: [],
      pageTotal: 0,
      dialogFormVisible: false,
      dragIndex: "",
      enterIndex: "",
      menuOrderList: []
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
          label: "菜单名称",
          prop: "text"
        },
        {
          label: "图标",
          prop: "iconUrl",
          render: "iconUrl"
        },
        // 暂时不支持，待后续
        // {
        //   label: "激活图标",
        //   prop: "selectedIconUrl",
        //   render: "selectedIconUrl"
        // },
        {
          label: "菜单顺序",
          prop: "tabbarOrder"
        },
        {
          label: "路由",
          prop: "router"
        },
        {
          label: "状态",
          prop: "status"
        },
        // {
        //   label: "创建时间",
        //   prop: "createTime"
        // },
        // {
        //   label: "更新时间",
        //   prop: "updateTime"
        // },
        {
          label: "操作",
          render: "operation"
        }
      ];
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    dragenter(e, index) {
      e.preventDefault();
      if (this.dragIndex !== index) {
        const source = this.menuOrderList[this.dragIndex];
        this.menuOrderList.splice(this.dragIndex, 1);
        this.menuOrderList.splice(index, 0, source);
        this.dragIndex = index;
      }
    },
    dragover(e) {
      e.preventDefault();
    },
    dragstart(index) {
      this.dragIndex = index;
    },
    async getData(query = { pageNum: 1, pageSize: 10 }) {
      const obj = Object.assign(query, this.searchForm);
      try {
        const res = await tabbarInfoList(obj);
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
    async handleDelete({ id }) {
      try {
        const res = await deleteTabbarInfo(id);
        if (res) {
          // this.$message.success('删除成功')
          this.$notify({ title: "提示", message: "删除成功" });
          if (this.tableData.length === 1) {
            this.$refs.tabbarConTable.query.pageNum--;
          }
          await this.getData();
        }
      } catch (error) {
        throw new Error(error.message);
      }
    },
    handleAdd() {
      this.$refs.tabbarConAdd.showDialog();
    },
    handleEdit(target) {
      this.$refs.tabbarConAdd.editConfirm(target);
    },
    dialogEditClose() {
      this.dialogFormVisible = false;
    },
    handleConfirm() {
      const target = this.menuOrderList.map(i => i.id);
      console.log(target);
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
    background-color: red;
    color: white;
    border-radius: 4px;
    margin-bottom: 6px;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }
}

.bg-phone {
  font-size: 500px;
  width: 400px;
  display: inline-block;
}
</style>
