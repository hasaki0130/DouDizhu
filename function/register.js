var admin = require('firebase-admin');
var serviceAccount = require("../gameproject-d9074-firebase-adminsdk-6rnh9-cff9fb8858.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const firebase = require('firebase');
require('firebase/auth');
require('firebase/database');

const bcrypt = require('bcryptjs')

const firebaseConfig = {
    apiKey: "AIzaSyCEEb5PlBygA9_pTl38ce19A5vtZsKUqdA",
    authDomain: "gameproject-d9074.firebaseapp.com",
    databaseURL: "https://gameproject-d9074-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "gameproject-d9074",
    storageBucket: "gameproject-d9074.appspot.com",
    messagingSenderId: "521476406324",
    appId: "1:521476406324:web:e44521f5a393d56d945e61",
    measurementId: "G-CL35V2SP5F"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig);
const auth = firebaseApp.auth();
let db = admin.firestore();
const firebaseTimestamp = admin.firestore.FieldValue.serverTimestamp();

const username = 'happy77';//獲取使用者輸入的用戶名稱
const email = 'happy77@happy.com';//獲取使用者輸入的email
const password = '7777777'; //獲取使用者輸入的密碼


auth.createUserWithEmailAndPassword(email, password)
  .then((userCredential) => {
    const user = userCredential.user;

    // 使用bcrypt加密
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error('密碼加密失敗', err);
        return;
      }

      // 額外將資料寫入db - 在此處寫入資料庫
      db.collection('users').doc(username).set({
        email: email,
        username: username,
        password: hashedPassword, // 存儲加密後的密碼
        money: 8888,
        regtime: firebaseTimestamp,
      })
      .then(() => {
        user.sendEmailVerification().then(function(){
          console.log('驗證郵件已發送');
        }).catch(function(error){
          console.log('驗證郵件發送失敗',error)
        });

        console.log('用戶資料寫入成功');
      })
      .catch((error) => {
        console.error('寫入用戶資料失敗', error);
      });

      console.log('註冊成功', user);
    });
  })
  .catch((error) => {
    // 處理註冊失敗的情況
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error('註冊失敗', errorCode, errorMessage);
  });
/*
//另外呼叫一個時間戳記，提供給html,js使用																									
async function fetchData() {
  try {
    const snapshot = await db.collection('users').doc(username).get();
    const userData = snapshot.data();
    
    if (userData) {
      const timestampFromFirestore = userData.regtime;
      const dateFromFirestore = timestampFromFirestore.toDate();
      const formattedFirestoreDate = dateFromFirestore.toLocaleString();
      
      console.log(formattedFirestoreDate);
      // 在這裡進行後續操作，例如將日期放入 HTML 元素中
    } else {
      console.log('找不到使用者資料');
    }
  } catch (error) {
    console.error('讀取資料失敗', error);
  }
}
fetchData();
//假設html中時間戳的id為 "timestampElement"
fetch('/getFormattedDate')
  .then(response => response.json())
  .then(data => {
    const formattedDate = data.formattedDate;
    // 在這裡使用 formattedDate 進行操作，例如將其顯示在網頁上的特定元素中
    document.getElementById('timestampElement').innerText = formattedDate;
  })
  .catch(error => {
    console.error('讀取資料失敗', error);
  });
  */