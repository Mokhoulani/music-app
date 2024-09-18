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

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
    }
  }, [response]);

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
