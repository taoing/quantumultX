/*
京享值好友列表重写: 保留京享值低于自己的好友

QuantumultX:
[MITM]
hostname = pengyougou.m.jd.com

^https://pengyougou.m.jd.com/like/jxz/getUserFriendsPage\?actId=8.+ url script-response-body https://raw.githubusercontent.com/taoing/quantumultX/master/rewrite/jd_jxz_friends.js

 */
const $ = new Env('京享值PK好友列表');
const USER_AGENT = "jdapp;iPhone;10.0.1;13.7;b4eecccd6390af2df77401baeddfa6bb199be987;network/wifi;model/iPhone12,1;addressid/138425760;appBuild/167685;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 13_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1";
const myPin = '109912ce317991bcdcca46aae737b4f2'; // 填写自己的pk pin
const myScore = 7340; // 填写自己的京享值

let body = $response.body;
let data = JSON.parse(body);
let pks = [];
let rewrite = false;

!(async () => {
    let originPks = data.datas;
    if (originPks.length > 0) {
        let rlist = await filterPks(originPks);
        if (rlist.length === 0) {
            // 查询第二页
            for (let i = 2; i < 22; i++) {
                originPks = await getUserFriendsPage(i);
                rlist = await filterPks(originPks);
                if (rlist.length > 0) {
                    break;
                }
            }
        }
        pks = rlist;
        rewrite = true;
        if (pks.length === 0) {
            let remainOne = {
                "friendPin":"2320eb36486e9243af3f403d9d9413b5",
                "friendMaskPin":null,
                "channel":null,
                "channelStr":null,
                "createTime":null,
                "jdImage":null,
                "jdNickname":"luyazhi",
                "relationAssist":null,
                "winNum":238,
                "relation":2,
                "pkStatus":4,
                "leftLunchPkNum":30,
                "leftAcceptPkNum":29,
                "isMain":null
            };
            // 默认保留一个, 防止不能加载下一页
            pks.push(remainOne);
        }
    }
})()
    .catch((e) => {
        $.log("", `❌ ${$.name}, 失败! 原因: ${e}!`, "");
    })
    .finally(() => {
        if (rewrite) {
            data.datas = pks;
            let newData = JSON.stringify(data);
            console.log("京享值低于自己的好友列表:\n" + newData);
            $.done(newData);
        } else {
            $.done();
        }
    });

function getScore(pin) {
    return new Promise((resolve => {
        let options = {
            "url": "https://pengyougou.m.jd.com/like/jxz/getScore?actId=8&appId=dafbe42d5bff9d82298e5230eb8c3f79&lkEPin=" + pin,
            "headers": {
                "Referer": "https://game-cdn.moxigame.cn/ClickEliminate/IntegralPK_jd/thirdapp/index.html?&token=AAFgwYjmADD1CrUNjDlWrIKSUE5xguJH3wmor9ZeStzbDq5cXG2Me0PSQgXJvT5bAgJv_DErW1E&returnurl=https%3A%2F%2Fprodev.m.jd.com%2Fmall%2Factive%2F45njQg88Vym1s2EGp9aV6cPvqecw%2Findex.html%3Ftttparams%3DImfQnGideyJnTG5nIjoiMTE0LjM3OTc2NiIsImdMYXQiOiIzMC42MDE0NzEifQ8%253D%253D%26babelChannel%3Dttt1%26qdsource%3Dapp%26lng%3D114.362856%26lat%3D30.577543%26sid%3Dab2735c8cec04b1db8d32b4f406fef7w%26un_area%3D17_1381_50717_52133%23%2Findex&tttparams=ImfQnGideyJnTG5nIjoiMTE0LjM3OTc2NiIsImdMYXQiOiIzMC42MDE0NzEifQ8%3D%3D&babelChannel=ttt1&lng=114.362856&lat=30.577543&sid=ab2735c8cec04b1db8d32b4f406fef7w&un_area=17_1381_50717_52133&friendPin=109912ce317991bcdcca46aae737b4f2",
                "Host": "pengyougou.m.jd.com",
                "Content-Type": "application/json",
                "Origin": "https://game-cdn.moxigame.cn",
                "Connection": "keep-alive",
                "Accept": " */*",
                "User-Agent": USER_AGENT,
                "Accept-Encoding": "gzip,deflate,br",
                "Accept-Language": "zh-cn",
            }
        };
        let result = 9999; // 默认值足够大
        $.get(options, (err, resp, data) => {
            try {
                if (err) {
                    $.logErr(err)
                } else {
                    if (data) {
                        data = JSON.parse(data);
                        result = data.data;
                    } else {
                        $.log('京东服务器返回空数据');
                    }
                }
            } catch (e) {
                $.logErr(e)
            } finally {
                resolve(result);
            }
        });
    }));
}

