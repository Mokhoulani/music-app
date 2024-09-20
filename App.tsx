import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect } from "react";
import { Button, SafeAreaView } from "react-native";

WebBrowser.maybeCompleteAuthSession();

// Spotify's authorization and token endpoints
const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
};

export default function App() {
  // Use the Implicit Grant Flow
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: "3dff60a9e4374377a72d8980a944aa74",
      scopes: ["user-read-email", "playlist-modify-public"], // Scopes for permissions you need
      responseType: "token", // This is important for Implicit Grant flow
      redirectUri: makeRedirectUri({
        scheme: "music-app",
        path: "spotify-auth-callback", // The same scheme as in your app.json
      }),
    },
    discovery
  );

  useEffect(() => {
    // When the response is successful, the access token is available directly
    if (response?.type === "success" && response?.params?.access_token) {
      const accessToken = response.params.access_token;
      console.log("Access Token:", accessToken);

      // Now you can use this access token to make requests to Spotify's API
      fetchUserProfile(accessToken);
      fetchArtistID(accessToken);
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
  async function fetchArtistID(token:String){
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
