import { baseUrl } from "@/config/setting";
import { post } from "@/http/request";

/**
 * 上传文件的路径
 * @type {string}
 */
export const fileUpload = baseUrl + "/file/uploadRemoteServer";

/**
 * 文件下载的路径
 * @param query
 * @returns {Promise<unknown>}
 */
export const fileDownload = async query => {
  return post("/file/downloadRemoteServer", query);
};

/**
 * 获取h5包的资源列表
 * @param query
 * @returns {Promise<unknown>}
 */
export const h5VersionList = async query => {
  return post("/appVersion/versionList", {
    body: {
      ...query,
      mobile: ""
    },
    channel: ""
  });
};

// 删除h5资源包
export const deleteVersion = async query => {
  return post("/appVersion/deleteVersion", query);
};
// 上传版本号和描述
export const insertVersion = async query => {
  return post("/appVersion/insertVersion", {
    body: {
      ...query,
      mobile: ""
    },
    channel: ""
  });
};
