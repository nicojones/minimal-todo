const admin = require('firebase-admin');
const config = require('./config');

if (!admin.apps.length) {
  admin.initializeApp(config);
}

const db = admin.firestore();

module.exports = { admin, db };
