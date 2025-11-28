import { create } from "zustand";
import api from "../api/client";
import storage from "../utils/storage";

type AuthState = {
  user: any | null;
  accessToken: string | null;
  refreshToken: string | null;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  hydrated: false,

  // 🧙 Hydrate from storage (runs at app boot)
  hydrate: async () => {
    // For web: synchronous first-read
    const webAccess = storage.getSync("accessToken");
    const webRefresh = storage.getSync("refreshToken");
    if (webAccess && webRefresh) {
      set({ accessToken: webAccess, refreshToken: webRefresh });
      api.defaults.headers.common["Authorization"] = `Bearer ${webAccess}`;
    }

    // Async fallback (mobile)
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
      return true;
    } catch (err) {
      console.error("Login failed:", err);
      return false;
    }
  },

  logout: async () => {
    try {
      const { accessToken } = get();
      if (accessToken) {
        await api.post("/auth/logout"); // backend clears refresh token
      }
    } catch (e) {
      console.warn("Logout error:", e);
    }

    // 🔥 Remove all local traces
    await storage.multiRemove(["accessToken", "refreshToken"]);
    delete api.defaults.headers.common["Authorization"];
    set({ accessToken: null, refreshToken: null, user: null });
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
      console.error("Refresh session failed", e);
      return false;
    }
  },
}));
