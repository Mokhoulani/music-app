import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { Button, Text } from "react-native";
import { Surface } from "react-native-paper";
import { getProfile } from "../api/spotify";
import { DrawerParamList } from "../navigator/DrawerNavigator";
import { RootStackParamList } from "../navigator/RootStackNavigator";
import { TabParamsList } from "../navigator/TabNavigator";
import { useAuthContext } from "../provider/AuthProvider";
import { Profile } from "../types/profile";
type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamsList, "Profile">,
  CompositeScreenProps<
    DrawerScreenProps<DrawerParamList>,
    NativeStackScreenProps<RootStackParamList>
  >
>;

export default function ProfileScreen({ navigation }: Props) {
  const { accessToken } = useAuthContext();
  const [profile, seProfile] = useState<Profile>();
  useEffect(() => {
    const fetchData = async () => {
      if (accessToken) {
        const data = await getProfile(accessToken);
        seProfile(data);
      }
    };

    fetchData();
  }, []);
  return (
    <Surface>
      <Text>{profile?.display_name}</Text>
      <Button title="Go to Home" onPress={() => navigation.navigate("Home")} />
    </Surface>
  );
}
