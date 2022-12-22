import { post } from "../../http/request";

const baseUrl = "/sysResource";

// 资源列表查询
export const pageList = query => {
  return post(baseUrl + "/pageList", query);
};

// 新增资源
export const addItem = query => {
  return post(baseUrl + "/addItem", query);
};

// 删除资源
export const deleteBatch = query => {
  return post(baseUrl + "/deleteBatch", query);
};

// 修改资源
export const editItem = query => {
  return post(baseUrl + "/editItem", query);
};
