const { functions, db } = require('../admin');

const generateOwnerData = functions.firestore
  .document('/stories/{storyId}')
  .onCreate(async (snap, context) => {
    const { createdBy } = snap.data();

    if (!createdBy) return null;

    const { storyId } = context.params;

    const userDoc = await db.collection('users').doc(createdBy).get();
    const userData = userDoc.data();

    await snap.ref.set({ creator: userData }, { merge: true });

    return db
      .collection('stories')
      .doc(storyId)
      .collection('roles')
      .doc(createdBy)
      .set(
        {
          owner: true,
          user: userData,
        },
        { merge: true },
      );
  });

const deleteRoles = functions.firestore
  .document('/stories/{storyId}')
  .onDelete((snap, context) =>
    db
      .collection('stories')
      .doc(context.params.storyId)
      .collection('roles')
      .get()
      .then((querySnapshot) => {
        // Once we get the results, begin a batch
        const batch = db.batch();

        querySnapshot.forEach(function (doc) {
          // For each doc, add a delete operation to the batch
          batch.delete(doc.ref);
        });

        // Commit the batch
        return batch.commit();
      }),
  );

module.exports = {
  generateOwnerData,
  deleteRoles,
};
