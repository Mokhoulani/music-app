import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect } from "react";
import { Button, SafeAreaView } from "react-native";

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};

export default function App() {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: "3dff60a9e4374377a72d8980a944aa74",
      scopes: ["user-read-email", "playlist-modify-public"],
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
  let token: string | undefined = "";

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
      token = code;
      fetchArtistID();
    }
  }, [response]);

  const fetchArtistID = async () => {
    if (token) {
      console.log("Token exists:", token); // Log the token to ensure it's valid
      try {
        const res = await fetch(
          "https://api.spotify.com/v1/artists/0TnOYISbd1XYRBk9myaseg",
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
        console.log("Artist data fetched:", artistData); // Log the artist data
      } catch (error) {
        console.error("Error fetching artist data:", error); // Handle and log any errors
      }
    } else {
      console.log("No token available. Please authenticate first."); // If token is missing
    }
  };

  return (
    <SafeAreaView style={{ margin: 40 }}>
      <Button
        disabled={!request}
        title="Login"
        onPress={() => {
          promptAsync();
        }}
      />
    </SafeAreaView>
  );
}
