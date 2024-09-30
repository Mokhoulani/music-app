import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";

WebBrowser.maybeCompleteAuthSession();

const STORAGE_KEY = "@SpotifyToken";
const REFRESH_STORAGE_KEY = "@SpotifyRefreshToken";
const EXPIRATION_KEY = "@SpotifyTokenExpiration";
const CLIENT_ID = "3dff60a9e4374377a72d8980a944aa74";

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
  expirationTime: number | null;
  loading: boolean;
  error: Error | null;
};

export default function useSpotifyAuth() {
  const [state, setState] = useState<SpotifyAuthState>({
    accessToken: null,
    refreshToken: null,
    expirationTime: null,
    loading: true,
    error: null,
  });

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: SCOPES,
      usePKCE: true,
      redirectUri: makeRedirectUri({
        scheme: "music-app",
        path: "spotify-auth-callback",
      }),
    },
    discovery
  );

  useEffect(() => {
    loadTokens();
  }, []);

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
      exchangeCodeForToken(code);
    } else if (response?.type === "error") {
      setState((prev) => ({
        ...prev,
        error: new Error(
          response.error?.description || "Authentication failed"
        ),
        loading: false,
      }));
    }
  }, [response]);

  const setLoading = (isLoading: boolean) => {
    setState((prev) => ({ ...prev, loading: isLoading }));
  };

  const loadTokens = async () => {
    setLoading(true);
    try {
      const [accessToken, refreshToken, expirationTime] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(REFRESH_STORAGE_KEY),
        AsyncStorage.getItem(EXPIRATION_KEY),
      ]);

      if (accessToken && refreshToken && expirationTime) {
        const expirationTimeNum = parseInt(expirationTime, 10);
        if (Date.now() >= expirationTimeNum) {
          // Token has expired, refresh it
          await refreshAccessToken(refreshToken);
        } else {
          setState((prev) => ({
            ...prev,
            accessToken,
            refreshToken,
            expirationTime: expirationTimeNum,
            loading: false,
          }));
        }
      } else {
        setLoading(false);
      }
    } catch (error) {
      setState((prev) => ({ ...prev, error: error as Error, loading: false }));
    }
  };

  const saveTokens = async (
    accessToken: string,
    refreshToken: string,
    expiresIn: number
  ) => {
    const expirationTime = Date.now() + expiresIn * 1000; // Convert expiresIn to milliseconds and add to current time
    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEY, accessToken),
        AsyncStorage.setItem(REFRESH_STORAGE_KEY, refreshToken),
        AsyncStorage.setItem(EXPIRATION_KEY, expirationTime.toString()),
      ]);
      setState((prev) => ({
        ...prev,
        accessToken,
        refreshToken,
        expirationTime,
        loading: false,
      }));
    } catch (error) {
      setState((prev) => ({ ...prev, error: error as Error, loading: false }));
    }
  };

  const exchangeCodeForToken = async (code: string) => {
    setLoading(true);
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
            client_id: CLIENT_ID,
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
      setState((prev) => ({ ...prev, error: error as Error, loading: false }));
    }
  };

  const refreshAccessToken = async (refreshToken: string) => {
    setLoading(true);
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
            refresh_token: refreshToken,
            client_id: CLIENT_ID,
          }).toString(),
        }
      );

      if (!tokenResponse.ok) {
        throw new Error(`Failed to refresh token: ${tokenResponse.status}`);
      }

      const tokenData = await tokenResponse.json();
      await saveTokens(
        tokenData.access_token,
        tokenData.refresh_token || refreshToken,
        tokenData.expires_in
      );
    } catch (error) {
      setState((prev) => ({ ...prev, error: error as Error, loading: false }));
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEY,
        REFRESH_STORAGE_KEY,
        EXPIRATION_KEY,
      ]);
      setState({
        accessToken: null,
        refreshToken: null,
        expirationTime: null,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({ ...prev, error: error as Error, loading: false }));
    }
  };

  const isAuthenticated = () => {
    return (
      !!state.accessToken &&
      !!state.refreshToken &&
      !!state.expirationTime &&
      Date.now() < state.expirationTime
    );
  };

  return {
    ...state,
    promptAsync,
    logout,
    refreshAccessToken: () => refreshAccessToken(state.refreshToken!),
    isAuthenticated,
  };
}
