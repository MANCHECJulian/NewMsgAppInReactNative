
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCzjkBOduZ8EHr52Z_LlkrPVvNhb_B5QjU',
  authDomain: 'TON_PROJECT_ID.firebaseapp.com',
  projectId: 'msgappinreactnative',
  storageBucket: 'msgappinreactnative.firebasestorage.app',
  messagingSenderId: 'TON_MESSAGING_SENDER_ID',
  appId: '1:571264660636:android:8f093061681ee18200e959',
};

const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
