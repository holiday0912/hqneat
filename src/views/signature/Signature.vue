<template>
  <div class="container">
    <div class="handle-box">
      <BaseTable
        ref="tabbarConTable"
        :columns="columns"
        :page-total="pageTotal"
        :table-data="tableData"
        @getData="getData"
      >
        <template #imgUrl="{ scope }">
          <img :alt="scope.row.imgUrl" :src="scope.row.imgUrl" width="50px" />
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

      <!-- <BasePagination
        :page-total="pageTotal"
        @getData="getList"
      ></BasePagination> -->
    </div>
  </div>
</template>

<script>
import { getuserSignList } from "@/api/signature";
import { dateFormat } from "@/utils/file.js";

export default {
  name: "Signature",
  data() {
    return {
      tableData: [],
      pageTotal: 0
    };
  },
  computed: {
    columns() {
      return [
        {
          label: "序号",
          width: "55",
          formatter: (row, column, val, index) => index + 1
        },
        {
          label: "用户id",
          prop: "userId"
        },
        {
          label: "创建时间",
          prop: "createTime"
        },
        {
          label: "签名图片",
          prop: "imgUrl",
          render: "imgUrl"
        }
        // {
        //   label: "操作",
        //   operaBtn: {
        //     // deleteFn: [functionMenuDelete, "id"],
        //     editFn: true
        //   }
        // }
      ];
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData(query = { pageNum: 1, pageSize: 10 }) {
      let params = Object.assign({}, query);
      try {
        let res = await getuserSignList(params);
        if (res) {
          console.log(res, 22);
          this.tableData = res.data.list.map(i => {
            return {
              ...i,
              createTime: i.createTime
                ? dateFormat(i.createTime, "yyyy-mm-dd HH:MM:ss")
                : "--"
            };
          });
          this.pageTotal = res.data.total;
        }
      } catch (e) {
        throw new Error(e);
      }
    },
    statusValueForce(target) {
      switch (target) {
        case 1:
          return "启用";
        case 0:
          return "停用";
        default:
          return "停用";
      }
    },
    showIsLatestAndIsForce(target) {
      switch (target) {
        case "1":
          return "是";
        case "0":
          return "否";
        default:
          return "否";
      }
    },
    showType(target) {
      switch (target) {
        case "1":
          return "离线包";
        case "0":
          return "安装包";
        default:
          return "——";
      }
    },
    // 新增弹窗关闭
    addCancel() {
      this.$refs.son1.$refs.addForm.resetFields();
      this.addDialogVisible = false;
    },
    // 新增确认
    addConfirm() {
      this.$refs.son1.$refs.addForm.resetFields();
      this.getList();
      this.addDialogVisible = false;
    },
    // 详情与修改弹窗
    cancel() {
      this.$refs.son2.$refs.dialogForm.resetFields();
      this.dialogVisible = false;
    },
    // 详情与修改弹窗
    confirm() {
      this.$refs.son2.$refs.dialogForm.resetFields();
      this.getList();
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped></style>
