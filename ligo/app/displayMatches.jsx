import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getUserLocation } from '../components/getUserLocation';
import { findNearbyUsers } from '../components/findNearbyUsers';

export default function displayMatches() {
    const [usersfound, setUsersfound] = useState([]);
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
                setUsersfound(list);
                console.log(list);
            } catch (error) {
                console.log("Error getting users nearby", error);
            }
        }
    };

    useEffect(() => {
        getcurrentLocation();
    }, []);

    useEffect(() => {
        getusers();
    }, [latitude, longitude]);

    const renderUserItem = ({ item }) => (
        <View style={styles.userContainer}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userDistance}>{item.distance.toFixed(2)} miles</Text>
        </View>
    );

    return (
        <View style={styles.container}>
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
