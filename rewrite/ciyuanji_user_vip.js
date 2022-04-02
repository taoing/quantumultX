/*
次元姬app 用户金币重写

QuantumultX:
[MITM]
hostname = api.huowenkeji.com

^https://api.huowenkeji.com/api/ciyuanji/client/account/getVipDiscount.+ url script-response-body https://raw.githubusercontent.com/taoing/quantumultX/master/rewrite/ciyuanji_user_vip.js

 */

let body = $response.body;
let obj = JSON.parse(body);
if (obj.code !== "200") {
  $done();
} else {
  if (obj.data && obj.data.accountInfo) {
    obj.data.accountInfo.couponBalance = 600;
    body = JSON.stringify(obj);
    $done(body);
  }
}
