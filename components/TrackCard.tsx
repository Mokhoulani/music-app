import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Audio } from "expo-av";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useSpotifyAuth from "../hooks/useSpotifyAuth";
import { Item } from "../types/track";
import { playSong, stopSong } from "../utils/audioPlayer";

interface Props {
  track: Item;
}

export default function TrackCard({ track }: Props) {
  const [sound, setSound] = useState<Audio.Sound | any>(null);
  const [isPlaying, setIsPlaying] = useState(false);


  useEffect(() => {
    // Clean up the sound when the component unmounts or sound changes
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const handleTogglePlay = async () => {
    if (isPlaying) {
      await stopSong(sound);
      setIsPlaying(false);
    } else {
      const previewUrl = track.preview_url;
      if (previewUrl) {
        const newSound = await playSong(previewUrl);
        setSound(newSound);
        setIsPlaying(true);
      }
    }
  };

  const currentTrack = track;
  const albumImageUrl = currentTrack?.album?.images?.[0]?.url;
  const trackName = currentTrack?.name || "Unknown Track";
  const artistName = currentTrack?.artists?.[0]?.name || "Unknown Artist";

  return (
    <TouchableOpacity style={styles.container} onPress={handleTogglePlay}>
      {albumImageUrl ? (
        <Image style={styles.albumCover} source={{ uri: albumImageUrl }} />
      ) : (
        <View style={styles.albumCoverPlaceholder} />
      )}
      <View style={styles.textContainer}>
        <Text style={styles.trackName} numberOfLines={1}>
          {trackName}
        </Text>
        <Text style={styles.artistName} numberOfLines={1}>
          {artistName}
        </Text>
      </View>
      {currentTrack?.preview_url && (
        <MaterialIcons
          style={styles.playIcon}
          name={isPlaying ? "pause-circle" : "play-circle"}
          color="#000"
          size={24}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  albumCover: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 12,
  },
  albumCoverPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 5,
    backgroundColor: "#000",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  trackName: {
    color: "#000",
    fontSize: 14,
    fontWeight: "bold",
  },
  artistName: {
    color: "000",
    fontSize: 12,
    opacity: 0.7,
  },
  playIcon: {
    padding: 8,
  },
});
