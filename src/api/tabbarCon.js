import { post } from "@/http/request";

// 删除tabbar
export const deleteTabbarInfo = query => {
  return post("/tabbarInfo/delete", {
    id: query
  });
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
