<template>
  <div class="container">
    <div class="handle-box">
      <el-form ref="searchRorm" :model="searchForm" label-width="120px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="版本号" prop="versionCode">
              <el-input v-model="searchForm.versionCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="描述" prop="descr">
              <el-input v-model="searchForm.descr"></el-input>
            </el-form-item>
          </el-col>
          <!--          <el-col :span="6">-->
          <!--            <el-form-item label="上传时间" prop="createTime">-->
          <!--              <el-date-picker-->
          <!--                v-model="searchForm.createTime"-->
          <!--                placeholder="选择日期"-->
          <!--                style="width: 100%"-->
          <!--                type="date"-->
          <!--              >-->
          <!--              </el-date-picker>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->

          <!--          <el-col :span="6">-->
          <!--            <el-form-item label="类型" prop="createTime">-->
          <!--              <el-select v-model="searchForm.type" placeholder="请选择">-->
          <!--                <el-option-->
          <!--                  v-for="item in typeList"-->
          <!--                  :key="item.value"-->
          <!--                  :label="item.label"-->
          <!--                  :value="item.value"-->
          <!--                />-->
          <!--              </el-select>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
        </el-row>
      </el-form>

      <div class="handle-box">
        <el-button icon="el-icon-refresh" @click="formRest">重置</el-button>
        <el-button icon="el-icon-search" type="primary" @click="handleSearch"
          >查询
        </el-button>
        <el-button icon="el-icon-plus" type="primary" @click="handleAdd"
          >新增
        </el-button>
      </div>

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

        <!--类型-->
        <el-table-column
          align="center"
          label="文件路径"
          prop="type"
        ></el-table-column>

        <!--类型-->
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
          align="center"
          label="创建时间"
          prop="createTime"
        ></el-table-column>

        <!--更新人-->
        <el-table-column
          align="center"
          label="更新人"
          prop="updateUser"
        ></el-table-column>

        <!--首次上报-->
        <el-table-column
          align="center"
          label="首次上报"
          prop="firstAppear"
        ></el-table-column>

        <!--最近上报-->
        <el-table-column
          align="center"
          label="最近上报"
          prop="lastAppear"
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
              icon="el-icon-delete"
              type="text"
              @click="showDrawer(scope.row)"
              >详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <BasePagination
        :pageTotal="pageTotal"
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
import { selectAllInfo } from "@/api/buryData";

export default {
  name: "roleManage",
  components: {
    BuryDataAdd,
    BuryDataDrawer
  },
  data() {
    return {
      searchForm: {
        appid: "njebd81krqn",
        descr: "", //描述
        versionCode: "", //版本号
        type: "", //类型，
        createTime: ""
      },
      tableData: [],
      pageTotal: 0
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData(query = { pageNum: 1, pageSize: 10 }) {
      try {
        let res = await selectAllInfo();
        if (res) {
          const { data, total } = res.data;
          this.tableData = data.map(i => {
            return {
              ...i,
              createTime: this.$dayjs(i.createTime),
              updateTime: this.$dayjs(i.updateTime)
              // type: this.showType(i.type)
            };
          });
          this.pageTotal = total;
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
        let res = await deleteVersion({ body: id, channel: "" });
        if (res.message === "请求成功") {
          this.$message.success("删除成功");
          this.getData();
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
