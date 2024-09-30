import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, Text } from "react-native";
import { Surface } from "react-native-paper";
import { getTopTracks } from "../api/spotify";
import TrackCard from "../components/TrackCard";
import { TabParamsList } from "../navigator/TabNavigator";
import { useAuthContext } from "../provider/AuthProvider";
import { Item } from "../types/track";

type Props = NativeStackScreenProps<TabParamsList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  const [tracks, setTracks] = useState<Item[]>();
  const { accessToken, loading } = useAuthContext();

  useEffect(() => {
    const fetchData = async () => {
      if (accessToken) {
        const data = await getTopTracks(accessToken);
        setTracks(data.items);
      }
    };

    fetchData();
  }, [accessToken]);

  return (
    <SafeAreaView>
      <ScrollView>
        <Text> Top track</Text>
        <Surface style={{ flexDirection: "row" }}>
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
    </SafeAreaView>
  );
}
