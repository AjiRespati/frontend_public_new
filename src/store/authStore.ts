import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/client";

type AuthState = {
  user: any | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,

  login: async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      await AsyncStorage.setItem("accessToken", res.data.accessToken);
      set({ user: res.data.user, accessToken: res.data.accessToken });
      return true;
    } catch (err) {
      console.error("Login failed:", err);
      return false;
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem("accessToken");
    set({ user: null, accessToken: null });
  },
}));
