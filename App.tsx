import React, { useEffect, useState } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import ReactQueryProvider from "./src/providers/ReactQueryProvider";
import RootNavigator from "./src/navigation/RootNavigator";
import { useAuthStore } from "./src/store/authStore";

export default function App() {
  const { hydrate, refreshSession, hydrated } = useAuthStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      await hydrate();
      await refreshSession();
      setReady(true);
    })();
  }, []);

  if (!hydrated || !ready) return null; // can replace with splash/loading
  return (
    <ReactQueryProvider>
      <PaperProvider>
        <RootNavigator />
      </PaperProvider>
    </ReactQueryProvider>
  );
}
