import firebase from 'firebase/app';
import 'firebase/firestore';

export const STORIES_COLLECTION_NAME = 'stories';
const db = firebase.firestore();

const create = (data, user) => {
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

  return db.collection(STORIES_COLLECTION_NAME).add(payload);
};

const update = (id, data, user) => {
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

  return db.collection(STORIES_COLLECTION_NAME).doc(id).set(payload, { merge: true });
};

const deleteStory = (id) => {
  return db.collection(STORIES_COLLECTION_NAME).doc(id).delete();
};

export const streamAll = (observer) => {
  return db
    .collection(STORIES_COLLECTION_NAME)
    .orderBy('createdAt')
    .onSnapshot(observer);
};

export const stream = (id, observer) => {
  return id && db.collection(STORIES_COLLECTION_NAME).doc(id).onSnapshot(observer);
};

export const STORIES = {
  create,
  update,
  delete: deleteStory,
  stream,
  streamAll,
};
