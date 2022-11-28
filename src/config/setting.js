import { dev } from "./dev";

// 请求的基础路径
export const baseUrl = process.env.NODE_ENV === "development" ? dev : "";

//日期格式
export const dateFormat = "YYYY-MM-DD HH:MM:ss";
