/*
此文件为Node.js专用。其他用户请忽略
 */
//此处填写京东账号的京喜token
//形如 '{}' 的json字符串
let JxTokens = [
  '',//账号一;
  '',//账号一;
];
// 判断环境变量里面是否有京喜token
let jxToken = process.env.JX_TOKEN;
if (jxToken) {
  if (jxToken.indexOf('&') > -1) {
    JxTokens = jxToken.split('&');
  } else if (jxToken.indexOf('\n') > -1) {
    JxTokens = jxToken.split('\n');
  } else {
    JxTokens = [jxToken];
  }
}
JxTokens = [...new Set(JxTokens.filter(item => !!item))]
for (let i = 0; i < JxTokens.length; i++) {
  const index = (i + 1 === 1) ? '' : (i + 1);
  exports['JxToken' + index] = JxTokens[i].trim();
}
