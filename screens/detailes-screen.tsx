import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { Surface } from "react-native-paper";
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
        <Surface
          key={item.track.id}
          style={{ paddingVertical: 16, paddingHorizontal: 20 }}
        >
          <TrackCard track={item.track} />
        </Surface>
      ))}
    </ScrollView>
  );
}
