import React from "react";
import { View } from "react-native";
import { Text, Appbar } from "react-native-paper";

export default function SalesScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Sales" />
      </Appbar.Header>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text variant="titleMedium">Sales records will appear here</Text>
      </View>
    </View>
  );
}
