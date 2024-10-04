import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Audio } from "expo-av";
import React, { useState } from "react";
import { Image, Pressable } from "react-native";
import { Card, Surface } from "react-native-paper";
import { View } from "react-native-reanimated/lib/typescript/Animated";
import {
  SearchItemAlbum,
  SearchItemArtist,
  SearchItemTrack,
} from "../types/search";
import { playSong, stopSong } from "../utils/audioPlayer";

interface Props {
  item: SearchItemTrack | SearchItemArtist | SearchItemAlbum;
}

export default function SearchCard({ item }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | any>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleTogglePlay = async (previewUrl: string | null) => {
    if (!previewUrl) {
      return;
    }

    // Stop the song if it's already playing
    if (isPlaying) {
      console.log("Stopping current song");
      await stopSong(sound);
      setIsPlaying(false);

      return;
    }

    // If a song is not already playing and the item exists, play it
    if (!isPlaying) {
      if (isLoading) {
        return;
      }
      const newSound = await playSong(previewUrl);
      setSound(newSound);
      setIsPlaying(true);
    }
  };
  const defaultImageUrl =
    "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228";

  const renderItem = ({
    item,
  }: {
    item: SearchItemTrack | SearchItemArtist | SearchItemAlbum;
  }) => {
    const getImageUrl = () => {
      if (item.type === "track") {
        return item.album.images[0]?.url || defaultImageUrl;
      } else if (item.type === "artist") {
        return item.images?.[0]?.url || defaultImageUrl;
      } else if (item.type === "album") {
        return item.images?.[0]?.url || defaultImageUrl;
      }
      return defaultImageUrl;
    };
    const getPreviewUrl = () => {
      if (item.type === "track") {
        return item.preview_url;
      }
      return null;
    };

    return (
      <Surface>
        <Card.Title
          title={item.name}
          subtitle={item.type}
          left={() => (
            <Image
              width={60}
              height={60}
              style={{ marginLeft: -12 }}
              source={{
                uri: getImageUrl(),
              }}
            />
          )}
          right={() =>
            item.type !== "track" ? (
              <></>
            ) : (
              <Pressable onPress={() => handleTogglePlay(getPreviewUrl())}>
                <MaterialIcons
                  name={isPlaying ? "pause-circle" : "play-circle"}
                  size={24}
                />
              </Pressable>
            )
          }
        />
      </Surface>
    );
  };

  return <View>{renderItem({ item })}</View>;
}
