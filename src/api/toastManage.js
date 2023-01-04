import { get, post } from "@/http/request";

// toast样式列表
export const toastManageList = query => {
  return get("/nyNoticeSetting/selectAllInfo", {
    ...query
  });
};

// 获取类型列表
export const searchTypeList = () => {
  return get("/nyNoticeSetting/searchTypeList", {});
};

// 删除toast
export const toastDeleteById = query => {
  return get("/nyNoticeSetting/deleteById", {
    ...query
  });
};

// 修改通知（post）
export const toastUpdateNotice = query => {
  return post("/nyNoticeSetting/updateNotice", {
    ...query
  });
};

/**
 * "id": 0,
  "isDeleted": 0,
  "status": "string"
 */
// 发起审核（post）
export const checkTips = query => {
  return post("/nyNoticeSetting/checkTips", {
    ...query
  });
};

/**
 * 复核
 * "id": 0,
  "isDeleted": 0,
  "status": "string"
 */
export const recheckTips = query => {
  return post("/nyNoticeSetting/recheckTips", {
    ...query
  });
};

// 新建通知（post）
export const toastAddNotice = query => {
  return post("/nyNoticeSetting/addNotice", {
    ...query
  });
};
