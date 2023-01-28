<template>
  <div class="container">
    <div class="handle-box">
      <el-button icon="el-icon-refresh" type="primary" @click="handleSearch">
        刷新
      </el-button>
      <el-button icon="el-icon-plus" type="primary" @click="handleAdd">
        新增
      </el-button>
      <el-button type="primary" @click="openEditOrderModal">
        修改菜单顺序
      </el-button>

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

        <template #status="{ scope }">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            @change="statusClick($event, scope.row)"
          ></el-switch>
        </template>

        <template #operation="{ scope }">
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
      <!--      <i class="el-icon-mobile-phone bg-phone"></i>-->
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
          <div style="height: 50px">
            <img
              :alt="item.text"
              :src="item.iconUrl"
              height="50px"
              width="50px"
            />
          </div>
          <p>{{ item.text }}</p>
        </li>
      </transition-group>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditClose">取 消</el-button>
        <el-button :loading="editLoading" type="primary" @click="handleConfirm">
          修 改
        </el-button>
      </div>
    </el-dialog>

    <TabbarConAdd
      ref="tabbarConAdd"
      @openOrderEdit="dialogFormVisible = true"
      @refresh="getData"
    ></TabbarConAdd>
  </div>
</template>

<script>
import {
  deleteTabbarInfo,
  tabbarInfoList,
  updateOrder,
  updateTabbarInfo
} from "@/api/tabbarCon";
import TabbarConAdd from "@/views/tabbarCon/TabbarConMan.vue";

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
      menuOrderList: [],
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
          prop: "tabbarOrder",
          sortable: true
        },
        {
          label: "路由",
          prop: "router"
        },
        {
          label: "状态",
          prop: "status",
          render: "status"
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
          operaBtn: {
            deleteFn: [deleteTabbarInfo, "id"]
          },
          render: "operation"
        }
      ];
    }
  },
  created() {
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
              ...i
              // createTime: i.createTime
              //   ? this.$dayjs(i.createTime)
              //   : this.$nodata,
              // updateTime: i.updateTime
              //   ? this.$dayjs(i.updateTime)
              //   : this.$nodata
            };
          });
          this.menuOrderList = JSON.parse(JSON.stringify(this.tableData));
          this.pageTotal = res.data.total;
        }
      } catch (e) {
        throw new Error(e);
      }
    },
    // 列表查询
    handleSearch() {
      this.query = {
        pageNum: 1,
        pageSize: 10
      };
      this.getData();
    },
    handleAdd() {
      this.$refs.tabbarConAdd.showDialog();
    },
    handleEdit(target) {
      this.$refs.tabbarConAdd.editConfirm(target);
    },
    dialogEditClose() {
      this.dialogFormVisible = false;
      this.getData();
    },
    async handleConfirm() {
      this.editLoading = true;
      const target = this.menuOrderList.map(i => i.id);
      try {
        const res = await updateOrder(target);
        if (res.code.slice(-5) === "00000") {
          this.$notify.success({
            title: "提示",
            message: "导航栏菜单顺序修改成功",
            type: "success"
          });
          this.dialogEditClose();
        }
      } catch (e) {
        throw new Error(e.message);
      } finally {
        this.editLoading = false;
      }
    },
    async statusClick(target, { id, text }) {
      try {
        const res = await updateTabbarInfo({ id, status: target });
        if (res.code.slice(-5) === "00000") {
          this.$notify({
            title: "提示",
            message: `${text}菜单${target ? "开启" : "关闭"}成功`,
            type: "success"
          });
          await this.getData();
        } else {
          this.$notify({ title: "提示", message: "请稍后重试", type: "error" });
        }
      } catch (e) {
        throw new Error(e.message);
      }
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
