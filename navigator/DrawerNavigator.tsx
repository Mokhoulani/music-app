import { createDrawerNavigator } from "@react-navigation/drawer";
import React from "react";
import ProfileScreen from "../screens/profile-screen";

export type DrawerParamList = {
  profile: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="profile" component={ProfileScreen} />
    </Drawer.Navigator>
  );
}
