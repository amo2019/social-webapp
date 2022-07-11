import firebase from "firebase/app";
import "firebase/firestore";
import 'firebase/auth';

let config = {
  // YOUR OWN FIREBASE CONFIG KEYS
};
if (!firebase.apps.length) {
firebase.initializeApp(config);
}else {
  firebase.app(); // if already initialized, use that one
}
export const auth = firebase.auth();

export const firestore = firebase.firestore();
