

function getCommonElements(array1, array2) {
    return array1.filter(value => array2.includes(value));
}


export const findMatchingUsers = (currArtistList, nearbyUsers) => {
    let matchingUsers = []

    nearbyUsers.forEach((user) => {
        let comp = getCommonElements(currArtistList, user.favoriteArtists);

        let perc = (comp.length / currArtistList.length) * 100;

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