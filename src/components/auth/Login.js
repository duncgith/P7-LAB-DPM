import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from "react-native";

export default function LoginScreen({ onLogin, navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch("http://192.168.72.36:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        onLogin(data.data.token); // Panggil fungsi login dari props
        Alert.alert("Success", "Login successful!");
      } else {
        Alert.alert("Error", data.message || "Invalid credentials");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to connect to server");
    }
  };

  const handleRegisterNavigation = () => {
    navigation.navigate("Register"); // Navigasi ke halaman register
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.subtitle}>We're so excited to see you again!</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#B9BBBE"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#B9BBBE"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleRegisterNavigation} style={styles.registerLinkContainer}>
        <Text style={styles.registerLinkText}>Need an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#36393F", // Discord dark background
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF", // White text
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#B9BBBE", // Subtle gray text
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 15,
    borderRadius: 5,
    backgroundColor: "#2F3136", // Discord input background
    color: "#FFFFFF",
    marginBottom: 15,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: "#5865F2", // Discord blurple
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerLinkContainer: {
    marginTop: 10,
  },
  registerLinkText: {
    color: "#5865F2", // Discord blurple for links
    textDecorationLine: "underline",
    fontSize: 14,
  },
});
