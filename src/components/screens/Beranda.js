// src/screens/Beranda/BerandaScreen.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from "react-native";

export default function BerandaScreen() {
  const tasks = [
    { id: "1", title: "Complete your profile", icon: "https://i.pinimg.com/236x/b9/86/8d/b9868d81b096ceb03d25d0fa525a184f.jpg" },
    { id: "2", title: "Join a new group", icon: "https://th.bing.com/th/id/OIP.Aj7d9NbCSRhbmPS7LISsmQAAAA?w=338&h=328&rs=1&pid=ImgDetMain" },
    { id: "3", title: "Explore trending channels", icon: "https://icons.iconarchive.com/icons/icons8/windows-8/512/Logos-Google-Web-Search-icon.png" },
  ];

  return (
    <View style={styles.container}>
      {/* Logo Section */}
      <Image
        source={{ uri: "https://logos-world.net/wp-content/uploads/2021/05/Discord-New-Logo.png" }} // Ganti URL dengan logo Anda
        style={styles.logo}
      />

      <Text style={styles.greeting}>👋 Welcome Back!</Text>
      <Text style={styles.subtitle}>Let’s get started with your tasks.</Text>

      {/* Featured Tasks Section */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.taskCard}>
            <Image source={{ uri: item.icon }} style={styles.taskIcon} />
            <Text style={styles.taskTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
        style={styles.taskList}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Action Button */}
      <TouchableOpacity style={styles.actionButton}>
        <Text style={styles.actionButtonText}>+ Add New Task</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#23272A", // Discord dark mode background
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 100, // Ukuran logo
    height: 100,
    borderRadius: 50, // Buat menjadi lingkaran
    marginBottom: 20, // Spasi di bawah logo
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF", // White text
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#B9BBBE", // Subtle gray text
    textAlign: "center",
    marginBottom: 20,
  },
  taskList: {
    flexGrow: 0,
    marginTop: 10,
    width: "100%",
  },
  taskCard: {
    backgroundColor: "#2F3136", // Dark card background
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  taskIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  taskTitle: {
    fontSize: 16,
    color: "#FFFFFF", // White text for task title
  },
  actionButton: {
    backgroundColor: "#5865F2", // Discord blurple
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    position: "absolute",
    bottom: 30,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
