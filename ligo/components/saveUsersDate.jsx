import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";


export const saveUserData = async (userId, name, latitude, longitude, topSongs, favoriteArtists, genres) => {
    try {
        await setDoc(doc(db, "users", userId), {
            name: name,
            location: {
                latitude,
                longitude
            },
            topSongs: topSongs, // Array of top song names
            favoriteArtists: favoriteArtists, // Array of artist names
            genreProfile: genres
        });
        console.log("User data saved successfully!");
    } catch (e) {
        console.error("Error adding user data: ", e);
    }
}
