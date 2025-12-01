import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Text, TextInput, Button, useTheme } from "react-native-paper";
import api from "../api/client";
import { globalStyles } from "../utils/globalStyles";

export default function ForgotPasswordScreen({ navigation }: any) {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await api.post("/auth/request-reset", { email });
      setMessage(res.data.message);
    } catch (err: any) {
      setMessage("Error sending reset link");
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
          Forgot Password
        </Text>

        <TextInput
          label="Email"
          mode="outlined"
          value={ email }
          onChangeText={ setEmail }
          keyboardType="email-address"
          style={ { marginBottom: 16 } }
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
          onPress={ handleSubmit }
          loading={ loading }
          disabled={ loading }
        >
          Send Reset Link
        </Button>

        <TouchableOpacity
          onPress={ () => navigation.navigate("Login") }
          style={ { marginTop: 20 } }
        >
          <Text style={ { textAlign: "center", color: theme.colors.primary } }>
            Back to Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
