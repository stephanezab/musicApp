import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getUserLocation } from '@/lib/getUserLocation';
import { findNearbyUsers } from '@/lib/findNearbyUsers';
import { findMatchingUsers } from '@/lib/findMatchingUsers';
import { getUserData } from '@/lib/getUserData';

export default function DisplayMatches() {
    const [usersfoundByLocation, setUsersfoundByLocation] = useState([]);
    const [usersfound, setUsersfound] = useState([]);
    const [currUserData, setcurrUserData] = useState({});
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);

    const { id } = useLocalSearchParams();

    // get user location 
    const getcurrentLocation = async () => {
        try {
            const { latitude, longitude } = await getUserLocation();
            setLatitude(latitude);
            setLongitude(longitude);
        } catch (error) {
            console.log("Error getting location", error);
        }
    };

    // get other users data in a 20 mile radius 

    const getusers = async () => {
        if (latitude !== null && longitude !== null) {
            try {
                const list = await findNearbyUsers(latitude, longitude, id); 
                setUsersfoundByLocation(list);
            } catch (error) {
                console.log("Error getting users nearby", error);
            }
        }
    };

    // get current user data 

    const getcurrUserData = async () => {
        try {
            const data = await getUserData(id);
            setcurrUserData(data);
        } catch (error) {
            console.log("Error getting current user data (displayMatches)", error);
        }
    };

    useEffect(() => {
        getcurrentLocation();
    }, []);

    useEffect(() => {
        getusers();
    }, [latitude, longitude]);

    useEffect(() => {
        getcurrUserData();
    }, [id]);

    // finding users that matches with the current user
    useEffect(() => {
        if (usersfoundByLocation.length > 0 && currUserData) {
            const users = findMatchingUsers(currUserData, usersfoundByLocation);
            setUsersfound(users);
        }
    }, [usersfoundByLocation, currUserData]);

    const renderUserItem = ({ item }) => (
        <View style={styles.userContainer}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.matchPercentage}>{item.matchPer.toFixed(1)}%</Text>
            <Text style={styles.userDistance}>{item.distance.toFixed(2)} miles</Text>
            <Text style={styles.matchType}>Match by: {item.matchType}</Text>
            {item.matches.length > 0 && (
                <Text style={styles.matches}>
                    Matches: {item.matches.join(', ')}
                </Text>
            )}
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
        flexDirection: 'column',
        alignItems: 'flex-start',
        borderBottomWidth: 1,
        borderBottomColor: '#2EC4B6',
        width: '100%',
    },
    userName: {
        fontSize: 18,
        color: '#FFFFFF',
    },
    matchPercentage: {
        fontSize: 16,
        color: '#FFFFFF',
    },
    userDistance: {
        fontSize: 14,
        color: '#A0A0A0',
    },
    matchType: {
        fontSize: 14,
        color: '#2EC4B6',
        marginTop: 5,
    },
    matches: {
        fontSize: 14,
        color: '#A0A0A0',
        marginTop: 2,
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
