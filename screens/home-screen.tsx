import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { CompositeScreenProps } from "@react-navigation/native";
import React from "react";
import { Button, Text, View } from "react-native";
import { DrawerParamList } from "../navigator/DrawerNavigator";
import { TabParamsList } from "../navigator/TabNavigator";

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamsList, "Home">,
  DrawerScreenProps<DrawerParamList>
>;

export default function HomeScreen({ navigation }: Props) {
  return (
    <View>
      <Text>Home Screen</Text>
      <Button
        title="Go to Profile"
        onPress={() => navigation.navigate("Profile")}
      />
    </View>
  );
}
