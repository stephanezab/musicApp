import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getUserLocation } from '../components/getUserLocation';
import { findNearbyUsers } from '../components/findNearbyUsers';
import {findMatchingUsers} from '../components/findMatchingUsers';
import {getUserData} from '../components/getUserDate';

export default function displayMatches() {
    const [usersfoundByLocation, setUsersfoundByLocation] = useState([]);
    const [usersfound, setUsersfound] = useState([]);
    const [currUserData, setcurrUserData] = useState({})
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);

    const { id } = useLocalSearchParams();

    const getcurrentLocation = async () => {
        try {
            const { latitude, longitude } = await getUserLocation();
            setLatitude(latitude);
            setLongitude(longitude);
        } catch (error) {
            console.log("Error getting location", error);
        }
    };

    const getusers = async () => {
        if (latitude !== null && longitude !== null) {
            try {
                const list = await findNearbyUsers(latitude, longitude, id); 
                setUsersfoundByLocation(list);
                console.log("=============" +list[0]);
            } catch (error) {
                console.log("Error getting users nearby", error);
            }
        }
    };

    // Get current user Data
    const getcurrUserData = async () =>{
        
        try {
            const data = await getUserData(id);
            console.log(data);
            setcurrUserData(data);

        } catch (error) {
            console.log("Error getting current user data (displayMatches)", error);
        }


    }

    useEffect(() => {
        getcurrentLocation();
    }, []);

    useEffect(() => {
        getusers();
    }, [latitude, longitude]);

    useEffect(() => {
        getcurrUserData()
        
    }, [id]);


    useEffect(() => {
        let users = findMatchingUsers(currUserData.favoriteArtists,usersfoundByLocation)
        console.log("matches: " + users);
        setUsersfound(users);

    }, [usersfoundByLocation]);

    

    const renderUserItem = ({ item }) => (
        <View style={styles.userContainer}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userName}>{item.matchPer}%</Text>
            <Text style={styles.userDistance}>{item.distance.toFixed(2)} miles</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Friends Nearby Found</Text>
            <FlatList
                data={usersfound}
                keyExtractor={(item) => item.userId}
                renderItem={renderUserItem}
                ListEmptyComponent={<Text style={styles.emptyText}>No nearby users found</Text>}
                style={styles.list}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#061325',
        padding: 20,
        paddingTop: 60,
        paddingBottom: 70,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 20,
    },
    userContainer: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#2EC4B6',
        width: '100%',
    },
    userName: {
        fontSize: 18,
        color: '#FFFFFF',
    },
    userDistance: {
        fontSize: 14,
        color: '#A0A0A0',
    },
    list: {
        width: '100%',
    },
    emptyText: {
        fontSize: 16,
        color: '#A0A0A0',
        textAlign: 'center',
    }
});
