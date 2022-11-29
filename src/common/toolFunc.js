import dayjs from "dayjs";
import { dateFormat } from "@/config/setting";

/**
 * 日期的格式化函数
 * @param target 需要格式化的日期函数
 * @return string
 */
export function day(target) {
  return dayjs(target).format(dateFormat);
}
