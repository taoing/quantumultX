/**
 * jd_cfd 打印提现url, 响应
 */

let body = $response.body;
let url = $request.url;

console.log('京喜财富岛提现请求 CashOut:', url);
console.log('提现响应:', body);
