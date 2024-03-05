var uuid = require('uuid-v4');
var admin = require('firebase-admin');
var serviceAccount = require("../gameproject-d9074-firebase-adminsdk-6rnh9-cff9fb8858.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "gs://gameproject-d9074.appspot.com"
});
var bucket = admin.storage().bucket();
/*
    上述為初始化資料庫，及指定資料庫網址
*/
async function uploadAvatarToFirestore(filename, username){
    const uploadedFile = await bucket.upload(filename,{
        gzip:true,
        metadata:{
            metadata:{
                firebaseStorageDownloadTokens:uuid()
            },
            cacheControl: ' public,max-age=31536000',
        },
    });

const db = admin.firestore();


const file=uploadedFile[0];
const downloadURL = await file.getSignedUrl({
    action: 'read',
    expires: '01-01-2099'
});

const updateimg={
    avatar: downloadURL
}

const userRef = db.collection('users').doc(username);
await userRef.update(updateimg)
}
//第一個path 為用戶端大頭貼上傳位址
//此第二個參數為 username 為指定的用戶名稱
uploadAvatarToFirestore('C:/Users/vans9/Downloads/ttt.jpg', "happy68").catch(console.error);