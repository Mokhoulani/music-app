import { NavigationContainer } from "@react-navigation/native";
import { Sound } from "expo-av/build/Audio";
import React, { useEffect, useState } from "react";
import { StatusBar } from "react-native";
import { getTopTracks } from "./api/spotify";
import useSpotifyAuth from "./hooks/useSpotifyAuth";
import RootStackNavigator from "./navigator/RootStackNavigator";
import { Tracks } from "./types/track";
import { playSong, stopSong } from "./utils/audioPlayer";
import ExpoStatusBar from "expo-status-bar/build/ExpoStatusBar";

export default function App() {
  const [tracks, setTracks] = useState<Tracks>();
  const [sound, setSound] = useState<Sound>();
  const [token, loading, promptAsync, logout] = useSpotifyAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        const datTracks = await getTopTracks(token);
        console.log(datTracks);

        setTracks(datTracks);
      }
    };

    fetchData(); // Call the async function
  }, [token]);

  // Function to stop playing
  const handleStopSong = async () => {
    stopSong(sound);
  };

  const handlePlaySong = async (preview_url: string) => {
    const song = await playSong(preview_url);
    setSound(song);
  };

  return (
    <NavigationContainer>
      <ExpoStatusBar style="auto" />
      <RootStackNavigator />
    </NavigationContainer>
    // <SafeAreaView style={{ margin: 40 }}>
    //   {loading ? (
    //     <ActivityIndicator size="large" color="#0000ff" />
    //   ) : token ? (
    //     <Button
    //       title="Logout"
    //       onPress={() => {
    //         logout();
    //       }}
    //     />
    //   ) : (
    //     <Button
    //       title="Login with Spotify"
    //       onPress={() => {
    //         promptAsync();
    //       }}
    //     />
    //   )}

    //   <ScrollView>
    //     {/* Map through each track's items */}
    //     <View>
    //       {tracks?.tracks.map((track, trackIndex) => (
    //         <View key={track.id || trackIndex}>
    //           {/* Album Info */}
    //           {/* <Text>Album: {track.track.album.name}</Text>
    //           <Text>Album Type: {track.track.album.album_type}</Text>
    //           <Text>Total Tracks: {track.track.album.total_tracks}</Text>
    //           <Text>Release Date: {track.track.album.release_date}</Text> */}

    //           {/* Button to Play Song */}
    //           <Pressable
    //           // Pass the trackItem to handlePlaySong
    //           />
    //           <Text onPress={() => handlePlaySong(track.preview_url)}>
    //             play song
    //           </Text>
    //           <Text onPress={() => handleStopSong()}>stop song</Text>
    //           {/* Album Image */}
    //           {track.album.images.length > 0 && (
    //             <Image
    //               source={{ uri: track.album.images[0].url }}
    //               style={{
    //                 width: "auto",
    //                 height: 200,
    //               }}
    //             />
    //           )}
    //           <Pressable />
    //           {/* Button to Stop Track */}

    //           {/* Artists */}
    //           {/* <Text>Artists:</Text>
    //           {track.track.artists.map((artist) => (
    //             <Text key={artist.id}>{artist.name}</Text>
    //           ))} */}

    //           {/* Track Info */}
    //           {/* <Text>Track Name: {track.track.name}</Text>
    //           <Text>Duration: {track.track.duration_ms / 1000}s</Text>
    //           <Text>Explicit: {track.track.explicit ? "Yes" : "No"}</Text>
    //           <Text>Popularity: {track.track.popularity}</Text> */}

    //           {/* External URL to Spotify */}
    //           {/* <Text
    //             style={{ color: "blue", textDecorationLine: "underline" }}
    //             onPress={() =>
    //               Linking.openURL(track.track.external_urls.spotify)
    //             }
    //           >
    //             Listen on Spotify
    //           </Text> */}
    //         </View>
    //       ))}
    //     </View>
    //   </ScrollView>
    // </SafeAreaView>
  );
}
