# nanyang 2.0

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

### BaseTable使用方法介绍

prop参数说明：

```js
// 表格数据源，可以直接是后台返回的数据
    tableData: {
      type: Array,
      default: () => [],
    },
    // 分页数据
    pageTotal: {
      type: Number,
      default: 0
    },
    // 表格列配置项
    columns: {
      type: Array,
      default: () => [],
      eg. [
          // 对象中的参数项可以参考element ui表格列的配置项
        {
          label: "序号",
          width: "55",
          formatter: (row, column, val, index) => index + 1
        },
        {
          label: "图标",
          prop: "iconUrl",
           // 渲染slot name
          render: "iconUrl"
        }，
          {
          label: "操作",
          operaBtn: {
          		// 操作列的删除按钮，数组第一项为删除接口，第二项为需要传递给后台的标识符
              deleteFn: [deleteEventInfo, "id"],
          		// 配置了搜索项之后，是否有编辑按钮
              editFn: true
    		}
        }
        ]
    },
    // 搜索表格的配置项
    searchFormSet: {
      type: Object,
      default: () => {}
      eg. {
          model: this.searchForm,
          ref: "searchForm",
          addBtnText    // 新增按钮的文字
          noAdd   // 不配置新增按钮
          ... // 其余配置项参考element-ui form配置项，默认'label-width': '120px'，传入参数可覆盖
      }
```

BaseTable Events 

```js
// 配置了searchFrom时，新增按钮和编辑按钮联动的回调函数，可以以此判断是编辑页面还是新增页面
@edit="judgeEdit"
// 获取表格数据的回调，必须配置，对应函数为请求数据函数
@getData="getData"
```

插槽slot

"searchForm"   内部可以放置表格头部搜索项
