import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Image, FlatList } from 'react-native';
import axios from 'axios';
import * as AuthSession from 'expo-auth-session';
// import {EXPO_CLIENT_ID} from '@env';
import Constants from 'expo-constants';

// const client_id = "c8d4544eba96402fbff67f4ee6491d70";
const client_id = Constants.expoConfig.extra.clientId;
const redirect_uri = AuthSession.makeRedirectUri({ useProxy: true });
const scope = ['user-top-read', 'user-follow-read']; // Add scope for reading followed artists
console.log("cliend:" + client_id)

export default function SpotifyAuthScreen() {
  const [accessToken, setAccessToken] = useState('');
  const [authorizationCode, setAuthorizationCode] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [artists, setArtists] = useState([]);
  const [isLoadingTracks, setIsLoadingTracks] = useState(false);
  const [isLoadingArtists, setIsLoadingArtists] = useState(false);

  console.log("Redirect URI:", redirect_uri);

  // Step 1: Define the authorization request configuration
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

  // Handle the response from the Spotify authorization endpoint
  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      setAuthorizationCode(code);
    }
  }, [response]);

  // Exchange the authorization code for an access token
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

  // Fetch the user's top tracks from Spotify
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

  // Fetch the artists that the user follows
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

  // Trigger access token retrieval after receiving the authorization code
  useEffect(() => {
    if (authorizationCode) {
      getAccessToken(authorizationCode);
    }
  }, [authorizationCode]);

  // Fetch user's top tracks and followed artists once access token is set
  useEffect(() => {
    if (accessToken) {
      setIsLoggedIn(true);
      fetchTopTracks();
      fetchFollowedArtists();
    }
  }, [accessToken]);

  // Render item function for FlatList - Top Tracks
  const renderTrackItem = ({ item }) => (
    <View style={styles.trackContainer}>
      <Text style={styles.trackName}>{item.name}</Text>
      <Text style={styles.artistName}>{item.artists[0].name}</Text>
    </View>
  );

  // Render item function for FlatList - Followed Artists
  const renderArtistItem = ({ item }) => (
    <View style={styles.artistContainer}>
      {item.images.length > 0 && (
        <Image source={{ uri: item.images[0].url }} style={styles.artistImage} />
      )}
      <Text style={styles.artistName}>{"   "+ item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {isLoggedIn ? (
        <>
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
    height: '50%'
  },
});

