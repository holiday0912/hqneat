import { get, post } from "@/http/request";

// 删除事项
export const deleteEventInfo = id => {
  return get("/eventInfo/delete", { id });
};

// 新增事项
export const insertEventInfo = query => {
  return post("/eventInfo/insert", {
    ...query
  });
};

// 事项分页列表
export const eventInfoList = query => {
  return post("/eventInfo/list", {
    ...query
  });
};

// 修改事项
export const updateEventInfo = query => {
  return post("/eventInfo/update", {
    ...query
  });
};
