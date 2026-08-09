import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Firebase project config (KIU Short Stories)
const firebaseConfig = {
  apiKey: 'AIzaSyDQ4eoEXCniUWaasQ2Hu7up68MGdEdo1Fg',
  authDomain: 'kiu-short-stories-1d8c5.firebaseapp.com',
  projectId: 'kiu-short-stories-1d8c5',
  storageBucket: 'kiu-short-stories-1d8c5.firebasestorage.app',
  messagingSenderId: '941098049264',
  appId: '1:941098049264:web:aee716fe5d653f1712ac35',
  measurementId: 'G-B2DVDVKBD0',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export default app
