import { post } from "../../http/request";

const baseUrl = "/sysRole";

// 角色列表查询（分页）
export const pageList = query => {
  return post(baseUrl + "/pageList", query);
};

// 账号对应的角色列表
export const roleListByUserId = query => {
  return post(baseUrl + "/roleListByUserId", query);
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

// 角色列表查询（不分页）
export const list = query => {
  return post(baseUrl + "/list", query);
};
