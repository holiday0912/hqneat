<template>
  <el-drawer
    :before-close="handleDrawerClose"
    :visible.sync="drawer"
    title="提示配置审批"
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
        v-if="form.status === '复核生效'"
        key="eff"
        :loading="approvalLoading"
        type="primary"
        @click="approConfirm1"
        >审批
      </el-button>
      <el-button
        v-else-if="form.status === '删除审核中'"
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
      // 审核按钮的loading状态
      approvalLoading: false
    };
  },
  computed: {
    statusList() {
      return [
        {
          key: this.form.status === "复核生效" ? "1" : "4",
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
      this.drawer = true;
    },
    handleDrawerClose() {
      this.drawer = false;
      this.$emit("refresh");
    },
    async approConfirm() {
      this.approvalLoading = true;
      try {
        let res = await recheckTips({
          id: this.form.id,
          status: this.status
        });
        if (res) {
          this.approvalLoading = false;
          this.handleDrawerClose();
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
      this.approvalLoading = true;
      try {
        let res = await checkTips({
          id: this.form.id,
          status: this.status
        });
        if (res.message === "请求成功") {
          this.approvalLoading = false;
          this.handleDrawerClose();
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
      this.approvalLoading = true;
      try {
        let res = await checkTips({
          id: this.form.id,
          status: this.status1,
          isDeleted: this.isDeleted
        });
        if (res.message === "请求成功") {
          this.approvalLoading = false;
          this.handleDrawerClose();
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
