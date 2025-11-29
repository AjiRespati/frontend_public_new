import React from "react";
import { Appbar } from "react-native-paper";

export default function AppHeader({ title }: { title: string }) {
  return (
    <Appbar.Header
      mode="small"
      style={{
        backgroundColor: "#FFFFFF",
        elevation: 0,
        borderBottomColor: "#E5E7EB",
        borderBottomWidth: 1,
      }}
    >
      <Appbar.Content
        title={title}
        titleStyle={{
          fontSize: 20,
          fontWeight: "700",
          color: "#333",
        }}
      />
    </Appbar.Header>
  );
}
