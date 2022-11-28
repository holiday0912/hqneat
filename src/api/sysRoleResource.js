import { post, get } from '../http/request';
const baseUrl = '/sysRoleResource'

// 为角色授予资源权限
export const authResource = query => {
  return post(baseUrl + '/authResource', query)
}

// 查询角色对应的资源权限树
export const queryResourceTree = query => {
  return get(baseUrl + '/queryResourceTree', query);
};
