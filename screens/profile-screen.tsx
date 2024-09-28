import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { Button, Text, View } from "react-native";
import { DrawerParamList } from "../navigator/DrawerNavigator";
import { RootStackParamList } from "../navigator/RootStackNavigator";
import { TabParamsList } from "../navigator/TabNavigator";
type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamsList, "Profile">,
  CompositeScreenProps<
    DrawerScreenProps<DrawerParamList>,
    NativeStackScreenProps<RootStackParamList>
  >
>;

export default function ProfileScreen({ navigation }: Props) {
  return (
    <View>
      <Text>Profile Screen</Text>
      <Button title="Go to Home" onPress={() => navigation.navigate("Home")} />
    </View>
  );
}
