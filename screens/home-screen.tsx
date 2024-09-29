import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
  const { accessToken, loading } = useSpotifyAuth();
  const [loadingTracks, setLoadingTracks] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (accessToken) {
        setLoadingTracks(true);
        try {
          const data = await getTopTracks(accessToken);
          setTracks(data.items);
        } catch (error) {
          console.error(error);
        } finally {
          setLoadingTracks(false);
        }
      }
    };

    fetchData();
  }, [accessToken]);

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      {loadingTracks ? (
        <ActivityIndicator size="large" color="#00ff00" />
      ) : (
        <ScrollView>
          <Surface>
            {tracks?.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => navigation.navigate("Details", { item })}
              >
                <TrackCard track={item} />
              </Pressable>
            ))}
          </Surface>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
