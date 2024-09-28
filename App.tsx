import React from "react";
import RootStackNavigator from "./navigator/RootStackNavigator";
import ThemeProvider from "./provider/ThemeProvider";

export default function App() {
  return (
    <ThemeProvider>
      <RootStackNavigator />
    </ThemeProvider>
  );
}
