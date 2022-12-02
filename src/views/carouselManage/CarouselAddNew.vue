<template>
  <!-- 角色绑定资源 -->
  <div>
    <el-dialog
      v-dialogDrag
      :close-on-click-modal="false"
      :visible.sync="dialogFormVisible"
      title="轮播图新增"
      width="680px"
      @close="dialogEditClose"
    >
      <el-form ref="edit" :model="form" label-width="150px">
        <el-upload
          :on-change="handleFileChange"
          :on-error="uploadError"
          :on-success="uploadSuccess"
          action="http://203.195.199.38:9009/file/uploadRemoteServer"
          class="upload-demo"
          drag
          multiple
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件，且不超过500kb
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

export default {
  name: "CarouselAddNew",
  data() {
    return {
      dialogFormVisible: false,
      form: {
        forwardUrl: "",
        imgUrl: "",
        path: ""
      },
      typeList: []
    };
  },
  methods: {
    showDialog() {
      this.dialogFormVisible = true;
    },
    dialogEditClose() {
      this.dialogFormVisible = false;
      this.$refs.edit.resetFields();
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
    uploadError(res) {
      this.$message.error(`请重新上传`);
    },
    async uploadSuccess({ message, data }) {
      if (message === "请求成功") {
        this.form.path = data;
      } else {
        this.$message.error(message);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.select-group:first-child {
  color: dodgerblue;
}

.upload-demo {
  margin: 0 0 20px 120px;
}
</style>
