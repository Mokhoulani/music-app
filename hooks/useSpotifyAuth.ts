import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";


WebBrowser.maybeCompleteAuthSession();

// Storage keys for access token, refresh token, and expiration time
const STORAGE_KEY = "@SpotifyToken";
const REFRESH_STORAGE_KEY = "@SpotifyRefreshToken";
const EXPIRATION_KEY = "@SpotifyTokenExpiration";
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID; // Make sure to use your Spotify client ID

const SCOPES = [
  "user-read-private",
  "user-read-email",
  "user-read-recently-played",
  "user-top-read",
  "playlist-read-private",
  "user-library-read",
  "playlist-modify-private",
  "user-modify-playback-state",
  "user-follow-read",
  "user-library-modify",
  "app-remote-control",
  "streaming",
];

const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};

type SpotifyAuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: Error | null;
};

export default function useSpotifyAuth() {
  const [state, setState] = useState<SpotifyAuthState>({
    accessToken: null,
    refreshToken: null,
    loading: true,
    error: null,
  });

  // Create the auth request
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: CLIENT_ID!,
      scopes: SCOPES,
      usePKCE: true,
      redirectUri: makeRedirectUri({
        scheme: "music-app",
        path: "spotify-auth-callback",
      }),
    },
    discovery
  );

  // Load tokens on app startup
  useEffect(() => {
    loadTokens();
  }, []);

  // Handle the response from Spotify when the user logs in
  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
      exchangeCodeForToken(code);
    }
  }, [response]);

  // Load stored tokens from AsyncStorage
  const loadTokens = async () => {
    try {
      const [accessToken, refreshToken, expirationTimeStr] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(REFRESH_STORAGE_KEY),
        AsyncStorage.getItem(EXPIRATION_KEY),
      ]);

      const expirationTime = parseInt(expirationTimeStr || "0");
      const currentTime = new Date().getTime();

      if (expirationTime < currentTime && refreshToken) {
        // Token expired, refresh it
        await refreshAccessToken();
      } else {
        setState((prev) => ({
          ...prev,
          accessToken,
          refreshToken,
          loading: false,
        }));
      }
    } catch (error) {
      setState((prev) => ({ ...prev, error: error as Error, loading: false }));
    }
  };

  // Save tokens and expiration time to AsyncStorage
  const saveTokens = async (
    accessToken: string,
    refreshToken: string,
    expiresIn: number
  ) => {
    const expirationTime = new Date().getTime() + expiresIn * 1000; // Calculate expiration time

    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEY, accessToken),
        AsyncStorage.setItem(REFRESH_STORAGE_KEY, refreshToken),
        AsyncStorage.setItem(EXPIRATION_KEY, expirationTime.toString()), // Save expiration time
      ]);
      setState((prev) => ({ ...prev, accessToken, refreshToken }));
    } catch (error) {
      setState((prev) => ({ ...prev, error: error as Error }));
    }
  };

  // Exchange the authorization code for access and refresh tokens
  const exchangeCodeForToken = async (code: string) => {
    try {
      const tokenResponse = await fetch(
        "https://accounts.spotify.com/api/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            code,
            redirect_uri: request!.redirectUri,
            client_id: CLIENT_ID!,
            code_verifier: request!.codeVerifier!,
          }).toString(),
        }
      );

      if (!tokenResponse.ok) {
        throw new Error(`Token request failed: ${tokenResponse.status}`);
      }

      const tokenData = await tokenResponse.json();
      await saveTokens(
        tokenData.access_token,
        tokenData.refresh_token,
        tokenData.expires_in
      );
    } catch (error) {
      setState((prev) => ({ ...prev, error: error as Error }));
    }
  };

  // Refresh the access token using the refresh token
  const refreshAccessToken = async () => {
    try {
      const tokenResponse = await fetch(
        "https://accounts.spotify.com/api/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: state.refreshToken!,
            client_id: CLIENT_ID!,
          }).toString(),
        }
      );

      if (!tokenResponse.ok) {
        throw new Error(`Failed to refresh token: ${tokenResponse.status}`);
      }

      const tokenData = await tokenResponse.json();
      await saveTokens(
        tokenData.access_token,
        tokenData.refresh_token || state.refreshToken!, // Only save new refresh token if provided
        tokenData.expires_in
      );
    } catch (error) {
      setState((prev) => ({ ...prev, error: error as Error }));
    }
  };

  // Log out by clearing tokens from AsyncStorage
  const logout = async () => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEY,
        REFRESH_STORAGE_KEY,
        EXPIRATION_KEY,
      ]);
      setState({
        accessToken: null,
        refreshToken: null,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({ ...prev, error: error as Error }));
    }
  };

  return {
    ...state,
    promptAsync,
    logout,
    refreshAccessToken,
  };
}
