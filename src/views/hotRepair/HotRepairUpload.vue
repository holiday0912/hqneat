<template>
  <!-- h5包上传的弹窗 -->
  <el-dialog
    v-dialogDrag
    :close-on-click-modal="false"
    :visible.sync="dialogFormVisible"
    title="热修复"
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
        label="更新时间"
        prop="updateTime"
      >
        <el-input v-model="form.updateTime"></el-input>
      </el-form-item>
    </el-form>

    <el-upload
      ref="upload"
      :action="actions"
      :auto-upload="false"
      :file-list="fileList"
      :multiple="false"
      :on-change="handleFileChange"
      :on-remove="handleRemove"
      accept="application/zip"
    >
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <el-button
        :disabled="!selectFile"
        :loading="isUploading"
        class="upload-btn"
        size="small"
        style="margin-left: 10px;"
        type="success"
        @click="submitUpload"
        >上传到服务器
      </el-button>
      <!--      <div slot="tip" class="el-upload__tip">-->
      <!--        只能上传zip格式的压缩包-->
      <!--      </div>-->
    </el-upload>

    <template #footer class="dialog-footer">
      <el-button @click="dialogEditClose">取 消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { fileUpload } from "@/api/htmlPackage";

export default {
  name: "HotRepairUpload",
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
      isUploading: false,
      selectFile: false
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
        this.selectFile = false;
        this.$refs.uploadMessage.resetFields();
        this.$emit("refresh");
      } else {
        this.$message.info("文件正在上传中");
      }
    },
    submitUpload() {
      this.$refs.uploadMessage.validate(valid => {
        if (valid) {
          if (this.fileList.length === 0) {
            this.$message.error("请选择上传文件");
          } else {
            this.isUploading = true;
            // this.$refs.upload.submit();
            setTimeout(() => {
              this.isUploading = false;
              this.dialogEditClose();
            }, 2000);
          }
        }
      });
    },
    // async uploadSuccess({ data }) {
    //   try {
    //     let res = await insertVersion({ fileUrl: data, ...this.form });
    //     if (res) {
    //       this.isUploading = false;
    //       this.$message.success(res.message);
    //       this.dialogEditClose();
    //     }
    //   } catch (e) {
    //     this.isUploading = false;
    //     throw new Error(e);
    //   }
    // },
    // uploadError(res) {
    //   this.$message.error(res.message);
    //   this.isUploading = false;
    // },
    handleRemove(file, fileList) {
      console.log(file, fileList);
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
