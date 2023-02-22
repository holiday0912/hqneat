<template>
  <!-- 角色绑定资源 -->
  <div>
    <el-dialog
      v-dialogDrag
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :visible.sync="dialogFormVisible"
      title="提示配置修改"
      width="680px"
      @close="dialogEditClose"
    >
      <el-form ref="edit" :model="form" label-width="150px">
        <el-form-item
          :rules="[{ required: true, message: '请输入' }]"
          label="内容"
          prop="property"
        >
          <el-input v-model="form.property"></el-input>
        </el-form-item>

        <el-form-item
          :rules="[{ required: true, message: '请输入' }]"
          label="类型"
          prop="type"
        >
          <el-input v-model="form.serviceTypeName" disabled></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditClose">取 消</el-button>
        <el-button type="primary" @click="editMessagePush">编 辑</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { toastUpdateNotice } from "@/api/toastManage";

export default {
  name: "ToastEdit",
  data() {
    return {
      dialogFormVisible: false,
      form: {
        property: "",
        serviceTypeName: "",
        id: ""
      },
      typeList: []
    };
  },
  methods: {
    showDialog(val) {
      this.dialogFormVisible = true;
      for (let i in this.form) {
        this.form[i] = val[i];
      }
    },
    dialogEditClose() {
      this.dialogFormVisible = false;
      this.$refs.edit.resetFields();
      this.$emit("refresh");
    },
    editMessagePush() {
      this.$refs.edit.validate(async valid => {
        if (valid) {
          try {
            let res = await toastUpdateNotice(this.form);
            if (res?.message === "请求成功") {
              this.$message.success("修改成功");
              this.dialogEditClose();
            } else {
              this.$message.error(res.message);
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
