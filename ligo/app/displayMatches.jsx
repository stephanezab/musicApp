import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useSearchParams } from 'expo-router';
import { getUserLocation } from '../components/getUserLocation';

export default function displayMatches() {
    const [usersfound, setUsersfound] = useState([]);
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);

    const { id } = useLocalSearchParams();

    const getcurrentLocation = async () => {
        try {
            const { latitude, longitude } = await getUserLocation();

            setLatitude(latitude);
            setLongitude(longitude);
            
        } catch (error) {
            console.log("Error get location", error);
        }
    }

    const getusers = async() =>{

        try {
            const list = await findNearbyUsers(latitude, longitude, id); 
            setUsersfound(list)

        } catch (error) {
            console.log("Error get users nearby", error);
        }

    }

    useEffect(() => {

        getcurrentLocation();

    }, [latitude]);



    return (
        <View style={styles.container}>
            <Text style={styles.text}>hhihuihiuhiuhiu</Text>
            <Text style={styles.text}>{id}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#061325',
    },
    text: {
        color: '#FFFFFF',
        fontSize: 18,
    },
});
