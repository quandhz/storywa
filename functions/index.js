const functions = require('firebase-functions');
const functionsRegion = functions.region('asia-east2');

// functions
const createProfile = require('./users/createProfile');
const {
  generateOwnerData,
  deleteRoles,
} = require('./stories/generateOwnerData');

const helloWorld = (request, response) => {
  functions.logger.info('Hello logs!', { structuredData: true });
  response.send('Hello from Firebase!');
};

// exports
module.exports = {
  authOnCreate: functionsRegion.auth.user().onCreate(createProfile),
  generateOwnerData: generateOwnerData,
  deleteRoles: deleteRoles,
  helloWorld: functionsRegion.https.onRequest(helloWorld),
};

// run emulator
// firebase emulators:start --only functions
