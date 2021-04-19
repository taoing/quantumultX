/*
此文件为Node.js专用。其他用户请忽略
 */
//此处填写京东账号的京喜token
//形如 '{}' 的json字符串
let JxTokens = [
  '',//账号一;
  '',//账号一;
];
// 判断环境变量里面是否有京东ck
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
if (JSON.stringify(process.env).indexOf('GITHUB')>-1) {
  console.log(`请勿使用github action运行此脚本,无论你是从你自己的私库还是其他哪里拉取的源代码，都会导致我被封号\n`);
  !(async () => {
    await require('./sendNotify').sendNotify('提醒', `请勿使用github action、滥用github资源会封我仓库以及账号`)
    await process.exit(0);
  })()
}
JxTokens = [...new Set(JxTokens.filter(item => !!item))]
for (let i = 0; i < JxTokens.length; i++) {
  const index = (i + 1 === 1) ? '' : (i + 1);
  exports['JxToken' + index] = JxTokens[i].trim();
}
