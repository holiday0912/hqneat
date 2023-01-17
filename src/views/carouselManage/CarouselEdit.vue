<template>
  <!-- 角色绑定资源 -->
  <div>
    <el-dialog
      v-dialogDrag
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :visible.sync="dialogFormVisible"
      title="轮播图修改"
      width="680px"
      @close="dialogEditClose"
    >
      <div :class="carousel.wp">
        <el-image
          :preview-src-list="[imgUrl]"
          :src="imgUrl"
          style="width: 40%;"
        >
        </el-image>

        <el-upload
          :action="actions"
          :file-list="fileList"
          :on-change="handleFileChange"
          :on-error="uploadError"
          :on-success="uploadSuccess"
          drag
          multiple
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或<em>点击上传</em>
            <p>只能上传jpg/png文件，且不超过500kb，上传图片将替换当前图片</p>
          </div>
        </el-upload>
      </div>

      <el-form ref="edit" :model="form" label-width="150px">
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
        <el-button type="primary" @click="carouselEditSubmit">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { carouselImgUpdateVersion } from "@/api/carouselManage";
import { fileUpload } from "@/api/htmlPackage";

export default {
  name: "CarouselEdit",
  data() {
    return {
      dialogFormVisible: false,
      imgUrl: "",
      form: {
        forwardUrl: "",
        id: "",
        imgUrl: ""
      },
      actions: fileUpload,
      fileList: []
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
      this.fileList = [];
      this.$emit("refresh");
    },
    carouselEditSubmit() {
      this.$refs.edit.validate(async valid => {
        if (valid) {
          try {
            let res = await carouselImgUpdateVersion(
              this.form.imgUrl
                ? this.form
                : {
                    forwardUrl: this.form.forwardUrl,
                    id: this.form.id
                  }
            );
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
    },
    handleFileChange(file, fileList) {
      this.selectFile = Boolean(fileList.length);
    },
    uploadError() {
      this.$message.error(`请重新上传`);
    },
    async uploadSuccess({ message, data }) {
      if (message === "请求成功") {
        this.imgUrl = "http://192.168.10.240:8989" + data;
        this.form.imgUrl = data;
      } else {
        this.$message.error(message);
      }
    }
  }
};
</script>

<style module="carousel">
.wp {
  display: flex;
  margin-bottom: 16px;
}
</style>
