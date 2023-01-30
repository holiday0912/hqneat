<template>
  <el-drawer
    :before-close="handleDrawerClose"
    :visible.sync="drawer"
    size="500px"
    title="分组管理"
  >
    <div class="drawer-wp">
      <div class="opt-wp">
        <el-input v-model="filterGroup" style="width: 300px"></el-input>
        <el-button class="add-btn" type="primary" @click="handleAdd"
          >新增
        </el-button>
        <el-button type="primary" @click="handleDrawerClose">完成</el-button>
      </div>
      <ul>
        <li v-for="item in groupList" :key="item.id" class="group-list-item">
          {{ item.filterGroup }}
          <el-popconfirm title="确定删除吗？" @confirm="handleDelete(item.id)">
            <el-button slot="reference" class="del-btn" type="text"
              >删除
            </el-button>
          </el-popconfirm>
        </li>
      </ul>
    </div>
  </el-drawer>
</template>

<script>
import { deleteGroup, insertGroup, postGroupList } from "@/api/msgPush";

export default {
  name: "MagPushType",
  data() {
    return {
      drawer: false,
      filterGroup: "",
      groupList: []
    };
  },
  methods: {
    handleDrawerClose() {
      this.drawer = false;
      this.$emit("updateGroup");
    },
    handleDrawerOpen() {
      this.drawer = true;
      this.getMsgPushGroup();
    },
    async getMsgPushGroup() {
      try {
        let res = await postGroupList("");
        if (res.message === "请求成功") {
          this.groupList = res.data;
        }
      } catch (e) {
        throw new Error(e);
      }
    },
    async handleDelete(target) {
      try {
        let res = await deleteGroup(target);
        if (res.message === "请求成功") {
          this.$message.success("删除成功");
          await this.getMsgPushGroup();
        }
      } catch (e) {
        throw new Error(e);
      }
    },
    async handleAdd() {
      try {
        let res = await insertGroup({ filterGroup: this.filterGroup });
        if (res.message === "请求成功") {
          this.$message.success("新增成功");
          await this.getMsgPushGroup();
        }
      } catch (e) {
        throw new Error(e);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.drawer-wp {
  padding: 20px;
}

.add-btn {
  margin-left: 20px;
}

.opt-wp {
  display: flex;
}

.group-list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 10px;

  &:hover {
    background: rgb(245, 247, 250);
  }
}

.del-btn {
  padding: 9px 15px;

  &:hover {
    background-color: rgb(255, 0, 0);
    color: white;
  }
}

ul,
li {
  list-style-type: none;
}
</style>
