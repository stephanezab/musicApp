# Ligo - Music Compatibility App

Ligo is a React Native app designed to help users find people with similar music tastes within a 20-mile radius. The app compares users based on their top songs, top artists, and music genres, providing a percentage match and showing which artists, songs, or genres they have in common.

## Features
- **Spotify Integration**: Users log in with their Spotify account to fetch their music data (top songs, top artists, genres).
- **Location-based Matching**: The app uses Expo Location to find the user's current location and only matches users within a 20-mile radius.
- **Music Taste Comparison**:
  - **Artists**: The app compares users' top artists using the **Jaccard Index** and shows the percentage match along with common artists.
  - **Songs**: If there's no match on artists, the app compares users' top songs using the **Jaccard Index** and shows the percentage match along with common songs.
  - **Genres**: If there's still no match on songs, the app compares users' genres using **Cosine Similarity** and shows the match percentage and common genres.
- **Firebase Integration**: User data (Spotify data and location) is saved in Firebase for comparison purposes.

## How It Works
1. **User Login**: Users log in via their Spotify account, granting the app access to their top songs, artists, and genres.
2. **Location Fetching**: The app uses Expo Location to get the user's location and ensure they are within a 20-mile radius of potential matches.
3. **Data Comparison**: The app compares the user's top songs, artists, and genres with other users using the following algorithms:
   - **Jaccard Index**: Used to compare top artists and top songs.
   - **Cosine Similarity**: Used to compare genres.
4. **Display Results**: If a match is found, the app displays the percentage of similarity and the shared artists, songs, or genres.

## Technologies Used
- **React Native**: Framework used to build the app.
- **Expo**: Toolchain for React Native development, including Expo Location for fetching user location.
- **Spotify API**: Used for fetching user data such as top songs, top artists, and genres.
- **Firebase**: Used to store user data for comparison.
- **Jaccard Index**: A statistical measure used to compare the similarity between two sets (artists and songs).
- **Cosine Similarity**: A measure of similarity between two vectors, used to compare genres.

## Setup and Installation

### Prerequisites
- **Node.js**: Ensure Node.js is installed on your machine.
- **Expo CLI**: Install Expo CLI globally if you don't have it already:
  ```bash
  npm install -g expo-cli
