import { get, post } from "@/http/request";

// 删除菜单
export const functionMenuDelete = id => {
  return get("/functionMenu/delete", { id });
};

// 菜单分组列表
export const functionMenuGroupList = () => {
  return get("/functionMenu/groupList");
};

// 新增菜单
export const functionMenuInsert = query => {
  return post("/functionMenu/insert", query);
};

// 图标库
export const functionMenuIconList = () => {
  return get("/functionMenu/iconList");
};

// 菜单列表
export const functionMenuList = query => {
  return post("/functionMenu/list", query);
};

// 修改菜单
export const functionMenuUpdate = query => {
  return post("/functionMenu/update", query);
};
