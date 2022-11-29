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
        prop="content"
      >
        <el-input v-model="form.content"></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogEditClose">取 消</el-button>
      <el-button type="primary" @click="addMessagePush">新 增</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { msgPushInsert } from "@/api/msgPush";

export default {
  name: "MsgAddNew",
  props: {},
  data() {
    return {
      dialogFormVisible: false,
      form: {
        content: ""
      }
    };
  },
  methods: {
    showDialog() {
      this.dialogFormVisible = true;
    },
    dialogEditClose() {
      this.dialogFormVisible = false;
      this.$refs.edit.resetFields();
      this.formRest();
      this.$emit("refresh");
    },
    addMessagePush() {
      this.$refs.edit.validate(async valid => {
        if (valid) {
          try {
            let res = await msgPushInsert({ content: this.form.content });
            if (res?.message === "请求成功") {
              this.$message.success("新增成功");
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

<style lang="less" scoped></style>
