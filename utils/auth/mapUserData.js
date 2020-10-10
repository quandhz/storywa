export const mapUserData = (user) => {
  const { uid, email, xa, displayName, photoURL } = user;

  return {
    id: uid,
    email,
    displayName,
    photoURL,
    token: xa,
  };
};
