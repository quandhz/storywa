const functions = require('firebase-functions');
const path = require('path');
// The Firebase Admin SDK to access Cloud Firestore.
const admin = require('firebase-admin');

exports.uidToUser = functions.firestore
  .document('/stories/{storyId}/items/{itemId}/files/{fileId}')
  .onCreate(async (snap, context) => {
    // Grab the current value of what was written to Cloud Firestore.
    const createdBy = snap.data().createdBy;

    // Access the parameter `{documentId}` with `context.params`
    return admin
      .firestore()
      .collection('stories')
      .doc(context.params.storyId)
      .get()
      .then((doc) => {
        const storyData = doc.data();
        const user = storyData.createdBy;

        return snap.ref.set(
          {
            createdBy: {
              photoURL: user.photoURL,
              name: user.name,
              uid: user.uid,
            },
          },
          { merge: true },
        );
      });
  });
