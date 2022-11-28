<template>
  <div id="tabs-bar-container" class="tabs-bar-container">
    <el-tabs
      v-model="tabActive"
      type="card"
      class="tabs-content"
      @tab-click="handleTabClick"
      @tab-remove="handleTabRemove"
    >
      <el-tab-pane
        v-for="item in tagsList"
        :key="item.path"
        :label="item.title"
        :name="item.path"
        :closable="!isAffix(item)"
        class="el-tabs_nav"
      ></el-tab-pane>
    </el-tabs>

    <div class="tags-close-box">
        <el-dropdown @command="handleTags">
            <el-button size="mini" type="primary">
              标签选项<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu size="small" slot="dropdown">
              <el-dropdown-item command="other">关闭其他</el-dropdown-item>
              <el-dropdown-item command="all">关闭所有</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
  </div>
</template>

<script>
import bus from "./bus";
import Sortable from "sortablejs"
export default {
  data() {
    return {
      tagsList: [
        {
          name: "dashboard",
          path: "/dashboard",
          title: "系统首页"
        }
      ],
      affixtabs: [],
      tabActive: "",
    };
  },
  mounted(){
    this.rowDrop();   //行拖拽效果
  },
  methods: {
    isActive(path) {
      return path === this.$route.path;
    },
    // 关闭全部标签
    closeAll() {
      this.tagsList = [
        {
          name: "dashboard",
          path: "/dashboard",
          title: "系统首页"
        }
      ]
      this.$router.push("/");
    },
    // 关闭其他标签
    closeOther() {
      const curItem = this.tagsList.filter((item) => {
        return item.path === this.$route.path;
      })[0];
      const tagsList = [
        {
          name: "dashboard",
          path: "/dashboard",
          title: "系统首页"
        }
      ]
      if (this.$route.path !== '/dashboard') {
        tagsList.push(curItem)
      }
      this.tagsList = tagsList;
    },
    // 设置标签
    setTags(route) {
      const isExist = this.tagsList.some((item) => {
        return item.path === route.path;
      });
      if (!isExist) {
        // if (this.tagsList.length >= 8) {
        //   this.tagsList.shift();
        // }
        this.tagsList.push({
          title: route.meta.title,
          path: route.path,
          name: route.matched[1].components.default.name,
        });
      }
      this.tagsList.forEach((item, index) => {
        if (item.path === this.$route.path) {
          this.tabActive = item.path;
        }
      });
      bus.$emit("tags", this.tagsList);
    },
    handleTags(command) {
      command === "other" ? this.closeOther() : this.closeAll();
    },
    handleTabClick(tab){
      const route = this.tagsList.filter((item, index) => {
            if (tab.index == index) return item;
        })[0];
        if (this.$route.path !== route.path) {
            this.$router.push({
              path: route.path,
              fullPath: route.fullPath,
            });
        } else {
          return false;
        }
    },
    handleTabRemove(tabActive) {
      const indexs = this.tagsList.findIndex((item)=>item.path==tabActive);
      const delItem = this.tagsList.splice(indexs, 1)[0];
      const item = this.tagsList[indexs] ? this.tagsList[indexs] : this.tagsList[indexs - 1];
      if (item) {
        delItem.path === this.$route.path && this.$router.push(item.path);
      } else {
        this.$router.push("/");
      }
    },
    isAffix(tag) {
      return tag.path === '/dashboard';
    },
    rowDrop() {
      const el= document.querySelector('.el-tabs__nav');
      let _this = this;
      var sortable = new Sortable(el, {
        group: _this.tagsList,
        sort: true,
        animation: 150,
        delay: 10,
        onEnd({ newIndex, oldIndex }) {                             //oldIIndex拖放前的位置， newIndex拖放后的位置
          console.log(currRow)
          const currRow = _this.tagsList.splice(oldIndex, 1)[0];    //鼠标拖拽当前的el-tabs-pane
          _this.tagsList.splice(newIndex, 0, currRow);  //tableData 是存放所以el-tabs-pane的数组
        },
        direction: 'vertical'
      })
    }
  },
  computed: {
    showTags() {
      return this.tagsList.length > 0;
    },
  },
  watch: {
    $route(newValue, oldValue) {
      this.setTags(newValue);
    },
  },
  created() {
    this.setTags(this.$route);
    // 监听关闭当前页面的标签页
    bus.$on("close_current_tags", () => {
      for (let i = 0, len = this.tagsList.length; i < len; i++) {
        const item = this.tagsList[i];
        if (item.path === this.$route.path) {
          if (i < len - 1) {
            this.$router.push(this.tagsList[i + 1].path);
          } else if (i > 0) {
            this.$router.push(this.tagsList[i - 1].path);
          } else {
            this.$router.push("/");
          }
          this.tagsList.splice(i, 1);
          break;
        }
      }
    });
  },
};
</script>

<style lang="scss" scoped>
.tabs-bar-container {
  position: relative;
  box-sizing: border-box;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: space-between;
  height: $base-tabs-bar-height;
  padding-right: $base-padding;
  padding-left: $base-padding;
  user-select: none;
  background: $base-color-white;
  border-top: 1px solid #f6f6f6;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  ::v-deep {
    .fold-unfold {
      margin-right: $base-padding;
    }
  }

  .tabs-content {
    width: calc(100% - 90px);
    height: $base-tag-item-height;

    ::v-deep {
      .el-tabs__nav-next,
      .el-tabs__nav-prev {
        height: $base-tag-item-height;
        line-height: $base-tag-item-height;
      }

      .el-tabs__header {
        border-bottom: 0;

        .el-tabs__nav {
          border: 0;
        }

        .el-tabs__item {
          box-sizing: border-box;
          height: $base-tag-item-height;
          margin-right: 5px;
          line-height: $base-tag-item-height;
          border: 1px solid $base-border-color;
          border-radius: $base-border-radius;
          transition: padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) !important;

          &.is-active {
            border: 1px solid $base-color-blue;
          }
        }
      }
    }
  }
  .more {
    display: flex;
    align-content: center;
    align-items: center;
    cursor: pointer;
  }
}
</style>

