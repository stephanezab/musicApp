import * as Location from 'expo-location';

export const getUserLocation = async () => {

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
    }

    let currentLocation = await Location.getCurrentPositionAsync({});

    return {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude
    };

}
