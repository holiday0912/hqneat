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

// 新建通知（post）
export const toastAddNotice = query => {
  return post("/nyNoticeSetting/addNotice", {
    ...query
  });
};
