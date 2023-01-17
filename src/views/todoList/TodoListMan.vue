<template>
  <!-- 角色绑定资源 -->
  <div>
    <el-dialog
      v-dialogDrag
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :title="isEdit ? '待办事项修改' : '待办事项新增'"
      :visible.sync="dialogFormVisible"
      width="680px"
      @close="dialogEditClose"
    >
      <el-form ref="edit" :model="form" label-width="150px">
        <el-form-item
          :rules="[{ required: true, message: '请输入' }]"
          label="待办事件"
          prop="eventName"
        >
          <el-input v-model="form.eventName"></el-input>
        </el-form-item>

        <el-form-item
          :rules="[{ required: true, message: '请输入' }]"
          label="事件类型"
          prop="eventType"
        >
          <el-input v-model="form.eventType"></el-input>
        </el-form-item>

        <el-form-item label="图标">
          <el-row>
            <el-col v-if="isEdit && !uploadNew" :span="4">
              <el-image
                :preview-src-list="[iconUrl]"
                :src="iconUrl"
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
import { fileUpload } from "@/api/htmlPackage";
import { insertEventInfo, updateEventInfo } from "@/api/todoList";

export default {
  name: "TodoListMan",
  data() {
    return {
      dialogFormVisible: false,
      form: {
        eventName: "",
        eventType: "",
        iconUrl: ""
      },
      id: "",
      iconUrl: "",
      target: {},
      // 判断是否是编辑页面
      isEdit: false,
      // 上传了的图标预览
      fileList: [],
      //   文件上传的地址
      actions: fileUpload,
      uploadNew: false
    };
  },
  methods: {
    showDialog() {
      this.isEdit = false;
      this.dialogFormVisible = true;
      for (let i in this.form) {
        this.form[i] = "";
      }
    },
    editConfirm(target) {
      this.showDialog();
      const temp = JSON.parse(JSON.stringify(target));
      this.form.eventName = temp.eventName;
      this.form.eventType = temp.eventType;
      const target1 = temp.iconUrl;
      if (target1) {
        this.iconUrl = target1;
        this.form.iconUrl = target1.slice(target1.indexOf("/home"));
      }
      this.id = temp.id;
      this.uploadNew = false;
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
              const res = await updateEventInfo({ ...this.form, id: this.id });
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
              const res = await insertEventInfo(this.form);
              if (res.code.slice(-5) === "00000") {
                this.$notify({
                  title: "提示",
                  message: "新增成功",
                  type: "success"
                });
                this.dialogEditClose();
                this.$emit("refresh");
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
