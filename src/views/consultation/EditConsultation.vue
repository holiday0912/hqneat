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
        <el-form-item prop="url" slot="left" label="链接">
          <el-input
            :disabled="dialogType == 'query'"
            type="textarea"
            v-model="dialogForm.url"
          ></el-input>
        </el-form-item>
      </gridTwo>

      <div class="market-title">
        市场信息
        <div class="line"></div>
      </div>

      <div style="position:relative">
        <div
          style="margin-top:20px"
          v-for="(item, index) in dialogForm.marketInfos"
          :key="index"
        >
          <gridTwo class="url_content">
            <el-form-item required slot="left" label="标题">
              <el-input
                :disabled="dialogType == 'query'"
                type="textarea"
                v-model="item.title"
              ></el-input>
            </el-form-item>
          </gridTwo>
          <gridTwo>
            <el-form-item required slot="left" label="类型">
              <el-select
                :disabled="dialogType == 'query'"
                v-model="item.typeId"
                placeholder="请输入"
                clearable
              >
                <el-option
                  v-for="i in typeList"
                  :key="i.id"
                  :label="i.typeName"
                  :value="i.id"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item required slot="right" label="状态">
              <el-select
                :disabled="dialogType == 'query'"
                v-model="item.status"
                placeholder="请输入"
                clearable
              >
                <el-option
                  v-for="j in statusList"
                  :key="j.id"
                  :label="j.value"
                  :value="j.id"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item required slot="left" label="是否推荐">
              <el-select
                :disabled="dialogType == 'query'"
                v-model="item.isUp"
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
        </div>
        <div class="btn-content" v-if="dialogType != 'query'">
          <el-button type="primary" style="font-size:20px" @click="addInfo"
            >+</el-button
          >
          <el-button
            type="primary"
            style="font-size:20px"
            @click="deleteInfo"
            v-if="dialogForm.marketInfos.length > 1"
            >-</el-button
          >
        </div>
      </div>
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
        url: "",
        marketInfos: [
          {
            title: "",
            typeId: "",
            status: "",
            isUp: ""
          }
        ]
      },
      flag: false,
      rules: {
        typeId: [{ required: true, message: "请选择", trigger: "change" }],
        status: [{ required: true, message: "请选择", trigger: "change" }],
        url: [{ required: true, message: "请输入", trigger: "blur" }]
      }
    };
  },
  mounted() {
    console.log(this.formData, 232);
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
          this.dialogForm.marketInfos.forEach(item => {
            for (let i in item) {
              if (item[i] === "") {
                this.flag = true;
                return;
              }
            }
            if (this.flag) {
              return;
            }
          });
          if (this.flag) {
            this.$message.error("请将市场信息输入完整");
            this.flag = false;
            return;
          }
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
