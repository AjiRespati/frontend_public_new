import React, { useEffect, useState } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import ReactQueryProvider from "./src/providers/ReactQueryProvider";
import RootNavigator from "./src/navigation/RootNavigator";
import { useAuthStore } from "./src/store/authStore";

export default function App() {
  const { hydrate, refreshSession, hydrated, scheduleRefresh } = useAuthStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      await hydrate();
      const refreshed = await refreshSession();
      if (refreshed) scheduleRefresh();
      setReady(true);
    })();
  }, []);

  if (!hydrated || !ready) return null; // loading splash placeholder
  return (
    <ReactQueryProvider>
      <PaperProvider>
        <RootNavigator />
      </PaperProvider>
    </ReactQueryProvider>
  );
}
