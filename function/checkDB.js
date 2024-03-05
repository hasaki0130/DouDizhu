var admin = require('firebase-admin');
var serviceAccount = require("../gameproject-d9074-firebase-adminsdk-6rnh9-cff9fb8858.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

let db = admin.firestore();
//users 資料庫集合的名稱，顯示id及內容
const FieldValue = admin.firestore.FieldValue;


exports.getData = function getData(accountValue, passwordValue) {
    return new Promise((resolve, reject) => {
        db.collection('users')
            .where("account", "==", accountValue)
            .where("password", "==", passwordValue)
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
//  function (account,password,callback) {
    
// }

