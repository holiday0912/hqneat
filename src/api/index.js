import { post, get } from '../http/request';

// 登入
export const login = query => {
    return post('/sysUser/login/toLogin', query);
};

// 查询菜单列表
export const menu = query => {
    return post('/sysResource/list', query)
}

// 删除菜单列表(批量)
export const deleteMenu = query => {
    return post('/sysResource/deleteBatch', query)
}

// 删除菜单列表(单条)
export const deleteMenuSingle = query => {
    return get('/sysResource/delete', query)
}