var admin = require('firebase-admin');
//取得Key認證文件
var serviceAccount = require("../gameproject-d9074-firebase-adminsdk-6rnh9-cff9fb8858.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
//數據庫對象
let db = admin.firestore();
//服務器時間戳
const FieldValue = admin.firestore.FieldValue;
/*
    文件id為使用者id，一個使用者底下有相關的所有資料，共用一個unique ID
    例如doc(MXRbxlGYY7sP2LAMQ8FG)
    新增與修改都可使用update功能
*/
upDate();
async function upDate(){
    const userRef = db.collection('users').doc('MXRbxlGYY7sP2LAMQ8FG');
    const res = await userRef.update({
        age: 25,
        upddate: FieldValue.serverTimestamp(),
        name: "皮卡皮卡",
        gender: "gay"
    });
}