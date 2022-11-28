<template>
  <div class="sidebar">
    <el-menu
      :collapse="collapse"
      :default-active="onRoutes"
      active-text-color="#20a0ff"
      background-color="#324157"
      class="sidebar-el-menu"
      router
      text-color="#bfcbd9"
      unique-opened
    >
      <template v-if="items">
        <template v-for="item in items">
          <template v-if="item.resources">
            <el-submenu :key="item.router" :index="item.router">
              <template slot="title">
                <i :class="item.icon"></i>
                <span slot="title">{{ item.resourceName }}</span>
              </template>
              <template v-for="subItem in item.resources">
                <el-submenu
                  v-if="subItem.resources"
                  :key="subItem.router"
                  :index="subItem.router"
                >
                  <template slot="title">{{ subItem.resourceName }}</template>
                  <el-menu-item
                    v-for="(threeItem, i) in subItem.resources"
                    :key="i"
                    :index="threeItem.router"
                    >{{ threeItem.resourceName }}
                  </el-menu-item>
                </el-submenu>
                <el-menu-item
                  v-else
                  :key="subItem.router"
                  :index="subItem.router"
                  >{{ subItem.resourceName }}
                </el-menu-item>
              </template>
            </el-submenu>
          </template>
          <template v-else>
            <el-menu-item :key="item.router" :index="item.router">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.resourceName }}</span>
            </el-menu-item>
          </template>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      collapse: false,
      items: [
        {
          icon: "el-icon-lx-home",
          router: "dashboard",
          resourceName: "系统首页"
        },
        {
          icon: "el-icon-lx-shop",
          router: "2",
          resourceName: "权限管理",
          resources: [
            {
              icon: "el-icon-lx-shop",
              router: "accountManage",
              resourceName: "账号管理"
            },
            {
              icon: "el-icon-lx-shop",
              router: "roleManage",
              resourceName: "角色管理"
            },
            {
              icon: "el-icon-lx-shop",
              router: "resourcesManage",
              resourceName: "资源管理"
            }
          ]
        },
        {
          icon: "el-icon-lx-home",
          router: "buryData",
          resourceName: "埋点数据管理"
        },
        {
          icon: "el-icon-lx-home",
          router: "carouselManage",
          resourceName: "轮播图管理"
        },
        {
          icon: "el-icon-lx-home",
          router: "htmlPackage",
          resourceName: "h5包管理"
        },
        {
          icon: "el-icon-lx-home",
          router: "loginLog",
          resourceName: "登陆日志"
        },
        {
          icon: "el-icon-lx-home",
          router: "msgPush",
          resourceName: "消息推送"
        },
        {
          icon: "el-icon-lx-home",
          router: "toastManage",
          resourceName: "toast样式管理"
        }
      ]
      // items: [],
    };
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace("/", "");
    }
  },
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    // bus.$on('collapse', (msg) => {
    //   this.collapse = msg
    //   bus.$emit('collapse-content', msg)
    // })
    // if (localStorage.getItem('userLoginContext')) {
    //   let userLoginContext = JSON.parse(
    //     localStorage.getItem('userLoginContext')
    //   )
    //   console.log(userLoginContext.resources)
    //   this.items = userLoginContext.resources
    // }
  }
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}

.sidebar::-webkit-scrollbar {
  width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}

.sidebar > ul {
  height: 100%;
}
</style>
