import firebase from 'firebase/app';
import 'firebase/firestore';

export const STORIES_COLLECTION_NAME = 'stories';
const db = firebase.firestore();

const create = (data) => {
  const now = firebase.firestore.FieldValue.serverTimestamp();

  const payload = {
    ...data,
    createdAt: now,
    lastModified: now,
  };

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

  return db
    .collection(STORIES_COLLECTION_NAME)
    .doc(id)
    .set(payload, { merge: true });
};

const deleteStory = (id) => {
  return db.collection(STORIES_COLLECTION_NAME).doc(id).delete();
};

export const streamAll = (observer) => {
  return db
    .collection(STORIES_COLLECTION_NAME)
    .orderBy('createdAt', 'desc')
    .limit(20)
    .onSnapshot(observer);
};

export const stream = (id, observer) => {
  return (
    id && db.collection(STORIES_COLLECTION_NAME).doc(id).onSnapshot(observer)
  );
};

export const STORIES = {
  create,
  update,
  delete: deleteStory,
  stream,
  streamAll,
};
