import { dev } from "./dev";

// 请求的基础路径
export const baseUrl =
  process.env.NODE_ENV === "development" ? dev : "/app-platform-backend";

//日期格式
export const dateFormat = "YYYY-MM-DD HH:MM:ss";

// 密码验证的正则
export const pasValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/;

//  手机号码验证
export const phoneValid = /^1[3|6|5|7|8|9]\d{9}$/;
