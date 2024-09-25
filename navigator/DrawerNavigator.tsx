import { createDrawerNavigator } from "@react-navigation/drawer";
import React from "react";
import Profile from "../screens/profile-screen";

export type DrawerParamList = {
  Profile: undefined;
};

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Profile" component={Profile} />
    </Drawer.Navigator>
  );
}
