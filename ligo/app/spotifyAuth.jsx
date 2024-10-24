import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Image, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Link, useRouter} from 'expo-router';
import * as AuthSession from 'expo-auth-session';
import Constants from 'expo-constants';
import {saveUserData} from '../components/saveUsersDate';
import {getUserData} from '../components/getUserDate';
import { getUserLocation } from '../components/getUserLocation';
import { useNavigation } from '@react-navigation/native';

const client_id = Constants.expoConfig.extra.clientId;
const redirect_uri = AuthSession.makeRedirectUri({ useProxy: true });
const scope = ['user-top-read', 'user-follow-read', 'user-read-private']; // Add scope for reading followed artists and user profile

export default function SpotifyAuthScreen() {
  const [accessToken, setAccessToken] = useState('');
  const [authorizationCode, setAuthorizationCode] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [artists, setArtists] = useState([]);
  const [userProfile, setUserProfile] = useState(null); // New state for user profile
  const [isLoadingTracks, setIsLoadingTracks] = useState(false);
  const [isLoadingArtists, setIsLoadingArtists] = useState(false);
  const navigation = useNavigation();
  const router = useRouter();

  const discovery = {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
  };

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: client_id,
      redirectUri: redirect_uri,
      scopes: [scope],
      responseType: 'code',
      usePKCE: true, // For PKCE flow
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      setAuthorizationCode(code);
    }
  }, [response]);

  const getAccessToken = async (code) => {
    try {
      const response = await axios.post('https://accounts.spotify.com/api/token', null, {
        params: {
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: redirect_uri,
          client_id: client_id,
          code_verifier: request?.codeVerifier, // PKCE
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      setAccessToken(response.data.access_token);
    } catch (error) {
      console.error('Error fetching access token:', error);
    }
  };

  const fetchUserProfile = async () => {
    if (!accessToken) return;
    try {
      const response = await axios.get('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUserProfile(response.data); // Save the user profile data
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchTopTracks = async () => {
    if (!accessToken) {
      return;
    }
    setIsLoadingTracks(true);
    try {
      const response = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setTracks(response.data.items);
    } catch (error) {
      console.error('Error fetching top tracks:', error);
    }
    setIsLoadingTracks(false);
  };

  const fetchFollowedArtists = async () => {
    if (!accessToken) {
      return;
    }
    setIsLoadingArtists(true);
    try {
      const response = await axios.get('https://api.spotify.com/v1/me/following?type=artist', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setArtists(response.data.artists.items);
    } catch (error) {
      console.error('Error fetching followed artists:', error);
    }
    setIsLoadingArtists(false);
  };

  useEffect(() => {
    if (authorizationCode) {
      getAccessToken(authorizationCode);
    }
  }, [authorizationCode]);

  useEffect(() => {
    if (accessToken) {
      setIsLoggedIn(true);
      fetchUserProfile(); // Fetch user profile after logging in
      fetchTopTracks();
      fetchFollowedArtists();
    }
  }, [accessToken]);

    // Save user data once profile, tracks, and artists are fetched
    useEffect(() => {
      const fetchLocationAndSaveUserData = async () => {
        if (userProfile && tracks.length > 0 && artists.length > 0) {
            const userId = userProfile.id;
            const userName = userProfile.display_name;
            const topSongs = tracks.map((track) => track.name);
            const favoriteArtists = artists.map((artist) => artist.name);

            // Await the async function to get the location
            const { latitude, longitude } = await getUserLocation();
            // console.log(latitude, longitude);
            
            // Call the function to save user data with the location
            saveUserData(userId, userName, latitude, longitude, topSongs, favoriteArtists);
        }
    };

    fetchLocationAndSaveUserData();
  
    }, [userProfile, tracks, artists]);

    // useEffect(()=>{
    //   if (userProfile){
        
    //     getUserData(userProfile.id)
    //   }
    // }, [userProfile])

    const handlesearch = () => {
      if (userProfile) {
        const id = userProfile.id
        router.push({
          pathname: '/displayMatches',
          params: {id}, // Convert to string for easy transfer
        });
      }
    };



  const renderTrackItem = ({ item }) => (
    <View style={styles.trackContainer}>
      <Text style={styles.trackName}>{item.name}</Text>
      <Text style={styles.artistName}>{item.artists[0].name}</Text>
    </View>
  );

  const renderArtistItem = ({ item }) => (
    <View style={styles.artistContainer}>
      {item.images.length > 0 && (
        <Image source={{ uri: item.images[0].url }} style={styles.artistImage} />
      )}
      <Text style={styles.artistName}>{"   " + item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {isLoggedIn ? (
        <>
          {/* {userProfile && (
            <View style={styles.userProfileContainer}>
              <Text style={styles.userProfileText}>User ID: {userProfile.id}</Text>
              <Text style={styles.userProfileText}>Name: {userProfile.display_name}</Text>
            </View>
          )} */}

          <Text style={styles.title}>Top Tracks</Text>
          {isLoadingTracks ? (
            <ActivityIndicator size="large" color="#00ff00" />
          ) : (
            <FlatList
              data={tracks}
              renderItem={renderTrackItem}
              keyExtractor={(item, index) => index.toString()}
              style={styles.list}
            />
          )}

          <Text style={styles.title}>Followed Artists</Text>
          {isLoadingArtists ? (
            <ActivityIndicator size="large" color="#00ff00" />
          ) : (
            <FlatList
              data={artists}
              renderItem={renderArtistItem}
              keyExtractor={(item, index) => index.toString()}
              style={styles.list}
            />
          )}
          <TouchableOpacity style={styles.searchButton} onPress={handlesearch}>
        <Text style={styles.buttonText}>Search Friends</Text>
      </TouchableOpacity>
        </>
      ) : (
        <Button
          title="Login with Spotify"
          disabled={!request}
          onPress={() => {
            promptAsync();
          }}
        />
      )}
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
  userProfileContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  userProfileText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  trackContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2EC4B6',
    width: '100%',
  },
  artistContainer: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#2EC4B6',
    width: '100%',
  },
  trackName: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  artistName: {
    fontSize: 14,
    color: '#A0A0A0',
    marginLeft: 0,
  },
  artistImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  list: {
    width: '100%',
    height: '50%',
  },
  searchButton: {
    backgroundColor: '#2EC4B6',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
  }
});
