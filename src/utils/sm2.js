// sm-crypto
/**
 * @Description 加密解密，加签解签
 * @Author ai_xinxin
 * @Date 2021/03/08 16:16
 */
const cipherMode = 1; // 1 - C1C3C2，0 - C1C2C3，默认为1
const sm2 = require("sm-crypto").sm2;
const baseUrl = "/wmc-backend";
// 生产32位随机字符创

function uuid2() {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 32; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23];
  var uuid = s.join("");
  return uuid;
}

// 签名
export const smSign = config => {
  let signPartyPrivateKey = sessionStorage.getItem("signPartyPrivateKey")
    ? sessionStorage.getItem("signPartyPrivateKey")
    : "1fba904d9944016e735110d4605049863763dc2ff1054f205fea9240f8d1a01c"; // 前端私钥 签名加签
  let uuidStr = uuid2();
  let timeTemp = new Date().getTime();
  let msg =
    config.url +
    "\n" +
    config.method.toUpperCase() +
    "\n" +
    timeTemp +
    "\n" +
    uuidStr +
    "\n" +
    JSON.stringify(config.data);
  let sigValueHex =
    timeTemp +
    ";" +
    uuidStr +
    ";" +
    sm2.doSignature(msg, signPartyPrivateKey, {
      der: true,
      hash: true,
      userId: "f9270S7l36A03d83"
    });
  return sigValueHex;
};

// 验签
export const smSignTrue = response2 => {
  let signPlatformPublicKey = sessionStorage.getItem("signPlatformPublicKey")
    ? sessionStorage.getItem("signPlatformPublicKey")
    : "0499349056d28f7ee185bebbf9eec0c88c8d286c39008b14863624f8c72a48fc34dc9a6839259de7507f7a74065289f8f66bae7d1fad72e6f0beb40bfe14152867"; // 后台公钥 签名验签
  let response = JSON.parse(JSON.stringify(response2)); // 深度复制
  let signArr = response.headers.sign.split(";"); // 截取sign参数
  let datas = response.data;
  datas = smDecrypt(datas.data); // 数据解密
  let msg =
    response.config.url.replace(baseUrl, "") +
    "\n" +
    response.config.method.toUpperCase() +
    "\n" +
    signArr["0"] +
    "\n" +
    signArr["1"] +
    "\n" +
    datas;
  let flag = sm2.doVerifySignature(msg, signArr["2"], signPlatformPublicKey, {
    der: true,
    hash: true,
    userId: "f9270S7l36A03d83"
  });
  let obj = {
    flag: flag,
    datas: datas
  };
  return obj;
};
// 加密
export const smEncryption = data => {
  let cryptPlatformPublicKey = sessionStorage.getItem("cryptPlatformPublicKey")
    ? sessionStorage.getItem("cryptPlatformPublicKey")
    : "041d7875b1e86b8f6a4eacf40eccb7d7fcdce563989dbe4a6ae317721f94a1c861fe66d481113144e2678917ea96a181d5cc6c0ed68abf8330e4399fbec11b8183"; // 前端密钥对公钥 前端数据加密
  let dataEncrypt = JSON.stringify(data);
  let encryptData = sm2.doEncrypt(
    dataEncrypt,
    cryptPlatformPublicKey,
    cipherMode
  ); // 加密结果
  return "04" + encryptData;
};

// 解密
export const smDecrypt = data => {
  let cryptPartyPrivateKey = sessionStorage.getItem("cryptPartyPrivateKey")
    ? sessionStorage.getItem("cryptPartyPrivateKey")
    : "4b5be47d2f99535943165945595e1048bdca2a90a070b8eb5101250ed73f2914"; // 后台密钥对私钥 返回数据解密
  let dataEncrypt = sm2.doDecrypt(
    data.substring(2),
    cryptPartyPrivateKey,
    cipherMode
  );
  return dataEncrypt;
};
