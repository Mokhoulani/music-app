import React from "react";
import RootStackNavigator from "./navigator/RootStackNavigator";
import AuthProvider from "./provider/AuthProvider";
import ThemeProvider from "./provider/ThemeProvider";

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <RootStackNavigator />
      </ThemeProvider>
    </AuthProvider>
  );
}
