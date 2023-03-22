<template>
  <div>
    <el-form
      ref="addForm"
      :model="addForm"
      label-width="80px"
      label-position="right"
      :rules="rules"
      inline
    >
      <gridTwo>
        <el-form-item prop="typeId" slot="left" label="类型名称">
          <el-select v-model="addForm.typeId" placeholder="请输入" clearable>
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
          <el-select v-model="addForm.status" placeholder="请输入" clearable>
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
          <el-input type="textarea" v-model="addForm.url"></el-input>
        </el-form-item>
      </gridTwo>

      <div class="market-title">
        市场信息
        <div class="line"></div>
      </div>

      <div style="position:relative">
        <div
          style="margin-top:20px"
          v-for="(item, index) in addForm.marketInfos"
          :key="index"
        >
          <gridTwo class="url_content">
            <el-form-item required slot="left" label="标题">
              <el-input type="textarea" v-model="item.title"></el-input>
            </el-form-item>
          </gridTwo>
          <gridTwo>
            <el-form-item required slot="left" label="类型">
              <el-select v-model="item.typeId" placeholder="请输入" clearable>
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
              <el-select v-model="item.status" placeholder="请输入" clearable>
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
              <el-select v-model="item.isUp" placeholder="请输入" clearable>
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
        <div class="btn-content">
          <el-button type="primary" style="font-size:20px" @click="addInfo"
            >+</el-button
          >
          <el-button
            type="primary"
            style="font-size:20px"
            @click="deleteInfo"
            v-if="addForm.marketInfos.length > 1"
            >-</el-button
          >
        </div>
      </div>
    </el-form>
    <div slot="footer" style="text-align:right">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </div>
  </div>
</template>

<script>
import { addInsert } from "@/api/consultation";
import gridTwo from "@/components/Page/gridTwo";
export default {
  name: "AddConsultation",
  components: { gridTwo },
  props: {
    typeList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      addForm: {
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
      this.addForm.marketInfos.push({
        title: "",
        typeId: "",
        status: "",
        isUp: ""
      });
    },
    deleteInfo() {
      this.addForm.marketInfos.pop();
    },
    cancel() {
      this.$emit("addCancel");
    },
    confirm() {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          this.addForm.marketInfos.forEach(item => {
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
            console.log("params", this.addForm);
            let res = await addInsert({ ...this.addForm });
            if (res) {
              this.$message.success("新增成功");
              this.$emit("addConfirm");
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
