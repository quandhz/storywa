const functions = require('firebase-functions');
const path = require('path');
// The Firebase Admin SDK to access Cloud Firestore.
const admin = require('firebase-admin');

const attachFileToItem = require('./attachFileToItem');
exports.attachFileToItem = attachFileToItem.attachFileToItem;

const uidToUser = require('./uidToUser');
exports.uidToUser = uidToUser.uidToUser;

const metadata = require('./metadata');
exports.metadata = metadata.metadata;

exports.attachFileToPost = functions.storage
  .object()
  .onFinalize(async (object) => {
    const fileBucket = object.bucket; // The Storage bucket that contains the file.
    const filePath = object.name; // File path in the bucket.
    const contentType = object.contentType; // File content type.
    const metageneration = object.metageneration; // Number of times metadata has been generated. New objects have a value of 1.

    // files/pcubxbTlRsNlbbmXRfVNyzeS4mL2/627dd13r6KAHwYutiVay/main_1500 (4).jpg
    const paths = path.dirname(filePath).split('/');
    console.log('paths', paths);
    const uid = paths[1];
    const postId = paths[2];
    const fileName = path.basename(filePath);

    let expenseDoc = admin.firestore().doc(`/posts/${postId}`);

    // Write the amount to this new document
    return expenseDoc.set(
      {
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        files: admin.firestore.FieldValue.arrayUnion({
          fileName,
        }),
      },
      { merge: true },
    );
  });

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// Take the text parameter passed to this HTTP endpoint and insert it into
// Cloud Firestore under the path /messages/:documentId/original
exports.addMessage = functions.https.onRequest(async (req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into Cloud Firestore using the Firebase Admin SDK.
  const writeResult = await admin
    .firestore()
    .collection('messages')
    .add({ original: original });
  // Send back a message that we've succesfully written the message
  res.json({ result: `Message with ID: ${writeResult.id} added.` });
});

// Listens for new messages added to /messages/:documentId/original and creates an
// uppercase version of the message to /messages/:documentId/uppercase
exports.makeUppercase = functions.firestore
  .document('/messages/{documentId}')
  .onCreate((snap, context) => {
    // Grab the current value of what was written to Cloud Firestore.
    const original = snap.data().original;

    // Access the parameter `{documentId}` with `context.params`
    functions.logger.log('Uppercasing', context.params.documentId, original);

    const uppercase = original.toUpperCase();

    // You must return a Promise when performing asynchronous tasks inside a Functions such as
    // writing to Cloud Firestore.
    // Setting an 'uppercase' field in Cloud Firestore document returns a Promise.
    return snap.ref.set({ uppercase }, { merge: true });
  });