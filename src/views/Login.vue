<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">后台管理系统模板</div>
      <el-form
        ref="login"
        :model="param"
        :rules="rules"
        class="ms-content"
        label-width="0"
      >
        <el-form-item prop="username">
          <el-input
            v-model="param.username"
            clearable
            placeholder="请输入账号"
            @focus="onfocus($event)"
          >
            <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="param.password"
            clearable
            placeholder="请输入密码"
            type="password"
            @focus="onfocus($event)"
            @keyup.enter.native="submitForm()"
          >
            <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm()">登录</el-button>
        </div>
        <!-- <p class="login-tips">Tips : 用户名和密码随便填。</p> -->
      </el-form>
    </div>
    <div class="copyDrec">备案号</div>
  </div>
</template>

<script>
import { login } from "@/api/system/sysUser";

export default {
  data: function() {
    return {
      param: {
        username: "qianyucai",
        password: "123456"
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm() {
      this.$refs.login.validate(valid => {
        if (valid) {
          login(this.param).then(res => {
            if (res) {
              // sessionStorage.setItem("token", res.data.token);
              // sessionStorage.setItem(
              //   "userLoginContext",
              //   JSON.stringify(res.data.userLoginContext)
              // );
              this.$router.push("/dashboard");
            }
          });
        } else {
          this.$message.error("请输入账号和密码");
          return false;
        }
      });
    },
    onfocus(e) {
      e.currentTarget.select();
    }
  }
};
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url("~@/assets/img/login-bg.png");
  background-size: 100%;
}

.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}

.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -160px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}

.ms-content {
  padding: 30px 30px;
}

.login-btn {
  text-align: center;
}

.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}

.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}

.copyDrec {
  font-size: 12px;
  color: #ccc;
  width: 100%;
  text-align: center;
  position: absolute;
  left: 0;
  bottom: 18px;
}
</style>
