<template>
  <!-- 角色绑定资源 -->
  <el-dialog
    v-dialogDrag
    :close-on-click-modal="false"
    :visible.sync="dialogFormVisible"
    title="h5包上传"
    width="680px"
    @close="dialogEditClose"
  >
    <el-form ref="edit" :model="form" label-width="80px">
      <el-form-item
        :rules="[{ required: true, message: '请输入' }]"
        label="版本号"
        prop="version"
      >
        <el-input v-model="form.version"></el-input>
      </el-form-item>
    </el-form>

    <el-upload
      ref="upload"
      :action="actions"
      :auto-upload="false"
      :data="{ version: form.version }"
      :file-list="fileList"
      :on-remove="handleRemove"
    >
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <el-button
        class="upload-btn"
        size="small"
        style="margin-left: 10px;"
        type="success"
        @click="submitUpload"
        >上传到服务器
      </el-button>
      <div slot="tip" class="el-upload__tip">
        请选择上传的文件
      </div>
    </el-upload>

    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogEditClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { fileUpload } from "@/api/htmlPackage";

export default {
  name: "HtmlPckUpload",
  props: {},
  data() {
    return {
      dialogFormVisible: false,
      fileList: [],
      form: {
        version: ""
      },
      actions: fileUpload
    };
  },
  methods: {
    showDialog() {
      this.dialogFormVisible = true;
    },
    // 表单重置
    formRest() {
      this.$refs.edit.resetFields();
    },
    dialogEditClose() {
      this.dialogFormVisible = false;
      this.formRest();
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    }
  }
};
</script>

<style lang="scss" scoped>
.upload-btn {
  transform: translateX(80px);
}
</style>
