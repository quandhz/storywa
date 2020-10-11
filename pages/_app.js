import 'antd/dist/antd.css';
import '../styles/globals.css';
import firebase from 'firebase';
import initFirebase from '../utils/auth/initFirebase';
import getConfig from 'next/config';

// Only holds serverRuntimeConfig and publicRuntimeConfig
const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

// Init the Firebase app.
initFirebase();

const db = firebase.firestore();

// ADD THESE LINES
if (process.env.NODE_ENV !== 'production') {
  db.settings({
    ignoreUndefinedProperties: true,
    // host: 'localhost:8080',
    // ssl: false,
  });
} else {
  db.settings({
    ignoreUndefinedProperties: true,
  });
}

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
