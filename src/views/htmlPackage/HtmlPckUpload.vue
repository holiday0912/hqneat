<template>
  <!-- h5包上传的弹窗 -->
  <el-dialog
    v-dialogDrag
    :close-on-click-modal="false"
    :visible.sync="dialogFormVisible"
    title="h5包上传"
    width="680px"
    @close="dialogEditClose"
  >
    <el-form ref="uploadMessage" :model="form" label-width="110px">
      <el-form-item
        :rules="[{ required: true, message: '请输入' }]"
        label="版本号"
        prop="versionCode"
      >
        <el-input v-model="form.versionCode"></el-input>
      </el-form-item>
      <el-form-item
        :rules="[{ required: true, message: '请输入' }]"
        label="描述"
        prop="descr"
      >
        <el-input v-model="form.descr"></el-input>
      </el-form-item>

      <el-form-item
        :rules="[{ required: true, message: '请输入' }]"
        label="是否最新"
        prop="descr"
      >
        <template>
          <el-radio v-model="form.isLatest" label="1">是</el-radio>
          <el-radio v-model="form.isLatest" label="0">否</el-radio>
        </template>
      </el-form-item>

      <el-form-item
        :rules="[{ required: true, message: '请输入' }]"
        label="是否强制更新"
        prop="descr"
      >
        <template>
          <el-radio v-model="form.isForce" label="1">是</el-radio>
          <el-radio v-model="form.isForce" label="0">否</el-radio>
        </template>
      </el-form-item>

      <el-form-item
        :rules="[{ required: true, message: '请输入' }]"
        label="类型"
        prop="descr"
      >
        <template>
          <el-radio v-model="form.type" label="1">离线包</el-radio>
          <el-radio v-model="form.type" label="0">安装包</el-radio>
        </template>
      </el-form-item>
    </el-form>

    <el-upload
      ref="upload"
      :action="actions"
      :auto-upload="false"
      :file-list="fileList"
      :multiple="false"
      :on-error="uploadError"
      :on-remove="handleRemove"
      :on-success="uploadSuccess"
      accept="application/zip"
    >
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <el-button
        :loading="isUploading"
        class="upload-btn"
        size="small"
        style="margin-left: 10px;"
        type="success"
        @click="submitUpload"
        >上传到服务器
      </el-button>
      <div slot="tip" class="el-upload__tip">
        只能上传zip格式的压缩包
      </div>
    </el-upload>

    <template #footer class="dialog-footer">
      <el-button @click="dialogEditClose">取 消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { fileUpload, insertVersion } from "@/api/htmlPackage";

export default {
  name: "HtmlPckUpload",
  props: {},
  data() {
    return {
      dialogFormVisible: false,
      fileList: [],
      form: {
        appid: "njebd81krqn",
        versionCode: "",
        descr: "",
        isLatest: "1",
        isForce: "0",
        type: "1"
      },
      actions: fileUpload,
      isUploading: false
    };
  },
  methods: {
    showDialog() {
      this.dialogFormVisible = true;
    },
    dialogEditClose() {
      if (!this.isUploading) {
        this.dialogFormVisible = false;
        this.fileList = [];
        this.$refs.uploadMessage.resetFields();
        this.$emit("refresh");
      } else {
        this.$message.info("文件正在上传中");
      }
    },
    submitUpload() {
      this.$refs.uploadMessage.validate(valid => {
        if (valid) {
          this.isUploading = true;
          this.$refs.upload.submit();
        }
      });
    },
    async uploadSuccess({ data }) {
      try {
        let res = await insertVersion({ fileUrl: data, ...this.form });
        if (res) {
          this.isUploading = false;
          this.$message.success(res.message);
          this.dialogEditClose();
        }
      } catch (e) {
        throw new Error(e);
      }
    },
    uploadError(res) {
      this.$message.error(res.message);
      this.isUploading = false;
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

.el-upload__tip {
  margin-left: 10px;
}
</style>
