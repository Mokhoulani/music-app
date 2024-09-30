import React from "react";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAuthContext } from "../provider/AuthProvider";

export default function SigninScreen() {
  const { isAuthenticated, loading, logout, promptAsync } = useAuthContext(); // Access auth functions

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : isAuthenticated() ? (
        <Button
          title="Logout"
          onPress={() => {
            logout();
          }}
        />
      ) : (
        <>
          <Text style={styles.text}>
            Please log in with Spotify to continue
          </Text>
          <Button
            title="Login with Spotify"
            onPress={() => {
              promptAsync();
            }}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginBottom: 20,
    fontSize: 22,
  },
});
