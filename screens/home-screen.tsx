import { NativeStackScreenProps } from "@react-navigation/native-stack";

import React, { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Card, Surface } from "react-native-paper";
import { getPlayList, getProfile, getTopTracks } from "../api/spotify";
import TrackCard from "../components/TrackCard";
import { TabParamsList } from "../navigator/TabNavigator";
import { useAuthContext } from "../provider/AuthProvider";
import { PlayListItem } from "../types/playlist";
import { Profile } from "../types/profile";
import { Item } from "../types/track";

type Props = NativeStackScreenProps<TabParamsList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  const [tracks, setTracks] = useState<Item[]>();
  const [playList, setPlayList] = useState<PlayListItem[]>();
  const [profile, seProfile] = useState<Profile>();
  const { accessToken } = useAuthContext();

  useEffect(() => {
    const fetchData = async () => {
      if (accessToken) {
        const profile = await getProfile(accessToken);
        seProfile(profile);
        const id = profile.id;
        const url = `v1/users/${id}/playlists`;
        const data = await getTopTracks(accessToken);
        setTracks(data.items);
        const playList = await getPlayList(accessToken, url);
        setPlayList(playList.items);
      }
    };

    fetchData();
  }, [accessToken]);

  return (
    <SafeAreaView>
      <ScrollView>
        <Text> Play list</Text>
        <Surface>
          {playList?.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => navigation.navigate("Details", { id: item.id })}
            >
              <Card.Title
                title={item.name}
                subtitle={item.type}
                left={() => (
                  <Image
                    width={60}
                    height={60}
                    style={{ marginLeft: -12 }}
                    source={{
                      uri: item.images[0].url,
                    }}
                  />
                )}
              />
            </TouchableOpacity>
          ))}
        </Surface>

        <Text style={{ fontSize: 20 }}>Top tracks</Text>
        <Surface>
          {tracks?.map((item) => (
            <View key={item.id}>
              <Pressable
                key={item.id}
                onPress={() => navigation.navigate("Details", { id: item.id })}
              ></Pressable>
              <TrackCard track={item} />
            </View>
          ))}
        </Surface>
      </ScrollView>
    </SafeAreaView>
  );
}
