import { get, post } from "@/http/request";

// 删除tabbar
export const deleteTabbarInfo = id => {
  return get("/tabbarInfo/delete", { id });
};

// 新增tabbar
export const insertTabbarInfo = query => {
  return post("/tabbarInfo/insert", {
    ...query
  });
};

// tabbar分页列表
export const tabbarInfoList = query => {
  return post("/tabbarInfo/list", {
    ...query
  });
};

// 修改tabbar
export const updateTabbarInfo = query => {
  return post("/tabbarInfo/update", {
    ...query
  });
};

// 修改顺序updateOrder
export const updateOrder = query => {
  return post("/tabbarInfo/updateOrder", query);
};
