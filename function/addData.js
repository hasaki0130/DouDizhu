var admin = require('firebase-admin');
//取得Key認證文件
var serviceAccount = require("../gameproject-d9074-firebase-adminsdk-6rnh9-cff9fb8858.json");
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
// });
//數據庫對象
let db = admin.firestore();
//服務器時間戳
const FieldValue = admin.firestore.FieldValue;

//增加數據
/*
    根據資料庫項目調整選項
    目前最外層資料庫集合為 users，後續依需求增加資料庫集合
    user底下的項目有，例如 account email password等
    但密碼要再加入Bcrypt等加密項目
    命令列使用 node addData.js調用檔案
*/

addData();
async function addData(){
        // const res = await db.collection('users').add({
        //     account: "tony123",
        //     email: "tony@tony.com",
        //     name:'Tony',
        //     password: '123456',
        //     registertime : FieldValue.serverTimestamp()
        // });
        // console.log('Added document with ID', res.id);
    
}

exports.feedback = async function addfeedback(mailtext,username){
        const res = await db.collection('feedback').doc(username).update({
            message:FieldValue.arrayUnion({
            reply_message: "尚未回覆",
            reply_message_date: "",
            user_message: mailtext,
            user_message_date: new Date()
        })    
        });

}

