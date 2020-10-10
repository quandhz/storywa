import 'antd/dist/antd.css';
import '../styles/globals.css';
import firebase from 'firebase';
import initFirebase from '../utils/auth/initFirebase';

// Init the Firebase app.
initFirebase();

const db = firebase.firestore();
db.settings({
  ignoreUndefinedProperties: true,
});

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
