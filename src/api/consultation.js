import { post } from "@/http/request";
import { get } from "@/http/request";

// 咨询列表
export const getConfigList = query => {
  return post("/marketInfoConfig/getConfigList", query);
};

// 新增咨询
export const addInsert = query => {
  return post("/marketInfoConfig/insert", query);
};

// 修改咨询配置
export const updateConfig = query => {
  return post("/marketInfoConfig/update", query);
};

// 获取咨询类型
export const marketInfoTypeList = query => {
  return get("/marketInfoType/marketInfoTypeList", {
    ...query
  });
};

// 获取咨询类型
export const deleteConfig = query => {
  return get("/marketInfoConfig/delete", {
    ...query
  });
};
