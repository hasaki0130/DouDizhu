const bcrypt = require('bcryptjs')
const admin = require('firebase-admin');
const express = require('express')

const serviceAccount = require("../gameproject-d9074-firebase-adminsdk-6rnh9-cff9fb8858.json");
const firebase = require('firebase/app');
require('firebase/auth');
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

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
const auth = firebaseApp.auth();
const db = admin.firestore();
const jwt = require('jsonwebtoken');
const firebaseTimestamp = admin.firestore.FieldValue.serverTimestamp();
const crypto=require('crypto')
const secretKey = crypto.randomBytes(32).toString('base64');


// 註冊功能
exports.registerNewUser = function (username, email, password) {
    return new Promise((resolve, reject) => {
        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                  // 使用bcrypt加密
                bcrypt.hash(password, 10, (err, hashedPassword) => {
                    if (err) {
                        console.error('密碼加密失敗', err);
                        return reject(err);
                    }
                    // 額外將資料寫入db - 在此處寫入資料庫
                    db.collection('users').doc(username).set({
                        avatar: "",
                        email: email,
                        username: username,
                        password: hashedPassword, // 存儲加密後的密碼
                        money: 8888,
                        regtime: firebaseTimestamp,
                    })
                        .then(() => {
                            user.sendEmailVerification().then(function () {
                                console.log('驗證郵件已發送');
                            }).catch(function (error) {
                                console.log('驗證郵件發送失敗', error)
                            });
                            console.log('用戶資料寫入成功');
                            resolve(user);
                        })
                        .catch((error) => {
                            console.error('寫入用戶資料失敗', error);
                            reject(error);
                        });

                    console.log('註冊成功', user);
                });
            })
            .catch((error) => {
                // 處理註冊失敗的情況
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error('註冊失敗', errorCode, errorMessage);
                reject(error);
            });
    });
}

exports.getData = function getData(username) {
    return new Promise((resolve, reject) => {
        db.collection('users')
            .where("username", "==", username)
            .get()
            .then((querySnapshot) => {
                let result = [];
                querySnapshot.forEach((doc) => {
                    result.push(doc.data());
                });
                resolve(result);
            })
            .catch((error) => {
                console.log('Error getting documents: ', error);
                reject(error);
            });
    });

}

// 登入功能
exports.getUsers = function authenticateUser(email, inputPassword) {
    return new Promise((resolve, reject) => {
        db.collection('users').where("email", "==", email).get()
            .then((querySnapshot) => {
                if (querySnapshot.empty) {
                    return reject(new Error('用戶不存在'));
                }

                // 假設每個電子郵件對應一個用戶
                const userData = querySnapshot.docs[0].data();
                const hashedPasswordFromFirestore = userData.password;

                bcrypt.compare(inputPassword, hashedPasswordFromFirestore, (err, result) => {
                    if (err) {
                        return reject(new Error('密碼比對錯誤'));
                    }
                    if (result) {
                        let feedback = [];
                        db.collection('feedback').doc(userData.username).get()
                            .then((snapshot) => {
                                feedback = snapshot.data().message;
                            }).catch((err) => {
                                feedback = '';
                            })
                        let user_playway = [];
                        db.collection('game_playway')
                            .get()
                            .then((snapshot) => {
                                snapshot.forEach((doc) => {
                                    switch (userData.username) {
                                        case doc.data().banker_id:
                                            user_playway.push({
                                                identity: 'banker',
                                                money: doc.data().banker_money,
                                                date: doc.data().date.toDate().toLocaleString()
                                            })
                                            break;
                                        case doc.data().player1_id:
                                            user_playway.push({
                                                identity: 'player1',
                                                money: doc.data().player1_money,
                                                date: doc.data().date.toDate().toLocaleString()
                                            })
                                            break;
                                        case doc.data().player2_id:
                                            user_playway.push({
                                                identity: 'player2',
                                                money: doc.data().player2_money,
                                                date: doc.data().date.toDate().toLocaleString()
                                            })
                                            break;
                                    }
                                });
                            }).catch((err) => {
                                console.log(err);
                            })
                        // 密碼匹配，使用 Firebase Authentication 登錄
                        firebase.auth().signInWithEmailAndPassword(email, inputPassword)
                            .then((userCredential) => {
                                const userDetails = {
                                    avatar: userData.avatar,
                                    email: userData.email,
                                    username: userData.username,
                                    money: userData.money,
                                    regtime: userData.regtime,
                                    feedback: feedback,
                                    user_playway:user_playway
                                };
                                    // 生成 JWT
                                    const token = jwt.sign({ username: userDetails.username }, secretKey, { expiresIn: '72h' });
                                    // 将 JWT 添加到用户详情中
                                    userDetails.token = token;
                                // 登錄成功
                                resolve(userDetails);

                            })
                            .catch((error) => {
                                // Firebase 登錄失敗
                                reject(new Error('Firebase Authentication 登錄失敗: ' + error.message));
                            });
                    } else {
                        reject(new Error('密碼不正確'));
                    }
                });
            })
            .catch((error) => {
                reject(new Error('查詢用戶時出錯: ' + error.message));
            });
    });
}
//透過google登入
const googleProvider = new firebase.auth.GoogleAuthProvider();

exports.signInWithGoogle = function signInWithGoogle() {
    return new Promise((resolve, reject) => {
        auth.signInWithPopup(googleProvider)
            .then((userCredential) => {
                const user = userCredential.user;
                db.collection('users').doc(user.uid).set({
                    displayName: user.displayName,
                    email: user.email,
                    uid: user.uid
                })
                    .then(() => {
                        console.log('使用者資料已存入Firestore');
                        resolve(user);
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        console.error('Google 登入失敗', errorCode, errorMessage);
                        reject(error);
                    });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error('Google 登入失敗', errorCode, errorMessage);
                reject(error);
            });
    });
}

//密碼重設
exports.resetPassword =function resetPassword(email) {
    return new Promise((resolve, reject) => {
        auth.sendPasswordResetEmail(email)
            .then(() => {
                console.log("重設密碼郵件已發送至" + email)
                resolve();
            })
            .catch((error) => {
                console.log('重設密碼郵件發送失敗', error.message);
                reject(error);
            })
    })

}


