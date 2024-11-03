
const THRESHOLD_ARTIST = 0.3; // Adjust threshold values as needed
const THRESHOLD_SONG = 0.3;
const THRESHOLD_GENRE = 0.5;

// function getCommonElements(array1, array2) {
//     return array1.filter(value => array2.includes(value));
// }

function calculateJaccardIndex(setA, setB) {
    const intersection = setA.filter(x => setB.includes(x)).length;
    const union = new Set([...setA, ...setB]).size;
    console.log(intersection/ union)
    return intersection / union;
}

function calculateCosineSimilarity(vectorA, vectorB) {
    const dotProduct = Object.keys(vectorA).reduce((sum, key) => {
        return sum + (vectorA[key] * (vectorB[key] || 0));
    }, 0);

    const magnitudeA = Math.sqrt(Object.values(vectorA).reduce((sum, val) => sum + val ** 2, 0));
    const magnitudeB = Math.sqrt(Object.values(vectorB).reduce((sum, val) => sum + val ** 2, 0));

    return dotProduct / (magnitudeA * magnitudeB);
}

function calculateCompatibility(data1, data2) {

    // Step 2.1: Artist Overlap
    const artistOverlapScore = calculateJaccardIndex(data1.favoriteArtists, data2.favoriteArtists);
    if (artistOverlapScore >= THRESHOLD_ARTIST) {
        return artistOverlapScore; // High compatibility based on artists
    }

    // Step 2.2: Song Overlap
    const songOverlapScore = calculateJaccardIndex(data1.topSongs, data2.topSongs);
    if (songOverlapScore >= THRESHOLD_SONG) {
        return songOverlapScore; // Moderate compatibility based on songs
    }

    // // Step 2.3: Genre Overlap
    const genreSimilarityScore = calculateCosineSimilarity(data1.genreProfile, data2.genreProfile);
    if (genreSimilarityScore >= THRESHOLD_GENRE) {
        return genreSimilarityScore; // Moderate compatibility based on songs
    }

    return 0; // Compatibility based on genres if previous scores were low
}

export const findMatchingUsers = (currUser, nearbyUsers) => {
    let matchingUsers = []

    nearbyUsers.forEach((user) => {
        let comp = calculateCompatibility(currUser, user);

        let perc = comp * 100;

        matchingUsers.push({
            userId: user.userId,
            distance: user.distance,
            name: user.name,
            matchPer: perc
        })
    });

    matchingUsers.sort((a, b) => b.matchPer - a.matchPer);

    return matchingUsers;

}