<template>
  <!-- 角色绑定资源 -->
  <div>
    <el-dialog
      v-dialogDrag
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :visible.sync="dialogFormVisible"
      title="轮播图新增"
      width="680px"
      @close="dialogEditClose"
    >
      <el-form ref="edit" :model="form" label-width="150px">
        <el-upload
          :action="actions"
          :file-list="fileList"
          :on-change="handleFileChange"
          :on-error="uploadError"
          :on-success="uploadSuccess"
          drag
          style="padding-left: 140px"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或<em>点击上传</em>
            <p>只能上传jpg/png文件，且不超过500kb</p>
          </div>
        </el-upload>

        <el-form-item
          :rules="[{ required: true, message: '请输入' }]"
          label="导航地址"
          prop="forwardUrl"
        >
          <el-input v-model="form.forwardUrl"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditClose">取 消</el-button>
        <el-button type="primary" @click="carouselEditSubmit">新 增</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { carouselImgInsert } from "@/api/carouselManage";
import { fileUpload } from "@/api/htmlPackage";

export default {
  name: "CarouselAddNew",
  data() {
    return {
      dialogFormVisible: false,
      form: {
        forwardUrl: "",
        imgUrl: ""
      },
      actions: fileUpload,
      fileList: []
    };
  },
  methods: {
    showDialog() {
      this.dialogFormVisible = true;
    },
    dialogEditClose() {
      this.dialogFormVisible = false;
      this.$refs.edit.resetFields();
      this.fileList = [];
      this.$emit("refresh");
    },
    carouselEditSubmit() {
      this.$refs.edit.validate(async valid => {
        if (valid) {
          try {
            let res = await carouselImgInsert(this.form);
            if (res?.message === "请求成功") {
              this.$message.success("新增成功");
              this.dialogEditClose();
            } else {
              this.$message.error(res.message);
            }
          } catch (e) {
            throw new Error(e);
          }
        }
      });
    },
    handleFileChange(file, fileList) {
      this.selectFile = Boolean(fileList.length);
    },
    uploadError() {
      this.$message.error(`请重新上传`);
    },
    async uploadSuccess({ message, data }) {
      if (message === "请求成功") {
        this.form.imgUrl = data;
      } else {
        this.$message.error(message);
      }
    }
  }
};
</script>
