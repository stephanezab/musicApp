
const THRESHOLD_ARTIST = 0.3; // Adjust threshold values as needed
const THRESHOLD_SONG = 0.3;
const THRESHOLD_GENRE = 0.5;

// function getCommonElements(array1, array2) {
//     return array1.filter(value => array2.includes(value));
// }

// Function to calculate the weighted Jaccard Index
function calculateWeightedJaccardIndex(weightedSetA, weightedSetB) {
    let intersectionSum = 0;
    let unionSum = 0;

    // Combine all unique elements from both sets
    const uniqueItems = new Set([
        ...Object.keys(weightedSetA),
        ...Object.keys(weightedSetB)
    ]);

    uniqueItems.forEach((item) => {
        const weightA = weightedSetA[item] || 0; // Default weight is 0 if item not present
        const weightB = weightedSetB[item] || 0;

        // Minimum weight for intersection, maximum for union
        intersectionSum += Math.min(weightA, weightB);
        unionSum += Math.max(weightA, weightB);
    });
    const commonElements = Object.keys(weightedSetA).filter(artist => artist in weightedSetB);
    const score = intersectionSum / unionSum;

    return { score, commonElements }; // Handle divide by zero case
}

function calculateJaccardIndex(setA, setB) {
    // console.log("setA",setA);
    // console.log("setB",setB);
    const commonElements = setA.filter(x => setB.includes(x));
    const intersectionSize = commonElements.length;
    const unionSize = new Set([...setA, ...setB]).size;
    const score = intersectionSize / unionSize;
    return { score, commonElements }; // Return both score and common elements
}

function calculateCosineSimilarity(vectorA, vectorB) {
    const dotProduct = Object.keys(vectorA).reduce((sum, key) => {
        return sum + (vectorA[key] * (vectorB[key] || 0));
    }, 0);

    const magnitudeA = Math.sqrt(Object.values(vectorA).reduce((sum, val) => sum + val ** 2, 0));
    const magnitudeB = Math.sqrt(Object.values(vectorB).reduce((sum, val) => sum + val ** 2, 0));

    const commonElements = Object.keys(vectorA).filter(genre => genre in vectorB);

    const score = dotProduct / (magnitudeA * magnitudeB)

    return { score, commonElements };
}

function calculateCompatibility(data1, data2) {

     // Step 2.1: Artist Overlap

     //const artistOverlap = calculateJaccardIndex(data1.favoriteArtists, data2.favoriteArtists);
     const artistOverlap = calculateWeightedJaccardIndex(data1.favoriteArtists, data2.favoriteArtists);
     
     if (artistOverlap.score >= THRESHOLD_ARTIST) {
         return { score: artistOverlap.score, matchType: 'artist', matches: artistOverlap.commonElements };
     }

    //  const artistOverlap2 = calculateJaccardIndex(Object.keys(data1.favoriteArtists), Object.keys(data2.favoriteArtists));
     
    //  if (artistOverlap2.score >= THRESHOLD_ARTIST) {
    //      return { score: artistOverlap2.score, matchType: 'artist', matches: artistOverlap2.commonElements };
    //  }

     
     // Step 2.2: Song Overlap
     const songOverlap = calculateJaccardIndex(data1.topSongs, data2.topSongs);
     
     if (songOverlap.score >= THRESHOLD_SONG) {
         return { score: songOverlap.score, matchType: 'song', matches: songOverlap.commonElements };
     }
 
    //  // Step 2.3: Genre Overlap
     const genreSimilarityScore = calculateCosineSimilarity(data1.genreProfile, data2.genreProfile);
     if (genreSimilarityScore.score >= THRESHOLD_GENRE) {
         return { score: genreSimilarityScore.score, matchType: 'genre', matches: genreSimilarityScore.commonElements }; // No exact "common" genres, just similarity
     }
 
     return { score: 0, matchType: null, matches: [] }; // No significant compatibility found
}

export const findMatchingUsers = (currUser, nearbyUsers) => {
    let matchingUsers = []

    nearbyUsers.forEach((user) => {
        const compatibility = calculateCompatibility(currUser, user);

        const perc = compatibility.score * 100;

        matchingUsers.push({
            userId: user.userId,
            distance: user.distance,
            name: user.name,
            matchPer: perc,
            matchType: compatibility.matchType,
            matches: compatibility.matches
        })
    });

    matchingUsers.sort((a, b) => b.matchPer - a.matchPer);

    return matchingUsers;

}