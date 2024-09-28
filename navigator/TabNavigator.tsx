import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import DetailsScreen from "../screens/detailes-screen";
import HomeScreen from "../screens/home-screen";
import ProfileScreen from "../screens/profile-screen";
import SearchScreen from "../screens/search-screen";
import SettingsScreen from "../screens/setting-screen";
import { Item } from "../types/track";

export type TabParamsList = {
  Home: undefined;
  Search: undefined;
  Profile: undefined;
  Settings: undefined;
  Details: { item: Item };
};

const Tab = createBottomTabNavigator<TabParamsList>();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon({ size, color }) {
            return <MaterialIcons name="home" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon({ size, color }) {
            return <MaterialIcons name="search" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="Details"
        component={DetailsScreen}
        options={{ tabBarButton: () => null }}
      />
    </Tab.Navigator>
  );
}
