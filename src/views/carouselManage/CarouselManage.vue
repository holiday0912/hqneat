<template>
  <div class="container">
    <div class="handle-box">
      <el-row>
        <!--        <el-form ref="searchRorm" :model="searchForm" label-width="120px">-->
        <!--          <el-col :span="6">-->
        <!--            <el-form-item label="描述" prop="descr">-->
        <!--              <el-input v-model="searchForm.descr"></el-input>-->
        <!--            </el-form-item>-->
        <!--          </el-col>-->
        <!--        </el-form>-->
        <el-col :span="8" style="margin-left: 20px">
          <div class="handle-box">
            <!--            <el-button icon="el-icon-refresh" @click="formRest">重置</el-button>-->
            <!--            <el-button-->
            <!--              icon="el-icon-search"-->
            <!--              type="primary"-->
            <!--              @click="handleSearch"-->
            <!--              >查询-->
            <!--            </el-button>-->
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

        <!--图片地址-->
        <el-table-column align="center" label="图片地址" prop="imgUrl">
          <template v-slot="scope">
            <img :src="`${scope.row.imgUrl}`" alt="" width="350px" />
          </template>
        </el-table-column>

        <!--导航地址-->
        <el-table-column
          align="center"
          label="导航地址"
          prop="forwardUrl"
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
              icon="el-icon-edit"
              type="text"
              @click="handleEdit(scope.row)"
              >编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <BasePagination
        :pageTotal="pageTotal"
        @getData="getData"
      ></BasePagination>
    </div>

    <CarouselEdit ref="carouselEdit" @refresh="getData"></CarouselEdit>
    <CarouselAddNew ref="carouselAddNew" @refresh="getData"></CarouselAddNew>
  </div>
</template>

<script>
import CarouselEdit from "@/views/carouselManage/CarouselEdit.vue";
import CarouselAddNew from "@/views/carouselManage/CarouselAddNew.vue";
import {
  carouselImgDeleteVersion,
  carouselImgList
} from "@/api/carouselManage";
import { baseUrl } from "@/config/setting";

export default {
  name: "carouselManage",
  components: {
    CarouselEdit,
    CarouselAddNew
  },
  data() {
    return {
      searchForm: {},
      tableData: [],
      pageTotal: 0,
      baseUrl: baseUrl
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData(query = { pageNum: 1, pageSize: 10 }) {
      try {
        let res = await carouselImgList({ ...query, ...this.searchForm });
        if (res.message === "请求成功") {
          // this.tableData = res.data.list.map(i => {
          //   return {
          //     ...i,
          //     createTime: this.$dayjs(i.createTime),
          //     updateTime: this.$dayjs(i.updateTime)
          //   };
          // });
          this.tableData = res.data.list;
          this.pageTotal = res.data.total;
        } else {
          this.$message.error(res.message);
        }
      } catch (e) {
        throw new Error(e);
      }
    },
    // formRest() {
    //   this.$refs.searchRorm.resetFields();
    // },
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
      this.$refs.carouselAddNew.showDialog();
    },
    // 删除toast
    async handleDelete({ id }) {
      try {
        let res = await carouselImgDeleteVersion(id);
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
      this.$refs.carouselEdit.showDialog(val);
    }
  }
};
</script>
