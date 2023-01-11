<template>
  <div id="app">
    <router-view />
  </div>
</template>
<style>
@import "./assets/css/main.css";
@import "./assets/css/color-dark.css"; /* 深色主题 */
/* @import "./assets/css/theme-green/color-green.css";   浅绿色主题 */
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}

.table {
  width: 100%;
}

.red {
  color: #ff0000;
}

.mr10 {
  margin-right: 10px;
}

.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}

.el-upload {
  border-radius: 0;
  margin-left: 10px;
  overflow: visible;
  width: 0;
  height: 0;
}

/* 解决table表格表头错位 */
.el-table th.gutter {
  display: table-cell !important;
}

.dialog-head-span {
  margin-left: 15px;
}

/* 折叠面板 */
.titleInfo {
  position: relative;
}

.titleInfo::before {
  content: "";
  display: inline;
  height: 28px;
  width: 2px;
  background-color: #409eff !important;
  position: absolute;
  left: 0;
  top: 11px;
}

.titleInfo .el-collapse-item__header {
  color: #409eff !important;
  font-size: 14px;
  padding-left: 20px;
  font-weight: bold;
  line-height: 40px;
  margin: 0;
}

/* 表格tip宽度 */
.el-tooltip__popper {
  max-width: 600px;
}
</style>
