<template>
  <el-drawer
      :before-close="handleDrawerClose"
      :visible.sync="drawer"
      size="700px"
      title="提示配置审批"
    > 
      <div class="des-content">
        <p>
          业务类型：{{form.type}}
        </p>
        <p>
          温馨提示内容：{{form.property}}
        </p>
      </div>
      
      <div class="appro">
        <i 
          class="el-icon-check icon"
          @click="handleAppro(1)"
          :class="{active: active}"></i>
        <i 
          class="el-icon-close icon"
          @click="handleAppro(2)"
          :class="{active1: active1}"></i>
      </div>
      <div class="btn">
        <el-button v-if="form.status === '复核生效'" key="eff" type="primary" style="width:300px" :loading="approvalLoading" @click="approConfirm1">审批</el-button>
        <el-button v-else-if="form.status === '删除审核中'" key="eff" type="primary" style="width:300px" :loading="approvalLoading" @click="approConfirm2">审批</el-button>
        <el-button v-else key="oth" type="primary" style="width:300px" :loading="approvalLoading" @click="approConfirm">审批</el-button>
      </div>
    </el-drawer>
</template>

<script>
import { recheckTips, checkTips } from "@/api/toastManage";

export default {
  name: "ToastApproval",
  data() {
    return {
      drawer: false,
      active: false,
      active1: false,
      form: {},
      // 删除审核的时候通过传1，不通过传0，其他情况不用传
      isDeleted: 0,
      status: '',
      status1: '',
      // 审核按钮的loading状态
      approvalLoading: false,
    }
  },
  methods: {
    openDrawer(target) {
      console.log(target)
      this.form = target
      this.drawer = true;
    },
    handleAppro(tar) {
      if(tar === 1) {
        this.active = true;
        this.active1 = false;
        this.isDeleted = 1
        this.status = '1'
        this.status1 = '4'
      }

      if(tar === 2) {
        this.active = false;
        this.active1 = true;
        this.isDeleted = 0
        this.status = '2'
        this.status1 = '2'
      }
    },
    handleDrawerClose() {
      this.drawer = false;
      this.$emit('refresh')
    },
    async approConfirm() {
      this.approvalLoading = true
      try {
        let res = await recheckTips({
          id: this.form.id,
          status: this.status
        })
        if(res) {
          this.approvalLoading = false
          this.handleDrawerClose()
        }
      } catch (error) {
        this.approvalLoading = false
        throw new Error(error);
      }
    },
    async approConfirm1() {
      this.approvalLoading = true
      try {
        let res = await checkTips({
          id: this.form.id,
          status: this.status1
        })
        if(res) {
          this.approvalLoading = false
          this.handleDrawerClose()
        }
      } catch (error) {
        this.approvalLoading = false
        throw new Error(error);
      }
    },
    async approConfirm2() {
      this.approvalLoading = true
      try {
        let res = await checkTips({
          id: this.form.id,
          status: this.status1,
          isDeleted: this.isDeleted
        })
        if(res) {
          this.approvalLoading = false
          this.handleDrawerClose()
        }
      } catch (error) {
        this.approvalLoading = false
        throw new Error(error);
      }
    }
  },
}
</script>

<style lang="scss" scoped>
  .appro {
    width: 200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
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

  .btn {
    text-align: center;
    margin-top: 16px;
  }

  .des-content {
    padding: 24px;

    p {
      margin-bottom: 16px;
    }
  }
</style>