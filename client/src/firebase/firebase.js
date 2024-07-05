import { initializeApp } from 'firebase/app'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyACNX6TJC5hjjAjzz37XlXpvURZtWqokL4',
  authDomain: 'blog-v2-fe257.firebaseapp.com',
  projectId: 'blog-v2-fe257',
  storageBucket: 'blog-v2-fe257.appspot.com',
  messagingSenderId: '114549254177',
  appId: '1:114549254177:web:74a6f3c0257f0ad7735b60'
}

const app = initializeApp(firebaseConfig)

const provider = new GoogleAuthProvider()

const auth = getAuth()

export const signInWithGoogle = async () => {
  let user = null

  await signInWithPopup(auth, provider)
    .then((result) => {
      user = result.user
    })
    .catch((error) => {
      console.log(error)
      throw new Error(error)
    })

  return user
}
