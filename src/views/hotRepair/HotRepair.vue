<template>
  <div class="container">
    <div class="handle-box">
      <el-row>
        <el-col :span="8">
          <el-form ref="searchRorm" :model="searchForm" label-width="120px">
            <el-form-item label="包版本号" prop="pkVersion">
              <el-input
                v-model="searchForm.pkVersion"
                style="width: 80%"
              ></el-input>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="16">
          <div class="handle-box">
            <el-button icon="el-icon-refresh" @click="formRest">重置</el-button>
            <el-button
              icon="el-icon-search"
              type="primary"
              @click="handleSearch"
            >查询
            </el-button>
            <el-button icon="el-icon-plus" type="primary" @click="handleAdd"
            >文件上传
            </el-button>
          </div>
        </el-col>
      </el-row>

      <BaseTable
        :columns="columns"
        :pageTotal="pageTotal"
        :tableData="tableData"
        @getData="getData"
      >
        <template #ordinal="{scope}">
          <div>
            {{ scope.$index + 1 }}
          </div>
        </template>

        <template #operation="{ scope }">
          <el-popconfirm
            title="确定删除吗？"
            @confirm="handleDelete(scope.row)"
          >
            <el-button slot="reference" icon="el-icon-delete" type="text"
            >删除
            </el-button>
          </el-popconfirm>
          <el-button
            slot="reference"
            icon="el-icon-edit"
            type="text"
            @click="handleEdit(scope.row)"
          >修改
          </el-button>
        </template>
      </BaseTable>

      <HotRepairUpload ref="htmlPckUpload" @refresh="getData"></HotRepairUpload>
      <HotRepairEdit ref="hotRepairEdit" @refresh="getData"></HotRepairEdit>
    </div>
  </div>
</template>

<script>
import { nyHotDepDeleteById, nyHotDepSelectAllInfo } from "@/api/hotRepair";
import HotRepairUpload from "@/views/hotRepair/HotRepairUpload.vue";
import HotRepairEdit from "@/views/hotRepair/HotRepairEdit.vue";

export default {
  name: "HotRepair",
  components: {
    HotRepairUpload,
    HotRepairEdit
  },
  data() {
    return {
      searchForm: {
        pkVersion: ""
      }, tableData: [],
      pageTotal: 0,
      columns: [
        {
          align: "center",
          label: "序号",
          width: "55",
          render: "ordinal"
        },
        {
          align: "center",
          label: "包版本号",
          prop: "pkVersion"
        },
        {
          align: "center",
          label: "包名字",
          prop: "pkName"
        },
        {
          align: "center",
          label: "上传时间",
          prop: "createTime"
        },
        {
          align: "center",
          label: "发布时间",
          prop: "pubTime"
        },
        {
          align: "center",
          label: "操作",
          render: "operation",
          width: 150
        }
      ]
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData(query = { pageNum: 1, pageSize: 10 }) {
      const params = {
        current: query.pageNum,
        size: query.pageSize,
        pkVersion: this.searchForm.pkVersion
      };
      try {
        let res = await nyHotDepSelectAllInfo(params);
        if (res.message === "请求成功") {
          this.tableData = res.data.data.map((i) => {
            return {
              ...i,
              createTime: this.$dayjs(i.createTime),
              pubTime: this.$dayjs(i.pubTime)
            };
          });
          this.pageTotal = res.data.total;
        } else {
          this.$message.error(res.message);
        }
      } catch (e) {
        throw new Error(e);
      }
    },
    formRest() {
      this.$refs.searchRorm.resetFields();
    },
    // 列表查询
    handleSearch() {
      this.getData();
    },
    // 新增推送
    handleAdd() {
      this.$refs.htmlPckUpload.showDialog();
    },
    async handleDelete({ id }) {
      try {
        let res = await nyHotDepDeleteById({ id });
        if (res.message === "请求成功") {
          this.$message.success("删除成功");
          await this.getData();
        } else {
          this.$message.error(res.message);
        }
      } catch (e) {
        throw new Error(e);
      }
    },
    handleEdit(val) {
      this.$refs.hotRepairEdit.showDialog(val);
    }
  }
};
</script>
