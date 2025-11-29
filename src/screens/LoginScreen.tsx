import React, { useState } from "react";
import { View } from "react-native";
import { Text, Button, TextInput, HelperText } from "react-native-paper";
import { useAuthStore } from "../store/authStore";
import { globalStyles } from "../utils/globalStyles";

export default function LoginScreen({ navigation }: any) {
  const { login } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (!success) setError("Invalid email or password");
  };

  return (
    <View style={[globalStyles.screen, { justifyContent: "center" }]}>
      <View style={[globalStyles.card, { paddingVertical: 32 }]}>
        <Text style={[globalStyles.title, { textAlign: "center" }]}>Welcome Back 👋</Text>
        <Text style={{ textAlign: "center", color: "#666", marginBottom: 20 }}>
          Sign in to continue your POS journey.
        </Text>

        <TextInput
          label="Email"
          mode="outlined"
          value={email}
          onChangeText={setEmail}
          style={globalStyles.input}
        />
        <TextInput
          label="Password"
          mode="outlined"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={globalStyles.input}
        />

        {error ? <HelperText type="error">{error}</HelperText> : null}

        <Button
          mode="contained"
          loading={loading}
          onPress={handleLogin}
          style={[globalStyles.button, { backgroundColor: "#FF5A5F" }]}
          labelStyle={{ fontWeight: "600", color: "#FFF" }}
        >
          Sign In
        </Button>

        <Button
          onPress={() => navigation.navigate("Register")}
          textColor="#FF5A5F"
          style={{ marginTop: 16 }}
        >
          Create Account
        </Button>
      </View>
    </View>
  );
}
