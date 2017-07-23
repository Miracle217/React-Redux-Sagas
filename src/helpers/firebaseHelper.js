import firebase from 'firebase';
import { firebaseUrl, boostAdminUrl, firebaseApiKey } from 'config';

const firebaseConfig = {
  apiKey: firebaseApiKey,
  authDomain: boostAdminUrl,
  databaseURL: firebaseUrl
};

firebase.initializeApp(firebaseConfig);

const DEFAULT_TIMEOUT = 15000;

export default firebase;
firebase.child = (path) => firebase.database().ref(path);
export const firebaseServerTime = () => firebase.database.ServerValue.TIMESTAMP;

export const createRequest = async function (type, payload = {}) {
  let auth = firebase.auth().currentUser;

  if (!auth) {
    auth = firebase.auth().signInAnonymously().catch(function(error) {
      console.log(error);
    });
  }

  const clientRef = await firebase.child('clients').push({uid: auth.uid});
  const clientId = clientRef.key;
  return await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      clientRef.remove();
      reject('Client timed out');
    }, payload._timeout || DEFAULT_TIMEOUT);
    const responseRef = clientRef.child('response');
    responseRef.on('value', responseSnap => {
      const response = responseSnap.val();
      if (!response) {
        return;
      }
      clearTimeout(timeout);
      responseRef.off('value');
      clientRef.remove();
      if (response.error) {
        reject(new Error(response.error));
      }
      resolve(response);
    });

    const data = {payload, clientId, type, uid: auth.uid};
    firebase.child('queues/client/tasks').push(data);
  });
};

export const getValue = async function (path) {
  const snapshot = await firebase.child(path).once('value');
  const val = snapshot.val();
  if (typeof val !== 'object' || val === null)  {
    return val;
  }
  return { ...snapshot.val(), __key__: snapshot.key };
};
