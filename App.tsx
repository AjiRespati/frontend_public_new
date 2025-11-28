import * as React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import ReactQueryProvider from "./src/providers/ReactQueryProvider";
import RootNavigator from "./src/navigation/RootNavigator";

export default function App() {
  return (
    <ReactQueryProvider>
      <PaperProvider>
        <RootNavigator />
      </PaperProvider>
    </ReactQueryProvider>
  );
}
