import firebase from 'firebase/app';
import 'firebase/firestore';

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

  return db.collection('stories').doc(storyId).collection('roles').add(payload);
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
    .collection('roles')
    .doc(id)
    .set(payload, { merge: true });
};

const deleteStory = (storyId, id) => {
  return db
    .collection('stories')
    .doc(storyId)
    .collection('roles')
    .doc(id)
    .delete();
};

export const streamAll = (storyId, observer) => {
  return db
    .collection('stories')
    .doc(storyId)
    .collection('roles')
    .onSnapshot(observer);
};

export const stream = (storyId, id, observer) => {
  return db
    .collection('stories')
    .doc(storyId)
    .collection('roles')
    .doc(id)
    .onSnapshot(observer);
};

export const ROLES = {
  create,
  update,
  delete: deleteStory,
  stream,
  streamAll,
};
