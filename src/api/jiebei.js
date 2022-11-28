import { post, get } from '../http/request';
const baseUrl = '/api/huaBei'
let baseParams = {
  "channel": "093",
  "serviceCode": "ABS000102",
  "flowNo": new Date().getTime(),
  "requestTime": new Date().getTime()
}
// 额度管理
export const queryLimitInfoList = query => {
  return post(baseUrl + '/queryLimitInfoList', Object.assign({}, baseParams, {body: query}));
};

// 账单管理
export const queryCreditPayBillInfoList = query => {
  return post(baseUrl + '/queryCreditPayBillInfoList', Object.assign({}, baseParams, {body: query}));
};

// 商户管理
export const queryBmMerchantInfoList = query => {
  return post(baseUrl + '/queryBmMerchantInfoList', Object.assign({}, baseParams, {body: query}));
};