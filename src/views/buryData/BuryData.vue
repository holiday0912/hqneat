<template>
  <div class="container">
    <div class="handle-box">
      <el-row>
        <el-form ref="searchRorm" :model="searchForm" label-width="120px">
          <el-col :span="6">
            <el-form-item label="事件id" prop="eventId">
              <el-input v-model="searchForm.eventId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="分类标签" prop="classLabels">
              <el-input v-model="searchForm.classLabels"></el-input>
            </el-form-item>
          </el-col>
        </el-form>

        <el-col :span="8" style="margin-left: 20px">
          <div class="handle-box">
            <el-button v-debounce="formRest" icon="el-icon-refresh"
              >重置</el-button
            >
            <el-button
              v-debounce="handleSearch"
              icon="el-icon-search"
              type="primary"
              >查询
            </el-button>
            <el-button icon="el-icon-plus" type="primary" @click="handleAdd"
              >新增
            </el-button>
          </div>
        </el-col>
      </el-row>

      <el-table
        ref="multipleTable"
        :data="tableData"
        border
        class="table"
        header-cell-class-name="table-header"
      >
        <el-table-column align="center" label="序号" width="55">
          <template v-slot="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>

        <!--事件id-->
        <el-table-column
          align="center"
          label="事件id"
          prop="eventId"
        ></el-table-column>

        <!--事件名称-->
        <el-table-column
          align="center"
          label="事件名称"
          prop="eventName"
        ></el-table-column>

        <!--触发时机-->
        <el-table-column
          align="center"
          label="触发时机"
          prop="triggerTiming"
        ></el-table-column>

        <!--分类标签-->
        <el-table-column
          align="center"
          label="分类标签"
          prop="classLabels"
        ></el-table-column>

        <!--创建人-->
        <el-table-column
          align="center"
          label="创建人"
          prop="createUser"
        ></el-table-column>

        <!-- 创建时间-->
        <el-table-column
          :sortable="true"
          align="center"
          label="创建时间"
          prop="createTime"
        >
          <template v-slot="{ row }">
            <div>
              <i class="el-icon-time" style="margin-right: 10px"></i>
              {{ row.createTime }}
            </div>
          </template>
        </el-table-column>

        <!--统计数据-->
        <el-table-column
          align="center"
          label="统计数据"
          prop="detailCount"
        ></el-table-column>

        <el-table-column align="center" label="操作" width="150">
          <template v-slot="scope">
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
              v-debounce="() => showDrawer(scope.row)"
              icon="el-icon-document"
              type="text"
              >详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <BasePagination
        :page-total="pageTotal"
        @getData="getData"
      ></BasePagination>
    </div>

    <BuryDataAdd ref="htmlPckUpload" @refresh="getData"></BuryDataAdd>

    <BuryDataDrawer ref="buryDataDrawer"></BuryDataDrawer>
  </div>
</template>

<script>
import BuryDataAdd from "@/views/buryData/BuryDataAdd";
import BuryDataDrawer from "@/views/buryData/BuryDataDrawer.vue";
import { NyEventControllerDeleteById, selectAllInfo } from "@/api/buryData";

export default {
  name: "RoleManage",
  components: {
    BuryDataAdd,
    BuryDataDrawer
  },
  data() {
    return {
      searchForm: {
        eventId: "",
        classLabels: ""
      },
      tableData: [],
      pageTotal: 0
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    // async getData(query = { pageNum: 1, pageSize: 10 }) {
    async getData() {
      // const params = {
      //   current: query.pageNum,
      //   size: query.pageSize
      // };
      try {
        let res = await selectAllInfo({ ...this.searchForm });
        if (res) {
          this.tableData = res.data.data.map(i => {
            return {
              ...i,
              createTime: this.$dayjs(i.createTime),
              updateTime: this.$dayjs(i.updateTime)
            };
          });
          this.pageTotal = res.data.total;
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
      this.query = {
        pageNum: 1,
        pageSize: 10
      };
      this.getData();
    },
    // 新增推送
    handleAdd() {
      this.$refs.htmlPckUpload.showDialog();
    },
    async handleDelete({ id }) {
      try {
        let res = await NyEventControllerDeleteById({ id });
        if (res.message === "请求成功") {
          this.$message.success("删除成功");
          await this.getData();
        }
      } catch (e) {
        throw new Error(e);
      }
    },
    showDrawer(val) {
      this.$refs.buryDataDrawer.showDrawer(val);
    }
  }
};
</script>
