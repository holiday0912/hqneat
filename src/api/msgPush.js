import { post } from "@/http/request";

/**
 * 新增消息推送
 */
export const msgPushInsert = async query => {
  return post("/msgPush/insert", {
    body: {
      ...query,
      mobile: ""
    },
    channel: ""
  });
};

/**
 * 获取消息列表
 */
export const msgPushList = async query => {
  let res = await post("/msgPush/list", {
    body: {
      ...query,
      mobile: ""
    },
    channel: ""
  });
  return res.data;
};

// 修改当前消息
export const updatePush = query => {
  return post("/msgPush/update", {
    body: {
      ...query
    },
    channel: ""
  });
};

// 删除当前推送消息
export const deletePush = query => {
  return post("/msgPush/delete", {
    body: query,
    channel: ""
  });
};

// 发送消息
export const sendPush = query => {
  return post("/msgPush/send", {
    body: query,
    channel: ""
  });
};

//分组列表
export const postGroupList = query => {
  return post("/msgPush/groupList", {
    body: query,
    channel: ""
  });
};

//删除分组
export const deleteGroup = query => {
  return post("/msgPush/deleteGroup", {
    body: query,
    channel: ""
  });
};

//新增分组
export const insertGroup = query => {
  return post("/msgPush/inserGroup", {
    body: query,
    channel: ""
  });
};
