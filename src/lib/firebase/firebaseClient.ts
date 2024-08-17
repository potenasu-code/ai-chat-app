import { getApp, getApps, initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDzJLIK-FDfyZ_KY5njA0p6wTUQIl_UzcY",
  authDomain: "ai-chat-app-da8a6.firebaseapp.com",
  projectId: "ai-chat-app-da8a6",
  storageBucket: "ai-chat-app-da8a6.appspot.com",
  messagingSenderId: "1071980681186",
  appId: "1:1071980681186:web:a742e376776ea3272f4bbb"
};


let app;

if(!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}

const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
export {auth, db, provider};
// const app = initializeApp(firebaseConfig);