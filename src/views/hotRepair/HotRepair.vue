<template>
  <div class="container">
    <div class="handle-box">
      <BaseTable
        ref="hotRepaireTable"
        :columns="columns"
        :pageTotal="pageTotal"
        :searchFormSet="searchFormSet"
        :tableData="tableData"
        @edit="judgeEdit"
        @getData="getData"
      >
        <template #searchForm>
          <div>
            <el-col :span="6">
              <el-form-item label="包版本号" prop="pkVersion">
                <el-input
                  v-model="searchForm.pkVersion"
                  style="width: 80%"
                ></el-input>
              </el-form-item>
            </el-col>
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
import { addTimeIcon } from "@/common/tableFormat";

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
      },
      tableData: [],
      pageTotal: 0
    };
  },
  mounted() {
    this.getData();
  },
  computed: {
    searchFormSet() {
      return {
        model: this.searchForm,
        ref: "searchForm",
        addBtnText: "文件上传"
      };
    },
    columns() {
      return [
        {
          label: "序号",
          width: "55",
          formatter: (row, column, val, index) => index + 1
        },
        {
          label: "包版本号",
          prop: "pkVersion"
        },
        {
          label: "包名字",
          prop: "pkName"
        },
        {
          label: "上传时间",
          prop: "createTime",
          formatter: (row, column, val) => addTimeIcon(row, column, val),
          sortable: true
        },
        {
          label: "发布时间",
          prop: "pubTime",
          formatter: (row, column, val) => addTimeIcon(row, column, val),
          sortable: true
        },
        {
          label: "操作",
          operaBtn: {
            deleteFn: [nyHotDepDeleteById, "id"],
            editFn: true
          },
          width: 150
        }
      ];
    }
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
          this.tableData = res.data.data.map(i => {
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
    judgeEdit(row) {
      if (row) {
        this.$refs.hotRepairEdit.showDialog(row);
      } else {
        this.$refs.htmlPckUpload.showDialog();
      }
    }
  }
};
</script>
