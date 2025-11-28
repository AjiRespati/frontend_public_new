import { create } from "zustand";
import api from "../api/client";
import storage from "../utils/storage";

type AuthState = {
  user: any | null;
  accessToken: string | null;
  refreshToken: string | null;
  refreshTimer: ReturnType<typeof setInterval> | null;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  startSilentRefresh: () => void;
  stopSilentRefresh: () => void;
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
    }
    set({ hydrated: true });
  },

  login: async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const { accessToken, refreshToken, user } = res.data;

      await storage.setItem("accessToken", accessToken);
      await storage.setItem("refreshToken", refreshToken);
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      set({ user, accessToken, refreshToken });
      get().startSilentRefresh();
      return true;
    } catch (err) {
      console.error("Login failed:", err);
      return false;
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch {}
    await storage.multiRemove(["accessToken", "refreshToken"]);
    const timer = get().refreshTimer;
    if (timer) clearInterval(timer);
    set({ accessToken: null, refreshToken: null, user: null, refreshTimer: null });
  },

  refreshSession: async () => {
    try {
      const refreshToken = get().refreshToken || (await storage.getItem("refreshToken"));
      if (!refreshToken) return false;

      const res = await api.post("/auth/refresh", { token: refreshToken });
      const { accessToken, refreshToken: newRefresh } = res.data;

      await storage.setItem("accessToken", accessToken);
      await storage.setItem("refreshToken", newRefresh);
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      set({ accessToken, refreshToken: newRefresh });
      return true;
    } catch (e) {
      console.error("Silent refresh failed:", e);
      get().logout();
      return false;
    }
  },

  startSilentRefresh: () => {
    const currentTimer = get().refreshTimer;
    if (currentTimer) clearInterval(currentTimer);

    const timer = setInterval(async () => {
      const success = await get().refreshSession();
      if (!success) {
        console.warn("⚠️ Auto token refresh failed — logging out");
        get().logout();
      }
    }, 10 * 60 * 1000); // 10 min

    set({ refreshTimer: timer });
  },

  stopSilentRefresh: () => {
    const timer = get().refreshTimer;
    if (timer) clearInterval(timer);
    set({ refreshTimer: null });
  },
}));
