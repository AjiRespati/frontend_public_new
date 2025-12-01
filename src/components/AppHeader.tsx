import React from "react";
import { Appbar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

type HeaderAction = {
  icon: string;
  onPress: () => void;
  color?: string;
};

interface AppHeaderProps {
  title: string;
  back?: boolean; // shows a back arrow
  actions?: HeaderAction[]; // right-side actions
}

export default function AppHeader({ title, back, actions }: AppHeaderProps) {
  const navigation = useNavigation();

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
      {back && <Appbar.BackAction onPress={() => navigation.goBack()} />}

      <Appbar.Content
        title={title}
        titleStyle={{
          fontSize: 20,
          fontWeight: "700",
          color: "#333",
        }}
      />

      {actions &&
        actions.map((action, idx) => (
          <Appbar.Action
            key={idx}
            icon={action.icon}
            color={action.color || "#333"}
            onPress={action.onPress}
          />
        ))}
    </Appbar.Header>
  );
}
