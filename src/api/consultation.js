import { post } from "@/http/request";
import { get } from "@/http/request";

// 咨询列表
export const getConfigList = query => {
  return post("/marketInfoConfig/getConfigList", query);
};

// 新增咨询
export const addInsert = query => {
  return post("/marketInfo/insert", query);
};

// 修改咨询配置
export const updateConfig = query => {
  return post("/marketInfo/update", query);
};

// 获取咨询类型
export const marketInfoTypeList = query => {
  return get("/marketInfoType/marketInfoTypeList", {
    ...query
  });
};

// 删除列表
export const deleteConfig = query => {
  return get("/marketInfo/delete", {
    ...query
  });
};

// 获取咨询列表
export const getMarketInfoList = query => {
  return post("/marketInfo/list", {
    ...query
  });
};
