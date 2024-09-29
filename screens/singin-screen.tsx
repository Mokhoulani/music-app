import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import useSpotifyAuth from "../hooks/useSpotifyAuth";

export default function SigninScreen() {
  const { loading, promptAsync } = useSpotifyAuth(); // Access auth functions
  const handleLogin = async () => {
    await promptAsync(); // Call promptAsync here
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Please log in with Spotify to continue</Text>
      <Button title="Login with Spotify" onPress={handleLogin} />
      {/* Use handleLogin */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    marginBottom: 20,
    fontSize: 22,
    color: "#000",
  },
});
