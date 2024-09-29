import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
} from "react";
import useSpotifyAuth from "../hooks/useSpotifyAuth";

interface AuthContextValue {
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  promptAsync: () => void;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
}

const AuthContext = createContext({} as AuthContextValue);

export default function AuthProvider({ children }: PropsWithChildren) {
  const {
    accessToken,
    refreshToken,
    loading,
    promptAsync,
    logout,
    refreshAccessToken,
  } = useSpotifyAuth();

  const validateToken = useCallback(async () => {
    if (accessToken && refreshToken) {
      try {
        await refreshAccessToken();
      } catch (error) {
        console.error("Failed to refresh token:", error);
        // Optionally, you could call logout() here if refresh fails
      }
    }
  }, [accessToken, refreshToken, refreshAccessToken]);

  useEffect(() => {
    validateToken();
  }, [validateToken]);

  const contextValue: AuthContextValue = {
    accessToken,
    refreshToken,
    loading,
    promptAsync,
    logout,
    refreshAccessToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
