import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};

export default function useSpotifyAuth() {
  const [token, setToken] = useState<string | undefined>(undefined);

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
                request!.redirectUri
              )}&client_id=${
                request!.clientId
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

          setToken(tokenData.access_token);
        } catch (error) {
          console.error("Error fetching token:", error);
        }
      };

      getToken();
    }
  }, [response]);

  return [token, promptAsync] as const;
}
