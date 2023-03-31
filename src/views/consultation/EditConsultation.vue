<template>
  <div>
    <el-form
      ref="dialogForm"
      :model="dialogForm"
      label-width="80px"
      label-position="right"
      :rules="rules"
      inline
    >
      <gridTwo>
        <el-form-item prop="typeId" slot="left" label="类型名称">
          <el-select
            :disabled="dialogType == 'query'"
            v-model="dialogForm.typeId"
            placeholder="请输入"
            clearable
          >
            <el-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.typeName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item slot="right" prop="status" label="状态">
          <el-select
            :disabled="dialogType == 'query'"
            v-model="dialogForm.status"
            placeholder="请输入"
            clearable
          >
            <el-option
              v-for="item in statusList"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </gridTwo>
      <gridTwo class="url_content">
        <el-form-item prop="title" slot="left" label="标题">
          <el-input
            :disabled="dialogType == 'query'"
            type="textarea"
            v-model="dialogForm.title"
          ></el-input>
        </el-form-item>
        <el-form-item prop="forwardUrl" slot="left" label="链接">
          <el-input
            :disabled="dialogType == 'query'"
            type="textarea"
            v-model="dialogForm.forwardUrl"
          ></el-input>
        </el-form-item>
      </gridTwo>

      <gridTwo>
        <el-form-item slot="left" label="缩略图">
          <el-upload
            :action="actions"
            :file-list="fileList"
            v-if="dialogType !== 'query'"
            :on-change="handleFileChange"
            :on-error="uploadError"
            :on-success="uploadSuccess"
            drag
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
              <p>只能上传jpg/png文件，且不超过500kb</p>
            </div>
          </el-upload>
          <el-image
            v-else
            :preview-src-list="[dialogForm.imgUrl]"
            :src="dialogForm.imgUrl"
            lazy
            style="width: 200px;"
          />
        </el-form-item>
        <el-form-item slot="left" prop="isUp" label="是否推荐">
          <el-select
            :disabled="dialogType == 'query'"
            v-model="dialogForm.isUp"
            placeholder="请输入"
            clearable
          >
            <el-option
              v-for="j in isUpList"
              :key="j.id"
              :label="j.value"
              :value="j.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </gridTwo>
    </el-form>
    <div slot="footer" style="text-align:right">
      <el-button @click="cancel" v-if="dialogType != 'query'">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </div>
  </div>
</template>

<script>
import gridTwo from "@/components/Page/gridTwo";
import { updateConfig } from "@/api/consultation";
import { fileUpload } from "@/api/htmlPackage";
export default {
  name: "AddConsultation",
  components: { gridTwo },
  props: {
    typeList: {
      type: Array,
      default: () => []
    },
    formData: {
      type: Object,
      default: () => {}
    },
    dialogType: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      dialogForm: {
        typeId: "",
        status: "",
        title: "",
        imgUrl: "",
        forwardUrl: "",
        isUp: ""
      },
      actions: fileUpload,
      fileList: [],
      flag: false,
      rules: {
        typeId: [{ required: true, message: "请选择", trigger: "change" }],
        status: [{ required: true, message: "请选择", trigger: "change" }],
        forwardUrl: [{ required: true, message: "请输入", trigger: "blur" }],
        isUp: [{ required: true, message: "请选择", trigger: "change" }]
      }
    };
  },
  mounted() {
    let obj = JSON.parse(JSON.stringify(this.formData));
    for (let i in this.dialogForm) {
      this.dialogForm[i] = obj[i];
    }
  },
  computed: {
    statusList() {
      return [
        {
          id: 0,
          value: "停用"
        },
        {
          id: 1,
          value: "启用"
        }
      ];
    },
    isUpList() {
      return [
        {
          id: 0,
          value: "否"
        },
        {
          id: 1,
          value: "是"
        }
      ];
    }
  },
  methods: {
    handleFileChange(file, fileList) {
      this.selectFile = Boolean(fileList.length);
    },
    uploadError() {
      this.$message.error(`请重新上传`);
    },
    async uploadSuccess({ message, data }) {
      if (message === "请求成功") {
        this.dialogForm.imgUrl = data;
      } else {
        this.$message.error(message);
      }
    },
    addInfo() {
      this.dialogForm.marketInfos.push({
        title: "",
        typeId: "",
        status: "",
        isUp: ""
      });
    },
    deleteInfo() {
      this.dialogForm.marketInfos.pop();
    },
    cancel() {
      this.$emit("cancel");
    },
    confirm() {
      if (this.dialogType === "query") {
        this.$emit("confirm");
        return;
      }
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          try {
            let res = await updateConfig({
              ...this.dialogForm,
              id: this.formData.id
            });
            if (res) {
              this.$message.success("修改成功");
              this.$emit("confirm");
            }
          } catch (error) {
            throw new Error(error);
          }
        } else {
          // this.$message.error("请输入账号和密码");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .url_content {
  .el-form-item {
    width: 200%;
    .el-form-item__content {
      width: 80%;
    }
  }
}
.market-title {
  margin: 10px 30px 0 20px;
  .line {
    margin-top: 5px;
    width: 100%;
    height: 1px;
    background-color: #ccc;
  }
}
.btn-content {
  position: absolute;
  right: 45%;
  bottom: 3%;
}
</style>
