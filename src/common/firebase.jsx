import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBfPZ_rVG_KzIeqpxDvchju8dgAZwVoXdY",
  authDomain: "react-js-hanoi-blog.firebaseapp.com",
  projectId: "react-js-hanoi-blog",
  storageBucket: "react-js-hanoi-blog.appspot.com",
  messagingSenderId: "901027835057",
  appId: "1:901027835057:web:a7dc9be4611447cfe40690",
};

const app = initializeApp(firebaseConfig);

// google auth
const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async () => {
  let user = null;

  await signInWithPopup(auth, provider)
    .then((result) => {
      user = result.user;
    })
    .catch((error) => {
      console.log(error);
    });

  return user;
};
