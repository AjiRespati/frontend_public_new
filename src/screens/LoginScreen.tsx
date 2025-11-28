import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { TextInput, Button, Text, useTheme } from "react-native-paper";
import { useAuthStore } from "../store/authStore";

export default function LoginScreen({ navigation }: any) {
  const { login } = useAuthStore();
  const theme = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (!success) setError("Invalid credentials");
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: theme.colors.background,
      }}
    >
      <Text
        variant="headlineMedium"
        style={{ textAlign: "center", marginBottom: 24 }}
      >
        Aji Respati POS
      </Text>

      <TextInput
        label="Email"
        mode="outlined"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={{ marginBottom: 12 }}
      />
      <TextInput
        label="Password"
        mode="outlined"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ marginBottom: 16 }}
      />

      {error ? (
        <Text style={{ color: "red", textAlign: "center", marginBottom: 12 }}>
          {error}
        </Text>
      ) : null}

      <Button
        mode="contained"
        onPress={handleLogin}
        loading={loading}
        disabled={loading}
      >
        Sign In
      </Button>

      <TouchableOpacity
        onPress={() => navigation.navigate("Register")}
        style={{ marginTop: 20 }}
      >
        <Text style={{ textAlign: "center", color: theme.colors.primary }}>
          Create an Account
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("ForgotPassword")}
        style={{ marginTop: 10 }}
      >
        <Text style={{ textAlign: "center", color: theme.colors.primary }}>
          Forgot Password?
        </Text>
      </TouchableOpacity>
    </View>
  );
}
