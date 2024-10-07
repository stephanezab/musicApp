import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { fetchFromAPI } from '../components/fetchFromAPI';

export default function Music() {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    fetchFromAPI(`playlist_tracks`).then((data) => setTracks(data.items)).catch((error) => console.error("Error fetching top tracks:", error));
  }, []);

  
  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>Top Songs</Text>
      <FlatList
        data={tracks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.trackContainer}>
            <Text style={styles.trackName}>{item.track.name}</Text>
            <Text style={styles.artistName}>{item.track.artists[0].name}</Text>
          </View>
        )}
      />
      <Text style={[styles.title, styles.topArtist]}>Top Artists</Text>
      <FlatList
      style = {styles.list}
        data={tracks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.trackContainer}>
            
            <Text style={styles.trackName}>{item.track.artists[0].name}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#061325',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  trackContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2EC4B6',
    width: '100%',
  },
  list: {
    width: '100%', // Ensures the FlatList container uses the full width
  },
  topArtist: {
    marginTop: 40,

  },
  trackName: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  artistName: {
    fontSize: 14,
    color: '#A0A0A0',
  },
});
