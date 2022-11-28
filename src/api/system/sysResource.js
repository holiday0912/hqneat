import { post } from "../../http/request";

const baseUrl = "/sysResource";

// 角色列表查询
export const pageList = query => {
  return post(baseUrl + "/pageList", query);
};

// 新增角色
export const addItem = query => {
  return post(baseUrl + "/addItem", query);
};

// 删除角色
export const deleteBatch = query => {
  return post(baseUrl + "/deleteBatch", query);
};

// 修改角色
export const editItem = query => {
  return post(baseUrl + "/editItem", query);
};
