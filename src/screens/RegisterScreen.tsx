import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Text, TextInput, Button, useTheme } from "react-native-paper";
import api from "../api/client";
import { globalStyles } from "../utils/globalStyles";

export default function RegisterScreen({ navigation }: any) {
  const theme = useTheme();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      await api.post("/auth/register", form);
      setMessage("Registration successful! Please verify your email.");
    } catch (err: any) {
      setMessage("Error registering account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={ [globalStyles.screen, { justifyContent: "center" }] }>
      <View style={ [globalStyles.card, { paddingVertical: 32 }] }>
        <Text
          variant="headlineMedium"
          style={ { textAlign: "center", marginBottom: 24 } }
        >
          Create Account
        </Text>

        <TextInput
          label="Name"
          mode="outlined"
          style={ { marginBottom: 12 } }
          value={ form.name }
          onChangeText={ (v) => handleChange("name", v) }
        />
        <TextInput
          label="Email"
          mode="outlined"
          style={ { marginBottom: 12 } }
          keyboardType="email-address"
          value={ form.email }
          onChangeText={ (v) => handleChange("email", v) }
        />
        <TextInput
          label="Password"
          mode="outlined"
          secureTextEntry
          style={ { marginBottom: 16 } }
          value={ form.password }
          onChangeText={ (v) => handleChange("password", v) }
        />

        { message ? (
          <Text
            style={ {
              color: message.startsWith("Error") ? "red" : "green",
              textAlign: "center",
              marginBottom: 12,
            } }
          >
            { message }
          </Text>
        ) : null }

        <Button
          mode="contained"
          onPress={ handleRegister }
          loading={ loading }
          disabled={ loading }
        >
          Register
        </Button>

        <TouchableOpacity
          onPress={ () => navigation.navigate("Login") }
          style={ { marginTop: 20 } }
        >
          <Text style={ { textAlign: "center", color: theme.colors.primary } }>
            Already have an account? Sign In
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
