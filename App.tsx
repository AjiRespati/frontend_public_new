import React, { useEffect, useState, useCallback } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import ReactQueryProvider from "./src/providers/ReactQueryProvider";
import RootNavigator from "./src/navigation/RootNavigator";
import { useAuthStore } from "./src/store/authStore";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from "@expo-google-fonts/poppins";
import * as SplashScreen from "expo-splash-screen";
import { airbnbTheme } from "./src/theme/airbnbTheme";

// Prevent splash from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function App() {
  const { hydrate, refreshSession, hydrated, scheduleRefresh } = useAuthStore();
  const [ready, setReady] = useState(false);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && hydrated && ready) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, hydrated, ready]);

  useEffect(() => {
    (async () => {
      await hydrate();
      const refreshed = await refreshSession();
      if (refreshed) scheduleRefresh();
      setReady(true);
    })();
  }, []);

  if (!fontsLoaded || !hydrated || !ready) return null;

  return (
    <ReactQueryProvider>
      <PaperProvider theme={ airbnbTheme }>
        <RootNavigator onLayout={ onLayoutRootView } />
      </PaperProvider>
    </ReactQueryProvider>
  );
}
