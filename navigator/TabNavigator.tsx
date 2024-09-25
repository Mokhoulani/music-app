import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import HomeScreen from "../screens/home-screen";
import SearchScreen from "../screens/search-screen";

export type TabParamsList = {
  Home: undefined;
  Search: undefined;
};

const Tab = createBottomTabNavigator<TabParamsList>();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
    </Tab.Navigator>
  );
}
