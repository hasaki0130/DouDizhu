var admin = require("firebase-admin");

var serviceAccount = require("./gameproject-d9074-firebase-adminsdk-6rnh9-cff9fb8858.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var defaultProjectManagement = admin.projectManagement();
console.log(defaultProjectManagement);