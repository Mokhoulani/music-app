import { useContext } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SegmentedButtons } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "../provider/ThemeProvider";

export default function SettingsScreen() {
  const { colorMode, setColorMode } = useContext(ThemeContext);

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={s.container}>
        <SegmentedButtons
          value={colorMode}
          onValueChange={setColorMode as any}
          buttons={[
            { value: "light", label: "Light" },
            { value: "dark", label: "Dark" },
            { value: "auto", label: "Auto" },
          ]}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: {
    padding: 12,
    gap: 12,
  },
  text: {
    fontSize: 24,
  },
});
