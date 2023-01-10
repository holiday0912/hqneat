<template>
  <!-- 角色绑定资源 -->
  <div>
    <el-dialog
      v-dialogDrag
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :title="isEdit ? '导航菜单修改' : '导航菜单新增'"
      :visible.sync="dialogFormVisible"
      width="680px"
      @close="dialogEditClose"
      @open="openOrderEdit = true"
    >
      <el-form ref="edit" :model="form" label-width="150px">
        <el-form-item
          :rules="[{ required: true, message: '请输入' }]"
          label="菜单名称"
          prop="text"
        >
          <el-input v-model="form.text"></el-input>
        </el-form-item>

        <el-form-item
          :rules="[{ required: true, message: '请输入' }]"
          label="路由"
          prop="router"
        >
          <el-input v-model="form.router"></el-input>
        </el-form-item>

        <el-form-item label="图标">
          <el-row>
            <el-col v-if="isEdit && !uploadNew" :span="4">
              <el-image
                :preview-src-list="[form.iconUrl]"
                :src="form.iconUrl"
                style="width: 50px;"
              />
            </el-col>
            <el-col :span="20">
              <el-upload
                ref="upload"
                :action="actions"
                :file-list="fileList"
                :multiple="false"
                :on-error="uploadError"
                :on-success="uploadSuccess"
                accept=".png,.jpg,.jpeg"
                list-type="picture"
              >
                <el-button size="small" type="primary"
                  >{{ isEdit ? "上传新的图标" : "点击上传" }}
                </el-button>
                <div slot="tip" class="el-upload__tip">
                  只能上传jpg/jpeg/png文件，且不超过50kb
                </div>
              </el-upload>
            </el-col>
          </el-row>
        </el-form-item>

        <!--        <el-form-item-->
        <!--          :rules="[{ required: true, message: '请输入' }]"-->
        <!--          label="激活图标"-->
        <!--          prop="selectedIconUrl"-->
        <!--        >-->
        <!--          <el-input v-model="form.selectedIconUrl"></el-input>-->
        <!--        </el-form-item>-->

        <el-form-item
          :rules="[{ required: true, message: '请输入' }]"
          label="状态"
          prop="status"
        >
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </el-form-item>

        <el-form-item v-if="!isEdit" label="调整菜单顺序">
          <el-checkbox v-model="openOrderEdit">
            新增成功打开菜单顺序调整页面
          </el-checkbox>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditClose">取 消</el-button>
        <el-button type="primary" @click="handleConfirm"
          >{{ isEdit ? "修 改" : "新 增" }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { insertTabbarInfo, updateTabbarInfo } from "@/api/tabbarCon";
import { fileUpload } from "@/api/htmlPackage";

export default {
  name: "TabbarConAdd",
  data() {
    return {
      dialogFormVisible: false,
      form: {
        text: "",
        router: "",
        status: 1,
        iconUrl: ""
      },
      id: "",
      target: {},
      // 判断是否是编辑页面
      isEdit: false,
      // 上传了的图标预览
      fileList: [],
      //   文件上传的地址
      actions: fileUpload,
      // 打开顺序调整页面
      openOrderEdit: true,
      uploadNew: false
    };
  },
  methods: {
    showDialog() {
      this.isEdit = false;
      this.dialogFormVisible = true;
      this.form.text = "";
      this.form.iconUrl = "";
      this.form.router = "";
      this.form.status = 1;
    },
    editConfirm(target) {
      this.showDialog();
      const temp = JSON.parse(JSON.stringify(target));
      for (let i in this.form) {
        this.form[i] = temp[i];
      }
      this.id = temp.id;
      this.isEdit = true;
    },
    dialogEditClose() {
      this.dialogFormVisible = false;
      this.$refs.edit.resetFields();
    },
    handleConfirm() {
      this.$refs.edit.validate(async valid => {
        if (valid) {
          if (this.isEdit) {
            try {
              const res = await updateTabbarInfo({ ...this.form, id: this.id });
              if (res.code.slice(-5) === "00000") {
                this.$notify({
                  title: "提示",
                  message: "修改成功",
                  type: "success"
                });
                this.dialogEditClose();
                this.$emit("refresh");
              }
            } catch (error) {
              throw new Error(error.message);
            }
          } else {
            this.isUploading = true;
            try {
              const res = await insertTabbarInfo(this.form);
              if (res.code.slice(-5) === "00000") {
                this.$notify({
                  title: "提示",
                  message: "新增成功",
                  type: "success"
                });
                this.dialogEditClose();
                this.$emit("refresh");
                if (this.openOrderEdit) {
                  this.$emit("openOrderEdit");
                }
              } else {
                this.$message.error(res.message);
              }
            } catch (e) {
              throw new Error(e);
            } finally {
              this.isUploading = false;
            }
          }
        }
      });
    },
    uploadError(res) {
      this.$message.error(res.message);
      this.isUploading = false;
    },
    async uploadSuccess({ message, data }) {
      if (message === "请求成功") {
        this.form.iconUrl = data;
        this.uploadNew = true;
      } else {
        this.$message.error(message);
      }
    }
  }
};
</script>
