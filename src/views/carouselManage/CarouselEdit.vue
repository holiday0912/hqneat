<template>
  <!-- 角色绑定资源 -->
  <div>
    <el-dialog
      v-dialogDrag
      :close-on-click-modal="false"
      :visible.sync="dialogFormVisible"
      title="轮播图修改"
      width="680px"
      @close="dialogEditClose"
    >
      <el-form ref="edit" :model="form" label-width="150px">
        <img
          :src="imgUrl"
          alt="轮播图"
          style="margin-bottom: 20px"
          width="100%"
        />

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

export default {
  name: "CarouselEdit",
  data() {
    return {
      dialogFormVisible: false,
      imgUrl: "",
      form: {
        forwardUrl: "",
        id: ""
      }
    };
  },
  methods: {
    showDialog(val) {
      this.dialogFormVisible = true;
      this.form.id = val.id;
      this.form.forwardUrl = val.forwardUrl;
      this.imgUrl = val.imgUrl;
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
            let res = await carouselImgUpdateVersion(this.form);
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

<style lang="scss" scoped>
.select-group:first-child {
  color: dodgerblue;
}
</style>
