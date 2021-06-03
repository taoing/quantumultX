/*
东东超市兑换列表重写
 */

let body = $response.body;
let data = JSON.parse(body);
if (data.data.bizCode !== 0) {
    console.log(data.data.bizMsg);
    $done();
}
let result = data.data.result;
let prizeAreas = result.areas;
for (let i = 0; i < prizeAreas.length; i++) {
    let area = prizeAreas[i];
    if (area.areaId === 6) {
        let prizes = area.prizes;
        for (let j = 0; j < prizes.length; j++) {
            prizes[j].status = 0;
        }
        break;
    }
}
body = JSON.stringify(data);
console.log("modify body:\n" + body);
$done(body);
