import { get, post } from "@/http/request";

// 获取事件列表
export const selectAllInfo = async query => {
  return post("/NyEventController/selectAllInfo", {
    body: {
      ...query,
      mobile: ""
    },
    channel: ""
  });
};

// 新增事件
export const addEvent = async query => {
  return post("/NyEventController/addEvent", query);
};

// 删除事件
export const NyEventControllerDeleteById = async query => {
  return get("/NyEventController/deleteById", query);
};

//埋点详情统计图（get）：
export const createCookieView = async query => {
  return get("/NyEventController/createCookieView", query);
};

// 事件详情
export const searchNewsDetail = async query => {
  return get("/NyEventController/searchNewsDetail", query);
};
