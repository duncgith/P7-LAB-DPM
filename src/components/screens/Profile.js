import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  Alert, 
  Button, 
  Image, 
  TouchableOpacity, 
  FlatList 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen({ onLogout }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const tokenData = await AsyncStorage.getItem("token");
        if (!tokenData) throw new Error("No token found");

        const { token } = JSON.parse(tokenData);
        const response = await fetch("http://192.168.72.36:5000/api/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const { data } = await response.json();
        setUserData(data);
      } catch (error) {
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2464EC" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Failed to load profile</Text>
      </View>
    );
  }

  const friends = [
    { id: "1", avatar: "https://cdn.videogamesblogger.com/wp-content/uploads/2011/03/lego-star-wars-3-character-yoda.jpg" },
    { id: "2", avatar: "https://thefederalist.com/wp-content/uploads/2016/12/Darth-Maul-1024x717.jpg" },
    { id: "3", avatar: "https://i.pinimg.com/originals/7e/b1/45/7eb145db5754005296c077052fc3e06d.jpg" },
    { id: "4", avatar: "https://media.licdn.com/dms/image/v2/D5603AQGEquFQ_LNfRQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1716089189109?e=2147483647&v=beta&t=HB7qvYxkwUZp4EN-4ZAUax5XdGuCpHu0-1aXBk1PKPU" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Profile</Text>
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <Image
            style={styles.avatar}
            source={{ uri: userData.avatar || "https://media.gettyimages.com/id/1484083062/photo/fans-attend-the-first-day-of-scarborough-sci-fi-weekend.jpg?b=1&s=594x594&w=0&k=20&c=jKc1NRp6-Li4rKKXOqGqMBa5B7fDxoY9VB0vI2O5ceQ=" }}
          />
        </View>

        <TouchableOpacity style={styles.addStatusButton}>
          <Text style={styles.addStatusText}>+ Add Status</Text>
        </TouchableOpacity>

        <Text style={styles.username}>{userData.username}</Text>
        <Text style={styles.bio}>{userData.bio || "pemula bukan pemalu"}</Text>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Member Since:</Text>
          <Text style={styles.value}>{new Date(userData.createdAt).toLocaleDateString()}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Your Friends</Text>
      <FlatList
        horizontal
        data={friends}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Image style={styles.friendAvatar} source={{ uri: item.avatar }} />
        )}
        contentContainerStyle={styles.friendsList}
      />

      <Button title="Logout" onPress={onLogout} color="#dc3545" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#2f3136",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
    color: "#ffffff",
  },
  profileCard: {
    backgroundColor: "#36393f",
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#2464EC",
  },
  addStatusButton: {
    backgroundColor: "#5865F2",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: "center",
    marginTop: 10,
  },
  addStatusText: {
    color: "#ffffff",
    fontSize: 14,
  },
  username: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
  },
  bio: {
    fontSize: 14,
    color: "#a1a1a1",
    textAlign: "center",
    marginVertical: 5,
  },
  infoContainer: {
    marginTop: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#dcdfe1",
  },
  value: {
    fontSize: 16,
    color: "#ffffff",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 10,
  },
  friendsList: {
    flexDirection: "row",
    gap: 10,
  },
  friendAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 5,
  },
  errorText: {
    fontSize: 16,
    color: "#dc3545",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
