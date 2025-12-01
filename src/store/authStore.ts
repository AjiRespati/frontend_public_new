import { jwtDecode } from "jwt-decode";
import { create } from "zustand";

import api from "../api/client";
import { LoginResponse } from "../models/LoginResponse";
import storage from "../utils/storage";

type DecodedToken = { exp: number };

type AuthState = {
  user: any | null;
  accessToken: string | null;
  refreshToken: string | null;
  refreshTimer: ReturnType<typeof setTimeout> | null;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  scheduleRefresh: () => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  refreshTimer: null,
  hydrated: false,

  hydrate: async () => {
    const access = await storage.getItem("accessToken");
    const refresh = await storage.getItem("refreshToken");
    if (access && refresh) {
      set({ accessToken: access, refreshToken: refresh });
      api.defaults.headers.common["Authorization"] = `Bearer ${access}`;
      get().scheduleRefresh();
    }
    set({ hydrated: true });
  },

  login: async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      // const { accessToken, refreshToken, user } = res.data;

      const loginData = LoginResponse.fromJson(res.data);
      const accessToken = loginData.accessToken;
      const refreshToken = loginData.refreshToken;
      const user = loginData.user;
      
      await storage.setItem("accessToken", accessToken);
      await storage.setItem("refreshToken", refreshToken);
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      set({ user, accessToken, refreshToken });

      get().scheduleRefresh();
      
      return true;
    } catch (err) {
      console.error("Login failed:", err);
      return false;
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch { }
    await storage.multiRemove(["accessToken", "refreshToken"]);
    const timer = get().refreshTimer;
    if (timer) clearTimeout(timer);
    set({ accessToken: null, refreshToken: null, user: null, refreshTimer: null });
  },

  refreshSession: async () => {
    try {
      const refreshToken = get().refreshToken || (await storage.getItem("refreshToken"));
      if (!refreshToken) return false;

      const res = await api.post("/auth/refresh", { token: refreshToken });
      const { accessToken, refreshToken: newRefresh, user } = res.data;

      await storage.setItem("accessToken", accessToken);
      await storage.setItem("refreshToken", newRefresh);
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      set({ accessToken, refreshToken: newRefresh, user });
      get().scheduleRefresh();
      console.log("🔁 Token refreshed silently");
      return true;
    } catch (e) {
      console.error("Silent refresh failed:", e);
      get().logout();
      return false;
    }
  },

  scheduleRefresh: () => {
    const token = get().accessToken;
    const timer = get().refreshTimer;
    if (timer) clearTimeout(timer);
    if (!token) return;

    try {
      const { exp } = jwtDecode<DecodedToken>(token);
      const expiresInMs = exp * 1000 - Date.now();
      // Schedule one minute before expiry, minimum 30 s
      const refreshDelay = Math.max(expiresInMs - 60 * 1000, 30 * 1000);

      console.log(
        `🕒 Access token expires in ${(expiresInMs / 1000).toFixed(
          0
        )} s → refreshing in ${(refreshDelay / 1000).toFixed(0)} s`
      );

      const newTimer = setTimeout(async () => {
        await get().refreshSession();
      }, refreshDelay);

      set({ refreshTimer: newTimer });
    } catch (err) {
      console.error("Failed to decode access token", err);
    }
  },

}));
