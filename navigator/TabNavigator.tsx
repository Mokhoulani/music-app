import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DrawerScreenProps } from "@react-navigation/drawer";
import React from "react";
import HomeScreen from "../screens/home-screen";
import SearchScreen from "../screens/search-screen";
import DrawerNavigator, { DrawerParamList } from "./DrawerNavigator";

export type TabParamsList = {
  Home: undefined;
  Search: undefined;
};

const Tab = createBottomTabNavigator<TabParamsList>();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ navigation }) => ({
        headerLeft: (props) => (
          <MaterialIcons
            style={{ marginRight: 16 }}
            name="person"
            size={24}
            color={props.tintColor}
            onPress={() => navigation.navigate("profile")}
          />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
    </Tab.Navigator>
  );
}
