import { post } from "@/http/request";

const baseUrl = "";

// 登入
export const login = query => {
  return post("/userLogin/toLogin", {
    body: query,
    channel: ""
  });
};

// 登出
export const loginOut = query => {
  return post("/userLogin/toLogout", {
    body: query,
    channel: ""
  });
};

// 新增账号
export const addUser = query => {
  return post("/userLogin/toRegister", {
    body: query,
    channel: ""
  });
};

// 账号列表查询
export const pageList = query => {
  return post(baseUrl + "/pageList", query);
};

// 账号对应的角色列表
export const roleListByUserId = query => {
  return post(baseUrl + "/roleListByUserId", query);
};

// 修改账户
export const editItem = query => {
  return post(baseUrl + "/editItem", query);
};

// 修改密码
export const resetPasswd = query => {
  return post(baseUrl + "/login/resetPasswd", query);
};
