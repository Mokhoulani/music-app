import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useAuthContext } from "../provider/AuthProvider";

export default function LoadingScreen() {

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#00ff00" />
      <Text style={styles.text}>Loading...</Text>
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
    marginTop: 10,
    fontSize: 18,
    color: "#000",
  },
});
