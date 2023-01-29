<template>
  <!-- h5包上传的弹窗 -->
  <el-dialog
    v-dialogDrag
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :visible.sync="dialogFormVisible"
    title="热修复"
    width="680px"
    @close="dialogEditClose"
  >
    <el-form ref="uploadMessage" :model="form" label-width="110px">
      <el-form-item
        :rules="[{ required: true, message: '请输入' }]"
        label="版本号"
        prop="pkVersion"
      >
        <el-input v-model="form.pkVersion"></el-input>
      </el-form-item>

      <el-form-item
        :rules="[{ required: true, message: '请输入' }]"
        label="包名称"
        prop="pkName"
      >
        <el-input v-model="form.pkName"></el-input>
      </el-form-item>

      <el-form-item label="发布时间" prop="pubTime">
        <el-date-picker
          v-model="form.pubTime"
          placeholder="请选择日期"
          style="width: 200px"
          type="date"
        >
        </el-date-picker>
      </el-form-item>
    </el-form>

    <el-upload
      ref="upload"
      :action="actions"
      :auto-upload="false"
      :file-list="fileList"
      :multiple="false"
      :on-change="handleFileChange"
      accept=".jar"
    >
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <div slot="tip" class="el-upload__tip">
        只能上传jar包
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
import { fileUpload } from "@/api/htmlPackage";
import { nyHotDepAddHotDep } from "@/api/hotRepair";

export default {
  name: "HotRepairUpload",
  props: {},
  data() {
    return {
      dialogFormVisible: false,
      fileList: [],
      form: {
        pkVersion: "",
        pkName: "",
        pubTime: ""
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
            setTimeout(async () => {
              try {
                let res = await nyHotDepAddHotDep(this.form);
                if (res.message === "请求成功") {
                  this.isUploading = false;
                  this.dialogEditClose();
                  this.$message.success("上传成功");
                } else {
                  this.$message.error(res.message);
                }
              } catch (e) {
                throw new Error(e);
              }
            }, 2000);
          }
        }
      });
    },
    handleFileChange(file, fileList) {
      this.selectFile = Boolean(fileList.length);
    }
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
  }
};
</script>

<style lang="scss" scoped>
.el-upload__tip {
  margin-left: 10px;
}
</style>
