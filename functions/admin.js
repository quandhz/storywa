const functions = require('firebase-functions');
const functionsRegion = functions.region('asia-east2');

const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

module.exports = {
  functions: functionsRegion,
  admin,
  db,
};
