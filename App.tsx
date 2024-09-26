import { NavigationContainer } from "@react-navigation/native";
import { Sound } from "expo-av/build/Audio";
import ExpoStatusBar from "expo-status-bar/build/ExpoStatusBar";
import React, { useEffect, useState } from "react";
import { getTopTracks } from "./api/spotify";
import useSpotifyAuth from "./hooks/useSpotifyAuth";
import RootStackNavigator from "./navigator/RootStackNavigator";
import BottomTabNavigator from "./navigator/TabNavigator";
import { Tracks } from "./types/track";
import { playSong, stopSong } from "./utils/audioPlayer";

export default function App() {
  return (
    <NavigationContainer>
      <ExpoStatusBar style="auto" />
      <RootStackNavigator />
    </NavigationContainer>
  );
}
