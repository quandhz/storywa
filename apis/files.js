import firebase from 'firebase/app';
import 'firebase/firestore';
import { ITEMS_COLLECTION_NAME } from './items';
import { STORIES_COLLECTION_NAME } from './stories';

export const FILES_COLLECTION_NAME = 'files';

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
    .collection(FILES_COLLECTION_NAME)
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
    .collection(FILES_COLLECTION_NAME)
    .doc(id)
    .set(payload, { merge: true });
};

const deleteStory = (storyId, itemId, id) => {
  return db
    .collection(STORIES_COLLECTION_NAME)
    .doc(storyId)
    .collection(ITEMS_COLLECTION_NAME)
    .doc(itemId)
    .collection(FILES_COLLECTION_NAME)
    .doc(id)
    .delete();
};

export const streamAll = (storyId, itemId, observer) => {
  return db
    .collection(STORIES_COLLECTION_NAME)
    .doc(storyId)
    .collection(ITEMS_COLLECTION_NAME)
    .doc(itemId)
    .collection(FILES_COLLECTION_NAME)
    .orderBy('createdAt')
    .onSnapshot(observer);
};

export const stream = (storyId, id, observer) => {
  return db
    .collection('stories')
    .doc(storyId)
    .collection(FILES_COLLECTION_NAME)
    .doc(id)
    .onSnapshot(observer);
};

export const FILES = {
  create,
  update,
  delete: deleteStory,
  stream,
  streamAll,
};
