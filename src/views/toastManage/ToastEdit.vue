<template>
  <!-- 角色绑定资源 -->
  <div>
    <el-dialog
      v-dialogDrag
      :close-on-click-modal="false"
      :visible.sync="dialogFormVisible"
      title="编辑toast样式"
      width="680px"
      @close="dialogEditClose"
    >
      <el-form ref="edit" :model="form" label-width="150px">
        <el-form-item
          :rules="[{ required: true, message: '请输入' }]"
          label="标题"
          prop="title"
        >
          <el-input v-model="form.title"></el-input>
        </el-form-item>

        <el-form-item
          :rules="[{ required: true, message: '请输入' }]"
          label="属性"
          prop="property"
        >
          <el-input v-model="form.property"></el-input>
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
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditClose">取 消</el-button>
        <el-button type="primary" @click="editMessagePush">新 增</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { searchTypeList, toastUpdateNotice } from "@/api/toastManage";

export default {
  name: "ToastEdit",
  data() {
    return {
      dialogFormVisible: false,
      form: {
        property: "",
        title: "",
        type: ""
      },
      typeList: []
    };
  },
  methods: {
    showDialog(val) {
      this.dialogFormVisible = true;
      this.form.property = val.property;
      this.form.title = val.title;
      this.form.type = val.type;
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
    editMessagePush() {
      this.$refs.edit.validate(async valid => {
        if (valid) {
          try {
            let res = await toastUpdateNotice(this.form);
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
    }
  }
};
</script>

<style lang="scss" scoped>
.select-group:first-child {
  color: dodgerblue;
}
</style>
