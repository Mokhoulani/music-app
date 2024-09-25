import { Audio } from "expo-av";

export async function playSong(previewUrl: string): Promise<Audio.Sound> {
  const { sound } = await Audio.Sound.createAsync({ uri: previewUrl });
  await sound.playAsync();
  return sound;
}

export async function stopSong(sound: Audio.Sound): Promise<void> {
  await sound.stopAsync();
  await sound.unloadAsync();
}
