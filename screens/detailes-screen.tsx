import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Avatar, Card } from "react-native-paper";
import { getTrack } from "../api/spotify";
import { TabParamsList } from "../navigator/TabNavigator";
import { useAuthContext } from "../provider/AuthProvider";
import { Track } from "../types/track";
type Props = NativeStackScreenProps<TabParamsList, "Details">;

export default function DetailsScreen({ route }: Props) {
  const [track, setTrack] = useState<Track>();
  const { accessToken } = useAuthContext();

  useEffect(() => {
    const fetchData = async () => {
      const id = route.params.id;
      if (accessToken) {
        const data = await getTrack(accessToken, `v1/tracks/${id}`);
        setTrack(data);
      }
    };
    fetchData();
  }, [track]);
  return (
    <View>
      <Card.Title
        title={track?.album.name}
        subtitle={track?.artists[0].name}
        left={() => (
          <Avatar.Image
            style={{ marginLeft: -12 }}
            source={{
              uri: track?.uri,
            }}
          />
        )}
      />
    </View>
  );
}
