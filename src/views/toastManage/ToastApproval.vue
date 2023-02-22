<template>
  <el-drawer
    :before-close="handleDrawerClose"
    :title="dialogTitle"
    :visible.sync="drawer"
  >
    <div class="des-content">
      <p>业务类型：{{ form.serviceTypeName }}</p>
      <p>温馨提示内容：{{ form.property }}</p>
    </div>

    <div class="appro">
      <el-select
        v-model="status"
        placeholder="请选择"
        style="width: 200px;margin-right: 16px"
      >
        <el-option
          v-for="item in statusList"
          :key="item.key"
          :label="item.val"
          :value="item.key"
        />
      </el-select>
      <!--    </div>-->
      <!--    <div class="btn">-->
      <el-button
        v-if="form.status.val === '复核生效'"
        key="eff"
        :loading="approvalLoading"
        type="primary"
        @click="approConfirm1"
        >审批
      </el-button>
      <el-button
        v-else-if="form.status.val === '删除审核中'"
        key="eff"
        :loading="approvalLoading"
        type="primary"
        @click="approConfirm2"
        >审批
      </el-button>
      <el-button
        v-else
        key="oth"
        :loading="approvalLoading"
        type="primary"
        @click="approConfirm"
        >审批
      </el-button>
    </div>
  </el-drawer>
</template>

<script>
import { checkTips, recheckTips } from "@/api/toastManage";

export default {
  name: "ToastApproval",
  data() {
    return {
      drawer: false,
      active: false,
      active1: false,
      form: {
        status: ""
      },
      // 删除审核的时候通过传1，不通过传0，其他情况不用传
      isDeleted: 0,
      status: "",
      originStatus: undefined,
      // 审核按钮的loading状态
      approvalLoading: false
    };
  },
  computed: {
    dialogTitle() {
      let tempTitle;
      if (this.originStatus === "复核生效") {
        tempTitle = "复核";
      } else if (this.originStatus === "审核中") {
        tempTitle = "审核";
      } else if (this.originStatus === "删除审核中") {
        tempTitle = "删除审核";
      }
      return tempTitle;
    },
    statusList() {
      let tempStatus;
      if (this.originStatus === "复核生效") {
        tempStatus = "4";
      } else if (this.originStatus === "审核中") {
        tempStatus = "1";
      } else if (this.originStatus === "删除审核中") {
        tempStatus = "3";
      }
      return [
        {
          key: tempStatus,
          val: "通过"
        },
        {
          key: "2",
          val: "拒绝"
        }
      ];
    }
  },
  methods: {
    openDrawer(target) {
      this.form = target;
      this.originStatus = target.status.val;
      this.drawer = true;
    },
    handleDrawerClose() {
      this.drawer = false;
      this.status = ''
    },
    async approConfirm() {
      if (!this.status) {
        return;
      }
      this.approvalLoading = true;
      try {
        let res = await recheckTips({
          id: this.form.id,
          status: this.status
        });
        if (res) {
          this.approvalLoading = false;
          this.handleDrawerClose();
          this.$emit("refresh");
          this.$notify({
            title: "提示",
            message: "审核成功",
            type: "success"
          });
        }
      } catch (error) {
        this.approvalLoading = false;
        throw new Error(error);
      }
    },
    async approConfirm1() {
      if (!this.status) {
        return;
      }
      this.approvalLoading = true;
      try {
        let res = await checkTips({
          id: this.form.id,
          status: this.status
        });
        if (res.message === "请求成功") {
          this.approvalLoading = false;
          this.handleDrawerClose();
          this.$emit("refresh");
          this.$notify({
            title: "提示",
            message: "审核成功",
            type: "success"
          });
        }
      } catch (error) {
        this.approvalLoading = false;
        throw new Error(error);
      }
    },
    async approConfirm2() {
      if (!this.status) {
        return;
      }
      this.approvalLoading = true;
      try {
        let res = await checkTips({
          id: this.form.id,
          status: this.status,
          isDeleted: this.status === "3" ? 1 : 0
        });
        if (res.message === "请求成功") {
          this.approvalLoading = false;
          this.handleDrawerClose();
          this.$emit("refresh");
          this.$notify({
            title: "提示",
            message: "删除审核成功",
            type: "success"
          });
        }
      } catch (error) {
        this.approvalLoading = false;
        throw new Error(error);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.appro {
  padding-left: 20px;
}

.icon {
  font-size: 50px;
  padding: 14px;
  border-radius: 10px;

  &:hover {
    border: 2px solid black;
  }
}

.active {
  background-color: red;
  color: #fff;
}

.active1 {
  background-color: gray;
  color: #fff;
}

.des-content {
  padding: 24px;

  p {
    margin-bottom: 16px;
  }
}
</style>
