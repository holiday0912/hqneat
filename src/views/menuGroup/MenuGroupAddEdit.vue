<template>
  <div>
    <el-dialog
      v-dialogDrag
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :visible.sync="dialogFormVisible"
      title="新增分组菜单"
      width="680px"
      @close="dialogEditClose"
    >
      <el-form
        v-if="dialogFormVisible"
        ref="edit"
        :model="form"
        label-width="150px"
      >
        <el-form-item
          :rules="[{ required: true, message: '请输入' }]"
          label="标题"
          prop="title"
        >
          <el-input v-model="form.title"></el-input>
        </el-form-item>

        <el-form-item
          :rules="[{ required: true, message: '请输入' }]"
          label="路由"
          prop="router"
        >
          <el-input v-model="form.router"></el-input>
        </el-form-item>

        <el-row>
          <el-col :span="12">
            <el-form-item
              :rules="[{ required: true, message: '请选择' }]"
              label="菜单分组"
              prop="menuGroup"
            >
              <el-select
                v-model="form.menuGroup"
                :clearable="true"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in menuGroupNameList"
                  :key="item.menuGroup"
                  :label="item.menuGroupName"
                  :value="item.menuGroup"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否开启" prop="status">
              <el-switch
                v-model="form.status"
                :active-value="1"
                :inactive-value="0"
              ></el-switch>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="图标配置">
          <el-radio-group v-model="menuIconType">
            <el-radio-button label="图标库选择"></el-radio-button>
            <el-radio-button label="自定义上传"></el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="图标" prop="menuIcon">
          <el-dropdown
            v-if="menuIconType === '图标库选择'"
            placement="top-start"
            trigger="hover"
            @command="handleCommand"
          >
            <el-link :tabindex="9999" class="el-dropdown-link" type="primary">
              <img
                v-if="form.menuIcon"
                :src="iconShow"
                alt="图标"
                width="40px"
              />
              <span v-else>选择图标</span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-link>
            <el-dropdown-menu slot="dropdown" class="menu-icon-select1">
              <el-dropdown-item
                v-for="(item, index) in iconList"
                :key="index"
                :command="item"
              >
                <img :src="item" alt="item" width="40px" />
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <el-upload
            v-else
            :action="actions"
            :auto-upload="true"
            :limit="1"
            :multiple="false"
            :on-error="uploadError"
            :on-success="uploadSuccess"
            accept=".png,.jpg,.jpeg"
            list-type="picture-card"
          >
            <i slot="default" class="el-icon-plus"></i>
            <div slot="file" slot-scope="{ file }">
              <img
                :src="file.url"
                alt=""
                class="el-upload-list__item-thumbnail"
              />
              <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-preview"
                  @click="handlePictureCardPreview(file)"
                >
                  <i class="el-icon-zoom-in"></i>
                </span>
              </span>
            </div>
          </el-upload>
        </el-form-item>

        <el-form-item label="排序" prop="menuOrder">
          <el-input v-model="form.menuOrder" style="width: 200px"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditClose">取 消</el-button>
        <el-button v-if="isEdit" type="primary" @click="editMessagePush"
          >修 改</el-button
        >
        <el-button v-else type="primary" @click="addMessagePush"
          >新 增</el-button
        >
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisible">
      <img :src="form.menuIcon" alt="" width="100%" />
    </el-dialog>
  </div>
</template>

<script>
import {
  functionMenuIconList,
  functionMenuInsert,
  functionMenuUpdate
} from "@/api/menuGroup";
import { fileUpload } from "@/api/htmlPackage";

export default {
  name: "MenuGroupAddEdit",
  props: {
    menuGroupNameList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      actions: fileUpload,
      form: {
        title: "",
        menuIcon: "",
        router: "",
        menuGroup: "",
        menuOrder: "",
        status: 1
      },
      menuIconType: "图标库选择",
      iconShow: "",
      iconList: [],
      dialogVisible: false,
      disabled: false,
      isEdit: false
    };
  },
  methods: {
    showDialog() {
      this.dialogFormVisible = true;
      this.getIconList();
      this.isEdit = false;
    },
    editConfirm(val) {
      this.isEdit = true;
      this.dialogFormVisible = true;
      for (let i in this.form) {
        this.form[i] = val[i];
      }
      this.iconShow = val.menuIcon;
      this.form.id = val.id;
      this.getIconList();
    },
    getIconList() {
      functionMenuIconList()
        .then(res => {
          if (res.code.slice(-5) === "00000") {
            this.iconList = res.data;
          }
        })
        .catch(error => console.log(error.message));
    },
    dialogEditClose() {
      this.dialogFormVisible = false;
      this.$refs.edit.resetFields();
      for (let i in this.form) {
        this.form[i] = "";
      }
      this.form.status = 1;
      this.$emit("refresh");
    },
    handleCommand(command) {
      this.iconShow = command;
      this.form.menuIcon = command.slice(command.indexOf("/home"));
    },
    handlePictureCardPreview(file) {
      this.form.menuIcon = file.url;
      this.dialogVisible = true;
    },
    uploadError() {
      this.$message.error(`请重新上传`);
    },
    async uploadSuccess({ message, data }) {
      if (message === "请求成功") {
        this.form.menuIcon = data;
      } else {
        this.$message.error(message);
      }
    },
    addMessagePush() {
      this.$refs.edit.validate(async valid => {
        if (valid) {
          try {
            let res = await functionMenuInsert(this.form);
            if (res?.message === "请求成功") {
              this.$message.success("新增成功");
              this.dialogEditClose();
            }
          } catch (e) {
            throw new Error(e);
          }
        }
      });
    },
    editMessagePush() {
      this.$refs.edit.validate(async valid => {
        if (valid) {
          const target = { ...this.form };
          const tempUrl = target.menuIcon;
          if (tempUrl.indexOf("http") !== -1) {
            target.menuIcon = tempUrl.slice(tempUrl.indexOf("/home"));
          }
          try {
            let res = await functionMenuUpdate(target);
            if (res?.message === "请求成功") {
              this.$message.success("修改成功");
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

<style scoped>
/deep/.el-upload {
  width: 146px;
  height: 146px;
  border-radius: 8px;
}

.menu-icon-select1 {
  display: flex;
  overflow-y: auto;
  flex-wrap: wrap;
  height: 200px;
  width: 410px;
}
</style>
