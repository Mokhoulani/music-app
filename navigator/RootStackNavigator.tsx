import { NavigatorScreenParams } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import useSpotifyAuth from "../hooks/useSpotifyAuth";
import LoadingScreen from "../screens/loading-screen";
import SigninScreen from "../screens/singin-screen";
import DrawerNavigator, { DrawerParamList } from "./DrawerNavigator";

export type RootStackParamList = {
  MainNavigator: NavigatorScreenParams<DrawerParamList>;
  SigninNavigator: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const {
    accessToken,
    loading,
    error,
    promptAsync,
    logout,
    refreshAccessToken,
  } = useSpotifyAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <SigninScreen />;
  }

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {!error ? (
        <RootStack.Screen name="MainNavigator" component={DrawerNavigator} />
      ) : (
        <RootStack.Screen name="SigninNavigator" component={SigninScreen} />
      )}
    </RootStack.Navigator>
  );
}
