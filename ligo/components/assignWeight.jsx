
const mappingWeight = (artists, weightMap, baseScore) => {
    artists.forEach((artist, index) => {
        weightMap[artist] = (weightMap[artist] || 0) + (baseScore - index);
    });
};

export const assignWeight = (short, medium, long) => {

    const weightMap = {};
    mappingWeight(short, weightMap, 10); // Short-term
    mappingWeight(medium, weightMap, 10); // Medium-term
    mappingWeight(long, weightMap, 10); // Long-term

    return weightMap

}