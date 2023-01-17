<template>
  <!-- 角色绑定资源 -->
  <div>
    <el-dialog
      v-dialogDrag
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :visible.sync="dialogFormVisible"
      title="新增推送"
      width="680px"
      @close="dialogEditClose"
    >
      <el-form ref="edit" :model="form" label-width="150px">
        <el-form-item
          :rules="[{ required: true, message: '请输入' }]"
          label="标题"
          prop="title"
        >
          <el-input v-model="form.title"></el-input>
        </el-form-item>

        <el-form-item
          :rules="[{ required: true, message: '请输入' }]"
          label="内容"
          prop="content"
        >
          <el-input v-model="form.content"></el-input>
        </el-form-item>

        <el-form-item
          :rules="[{ required: true, message: '请输入' }]"
          label="通知栏提示文字"
          prop="ticker"
        >
          <el-input v-model="form.ticker"></el-input>
        </el-form-item>

        <el-form-item
          :rules="[{ required: true, message: '请输入' }]"
          label="分组"
          prop="filterGroup"
        >
          <el-select
            v-model="form.filterGroup"
            clearable
            placeholder="请选择"
            style="width: 100%"
            @change="handleTypeManage"
          >
            <el-option
              v-for="item in groupList"
              :key="item.id"
              :label="item.filterGroup"
              :value="item.filterGroup"
              class="select-group"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditClose">取 消</el-button>
        <el-button type="primary" @click="addMessagePush">修 改</el-button>
      </div>
    </el-dialog>
    <MsgPushType ref="msgPushType" @updateGroup="getMsgPushGroup"></MsgPushType>
  </div>
</template>

<script>
import { postGroupList, updatePush } from "@/api/msgPush";
import MsgPushType from "@/views/msgPush/MsgPushGroup.vue";

export default {
  name: "MsgPushEdit",
  props: {},
  components: {
    MsgPushType
  },
  data() {
    return {
      dialogFormVisible: false,
      form: {
        content: "",
        title: "",
        ticker: "",
        id: "",
        filterGroup: ""
      },
      groupList: []
    };
  },
  methods: {
    showDialog(val) {
      this.dialogFormVisible = true;
      for (let i in this.form) {
        this.form[i] = val[i];
      }
      this.getMsgPushGroup();
    },
    dialogEditClose() {
      this.dialogFormVisible = false;
      this.$refs.edit.resetFields();
      this.$emit("refresh");
    },
    addMessagePush() {
      this.$refs.edit.validate(async valid => {
        if (valid) {
          try {
            let res = await updatePush(this.form);
            if (res?.message === "请求成功") {
              this.$message.success("修改成功");
              this.dialogEditClose();
            }
          } catch (e) {
            throw new Error(e);
          }
        }
      });
    },
    async getMsgPushGroup() {
      if (this.form.group) {
        this.form.group = "";
      }
      try {
        let res = await postGroupList("");
        this.groupList = [
          {
            id: "分组管理",
            filterGroup: "分组管理"
          },
          ...res.data
        ];
      } catch (e) {
        throw new Error(e);
      }
    },
    handleTypeManage(val) {
      if (val === "分组管理") {
        this.$refs.msgPushType.handleDrawerOpen();
      }
    }
  }
};
</script>

<style>
.select-group:first-child {
  color: dodgerblue;
}
</style>
