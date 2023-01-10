<template>
  <!-- 角色绑定资源 -->
  <div>
    <el-dialog
      v-dialogDrag
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :title="isEdit ? '业务类型修改' : '业务类型新增'"
      :visible.sync="dialogFormVisible"
      width="680px"
      @close="dialogEditClose"
    >
      <el-form ref="edit" :model="form" label-width="150px">
        <el-form-item
          :rules="[{ required: true, message: '请输入' }]"
          label="业务类型"
          prop="serviceTypeCode"
        >
          <el-select
            v-model="form.serviceTypeCode"
            placeholder="请选择"
            style="display: block;width: 200px"
            @change="serviceTypeChange"
          >
            <el-option
              v-for="item in serviceType"
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
import { insertServiceType, updateServiceType } from "@/api/serviceType";
import { serviceType } from "@/common/enum";

export default {
  name: "ServiceTypeAdd",
  data() {
    return {
      dialogFormVisible: false,
      form: {
        serviceTypeCode: "",
        serviceTypeName: ""
      },
      target: {},
      serviceType: serviceType,
      // 判断是否是编辑页面
      isEdit: false
    };
  },
  methods: {
    showDialog() {
      this.dialogFormVisible = true;
      this.isEdit = false;
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
    async handleConfirm() {
      if (this.isEdit) {
        try {
          const { id, serviceTypeCode, serviceTypeName } = this.form;
          const res = await updateServiceType({
            id,
            serviceTypeCode,
            serviceTypeName
          });
          if (res.code.slice(-5) === "00000") {
            // this.$message.success('修改成功')
            this.$notify({
              title: "提示",
              message: "修改成功",
              type: "success"
            });
            this.dialogEditClose();
          }
        } catch (error) {
          throw new Error(error.message);
        }
      } else {
        try {
          const res = await insertServiceType(this.form);
          if (res.code.slice(-5) === "00000") {
            // this.$message.success('新增成功')
            this.$notify({
              title: "提示",
              message: "新增成功",
              type: "success"
            });
            this.dialogEditClose();
          }
        } catch (error) {
          throw new Error(error.message);
        }
      }
    }
  }
};
</script>
