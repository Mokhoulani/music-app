import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigatorScreenParams } from "@react-navigation/native";
import React from "react";
import BottomTabNavigator, { TabParamsList } from "./TabNavigator";

export type DrawerParamList = {
  ProfileTab: NavigatorScreenParams<TabParamsList>;
  HomeTab: NavigatorScreenParams<TabParamsList>;
  SearchTab: NavigatorScreenParams<TabParamsList>;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="ProfileTab"
        component={BottomTabNavigator}
        options={({ navigation }) => ({
          drawerLabel: () => (
            <MaterialIcons
              style={{ marginRight: 16 }}
              name="person"
              size={24}
              onPress={() => navigation.navigate("Profile")}
            />
          ),
        })}
      />
      <Drawer.Screen
        name="HomeTab"
        component={BottomTabNavigator}
        options={({ navigation }) => ({
          drawerLabel: () => (
            <MaterialIcons
              style={{ marginRight: 16 }}
              name="settings"
              size={24}
              onPress={() => navigation.navigate("Settings")}
            />
          ),
        })}
      />
      <Drawer.Screen
        name="SearchTab"
        component={BottomTabNavigator}
        options={{ drawerLabel: () => null }}
      />
    </Drawer.Navigator>
  );
}
