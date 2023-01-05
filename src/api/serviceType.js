import { get, post } from "@/http/request"

// 删除业务类型
export const deleteServiceType = (id) => {
  return get("/serviceType/delete", {id})
}

// 业务类型列表
export const getServiceTypeList = query => {
  return post("/serviceType/getServiceTypeList", {
    ...query
  })
}

// 新增业务类型
export const insertServiceType = query => {
  return post("/serviceType/insert", {
    ...query
  })
}

// 修改业务类型
export const updateServiceType = query => {
  return post("/serviceType/update", {
    ...query
  })
}