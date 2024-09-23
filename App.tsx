import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { Audio } from "expo-av";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";
import {
  Button,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";

WebBrowser.maybeCompleteAuthSession();

// Spotify's authorization and token endpoints
// Endpoint
const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};

export default function App() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [artist, setArtist] = useState<Artist>();
  const [token, setToken] = useState<string>();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [sound, setSound] = useState();
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: "3dff60a9e4374377a72d8980a944aa74",
      scopes: ["user-read-email", "user-read-recently-played"],
      // To follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
      // this must be set to false
      usePKCE: false,
      redirectUri: makeRedirectUri({
        scheme: "music-app",
        path: "spotify-auth-callback",
      }),
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
      // Function to exchange code for token
      const getToken = async () => {
        try {
          const tokenResponse = await fetch(
            "https://accounts.spotify.com/api/token",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(
                request.redirectUri
              )}&client_id=${
                request.clientId
              }&client_secret=7b34cf13954a47cbbc07073c17b0f759`,
            }
          );

          if (!tokenResponse.ok) {
            const errorText = await tokenResponse.text();
            console.error(
              "Token request failed:",
              tokenResponse.status,
              errorText
            );
            return;
          }

          const tokenData = await tokenResponse.json();
          if (tokenData.access_token) {
            console.log("Access Token:", tokenData.access_token);
            fetchUserProfile(tokenData.access_token);
            fetchArtistID(tokenData.access_token);
            setToken(tokenData.access_token);
          } else {
            console.error("Access token not found in response:", tokenData);
          }
        } catch (error) {
          console.error("Error during token exchange:", error);
        }
      };

      getToken();
    }
  }, [response]);

  // Example function to fetch the user's Spotify profile
  async function fetchUserProfile(accessToken: string) {
    try {
      const res = await fetch("https://api.spotify.com/v1/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();
      console.log("User Profile:", data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }
  async function fetchArtistID(token: String) {
    if (token) {
      console.log("Token exists:", token); // Log the token to ensure it's valid
      try {
        const res = await fetch(
          "https://api.spotify.com/v1/artists?ids=2CIMQHirSU0MQqyYHq0eOx%2C57dN52uHvrHOxijzpIgu3E%2C1vCWHaC5f2uS3yhpwWbIA6",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // Bearer token for Spotify API
              "Content-Type": "application/json", // Ensure correct content-type
            },
          }
        );

        // Check if response is OK (200-level)
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const artistData = await res.json();
        setArtists(artistData.artists);
        console.log("Artist data fetched:", artistData); // Log the artist data
      } catch (error) {
        console.error("Error fetching artist data:", error); // Handle and log any errors
      }
    } else {
      console.log("No token available. Please authenticate first."); // If token is missing
    }
  }
  const fetchTrack = async () => {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/me/player/recently-played`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (data && !data.error) {
        setTracks([data]);
      } else {
        console.log("No valid data received from API");
        setTracks([]);
      }
    } catch (error) {
      console.error("Error fetching track:", error);
      setTracks([]);
    }
  };
  const handleGetArtist = async (id: string) => {
    console.log("id:", id);
    await fetchTrack(); // Call the fetchArtist function with the token and URL
  };
  // Function to stop playing
  const stopTrack = async () => {
    if (sound) {
      await sound.stopAsync();
    }
  };

  // Handle pressing the Play Song button (fetches the track, then plays it)
const handlePlaySong = async () => {
  try {
    if (tracks && tracks.length > 0) {
      const trackData = tracks[0].items;

      // Ensure trackData exists and contains a track with a preview URL
      if (trackData && trackData.length > 0 && trackData[0].track.preview_url) {
        const preview_url = trackData[0].track.preview_url;

        console.log("Preview URL found:", preview_url);

        // Create the sound object from the preview URL
        const { sound } = await Audio.Sound.createAsync({ uri: preview_url });
        setSound(sound);

        console.log("Playing Sound");
        await sound.playAsync();
      } else {
        console.log("No preview URL available for this track.");
      }
    } else {
      console.log("No tracks available.");
    }
  } catch (error) {
    console.error("Error in handlePlaySong:", error);
  }
};

  useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    if (tracks.length > 0) {
      // Playback logic here
    }
  }, [tracks]);

  return (
    <SafeAreaView style={{ margin: 40 }}>
      <Button
        disabled={!request}
        title="Login"
        onPress={() => {
          promptAsync();
        }}
      />
      <ScrollView>
        {artists.map((artist) => (
          <View key={artist.id} style={{ marginBottom: 20 }}>
            {/* Artist Image */}
            {artist.images && artist.images.length > 0 && (
              <Image
                source={{ uri: artist.images[0].url }}
                style={{
                  width: "100%",
                  height: 200,
                }}
              />
            )}

            {/* Artist Name */}
            <Text>{artist.name}</Text>

            {/* Genres */}
            {artist.genres && artist.genres.length > 0 && (
              <Text>Genres: {artist.genres.join(", ")}</Text>
            )}

            {/* Followers */}
            <Text>Followers: {artist.followers.total}</Text>

            {/* Spotify Link */}
            <Text>
              <Text>Spotify: </Text>
              <Text style={{ color: "blue" }}>
                {artist.external_urls.spotify}
              </Text>
            </Text>
            <Button
              title="Get Artist"
              onPress={() => handleGetArtist(artist.id)}
            />
            {/* <Button title="Get Artist" onPress={() => fetchArtistID(token)} /> */}
            {/* Button to Play Track */}
            <Button
              title="Play Song"
              onPress={() => handlePlaySong()} // Fetch and play song when clicked
            />

            {/* Button to Stop Track */}
            <Button
              title="Stop Song"
              onPress={stopTrack} // Stop playing the track
            />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
