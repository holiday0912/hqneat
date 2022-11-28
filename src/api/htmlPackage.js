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
 * 读取远程服务器的文件
 * @param query
 * @returns {Promise<unknown>}
 */
export const fileList = async query => {
  return post("/file/readRemoteServer", query);
};
