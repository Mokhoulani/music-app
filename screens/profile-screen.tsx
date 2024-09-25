import { DrawerScreenProps } from "@react-navigation/drawer";
import React from "react";
import { Button, Text, View } from "react-native";
import { DrawerParamList } from "../navigator/DrawerNavigator";

type Props = DrawerScreenProps<DrawerParamList, "Profile">;

export default function ProfileScreen({ navigation }: Props) {
  return (
    <View>
      <Text>Profile Screen</Text>
      <Button
        title="Go to Home"
        onPress={() => navigation.navigate("MainTabs", { screen: "Home" })}
      />
    </View>
  );
}
