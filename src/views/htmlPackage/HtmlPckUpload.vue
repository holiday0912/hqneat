<template>
  <!-- h5包上传的弹窗 -->
  <el-dialog
    v-dialogDrag
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :visible.sync="dialogFormVisible"
    title="h5包上传"
    width="680px"
    @close="dialogEditClose"
  >
    <el-form
      ref="uploadMessage"
      :model="form"
      :rules="rules"
      label-width="110px"
    >
      <el-form-item label="版本号" prop="versionCode">
        <el-input v-model="form.versionCode" type="number"></el-input>
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
      :on-change="handleFileChange"
      :on-error="uploadError"
      :on-success="uploadSuccess"
      accept="application/zip"
    >
      <el-button slot="trigger" size="small" type="primary"
        >选取文件
      </el-button>

      <div slot="tip" class="el-upload__tip">
        只能上传zip格式的压缩包，并请直接压缩所需文件，不要直接压缩文件夹
      </div>
    </el-upload>

    <template #footer class="dialog-footer">
      <el-button @click="dialogEditClose">取 消</el-button>
      <el-button
        :disabled="!selectFile"
        :loading="isUploading"
        size="small"
        style="margin-left: 10px;"
        type="primary"
        @click="submitUpload"
        >上传到服务器
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
import { fileUpload, insertVersion } from "@/api/htmlPackage";

export default {
  name: "HtmlPckUpload",
  props: {
    maxVerionCode: {
      type: Number,
      default: 0
    }
  },
  data() {
    const validateVersionCode = (rule, value, callback) => {
      if (value < this.maxVerionCode) {
        callback(new Error(`版本号必须大于${this.maxVerionCode}`));
      } else {
        callback();
      }
    };
    return {
      dialogFormVisible: false,
      fileList: [],
      form: {
        appid: "njebd81krqn",
        versionCode: null,
        descr: "",
        isLatest: "1",
        isForce: "0",
        type: "1"
      },
      actions: fileUpload,
      isUploading: false,
      selectFile: false,
      rules: {
        versionCode: [
          { required: true, message: "请输入" },
          { validator: validateVersionCode, trigger: "change" }
        ]
      }
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
        this.selectFile = false;
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
    async uploadSuccess({ message, data }) {
      if (message === "请求成功") {
        try {
          let res = await insertVersion({ fileUrl: data, ...this.form });
          if (res.message === "请求成功") {
            this.isUploading = false;
            this.$message.success(res.message);
            this.dialogEditClose();
          } else {
            this.isUploading = false;
            this.$message.error(res.message);
          }
        } catch (e) {
          this.isUploading = false;
          throw new Error(e);
        }
      } else {
        this.isUploading = false;
        this.$message.error(message);
      }
    },
    uploadError(res) {
      this.$message.error(res.message);
      this.isUploading = false;
    },
    handleFileChange(file, fileList) {
      this.selectFile = Boolean(fileList.length);
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
