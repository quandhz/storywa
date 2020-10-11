const { USERS_COLLECTION } = require('../constants');
const { db } = require('../admin');

const createProfile = (userRecord, context) => {
  const { email, uid, displayName, photoURL } = userRecord;
  console.log('userRecord', JSON.stringify(userRecord));

  return db
    .collection(USERS_COLLECTION)
    .doc(uid)
    .set({ email, displayName, photoURL })
    .catch(console.error);
};

module.exports = createProfile;
