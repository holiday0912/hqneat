<template>
  <!-- 新增事件的弹窗 -->
  <el-dialog
    v-dialogDrag
    :close-on-click-modal="false"
    :visible.sync="dialogFormVisible"
    title="新增事件"
    width="680px"
    @close="dialogEditClose"
  >
    <el-form ref="uploadMessage" :model="form" label-width="110px">
      <el-form-item
        :rules="[{ required: true, message: '请输入' }]"
        label="事件id"
        prop="eventId"
      >
        <el-input v-model="form.eventId"></el-input>
      </el-form-item>
      <el-form-item
        :rules="[{ required: true, message: '请输入' }]"
        label="事件名称"
        prop="eventName"
      >
        <el-input v-model="form.eventName"></el-input>
      </el-form-item>

      <el-form-item
        :rules="[{ required: true, message: '请输入' }]"
        label="触发时机"
        prop="triggerTiming"
      >
        <el-input v-model="form.triggerTiming" type="textarea"></el-input>
      </el-form-item>

      <el-form-item
        :rules="[{ required: true, message: '请输入' }]"
        label="类型"
        prop="classLabels"
      >
        <el-select v-model="form.classLabels" placeholder="请选择">
          <el-option
            v-for="item in typeList"
            :key="item.key"
            :label="item.val"
            :value="item.val"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer class="dialog-footer">
      <el-button @click="dialogEditClose">取 消</el-button>
      <el-button type="primary" @click="submitUpload">提 交</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { addEvent } from "@/api/buryData";

export default {
  name: "BuryDataAdd",
  props: {},
  data() {
    return {
      dialogFormVisible: false,
      form: {
        triggerTiming: "",
        eventName: "",
        classLabels: "",
        // classLabels: "",
        // collectionStatus: "",
        eventId: ""
      },
      isUploading: false
    };
  },
  computed: {
    typeList() {
      return [
        {
          key: "点击事件",
          val: "点击事件"
        },
        {
          key: "页面点击事件",
          val: "页面点击事件"
        }
      ];
    }
  },
  methods: {
    showDialog() {
      this.dialogFormVisible = true;
    },
    dialogEditClose() {
      if (!this.isUploading) {
        this.dialogFormVisible = false;
        this.$refs.uploadMessage.resetFields();
        this.$emit("refresh");
      } else {
        this.$message.info("正在上传中");
      }
    },
    submitUpload() {
      this.$refs.uploadMessage.validate(async valid => {
        if (valid) {
          this.isUploading = true;
          try {
            let res = await addEvent(this.form);
            if (res.message === "请求成功") {
              this.$message.success("添加成功");
            }
            this.isUploading = false;
            this.dialogEditClose();
          } catch (e) {
            this.isUploading = false;
            throw new Error(e);
          }
        }
      });
    }
  }
};
</script>
