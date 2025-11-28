import React from "react";
import { View } from "react-native";
import { Text, Appbar } from "react-native-paper";

export default function ReportsScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Reports" />
      </Appbar.Header>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text variant="titleMedium">Analytics and Reports will appear here</Text>
      </View>
    </View>
  );
}
