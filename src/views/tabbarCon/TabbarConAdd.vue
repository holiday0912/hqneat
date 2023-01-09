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
          label="菜单顺序"
          prop="tabbarOrder"
        >
          <el-input v-model="form.tabbarOrder"></el-input>
        </el-form-item>

        <el-form-item
          :rules="[{ required: true, message: '请输入' }]"
          label="路由"
          prop="router"
        >
          <el-input v-model="form.router"></el-input>
        </el-form-item>

        <el-form-item
          :rules="[{ required: true, message: '请输入' }]"
          label="图标"
          prop="iconUrl"
        >
          <el-input v-model="form.iconUrl"></el-input>
        </el-form-item>

        <el-form-item
          :rules="[{ required: true, message: '请输入' }]"
          label="激活图标"
          prop="selectedIconUrl"
        >
          <el-input v-model="form.selectedIconUrl"></el-input>
        </el-form-item>

        <el-form-item
          :rules="[{ required: true, message: '请输入' }]"
          label="状态"
          prop="status"
        >
          <el-select
            v-model="form.status"
            placeholder="请选择"
            style="display: block;width: 200px"
          >
            <el-option
              v-for="item in tabBarStatus"
              :key="item.key"
              :label="item.val"
              :value="item.key"
            />
          </el-select>
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
import { tabBarStatus } from "@/common/enum";

export default {
  name: "TabbarConAdd",
  data() {
    return {
      dialogFormVisible: false,
      form: {
        text: "",
        tabbarOrder: "",
        router: "",
        status: "",
        iconUrl: "",
        selectedIconUrl: ""
      },
      target: {},
      // 判断是否是编辑页面
      isEdit: false,
      tabBarStatus: tabBarStatus
    };
  },
  methods: {
    showDialog() {
      this.isEdit = false;
      this.dialogFormVisible = true;
    },
    editConfirm(target) {
      this.showDialog();
      this.form = JSON.parse(JSON.stringify(target));
      this.isEdit = true;
    },
    dialogEditClose() {
      this.dialogFormVisible = false;
      this.$refs.edit.resetFields();
      this.$emit("refresh");
    },
    serviceTypeChange() {
      this.form.serviceTypeName = this.serviceType.find(
        i => i.key === this.form.serviceTypeCode
      ).val;
    },
    handleConfirm() {
      this.$refs.edit.validate(async valid => {
        if (valid) {
          if (this.isEdit) {
            try {
              const { id, serviceTypeCode, serviceTypeName } = this.form;
              const res = await updateTabbarInfo({
                id,
                serviceTypeCode,
                serviceTypeName
              });
              if (res.code.slice(-5) === "00000") {
                // this.$message.success('修改成功')
                this.$notify({ title: "提示", message: "修改成功" });
                this.dialogEditClose();
              }
            } catch (error) {
              throw new Error(error.message);
            }
          } else {
            try {
              const res = await insertTabbarInfo(this.form);
              if (res.code.slice(-5) === "00000") {
                // this.$message.success('新增成功')
                this.$notify({ title: "提示", message: "新增成功" });
                this.dialogEditClose();
              }
            } catch (error) {
              throw new Error(error.message);
            }
          }
        }
      });
    }
  }
};
</script>
