import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Home from "../screens/home-screen";
import Profile from "../screens/profile-screen";

export type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  return (
    <RootStack.Navigator>
      <RootStack.Screen name="Home" component={Home} />
      <RootStack.Screen name="Profile" component={Profile} />
    </RootStack.Navigator>
  );
}
