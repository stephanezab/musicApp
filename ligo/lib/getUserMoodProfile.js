
function calculateMoodProfile(audioFeatures) {
    let totalDanceability = 0;
    let totalEnergy = 0;
    let totalValence = 0;

    audioFeatures.forEach((feature) => {
        totalDanceability += feature.danceability;
        totalEnergy += feature.energy;
        totalValence += feature.valence;
    });

    const count = audioFeatures.length;
    return {
        danceability: totalDanceability / count,
        energy: totalEnergy / count,
        valence: totalValence / count,
    };
}


export function getUserMoodProfile(audioFeatures) {

    const moodProfile = calculateMoodProfile(audioFeatures);
    
    return moodProfile;

}

