<template>
  <!-- h5包上传的弹窗 -->
  <el-dialog
    v-dialogDrag
    :close-on-click-modal="false"
    :visible.sync="dialogFormVisible"
    title="热修复修改"
    width="680px"
    @close="dialogEditClose"
  >
    <el-form ref="uploadMessage" :model="form" label-width="110px">
      <el-form-item
        :rules="[{ required: true, message: '请输入' }]"
        label="版本号"
        prop="pkVersion"
      >
        <el-input v-model="form.pkVersion" disabled></el-input>
      </el-form-item>

      <el-form-item
        :rules="[{ required: true, message: '请输入' }]"
        label="包名称"
        prop="pkName"
      >
        <el-input v-model="form.pkName" disabled></el-input>
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

    <template #footer class="dialog-footer">
      <el-button @click="dialogEditClose">取 消</el-button>
      <el-button type="primary" @click="dialogEdit">修 改</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { fileUpload } from "@/api/htmlPackage";
import { nyHotDepUpdateData } from "@/api/hotRepair";

export default {
  name: "HotRepairEdit",
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
    showDialog(val) {
      this.dialogFormVisible = true;
      this.form.pkVersion = val.pkVersion;
      this.form.pkName = val.pkName;
      this.form.pubTime = val.pubTime;
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
    async dialogEdit() {
      try {
        let res = await nyHotDepUpdateData({ pubTime: this.form.pubTime });
        if (res.message === "请求成功") {
          this.$message.success("修改成功");
        } else {
          this.$message.error(res.message);
        }
      } catch (e) {
        throw new Error(e);
      }
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
