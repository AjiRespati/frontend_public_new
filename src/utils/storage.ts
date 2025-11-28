import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const storage = {
  async getItem(key: string) {
    if (Platform.OS === "web") return localStorage.getItem(key);
    return await AsyncStorage.getItem(key);
  },
  async setItem(key: string, value: string) {
    if (Platform.OS === "web") localStorage.setItem(key, value);
    else await AsyncStorage.setItem(key, value);
  },
  async removeItem(key: string) {
    if (Platform.OS === "web") localStorage.removeItem(key);
    else await AsyncStorage.removeItem(key);
  },
  async multiRemove(keys: string[]) {
    if (Platform.OS === "web") keys.forEach((k) => localStorage.removeItem(k));
    else await AsyncStorage.multiRemove(keys);
  },
  // 💡 New: synchronous getter for web (to avoid async gaps)
  getSync(key: string): string | null {
    if (Platform.OS === "web") return localStorage.getItem(key);
    return null;
  },
};

export default storage;
