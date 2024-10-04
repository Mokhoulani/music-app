import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Card, Surface } from "react-native-paper";
import { TabParamsList } from "../navigator/TabNavigator";
import { PlayListItem } from "../types/playlist";
import { Item } from "../types/track";
import TrackCard from "./TrackCard";

interface Props {
  playlists: PlayListItem[] | undefined;
  tracks: Item[] | undefined;
  navigation: NativeStackNavigationProp<TabParamsList, "Home", undefined>;
}

export default function PlaylistScreen({
  playlists,
  tracks,
  navigation,
}: Props) {
  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <Text style={styles.sectionTitle}>Play List</Text>

      <Surface style={styles.surface}>
        {playlists?.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => navigation.navigate("Details", { id: item.id })}
            style={styles.cardTouchable}
          >
            <Card.Title
              title={item.name}
              subtitle={item.type}
              left={() => (
                <Image
                  style={styles.albumImage}
                  source={{
                    uri: item.images[0]?.url,
                  }}
                />
              )}
              titleStyle={styles.cardTitle}
              subtitleStyle={styles.cardSubtitle}
            />
          </TouchableOpacity>
        ))}
      </Surface>

      <Text style={styles.sectionTitle}>Top Tracks</Text>

      <Surface style={styles.surface}>
        {tracks?.map((item) => (
          <View key={item.id} style={styles.trackCard}>
            <TrackCard track={item} />
          </View>
        ))}
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    paddingVertical: 16,
    paddingHorizontal: 20, // Wider padding for cleaner layout
  },
  sectionTitle: {
    fontSize: 28, // Larger font for the section headers
    fontWeight: "700", // Bold for emphasis
    color: "#333", // Darker color for contrast
    marginBottom: 12,
  },
  surface: {
    borderRadius: 10, // Rounded corners for smooth card appearance
    marginBottom: 24, // Bigger gap between sections
    paddingVertical: 8,
    paddingHorizontal: 12, // Internal padding for content
    backgroundColor: "#fff",
    elevation: 2, // Subtle shadow for the card
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTouchable: {
    marginVertical: 10,
    backgroundColor: "#fdfdfd", // Soft white background for cards
    borderRadius: 10,
    overflow: "hidden", // Ensure image fits well
  },
  albumImage: {
    width: 50,
    height: 50, // Smaller, consistent album image size
    borderRadius: 6,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600", // Semi-bold for better readability
    color: "#1c1c1c", // Darker text color for contrast
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#777", // Subtle gray for subtitle
  },
  trackCard: {
    marginBottom: 12,
    paddingHorizontal: 16, // More internal padding for top tracks
  },
});
