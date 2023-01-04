<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <div>
      <div class="collapse-btn" @click="collapseChage">
        <i v-if="!collapse" class="el-icon-s-fold"></i>
        <i v-else class="el-icon-s-unfold"></i>
      </div>
      <div class="logo">{{title}}</div>
    </div>
    <div class="header-right">
      <div class="header-user-con">
        <!-- 全屏显示 -->
        <div class="btn-fullscreen" @click="handleFullScreen">
          <el-tooltip
            :content="fullscreen ? `取消全屏` : `全屏`"
            effect="dark"
            placement="bottom"
          >
            <i class="el-icon-rank"></i>
          </el-tooltip>
        </div>
        <!-- 消息中心 -->
        <!--        <div class="btn-bell">-->
        <!--          <el-tooltip-->
        <!--            :content="message ? `有${message}条未读消息` : `消息中心`"-->
        <!--            effect="dark"-->
        <!--            placement="bottom"-->
        <!--          >-->
        <!--            <router-link to="/tabs">-->
        <!--              <i class="el-icon-bell"></i>-->
        <!--            </router-link>-->
        <!--          </el-tooltip>-->
        <!--          <span v-if="message" class="btn-bell-badge"></span>-->
        <!--        </div>-->
        <!-- 用户头像 -->
        <div class="user-avator">
          <img src="../../assets/img/img.jpg" />
        </div>
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-name" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            {{ username }}
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="changePsw">修改密码</el-dropdown-item>
            <el-dropdown-item command="loginout" divided
              >退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <el-dialog
      v-dialogDrag
      :close-on-click-modal="false"
      :visible.sync="dialogFormVisible"
      title="修改密码"
      width="500px"
    >
      <el-form ref="edit" :label-width="'120px'" :model="form" :rules="rules">
        <el-form-item label="旧密码" prop="oldPsw">
          <el-input
            v-model="form.oldPsw"
            autocomplete="off"
            clearable
            placeholder="请输入旧密码"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="psw">
          <el-input
            v-model="form.psw"
            autocomplete="off"
            clearable
            placeholder="请输入新密码"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="comPsw">
          <el-input
            v-model="form.comPsw"
            autocomplete="off"
            clearable
            placeholder="请确认输入新密码"
            type="password"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleComfire">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import bus from "../common/bus";
import { loginOut, resetPasswd } from "@/api/system/sysUser";
import { sysTitle } from '@/config/dev'

export default {
  data() {
    const pswRule = (rule, value, callback) => {
      if (this.form.comPsw !== "") {
        if (value !== this.form.comPsw) {
          callback(new Error("两次密码输入不一致"));
        } else {
          callback();
        }
      } else if (this.form.oldPsw && value === this.form.oldPsw) {
        callback(new Error("新密码不可与旧密码一致"));
      } else {
        callback();
      }
    };
    const comPswRule = (rule, value, callback) => {
      if (this.form.psw !== "") {
        if (value !== this.form.psw) {
          callback(new Error("两次密码输入不一致"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      collapse: false,
      fullscreen: false,
      title: sysTitle,
      name: "linxin",
      message: 2,
      dialogFormVisible: false,
      form: {
        oldPsw: "",
        psw: "",
        comPsw: ""
      },
      rules: {
        oldPsw: [{ required: true, message: "请输入旧密码", trigger: "blur" }],
        psw: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/,
            message: "密码必须为8-16位的大写字母、小写字母、数字组合"
          },
          { validator: pswRule, trigger: "change" }
        ],
        comPsw: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
          {
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/,
            message: "密码必须为8-16位的大写字母、小写字母、数字组合"
          },
          { validator: comPswRule, trigger: "change" }
        ]
      }
    };
  },
  computed: {
    username() {
      let username = sessionStorage.getItem("user");
      return username ?? this.name;
    }
  },
  methods: {
    // 用户名下拉菜单选择事件
    handleCommand(command) {
      if (command === "loginout") {
        this.$confirm("您确定要退出么?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            loginOut({ userName: sessionStorage.getItem("user") }).then(res => {
              if (res) {
                sessionStorage.removeItem("user");
                sessionStorage.removeItem("tk");
                this.$router.push("/login");
              }
            });
          })
          .catch(error => {
            console.log(error);
          });
      } else if (command === "changePsw") {
        this.dialogFormVisible = true;
      }
    },
    // 侧边栏折叠
    collapseChage() {
      this.collapse = !this.collapse;
      bus.$emit("collapse", this.collapse);
    },
    // 全屏事件
    handleFullScreen() {
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    },
    // 修改密码
    handleComfire() {
      this.$refs.edit.validate(valid => {
        if (valid) {
          let obj = {
            oldPassword: this.form.oldPsw,
            newPassword: this.form.psw,
            userName: sessionStorage.getItem('user')
          };
          resetPasswd(obj).then(res => {
            if (res) {
              this.dialogFormVisible = false;
              this.$message.success("修改成功");
            }
          });
        }
      });
    }
  },
  mounted() {
    if (document.body.clientWidth < 1500) {
      this.collapseChage();
    }
  }
};
</script>
<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  font-size: 22px;
  color: #fff;
}

.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 70px;
}

.header .logo {
  width: 250px;
  line-height: 70px;
}

.header-right {
  margin-right: 20px;
}

.header-user-con {
  display: flex;
  height: 70px;
  align-items: center;
}

.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}

.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}

.btn-bell-badge {
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: #fff;
}

.btn-bell .el-icon-bell {
  color: #fff;
}

.user-name {
  margin-left: 10px;
}

.user-avator {
  margin-left: 20px;
}

.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}

.el-dropdown-menu__item {
  text-align: center;
}
</style>
