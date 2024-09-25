import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import Home from "../screens/home-screen";
import Search from "../screens/search-screen";

export type TabparamsList = {
  HomeNvigator: undefined;
  Search: undefined;
};

const TabNavigator = createBottomTabNavigator<TabparamsList>();

export default function BottomTabNavigator() {
  return (
    <TabNavigator.Navigator>
      <TabNavigator.Screen name="HomeNvigator" component={Home} />
      <TabNavigator.Screen name="Search" component={Search} />
    </TabNavigator.Navigator>
  );
}
