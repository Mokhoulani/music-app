import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Sound } from "expo-av/build/Audio";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  Pressable,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Surface } from "react-native-paper";
import { getTopTracks } from "../api/spotify";
import TrackCard from "../components/TrackCard";
import useSpotifyAuth from "../hooks/useSpotifyAuth";
import { TabParamsList } from "../navigator/TabNavigator";
import { Item } from "../types/track";

type Props = NativeStackScreenProps<TabParamsList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  const [tracks, setTracks] = useState<Item[]>();
  const [sound, setSound] = useState<Sound | any>(null);
  const [token, loading, promptAsync, logout] = useSpotifyAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        const datTracks = await getTopTracks(token);
        setTracks(datTracks.items);

        // const searchData = await searchSpotify(token);
      }
    };

    fetchData(); // Call the async function
  }, [token]);

  return (
    <SafeAreaView style={{ margin: 40 }}>
      {loading && !tracks ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : token ? (
        <Button
          title="Logout"
          onPress={() => {
            logout();
          }}
        />
      ) : (
        <Button
          title="Login with Spotify"
          onPress={() => {
            promptAsync();
          }}
        />
      )}

      <ScrollView>
        <Surface>
          {tracks
            ? tracks.map((item) => (
                <Pressable
                  onPress={() => navigation.navigate("Details", { item: item })}
                >
                  <TrackCard track={item} />
                </Pressable>
              ))
            : null}
        </Surface>
      </ScrollView>
    </SafeAreaView>
  );
}
