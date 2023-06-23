import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyC_cG-BoZ5zUcfcKb_uWYpBiSjJgJdt0D8",
  authDomain: "cricket-5abc7.firebaseapp.com",
  projectId: "cricket-5abc7",
  storageBucket: "cricket-5abc7.appspot.com",
  messagingSenderId: "179032800747",
  appId: "1:179032800747:web:82d1de592ae7934004adae"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export { db }