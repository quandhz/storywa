const functions = require('firebase-functions');
const path = require('path');
// The Firebase Admin SDK to access Cloud Firestore.
const admin = require('firebase-admin');

exports.attachFileToPost = functions.storage
  .object()
  .onFinalize(async (object) => {
    const fileBucket = object.bucket; // The Storage bucket that contains the file.
    const filePath = object.name; // File path in the bucket.
    const contentType = object.contentType; // File content type.
    const metageneration = object.metageneration; // Number of times metadata has been generated. New objects have a value of 1.

    // files/pcubxbTlRsNlbbmXRfVNyzeS4mL2/627dd13r6KAHwYutiVay/main_1500 (4).jpg
    const paths = path.dirname(filePath).split('/');
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
          createdBy: uid,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        }),
      },
      { merge: true },
    );
  });
