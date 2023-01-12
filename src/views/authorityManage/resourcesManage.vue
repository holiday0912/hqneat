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
        :columns="columns"
        :pageTotal="pageTotal"
        :tableData="tableData"
        :tree-props="{ children: 'resources' }"
        row-key="resourceId"
        @getData="getData"
      >
        <template #ordinal="{scope}">
          {{ scope.$index + 1 }}
        </template>

        <!-- 资源图标 -->
        <template #iconRender="{ scope }">
          <i :class="scope.row.icon" style="font-size: 20px"></i>
        </template>

        <template #router="{ scope }">
          <p>/{{ scope.row.router }}</p>
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
        <el-form-item
          v-if="dialogTitle === '新增子资源' || addItem.parentId !== 0"
          label="父资源名称"
        >
          <el-input v-model="resourceNameF" disabled />
        </el-form-item>

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
          >
            <el-option
              v-for="(item, index) in typeList"
              :key="index"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="addItem.type" label="菜单路由地址" prop="router">
          <el-select
            v-model="addItem.router"
            clearable
            placeholder="请选择菜单路由地址"
          >
            <el-option
              v-for="item in routeList"
              :key="item"
              :label="`/${item}`"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="资源请求后台地址" prop="handlerUrl">
          <el-input
            v-model="addItem.handlerUrl"
            clearable
            placeholder="请输入资源请求后台地址"
          />
        </el-form-item>

        <el-form-item label="资源描述" prop="resourceDesc">
          <el-input
            v-model="addItem.resourceDesc"
            clearable
            placeholder="请输入资源描述"
          />
        </el-form-item>

        <el-form-item label="菜单图标" prop="icon">
          <el-dropdown
            placement="top-start"
            trigger="click"
            @command="handleCommand"
          >
            <el-link :tabindex="9999" class="el-dropdown-link" type="primary">
              <i
                v-if="addItem.icon"
                :class="addItem.icon"
                style="font-size: 30px"
              >
              </i
              ><span v-else>下拉菜单</span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-link>
            <el-dropdown-menu slot="dropdown" class="menu-icon-select">
              <el-dropdown-item
                v-for="item in iconList"
                :key="item"
                :command="item"
              >
                <i :class="item" style="font-size: 30px"></i>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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
  addItem,
  deleteBatch,
  editItem,
  pageList
} from "@/api/system/sysResource";
import { updateMenuMethod } from "@/common/toolFunc";

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
        icon: "",
        resourceDesc: "",
        resourceIdentifi: "", // 资源标识
        resourceName: "", // 资源名称
        type: true // 资源类型 false - 按钮 true - 菜单
      },
      resourceNameF: "", // 父资源名称
      routeList: []
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
          width: "85",
          render: "ordinal"
        },
        {
          label: "资源ID",
          prop: "resourceId"
        },
        // {
        //   label: "父资源ID",
        //   prop: "parentId"
        // },
        {
          label: "资源名称",
          prop: "resourceName"
        },
        {
          label: "图标",
          prop: "icon",
          render: "iconRender",
          width: "60"
        },
        {
          label: "前端路由",
          prop: "router",
          render: "router"
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
    },
    iconList() {
      return [
        "el-icon-delete-solid",
        "el-icon-delete",
        "el-icon-s-tools",
        "el-icon-setting",
        "el-icon-user-solid",
        "el-icon-user",
        "el-icon-phone",
        "el-icon-phone-outline",
        "el-icon-more",
        "el-icon-more-outline",
        "el-icon-star-on",
        "el-icon-star-off",
        "el-icon-s-goods",
        "el-icon-goods",
        "el-icon-warning",
        "el-icon-warning-outline",
        "el-icon-question",
        "el-icon-info",
        "el-icon-remove",
        "el-icon-circle-plus",
        "el-icon-success",
        "el-icon-error",
        "el-icon-zoom-in",
        "el-icon-zoom-out",
        "el-icon-remove-outline",
        "el-icon-circle-plus-outline",
        "el-icon-circle-check",
        "el-icon-circle-close",
        "el-icon-s-help",
        "el-icon-help",
        "el-icon-minus",
        "el-icon-plus",
        "el-icon-check",
        "el-icon-close",
        "el-icon-picture",
        "el-icon-picture-outline",
        "el-icon-picture-outline-round",
        "el-icon-upload",
        "el-icon-upload2",
        "el-icon-download",
        "el-icon-camera-solid",
        "el-icon-camera",
        "el-icon-video-camera-solid",
        "el-icon-video-camera",
        "el-icon-message-solid",
        "el-icon-bell",
        "el-icon-s-cooperation",
        "el-icon-s-order",
        "el-icon-s-platform",
        "el-icon-s-fold",
        "el-icon-s-unfold",
        "el-icon-s-operation",
        "el-icon-s-promotion",
        "el-icon-s-home",
        "el-icon-s-release",
        "el-icon-s-ticket",
        "el-icon-s-management",
        "el-icon-s-open",
        "el-icon-s-shop",
        "el-icon-s-marketing",
        "el-icon-s-flag",
        "el-icon-s-comment",
        "el-icon-s-finance",
        "el-icon-s-claim",
        "el-icon-s-custom",
        "el-icon-s-opportunity",
        "el-icon-s-data",
        "el-icon-s-check",
        "el-icon-s-grid",
        "el-icon-menu",
        "el-icon-share",
        "el-icon-video-pause",
        "el-icon-video-play",
        "el-icon-refresh",
        "el-icon-refresh-right",
        "el-icon-refresh-left",
        "el-icon-finished",
        "el-icon-sort",
        "el-icon-sort-up",
        "el-icon-sort-down",
        "el-icon-rank",
        "el-icon-loading",
        "el-icon-view",
        "el-icon-c-scale-to-original",
        "el-icon-date",
        "el-icon-edit",
        "el-icon-edit-outline",
        "el-icon-folder",
        "el-icon-folder-opened",
        "el-icon-folder-add",
        "el-icon-folder-remove",
        "el-icon-folder-delete",
        "el-icon-folder-checked",
        "el-icon-tickets",
        "el-icon-document-remove",
        "el-icon-document-delete",
        "el-icon-document-copy",
        "el-icon-document-checked",
        "el-icon-document",
        "el-icon-document-add",
        "el-icon-printer",
        "el-icon-paperclip",
        "el-icon-takeaway-box",
        "el-icon-search",
        "el-icon-monitor",
        "el-icon-attract",
        "el-icon-mobile",
        "el-icon-scissors",
        "el-icon-umbrella",
        "el-icon-headset",
        "el-icon-brush",
        "el-icon-mouse",
        "el-icon-coordinate",
        "el-icon-magic-stick",
        "el-icon-reading",
        "el-icon-data-line",
        "el-icon-data-board",
        "el-icon-pie-chart",
        "el-icon-data-analysis",
        "el-icon-collection-tag",
        "el-icon-film",
        "el-icon-suitcase",
        "el-icon-suitcase-1",
        "el-icon-receiving",
        "el-icon-collection",
        "el-icon-files",
        "el-icon-notebook-1",
        "el-icon-notebook-2",
        "el-icon-toilet-paper",
        "el-icon-office-building",
        "el-icon-school",
        "el-icon-table-lamp",
        "el-icon-house",
        "el-icon-no-smoking",
        "el-icon-smoking",
        "el-icon-shopping-cart-full",
        "el-icon-shopping-cart-1",
        "el-icon-shopping-cart-2",
        "el-icon-shopping-bag-1",
        "el-icon-shopping-bag-2",
        "el-icon-sold-out",
        "el-icon-sell",
        "el-icon-present",
        "el-icon-box",
        "el-icon-bank-card",
        "el-icon-money",
        "el-icon-coin",
        "el-icon-wallet",
        "el-icon-discount",
        "el-icon-price-tag",
        "el-icon-news",
        "el-icon-guide",
        "el-icon-male",
        "el-icon-female",
        "el-icon-thumb",
        "el-icon-cpu",
        "el-icon-link",
        "el-icon-connection",
        "el-icon-open",
        "el-icon-turn-off",
        "el-icon-set-up",
        "el-icon-chat-round",
        "el-icon-chat-line-round",
        "el-icon-chat-square",
        "el-icon-chat-dot-round",
        "el-icon-chat-dot-square",
        "el-icon-chat-line-square",
        "el-icon-message",
        "el-icon-postcard",
        "el-icon-position",
        "el-icon-turn-off-microphone",
        "el-icon-microphone",
        "el-icon-close-notification",
        "el-icon-bangzhu",
        "el-icon-time",
        "el-icon-odometer",
        "el-icon-crop",
        "el-icon-aim",
        "el-icon-switch-button",
        "el-icon-full-screen",
        "el-icon-copy-document",
        "el-icon-mic",
        "el-icon-stopwatch",
        "el-icon-medal-1",
        "el-icon-medal",
        "el-icon-trophy",
        "el-icon-trophy-1",
        "el-icon-first-aid-kit",
        "el-icon-discover",
        "el-icon-place",
        "el-icon-location",
        "el-icon-location-outline",
        "el-icon-location-information",
        "el-icon-add-location",
        "el-icon-delete-location",
        "el-icon-map-location",
        "el-icon-alarm-clock",
        "el-icon-timer",
        "el-icon-watch-1",
        "el-icon-watch",
        "el-icon-lock",
        "el-icon-unlock",
        "el-icon-key",
        "el-icon-service",
        "el-icon-mobile-phone",
        "el-icon-bicycle",
        "el-icon-truck",
        "el-icon-ship"
      ];
    }
  },
  mounted() {
    this.getData();
    this.routeList = this.$router.options.routes[1].children.map(i => i.name);
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
              if (this.tableData.length === 1) {
                this.$refs.resourceTable.query.pageNum--;
              }
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
      const {
        icon,
        parentId,
        parentResourceName,
        resourceDesc,
        resourceId,
        resourceIdentifi,
        resourceName,
        router
      } = row;
      this.addItem = {
        icon,
        parentId,
        parentResourceName,
        resourceDesc,
        id: resourceId,
        resourceIdentifi,
        resourceName,
        router
      };
      if (row.type === "菜单") {
        this.addItem.type = true;
      } else if (row.type === "按钮") {
        this.addItem.type = false;
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
                updateMenuMethod();
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
    },
    handleCommand(command) {
      this.addItem.icon = command;
    }
  }
};
</script>
