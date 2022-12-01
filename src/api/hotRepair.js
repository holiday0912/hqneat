import { get } from "@/http/request";

// 获取热更新列表
export const nyHotDepSelectAllInfo = query => {
  return get("/nyHotDep/selectAllInfo", {
    ...query
  });
};

// 新建热部署
export const nyHotDepAddHotDep = query => {
  return get("/nyHotDep/addHotDep", {
    ...query
  });
};

// 修改热部署
export const nyHotDepUpdateData = query => {
  return get("/nyHotDep/updateData", {
    ...query
  });
};

// 删除热部署
export const nyHotDepDeleteById = query => {
  return get("/nyHotDep/deleteById", {
    ...query
  });
};
