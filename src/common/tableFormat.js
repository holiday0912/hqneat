import bus from "@/components/common/bus";

const h = bus.$createElement;

/**
 * 格式化时间单元格
 * @param row 当前元素所在的行
 * @param column 当前元素所在的列
 * @param val  单元格值
 * @returns {VNode} 返回构造好的VNode
 */
export function addTimeIcon(row, column, val) {
  return h("div", {}, [
    h("i", { style: { marginRight: "10px" }, class: "el-icon-time" }, ""),
    h("span", {}, val)
  ]);
}
