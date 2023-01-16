<template>
  <div class="container">
    <div class="handle-box">
      <el-form ref="searchRorm" :model="searchForm" label-width="120px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="业务类型代码" prop="serviceTypeCode">
              <el-select
                v-model="searchForm.serviceTypeCode"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in serviceType"
                  :key="item.key"
                  :label="item.val"
                  :value="item.key"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- <el-col :span="6">
            <el-form-item label="状态" prop="status">
              <el-input v-model="searchForm.status"></el-input>
            </el-form-item>
          </el-col> -->

          <el-col :span="18">
            <el-button
              icon="el-icon-refresh"
              style="margin-left: 50px; display: inline-block"
              @click="formRest"
              >重置
            </el-button>

            <el-button
              icon="el-icon-search"
              style="margin-left: 10px; display: inline-block"
              type="primary"
              @click="handleSearch"
              >查询
            </el-button>

            <el-button
              icon="el-icon-plus"
              style="margin-left: 10px; display: inline-block"
              type="primary"
              @click="handleAdd"
            >
              新增
            </el-button>
          </el-col>
        </el-row>
      </el-form>

      <BaseTable
        ref="serviceTypeTable"
        :columns="columns"
        :pageTotal="pageTotal"
        :tableData="tableData"
        @getData="getData"
      >
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
    </div>
    <!--    <DragAbleTest/>-->
    <ServiceTypeAdd ref="serviceTypeAdd" @refresh="getData"></ServiceTypeAdd>
  </div>
</template>

<script>
import { deleteServiceType, getServiceTypeList } from "@/api/serviceType";
import ServiceTypeAdd from "@/views/serviceType/ServiceTypeMan.vue";
import { serviceType } from "@/common/enum";
import { addTimeIcon } from "@/common/tableFormat";

export default {
  name: "ServiceType",
  components: {
    ServiceTypeAdd
    // DragAbleTest
  },
  data() {
    return {
      searchForm: {
        serviceTypeCode: ""
      },
      serviceType: serviceType,
      tableData: [],
      pageTotal: 0
    };
  },
  computed: {
    columns() {
      return [
        {
          label: "序号",
          width: "55",
          formatter: (row, column, val, index) => index + 1
        },
        {
          label: "业务类型代码",
          prop: "serviceTypeCode"
        },
        {
          label: "业务类型",
          prop: "serviceTypeName"
        },
        // {
        //   label: "状态",
        //   prop: "status"
        // },
        {
          label: "创建时间",
          prop: "createTime",
          formatter: (row, column, val) => addTimeIcon(row, column, val),
          sortable: true
        },
        {
          label: "更新时间",
          prop: "updateTime",
          formatter: (row, column, val) => addTimeIcon(row, column, val),
          sortable: true
        },
        {
          label: "操作",
          render: "operation"
        }
      ];
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData(query = { pageNum: 1, pageSize: 10 }) {
      const obj = Object.assign(query, this.searchForm);
      try {
        const res = await getServiceTypeList(obj);
        if (res) {
          this.tableData = res.data.list.map(i => {
            return {
              ...i,
              createTime: i.createTime
                ? this.$dayjs(i.createTime)
                : this.$nodata,
              updateTime: i.updateTime
                ? this.$dayjs(i.updateTime)
                : this.$nodata
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
    async handleDelete({ id }) {
      try {
        const res = await deleteServiceType(id);
        if (res) {
          // this.$message.success('删除成功')
          this.$notify({ title: "提示", message: "删除成功", type: "success" });
          if (this.tableData.length === 1) {
            this.$refs.serviceTypeTable.query.pageNum--;
          }
          await this.getData();
        }
      } catch (error) {
        throw new Error(error.message);
      }
    },
    handleAdd() {
      this.$refs.serviceTypeAdd.showDialog();
    },
    handleEdit(target) {
      this.$refs.serviceTypeAdd.editConfirm(target);
    }
  }
};
</script>
