import MD5 from "md5.js";

/**
 * 使用md5加密
 * @param {string} target 需要加密的字符串
 * @returns {string} 加密之后的字符串
 */
export function md5(target) {
  const pas = `asTJMHJSBSRTfs${target}asdfweeyhyhrv.&$%`;
  return new MD5().update(pas).digest("hex");
}
