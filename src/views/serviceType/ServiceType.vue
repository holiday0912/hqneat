<template>
  <div class="container">
    <div class="handle-box">
      <BaseTable
        ref="serviceTypeTable"
        :columns="columns"
        :page-total="pageTotal"
        :search-form-set="searchFormSet"
        :table-data="tableData"
        @edit="judgeEdit"
        @getData="getData"
      >
        <template #searchForm>
          <div>
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
          </div>
        </template>
      </BaseTable>
    </div>

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
    searchFormSet() {
      return {
        model: this.searchForm,
        ref: "searchForm"
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
          operaBtn: {
            deleteFn: [deleteServiceType, "id"],
            editFn: true
          }
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
    judgeEdit(row) {
      if (row) {
        this.$refs.serviceTypeAdd.editConfirm(row);
      } else {
        this.$refs.serviceTypeAdd.showDialog();
      }
    }
  }
};
</script>
