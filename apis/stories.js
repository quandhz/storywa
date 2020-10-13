import firebase from 'firebase/app';
import 'firebase/firestore';

export const STORIES_COLLECTION_NAME = 'stories';
const db = firebase.firestore();

const create = (storyId, data) => {
  const now = firebase.firestore.FieldValue.serverTimestamp();

  const payload = {
    ...data,
    id: Date.now(),
    createdAt: now,
    lastModified: now,
  };

  return db
    .collection(STORIES_COLLECTION_NAME)
    .doc(storyId)
    .set(payload, { merge: true });
};

const setChapter = (storyId, chapters) => {
  return db
    .collection(STORIES_COLLECTION_NAME)
    .doc(storyId)
    .set({ chapters }, { merge: true });
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
  setChapter,
  update,
  delete: deleteStory,
  stream,
  streamAll,
};
