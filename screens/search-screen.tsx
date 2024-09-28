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
import { z } from "zod";
import { searchSpotify } from "../api/spotify";
import useSpotifyAuth from "../hooks/useSpotifyAuth";
import { Search } from "../types/search";

// Define the schema for our form
const searchSchema = z.object({
  query: z.string().min(1, "Search query is required"),
});

// Infer the TypeScript type from the schema
type SearchFormData = z.infer<typeof searchSchema>;

export default function SearchScreen() {
  const [searchResults, setSearchResults] = useState<Search | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token] = useSpotifyAuth();

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
    if (!token) {
      setError("Not authenticated. Please log in.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const results = await searchSpotify(
        token,
        data.query,
        "track,artist,album"
      );
      setSearchResults(results);
    } catch (err) {
      setError("An error occurred while searching. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.name}</Text>
      <Text>{item.type}</Text>
    </View>
  );

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

      {error && <Text style={styles.error}>{error}</Text>}

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
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 16,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  }
});
