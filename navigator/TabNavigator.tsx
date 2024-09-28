import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import HomeScreen from "../screens/home-screen";
import ProfileScreen from "../screens/profile-screen";
import SearchScreen from "../screens/search-screen";
import { Item } from "../types/track";

export type TabParamsList = {
  Home: undefined;
  Search: undefined;
  Profile: undefined;
  Details: { item: Item };
  // ProfileDrawer: undefined;
};

const Tab = createBottomTabNavigator<TabParamsList>();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      // screenOptions={({ navigation }) => ({
      //   headerLeft: (props) => (
      //     <MaterialIcons
      //       style={{ marginRight: 16 }}
      //       name="person"
      //       size={24}
      //       color={props.tintColor}
      //       onPress={() => navigation.navigate("ProfileDrawer")}
      //     />
      //   ),
      // })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarButton: () => null }}
      />
      {/* <Tab.Screen
        name="ProfileDrawer" // You can make this tab invisible by using `tabBarButton: () => null`
        component={DrawerNavigator} // This integrates the drawer navigator into the tab
        options={{ tabBarButton: () => null }} // This hides the tab from the tab bar
      /> */}
    </Tab.Navigator>
  );
}
