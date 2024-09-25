import { Tracks } from "../types/track";

// Helper function to make Spotify API requests
async function fetchWebApi(
  endpoint: string,
  method: string,
  token: string,
  body?: any
): Promise<any> {
  try {
    const options: RequestInit = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method,
    };

    // Add body only if the method is not GET and body exists
    if (method !== "GET" && body) {
      options.body = JSON.stringify(body);
    }

    const res = await fetch(`https://api.spotify.com/${endpoint}`, options);

    if (!res.ok) {
      // Include status and statusText for more detailed error logging
      throw new Error(
        `Error fetching data from Spotify API: ${res.status} ${res.statusText}`
      );
    }

    // Check if the response contains JSON content
    const contentType = res.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      return await res.json();
    } else {
      throw new Error("Unexpected non-JSON response");
    }
  } catch (error) {
    console.error("Fetch API Error:", error);
    throw error;
  }
}

// Fetch user's top tracks from Spotify API
export async function getTopTracks(token: string): Promise<Tracks> {
  const data = await fetchWebApi(
    "v1/tracks?ids=7ouMYWpwJ422jRcDASZB7P%2C4VqPOruhp5EdPBeR92t6lQ%2C2takcwOaAZWiXQijPHIx7B",
    "GET",
    token
  );
  console.log("Top Tracks:", data);
  return data;
}