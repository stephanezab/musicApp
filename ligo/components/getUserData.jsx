import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export const getUserData = async(userId) => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // console.log("User data:", docSnap.data());
      return docSnap.data();
    } else {
      console.log("No such document!");
    }

  } catch (e) {
    console.error("Error fetching user data: ", e);
  }

  
}


