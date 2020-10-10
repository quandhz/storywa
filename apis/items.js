import firebase from 'firebase/app';
import 'firebase/firestore';

export const ITEMS_COLLECTION_NAME = 'items';
const db = firebase.firestore();
db.settings({
  ignoreUndefinedProperties: true,
});

const create = (storyId, data, user) => {
  const now = firebase.firestore.FieldValue.serverTimestamp();

  const payload = {
    ...data,
    createdAt: now,
    lastModified: now,
    createdBy: {
      uid: user.id,
      name: user.displayName,
      photoURL: user.photoURL,
    },
  };

  console.log('create payload', payload);

  return db
    .collection('stories')
    .doc(storyId)
    .collection(ITEMS_COLLECTION_NAME)
    .add(payload);
};

const update = (storyId, id, data, user) => {
  const now = firebase.firestore.FieldValue.serverTimestamp();

  const payload = {
    ...data,
    lastModified: now,
    lastModifiedBy: {
      uid: user.id,
      name: user.displayName,
      photoURL: user.photoURL,
    },
  };

  console.log('update payload', payload);

  return db
    .collection('stories')
    .doc(storyId)
    .collection(ITEMS_COLLECTION_NAME)
    .doc(id)
    .set(payload, { merge: true });
};

const deleteStory = (storyId, id) => {
  return db
    .collection('stories')
    .doc(storyId)
    .collection(ITEMS_COLLECTION_NAME)
    .doc(id)
    .delete();
};

export const streamAll = (storyId, observer) => {
  return db
    .collection('stories')
    .doc(storyId)
    .collection(ITEMS_COLLECTION_NAME)
    .orderBy('date')
    .onSnapshot(observer);
};

export const stream = (storyId, id, observer) => {
  return db
    .collection('stories')
    .doc(storyId)
    .collection(ITEMS_COLLECTION_NAME)
    .doc(id)
    .onSnapshot(observer);
};

export const ITEMS = {
  create,
  update,
  delete: deleteStory,
  stream,
  streamAll,
};
