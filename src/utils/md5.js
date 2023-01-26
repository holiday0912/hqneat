import MD5 from "md5.js";

/**
 * 使用md5加密
 * @param target 需要加密的字符串
 * @returns {*} 加密之后的字符串
 */
export function md5(target) {
  const pas = `asTJMHJSBSRTfs${target}asdfweeyhyhrv.&$%`;
  return new MD5().update(pas).digest("hex");
}
