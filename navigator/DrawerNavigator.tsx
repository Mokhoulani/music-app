import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigatorScreenParams } from "@react-navigation/native";
import React from "react";
import ProfileScreen from "../screens/profile-screen";
import BottomTabNavigator, { TabParamsList } from "./TabNavigator";

export type DrawerParamList = {
  Profile: undefined;
  MainTabs: NavigatorScreenParams<TabParamsList>;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="MainTabs" component={BottomTabNavigator} />
    </Drawer.Navigator>
  );
}
