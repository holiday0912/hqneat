<template>
  <div>
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
        <el-button
          icon="el-icon-document"
          type="text"
          @click="handleDetail(scope.row)"
          >详情
        </el-button>
      </template>
    </BaseTable>
  </div>
</template>

<script>
export default {
  name: "PdoReco",
  data() {
    return {
      pageTotal: "",
      tableData: []
    };
  },
  computed: {
    columns() {
      return [
        {
          label: "序号",
          width: "55",
          render: "ordinal"
        },
        {
          label: "客户群体",
          prop: ""
        },
        {
          label: "产品类型",
          prop: ""
        },
        {
          label: "产品代码",
          prop: ""
        },
        {
          label: "类型",
          prop: ""
        },
        {
          label: "操作",
          render: "operation",
          width: 90
        }
      ];
    }
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      try {
      } catch (error) {
        throw new Error(error);
      }
    }
  }
};
</script>
