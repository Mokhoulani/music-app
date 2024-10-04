import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getProfile } from "../api/spotify";
import { DrawerParamList } from "../navigator/DrawerNavigator";
import { RootStackParamList } from "../navigator/RootStackNavigator";
import { TabParamsList } from "../navigator/TabNavigator";
import { useAuthContext } from "../provider/AuthProvider";
import { Profile } from "../types/profile";


type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamsList, "Profile">,
  CompositeScreenProps<
    DrawerScreenProps<DrawerParamList>,
    NativeStackScreenProps<RootStackParamList>
  >
>;

export default function ProfileScreen({ navigation }: Props) {
  const { accessToken } = useAuthContext();
  const [profile, seProfile] = useState<Profile>();
  useEffect(() => {
    const fetchData = async () => {
      if (accessToken) {
        const data = await getProfile(accessToken);
        seProfile(data);
      }
    };

    fetchData();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileHeader}>
        <Text style={styles.displayName}>{profile?.display_name}</Text>
        <Text style={styles.email}>{profile?.email}</Text>
      </View>

      <View style={styles.profileDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Country:</Text>
          <Text style={styles.detailValue}>{profile?.country}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Followers:</Text>
          <Text style={styles.detailValue}>{profile?.followers.total}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Explicit Content Filter:</Text>
          <Text style={styles.detailValue}>
            {profile?.explicit_content.filter_enabled ? "Enabled" : "Disabled"}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.spotifyLink}
          onPress={() => {
            // Open Spotify URL
          }}
        >
          <Text style={styles.spotifyText}>View on Spotify</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75, // Makes the image round
    marginBottom: 20,
  },
  displayName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  email: {
    fontSize: 16,
    color: "#777",
    marginTop: 5,
  },
  profileDetails: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5, // for Android shadow
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
  },
  detailValue: {
    fontSize: 16,
    color: "#777",
  },
  spotifyLink: {
    marginTop: 20,
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#1DB954", // Spotify Green
    borderRadius: 50,
  },
  spotifyText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});
