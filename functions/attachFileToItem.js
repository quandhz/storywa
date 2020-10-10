const functions = require('firebase-functions');
const path = require('path');
// The Firebase Admin SDK to access Cloud Firestore.
const admin = require('firebase-admin');

exports.attachFileToItem = functions.storage
  .object()
  .onFinalize(async (object) => {
    const fileBucket = object.bucket; // The Storage bucket that contains the file.
    const filePath = object.name; // File path in the bucket.
    const contentType = object.contentType; // File content type.
    const metageneration = object.metageneration; // Number of times metadata has been generated. New objects have a value of 1.

    const paths = path.dirname(filePath).split('/');
    const storyId = paths[1];
    const itemId = paths[2];
    const uid = paths[3];
    const fileName = path.basename(filePath);

    // Write the amount to this new document
    return admin
      .firestore()
      .collection('stories')
      .doc(storyId)
      .collection('items')
      .doc(itemId)
      .collection('files')
      .add({
        fileName,
        contentType,
        createdBy: uid,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
  });
