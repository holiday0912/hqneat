import { post } from "@/http/request";

// 日志列表
export const LogInfo = async query => {
  return post("/appLogInfo/list", {
    body: {
      ...query,
      mobile: ""
    },
    channel: ""
  });
};
