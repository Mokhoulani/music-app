import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Card, Surface } from "react-native-paper";
import { z } from "zod";
import { searchSpotify } from "../api/spotify";

import TrackCard from "../components/TrackCard";
import { useAuthContext } from "../provider/AuthProvider";
import {
  Search,
  SearchItemAlbum,
  SearchItemArtist,
  SearchItemTrack,
} from "../types/search";
import { Item } from "../types/track";

// Define the schema for our form
const searchSchema = z.object({
  query: z.string().min(1, "Search query is required"),
});

// Infer the TypeScript type from the schema
type SearchFormData = z.infer<typeof searchSchema>;

export default function SearchScreen() {
  const [searchResults, setSearchResults] = useState<Search | null>(null);
  const { accessToken, error } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      query: "",
    },
  });

  const onSubmit = async (data: SearchFormData) => {
    if (!accessToken) {
      return;
    }

    setIsLoading(true);

    try {
      const results = await searchSpotify(
        accessToken,
        data.query,
        "track,artist,album"
      );
      setSearchResults(results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
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

    return (
      <Surface>
        {item.type === "track" ? (
          <TrackCard track={item as Item} />
        ) : (
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
          />
        )}
      </Surface>
    );
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="query"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Enter search query"
            editable={!isSubmitting}
          />
        )}
      />
      {errors.query && <Text style={styles.error}>{errors.query.message}</Text>}

      <Button
        title="Search"
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading || isSubmitting}
      />

      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}

      {error && <Text style={styles.error}>{error.message}</Text>}

      {searchResults && (
        <FlatList
          data={[
            ...(searchResults.tracks?.items || []),
            ...(searchResults.artists?.items || []),
            ...(searchResults.albums?.items || []),
          ]}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.type}-${item.id}`}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});
