# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

# Compatibility Algorithm Pseudocode

# STEP 1: Extract User Music Data
function getUserData(user):
    # Get top songs, top artists, and genres from Spotify API
    topSongs = getSpotifyData(user, "top/tracks")
    topArtists = getSpotifyData(user, "top/artists")
    
    # Collect genres from top songs and artists
    genres = extractGenres(topSongs, topArtists)
    genreProfile = countGenres(genres)  # {genre: frequency}
    
    return {
        "topSongs": topSongs,
        "topArtists": topArtists,
        "genreProfile": genreProfile
    }

# STEP 2: Compare User Profiles

function calculateJaccardIndex(setA, setB):
    intersection = countIntersection(setA, setB)
    union = countUnion(setA, setB)
    return intersection / union

function calculateCosineSimilarity(vectorA, vectorB):
    dotProduct = calculateDotProduct(vectorA, vectorB)
    magnitudeA = calculateMagnitude(vectorA)
    magnitudeB = calculateMagnitude(vectorB)
    return dotProduct / (magnitudeA * magnitudeB)

# Function to calculate compatibility between two users
function calculateCompatibility(user1, user2):
    # Extract data for both users
    data1 = getUserData(user1)
    data2 = getUserData(user2)
    
    # Step 2.1: Artist Overlap
    artistOverlapScore = calculateJaccardIndex(data1["topArtists"], data2["topArtists"])
    if artistOverlapScore >= THRESHOLD_ARTIST:
        return artistOverlapScore  # High compatibility based on artists
    
    # Step 2.2: Song Overlap
    songOverlapScore = calculateJaccardIndex(data1["topSongs"], data2["topSongs"])
    if songOverlapScore >= THRESHOLD_SONG:
        return songOverlapScore  # Moderate compatibility based on songs
    
    # Step 2.3: Genre Overlap
    genreSimilarityScore = calculateCosineSimilarity(data1["genreProfile"], data2["genreProfile"])
    return genreSimilarityScore  # Compatibility based on genres if previous scores were low

# Helper functions
function getSpotifyData(user, endpoint):
    # Use Spotify API to fetch data
    # This returns a list of items (songs/artists with associated genres)
    ...

function extractGenres(topSongs, topArtists):
    genres = []
    for each item in (topSongs + topArtists):
        genres.extend(item.genres)  # Add all genres of songs/artists to list
    return genres

function countGenres(genres):
    genreCount = {}
    for genre in genres:
        genreCount[genre] = genreCount.get(genre, 0) + 1
    return genreCount  # Returns a dictionary {genre: count}

function countIntersection(setA, setB):
    return count of elements in both setA and setB

function countUnion(setA, setB):
    return count of unique elements in either setA or setB

function calculateDotProduct(vectorA, vectorB):
    return sum of products of corresponding elements

function calculateMagnitude(vector):
    return square root of sum of squares of elements in vector

# Constants
THRESHOLD_ARTIST = 0.5  # Define as per requirement
THRESHOLD_SONG = 0.5    # Define as per requirement



# Modified Jaccard Index to account for weights
function calculateWeightedJaccardIndex(weightedSetA, weightedSetB):
    intersectionSum = 0
    unionSum = 0
    
    # Combine all unique elements from both sets
    uniqueItems = set(weightedSetA.keys()).union(set(weightedSetB.keys()))
    
    for item in uniqueItems:
        weightA = weightedSetA.get(item, 0)  # Default weight is 0 if item not present
        weightB = weightedSetB.get(item, 0)
        
        # Minimum weight for intersection, maximum for union
        intersectionSum += min(weightA, weightB)
        unionSum += max(weightA, weightB)
    
    return intersectionSum / unionSum if unionSum != 0 else 0  # Handle divide by zero case
