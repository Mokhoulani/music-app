import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
} from "react";
import useSpotifyAuth from "../hooks/useSpotifyAuth";

interface AuthContextValue {
  accessToken: string | null;
  refreshToken: string | null;
  expirationTime: number | null;
  loading: boolean;
  error: Error | null;
  isAuthenticated: () => boolean;
  promptAsync: () => void;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
}

const AuthContext = createContext({} as AuthContextValue);

export default function AuthProvider({ children }: PropsWithChildren) {
  const {
    accessToken,
    refreshToken,
    expirationTime,
    loading,
    error,
    isAuthenticated,
    promptAsync,
    logout,
    refreshAccessToken,
  } = useSpotifyAuth();

  useEffect(() => {
    if (!isAuthenticated && refreshToken) {
      refreshAccessToken();
    }
  }, [isAuthenticated, refreshToken]);

  const contextValue: AuthContextValue = {
    accessToken,
    refreshToken,
    expirationTime,
    loading,
    error,
    isAuthenticated,
    promptAsync,
    logout,
    refreshAccessToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
