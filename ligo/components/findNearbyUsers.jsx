import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import {findDistance} from './findDistance';


export const findNearbyUsers = async(currentLat, currentLon, userId, maxDistance = 20) => {
    const usersCollection = collection(db, "users");
    const usersSnapshot = await getDocs(usersCollection);
    const nearbyUsers = [];
  
    usersSnapshot.forEach((doc) => {
      // Ignore the main user by checking the document ID
      if (doc.id === userId) {
        return; // Skip this iteration
      }
  
      const userData = doc.data();
      const { latitude, longitude } = userData.location;
      const distance = findDistance(currentLat, currentLon, latitude, longitude);
  
      if (distance <= maxDistance) {
        nearbyUsers.push({
          userId: doc.id,
          distance: distance,
          topSongs: userData.topSongs,
          favoriteArtists: userData.favoriteArtists
        });
      }
    });
  
    return nearbyUsers;
  }

  