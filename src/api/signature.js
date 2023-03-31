import { post } from "@/http/request";

// 签名列表
export const getuserSignList = query => {
  return post("/userSign/list", {
    ...query
  });
};

// 投诉建议列表
export const getcomplaintAdviceList = query => {
  return post("/complaintAdvice/list", {
    ...query
  });
};
