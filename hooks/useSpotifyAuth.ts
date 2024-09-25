
import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};

const STORAGE_KEY = "@SpotifyToken";

export default function useSpotifyAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: "3dff60a9e4374377a72d8980a944aa74",
      scopes: [
        "user-read-email",
        "user-read-recently-played",
        "user-top-read",
        "playlist-read-private",
        "user-library-read",
        "playlist-modify-private",
        "user-modify-playback-state",
        "user-follow-read",
        "user-read-private",
        "user-library-modify",
        "app-remote-control",
        "streaming",
      ],
      usePKCE: true,
      redirectUri: makeRedirectUri({
        scheme: "music-app",
        path: "spotify-auth-callback",
      }),
    },
    discovery
  );

  useEffect(() => {
    loadToken();
  }, []);

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
      exchangeCodeForToken(code);
    }
  }, [response]);

  const loadToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedToken) {
        setToken(storedToken);
      }
    } catch (error) {
      console.error("Failed to load token from storage:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveToken = async (newToken: string) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, newToken);
      setToken(newToken);
    } catch (error) {
      console.error("Failed to save token to storage:", error);
    }
  };

  const exchangeCodeForToken = async (code: string) => {
    try {
      const tokenResponse = await fetch(
        "https://accounts.spotify.com/api/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(
            request!.redirectUri
          )}&client_id=${request!.clientId}&code_verifier=${
            request!.codeVerifier
          }`,
        }
      );

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error("Token request failed:", tokenResponse.status, errorText);
        return;
      }

      const tokenData = await tokenResponse.json();
      await saveToken(tokenData.access_token);
    } catch (error) {
      console.error("Error fetching token:", error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setToken(null);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return [token, loading, promptAsync, logout] as const;
}
