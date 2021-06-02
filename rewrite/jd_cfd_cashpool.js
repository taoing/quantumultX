/**
 * jd_cfd 提现现金池重写
 */

let body = $response.body;
let url = $request.url;

console.log('京喜财富岛提现现金池额度查询 UserCashOutState:', url);

let jsonpPrefix = body.substring(0, body.indexOf('{'));
let suffix = body.substring(body.indexOf('}') + 1);
let bodyJson = body.substring(body.indexOf('{'), body.indexOf('}') + 1);
let obj = JSON.parse(bodyJson);

let restNum = 3664;
let todayPool = restNum * 100;
let exchangeRate = Math.round((5000 - restNum) * 100 / 5000);

obj['ddwTodayPool'] = todayPool;
obj['strCashProgress'] = exchangeRate;
body = jsonpPrefix + JSON.stringify(obj) + suffix;

$done({body});
