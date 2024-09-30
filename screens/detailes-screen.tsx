import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { Text, View } from "react-native";
import { RootStackParamList } from "../navigator/RootStackNavigator";
import { TabParamsList } from "../navigator/TabNavigator";
type Props = NativeStackScreenProps<TabParamsList, "Details">;

export default function DetailsScreen({ route }: Props) {
  return (
    <View>
      <Text>{route.params.item.id}</Text>
    </View>
  );
}

