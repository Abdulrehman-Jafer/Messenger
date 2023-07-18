import { FirebaseError } from "firebase/app";
import { auth } from "../configs/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export const googleAuth = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    // This gives you a Google Access Token. You can use it to access the Google API.
    //   const credential = GoogleAuthProvider.credentialFromResult(result);
    //   const token = credential?.accessToken;
    return result.user;
  } catch (error) {
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(
      error as FirebaseError
    );
    // ...
    console.log({ error, credential });
  }
};