async function filterPks(pkList) {
    let newPkList = [];
    if (pkList.length > 0) {
        for (let i = 0; i < pkList.length; i++) {
            let item = pkList[i];
            // 保留1或2个京享值低于自己好友即可, 多余无用; pkStatus===4 表示已pk, 需要排除
            if (newPkList.length < 2 && item.leftAcceptPkNum > 0 && item.pkStatus !== 4) {
                let score = await getScore(item.friendPin);
                if (score < myScore) {
                    newPkList.push(item);
                }
            }
        }
    }
    return newPkList;
}

function getUserFriendsPage(pageNo = 1, pageSize = 10) {
    console.log(`获取好友分页列表 pageNo: ${pageNo}, pageSize: ${pageSize}`);
    return new Promise(resolve => {
        let options = {
            "url": `https://pengyougou.m.jd.com/like/jxz/getUserFriendsPage?appId=dafbe42d5bff9d82298e5230eb8c3f79&lkEPin=${myPin}&pageNo=${pageNo}&pageSize=${pageSize}&actId=8`,
            "headers": {
                "Referer": "https://game-cdn.moxigame.cn/ClickEliminate/IntegralPK_jd/thirdapp/index.html?&token=AAFgwYjmADD1CrUNjDlWrIKSUE5xguJH3wmor9ZeStzbDq5cXG2Me0PSQgXJvT5bAgJv_DErW1E&returnurl=https%3A%2F%2Fprodev.m.jd.com%2Fmall%2Factive%2F45njQg88Vym1s2EGp9aV6cPvqecw%2Findex.html%3Ftttparams%3DImfQnGideyJnTG5nIjoiMTE0LjM3OTc2NiIsImdMYXQiOiIzMC42MDE0NzEifQ8%253D%253D%26babelChannel%3Dttt1%26qdsource%3Dapp%26lng%3D114.362856%26lat%3D30.577543%26sid%3Dab2735c8cec04b1db8d32b4f406fef7w%26un_area%3D17_1381_50717_52133%23%2Findex&tttparams=ImfQnGideyJnTG5nIjoiMTE0LjM3OTc2NiIsImdMYXQiOiIzMC42MDE0NzEifQ8%3D%3D&babelChannel=ttt1&lng=114.362856&lat=30.577543&sid=ab2735c8cec04b1db8d32b4f406fef7w&un_area=17_1381_50717_52133&friendPin=109912ce317991bcdcca46aae737b4f2",
                "Host": "pengyougou.m.jd.com",
                "Content-Type": "application/json",
                "Origin": "https://game-cdn.moxigame.cn",
                "Connection": "keep-alive",
                "Accept": " */*",
                "User-Agent": USER_AGENT,
                "Accept-Encoding": "gzip,deflate,br",
                "Accept-Language": "zh-cn",
            }
        };
        let result = [];
        $.get(options, (err, resp, data) => {
            try {
                if (err) {
                    $.logErr(err)
                } else {
                    if (data) {
                        data = JSON.parse(data);
                        result = data.datas;
                    } else {
                        $.log('京东服务器返回空数据');
                    }
                }
            } catch (e) {
                $.logErr(e)
            } finally {
                resolve(result);
            }
        });
    });
}

// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
