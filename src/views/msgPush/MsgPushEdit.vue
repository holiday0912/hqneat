<template>
  <!-- 角色绑定资源 -->
  <el-dialog
    v-dialogDrag
    :close-on-click-modal="false"
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
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogEditClose">取 消</el-button>
      <el-button type="primary" @click="addMessagePush">修 改</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { updatePush } from "@/api/msgPush";

export default {
  name: "MsgPushEdit",
  props: {},
  data() {
    return {
      dialogFormVisible: false,
      form: {
        content: "",
        title: "",
        ticker: "",
        id: ""
      }
    };
  },
  methods: {
    showDialog(val) {
      this.dialogFormVisible = true;
      const { content, title, ticker, id } = val;
      this.form.content = content;
      this.form.title = title;
      this.form.ticker = ticker;
      this.form.id = id;
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
    }
  }
};
</script>
