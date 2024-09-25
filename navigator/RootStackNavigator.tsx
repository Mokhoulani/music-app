import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import BottomTabNavigator from "./TabNavigator";
import DrawerNavigator from "./DrawerNavigator";

export type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  return (
    <RootStack.Navigator>
      <RootStack.Screen name="Home" component={BottomTabNavigator} />
      <RootStack.Screen name="Profile" component={DrawerNavigator} />
    </RootStack.Navigator>
  );
}
