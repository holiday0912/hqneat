<template>
  <!-- 角色绑定资源 -->
  <div>
    <el-dialog
      v-dialogDrag
      :close-on-click-modal="false"
      :visible.sync="dialogFormVisible"
      title="新增提示配置"
      width="680px"
      @close="dialogEditClose"
    >
      <el-form ref="edit" :model="form" label-width="150px">
        <el-form-item
          :rules="[{ required: true, message: '请输入' }]"
          label="样式"
          prop="picPath"
        >
          <el-input v-model="form.picPath" style="width: 82.2%;"></el-input>
        </el-form-item>

        <el-form-item
          :rules="[{ required: true, message: '请输入' }]"
          label="标题"
          prop="tittle"
        >
          <div class="input-wp">
            <el-input v-model="form.tittle"></el-input>
            <span>(中文)</span>
          </div>
        </el-form-item>

        <el-form-item
          :rules="[{ required: true, message: '请输入' }]"
          prop="tittleE"
        >
          <div class="input-wp">
            <el-input v-model="form.tittleE"></el-input>
            <span>(英文)</span>
          </div>
        </el-form-item>

        <el-form-item
          :rules="[{ required: true, message: '请输入' }]"
          prop="tittleF"
        >
          <div class="input-wp">
            <el-input v-model="form.tittleF"></el-input>
            <span>(繁体)</span>
          </div>
        </el-form-item>

        <el-form-item
          :rules="[{ required: true, message: '请输入' }]"
          label="内容"
          prop="property"
        >
          <div class="input-wp">
            <el-input v-model="form.property" maxlength="60"></el-input>
            <span>(中文)</span>
          </div>
        </el-form-item>

        <el-form-item
          :rules="[{ required: true, message: '请输入' }]"
          prop="propertyE"
        >
          <div class="input-wp">
            <el-input v-model="form.propertyE" maxlength="60"></el-input>
            <span>(英文)</span>
          </div>
        </el-form-item>

        <el-form-item
          :rules="[{ required: true, message: '请输入' }]"
          prop="propertyF"
        >
          <div class="input-wp">
            <el-input v-model="form.propertyF" maxlength="60"></el-input>
            <span>(繁体)</span>
          </div>
        </el-form-item>

        <el-form-item
          :rules="[{ required: true, message: '请输入' }]"
          label="类型"
          prop="type"
        >
          <el-autocomplete
            v-model="form.type"
            :fetch-suggestions="querySearch"
            placeholder="请输入内容"
            @select="handleSelect"
          >
            <template v-slot="{ item }">
              <span>{{ item.type }}</span>
            </template>
          </el-autocomplete>
        </el-form-item>

        <!--          @select="handleSelect"-->
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditClose">取 消</el-button>
        <el-button type="primary" @click="addMessagePush">新 增</el-button>
      </div>
    </el-dialog>
    <ToastType ref="toastType" @updateGroup="getTypeList"></ToastType>
  </div>
</template>

<script>
import ToastType from "@/views/toastManage/ToastType.vue";
import { searchTypeList, toastAddNotice } from "@/api/toastManage";

export default {
  name: "ToastAddNew",
  components: {
    ToastType
  },
  props: {},
  data() {
    return {
      dialogFormVisible: false,
      form: {
        property: "",
        propertyE: "",
        propertyF: "",
        tittle: "",
        tittleE: "",
        tittleF: "",
        type: "",
        imgUrl: "",
        picPath: ""
      },
      typeList: []
    };
  },
  methods: {
    showDialog() {
      this.dialogFormVisible = true;
      this.getTypeList();
    },
    dialogEditClose() {
      this.dialogFormVisible = false;
      this.$refs.edit.resetFields();
      this.$emit("refresh");
    },
    querySearch(queryString, cb) {
      const typeList = this.typeList;
      const results = queryString
        ? typeList.filter(this.createFilter(queryString))
        : typeList;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.type.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    handleTypeManage(val) {
      if (val === "类型管理") {
        this.$refs.toastType.handleDrawerOpen();
      }
    },
    async getTypeList() {
      try {
        let res = await searchTypeList();
        this.typeList = res.data;
      } catch (e) {
        throw new Error(e);
      }
    },
    handleSelect(val) {
      this.form.type = val.type;
    },
    addMessagePush() {
      this.$refs.edit.validate(async valid => {
        if (valid) {
          try {
            let res = await toastAddNotice(this.form);
            if (res?.message === "请求成功") {
              this.$message.success("新增成功");
              this.dialogEditClose();
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

.upload-demo {
  margin: 0 0 20px 120px;
}

.input-wp {
  display: flex;

  &:not(:last-child) {
    margin-bottom: 20px;
  }

  span {
    width: 80px;
    margin-left: 20px;
  }
}
</style>
