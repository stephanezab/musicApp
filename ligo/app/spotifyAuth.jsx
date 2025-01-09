import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Image, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Link, useRouter } from 'expo-router';
import * as AuthSession from 'expo-auth-session';
import Constants from 'expo-constants';
import { saveUserData } from '@/lib/saveUsersDate';
import { getUserData } from '@/lib/getUserData';
import { fetchFromAPI } from '@/lib/fetchFromAPI';
import { getAccessToken } from '@/lib/getAccessToken';
import { getUserLocation } from '@/lib/getUserLocation';
import { assignWeight } from '@/lib/assignWeight';
import { getUserMoodProfile } from '@/lib/getUserMoodProfile';


const client_id = Constants.expoConfig.extra.clientId;
const redirect_uri = AuthSession.makeRedirectUri({ useProxy: true });
const scope = [
  'user-top-read',
  'user-follow-read',
  'user-read-private',
  'user-read-email',
  'playlist-read-private',
  'user-library-read'
]; // Add scope here

export default function SpotifyAuthScreen() {

  const [accessToken, setAccessToken] = useState('');
  const [authorizationCode, setAuthorizationCode] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [artists, setArtists] = useState([]);

  const [extsongGenres, setExtsongGenres] = useState({});
  const [extartistGenres, setExtartistGenres] = useState({});
  const [Genres, setGenres] = useState({});

  const [userProfile, setUserProfile] = useState(null); 
  const [isLoadingTracks, setIsLoadingTracks] = useState(false);
  const [isLoadingArtists, setIsLoadingArtists] = useState(false);
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
      show_dialog: true,
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

  const getToken = async (code) => {
    try {
    
      const data = await getAccessToken(code, redirect_uri, client_id, request);
      //console.log("define the scope",data.scope);
      setAccessToken(data.access_token);
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
      
      const data = await fetchFromAPI('me/top/tracks?offset=0&limit=10', accessToken);
      

      //console.log("top tracks===",data.items);
      const trackIds = data.items.map((track) => track.id);

      // const data2 = await fetchFromAPI(`audio-features/${trackIds[0]}`, accessToken);

      // console.log("=========", data2);

      // const mood = getUserMoodProfile(audioFeatures);
      // console.log("MOOD:===", mood);
      setTracks(data.items);
      

      // console.log("genres from songs====", genres);
      //setExtsongGenres(genres);

    } catch (error) {
      console.error('Error fetching top tracks:', error);
    }
    setIsLoadingTracks(false);
  };

  const fetchTopArtists = async () => {
    if (!accessToken) {
      return;
    }
    setIsLoadingArtists(true);
    try {
      

      const data = await fetchFromAPI('me/following?type=artist', accessToken);
      const data_short = await fetchFromAPI('me/top/artists?time_range=short_term&limit=10', accessToken);
      const data_medium = await fetchFromAPI('me/top/artists?time_range=medium_term&limit=10', accessToken);
      const data_long = await fetchFromAPI('me/top/artists?time_range=long_term&limit=10', accessToken);
      const genreCounts = {};

      const shortArtists = data_short.items.map(artist => artist.name);
      const mediumArtists = data_medium.items.map(artist => artist.name);
      const longArtists = data_long.items.map(artist => artist.name);

      // console.log("short term", shortArtists);
      // console.log("medium", mediumArtists);
      // console.log("long", longArtists);
      const listmap = assignWeight(shortArtists, mediumArtists, longArtists);
      console.log("final weight:", listmap);

      const artistArray = Object.entries(listmap).map(([name, score]) => ({ name, score }));


      data.artists.items.forEach(artist => {

        artist.genres.forEach(genre => {
          genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        });
      });

      let sortedGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

      sortedGenres = Object.fromEntries(sortedGenres);

      console.log("genre artist====: " + JSON.stringify(genreCounts));

      setGenres(sortedGenres);

      //setExtartistGenres(genreCounts);

      setArtists(artistArray);

    } catch (error) {
      console.error('Error fetching followed artists:', error);
    }
    setIsLoadingArtists(false);
  };

  // get access token call 
  useEffect(() => {
    if (authorizationCode) {
      getToken(authorizationCode);
    }
  }, [authorizationCode]);

  // fetch top tracks and top artists call 
  useEffect(() => {
    if (accessToken) {
      setIsLoggedIn(true);
      fetchUserProfile(); // Fetch user profile after logging in
      fetchTopTracks();
      fetchTopArtists();
    }
  }, [accessToken]);

  // Save user data once profile, tracks, and artists are fetched
  useEffect(() => {
    const fetchLocationAndSaveUserData = async () => {
      if (userProfile && tracks.length > 0 && artists.length > 0) {
        const userId = userProfile.id;
        const userName = userProfile.display_name;
        const topSongs = tracks.map((track) => track.name);
        //const favoriteArtists = artists.map((artist) => artist.name);
        const favoriteArtists = artists.reduce((map, artist) => {
          map[artist.name] = artist.score;
          return map;
        }, {});

        // Await the async function to get the location
        const { latitude, longitude } = await getUserLocation();
        // console.log(latitude, longitude)


        // Call the function to save user data with the location
        saveUserData(userId, userName, latitude, longitude, topSongs, favoriteArtists, Genres);
      }
    };

    fetchLocationAndSaveUserData();

  }, [userProfile, tracks, artists, Genres]);



  const handlesearch = () => {
    if (userProfile) {
      const id = userProfile.id
      router.push({
        pathname: '/displayMatches',
        params: { id }, // Convert to string for easy transfer
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
      <View style={styles.artistInfoContainer}>
        <Text style={styles.artistName}>{item.name}</Text>
        <Text style={styles.artistGenres}>Score: {item.score}</Text>
      </View>
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

          <Text style={styles.title}>Top Artists</Text>
          {isLoadingArtists ? (
            <ActivityIndicator size="large" color="#00ff00" />
          ) : (
            <FlatList
              data={artists}
              renderItem={renderArtistItem}
              keyExtractor={(item) => item.name}
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
    fontSize: 18,
    color: '#FFFFFF',
    marginLeft: 0,
  },
  artistImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  artistGenres: {
    fontSize: 14,
    color: '#A0A0A0',
    marginTop: 10,
  },
  artistInfoContainer: {
    marginLeft: 10,  // Adjust as needed for spacing
    flex: 1,
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
