import { NativeStackScreenProps } from "@react-navigation/native-stack";

import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { getPlayList, getProfile, getTopTracks } from "../api/spotify";
import PlaylistScreen from "../components/PlaylistScreen";
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
    <SafeAreaView style={styles.safeArea}>
      <PlaylistScreen
        playlists={playList}
        tracks={tracks}
        navigation={navigation}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
});
