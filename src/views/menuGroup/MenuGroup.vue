<template>
  <div class="container">
    <div class="handle-box">
      <BaseTable
        ref="tabbarConTable"
        :columns="columns"
        :page-total="pageTotal"
        :search-form-set="searchFormSet"
        :table-data="tableData"
        @edit="judgeEdit"
        @getData="getData"
      >
        <template #searchForm>
          <el-col :span="6" :xs="12">
            <el-form-item label="菜单名称" prop="title">
              <el-input v-model="searchForm.title" placeholder="请输入">
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6" :xs="12">
            <el-form-item label="菜单分组" prop="menuGroup">
              <el-select
                v-model="searchForm.menuGroup"
                :clearable="true"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in menuGroupNameList"
                  :key="item.menuGroupName"
                  :label="item.menuGroupName"
                  :value="item.menuGroup"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6" :xs="12">
            <el-form-item label="是否开启" prop="status">
              <el-select
                v-model="searchForm.status"
                :clearable="true"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in statusEnum"
                  :key="item.key"
                  :label="item.val"
                  :value="item.key"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </template>

        <template #menuIcon="{ scope }">
          <img :alt="scope.row.title" :src="scope.row.menuIcon" width="50px" />
        </template>

        <template #status="{ scope }">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            @change="statusClick($event, scope.row)"
          ></el-switch>
        </template>
      </BaseTable>
    </div>

    <MenuGroupAdd
      ref="MenuGroupAdd"
      :menu-group-name-list="menuGroupNameList"
      @refresh="getData"
    ></MenuGroupAdd>
  </div>
</template>

<script>
import {
  functionMenuDelete,
  functionMenuGroupList,
  functionMenuList,
  functionMenuUpdate
} from "@/api/menuGroup";
import { statusEnum } from "@/common/enum";

export default {
  name: "MenuGroup",
  components: {
    MenuGroupAdd: () => import("@/views/menuGroup/MenuGroupAddEdit.vue")
  },
  data() {
    return {
      pageTotal: 0,
      tableData: [],
      searchForm: {
        title: undefined,
        menuGroupName: undefined,
        status: undefined
      },
      menuGroupNameList: []
    };
  },
  created() {
    this.getData();
    this.getMenuGroupNameList();
  },
  computed: {
    statusEnum() {
      return statusEnum;
    },
    searchFormSet() {
      return {
        model: this.searchForm,
        ref: "searchForm",
        style: {
          marginBottom: "16px"
        }
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
          label: "菜单名称",
          prop: "title"
        },
        {
          label: "图标",
          prop: "menuIcon",
          render: "menuIcon"
        },
        {
          label: "路由",
          prop: "router"
        },
        {
          label: "菜单分组",
          prop: "menuGroupName"
        },
        {
          label: "顺序",
          prop: "menuOrder",
          sortable: true
        },
        {
          label: "是否开启",
          prop: "status",
          render: "status"
        },
        {
          label: "操作",
          operaBtn: {
            deleteFn: [functionMenuDelete, "id"],
            editFn: true
          }
        }
      ];
    }
  },
  methods: {
    async getData(query = { pageNum: 1, pageSize: 10 }) {
      const searchParams = JSON.parse(JSON.stringify(this.searchForm));
      const obj = Object.assign(query, searchParams);
      try {
        const res = await functionMenuList(obj);
        if (res) {
          this.tableData = res.data.list;
          this.pageTotal = res.data.total;
        }
      } catch (e) {
        throw new Error(e);
      }
    },
    async statusClick(target, { id, title }) {
      try {
        const res = await functionMenuUpdate({ id, status: target });
        if (res.code.slice(-5) === "00000") {
          this.$notify({
            title: "提示",
            message: `${title}菜单${target ? "开启" : "关闭"}成功`,
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
    async getMenuGroupNameList() {
      try {
        const res = await functionMenuGroupList();
        if (res) {
          this.menuGroupNameList = res.data;
        }
      } catch (e) {
        console.log(e);
      }
    },
    judgeEdit(row) {
      if (row) {
        this.$refs.MenuGroupAdd.editConfirm(row);
      } else {
        this.$refs.MenuGroupAdd.showDialog();
      }
    }
  }
};
</script>
