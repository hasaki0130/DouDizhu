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
    刪除指定文件
*/
delDate();
async function delDate(){
    let deleteDoc = db.collection('users').doc('testdelete').delete();
}