import { post } from "@/http/request";

const baseUrl = "/sysUser";

// 登入
export const login = query => {
  return post(baseUrl + "/login/toLogin", query);
};

// 登出
export const loginOut = query => {
  return post(baseUrl + "/login/loginOut", query);
};

// 账号列表查询
export const pageList = query => {
  return post(baseUrl + "/pageList", query);
};

// 账号对应的角色列表
export const roleListByUserId = query => {
  return post(baseUrl + "/roleListByUserId", query);
};

// 新增账号
export const addUser = query => {
  return post(baseUrl + "/addUser", query);
};

// 修改账户
export const editItem = query => {
  return post(baseUrl + "/editItem", query);
};

// 修改密码
export const resetPasswd = query => {
  return post(baseUrl + "/login/resetPasswd", query);
};
