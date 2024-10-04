import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { getPlaylistItem } from "../api/spotify";
import TrackCard from "../components/TrackCard";
import { TabParamsList } from "../navigator/TabNavigator";
import { useAuthContext } from "../provider/AuthProvider";
import { PlayListTrackItemObject } from "../types/playlist";

type Props = NativeStackScreenProps<TabParamsList, "Details">;

export default function DetailsScreen({ route }: Props) {
  const [tracks, setTracks] = useState<PlayListTrackItemObject[]>();
  const { accessToken } = useAuthContext();

  useEffect(() => {
    const fetchData = async () => {
      const id = route.params.id;
      if (accessToken) {
        const data = await getPlaylistItem(
          accessToken,
          `v1/playlists/${id}/tracks`
        );

        setTracks(data.items);
      }
    };
    fetchData();
  }, [tracks]);

  return (
    <ScrollView>
      {tracks?.map((item) => (
        <View key={item.track.id}>
          <TrackCard track={item.track} />
        </View>
      ))}
    </ScrollView>
  );
}
