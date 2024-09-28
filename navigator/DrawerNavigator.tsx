import { createDrawerNavigator } from "@react-navigation/drawer";
import React from "react";
import ProfileScreen from "../screens/profile-screen";

export type DrawerParamList = {
  Profile: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Profile" component={ProfileScreen} />
    </Drawer.Navigator>
  );
}
