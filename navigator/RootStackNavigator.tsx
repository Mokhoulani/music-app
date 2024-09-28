import { NavigatorScreenParams } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import DrawerNavigator, { DrawerParamList } from "./DrawerNavigator";

export type RootStackParamList = {
  MainNavigator: NavigatorScreenParams<DrawerParamList>;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="MainNavigator" component={DrawerNavigator} />
    </RootStack.Navigator>
  );
}
