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
