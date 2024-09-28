import { NavigatorScreenParams } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import BottomTabNavigator, { TabParamsList } from "./TabNavigator";

export type RootStackParamList = {
  MainNavigator: NavigatorScreenParams<TabParamsList>;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="MainNavigator" component={BottomTabNavigator} />
    </RootStack.Navigator>
  );
}
