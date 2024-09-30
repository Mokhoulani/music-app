import { NavigatorScreenParams } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { useAuthContext } from "../provider/AuthProvider";
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
  } = useAuthContext();

  if (loading) {
    return <LoadingScreen />;
  }
  if (error) {
    return <SigninScreen />;
  }
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="MainNavigator" component={DrawerNavigator} />
    </RootStack.Navigator>
  );
}
