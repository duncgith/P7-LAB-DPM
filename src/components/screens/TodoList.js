// src/screens/TodoList/TodoList.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://192.168.72.36:5000/api/todos";

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [token, setToken] = useState("");
  const [editTodoId, setEditTodoId] = useState(null);

  useEffect(() => {
    const fetchTodos = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        const { token } = JSON.parse(storedToken);
        setToken(token);
        const response = await fetch(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setTodos(data.data || []);
      }
    };
    fetchTodos();
  }, []);

  const handleAddTodo = async () => {
    if (!title || !description) {
      Alert.alert("Error", "Title and description cannot be empty.");
      return;
    }
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description }),
    });

    const result = await response.json();

    if (response.ok) {
      setTodos((prev) => [result.data, ...prev]);
      setTitle("");
      setDescription("");
      setShowForm(false);
    } else {
      alert(result.message || "Error adding todo");
    }
  };

  const handleEditTodo = async () => {
    if (!title || !description) {
      Alert.alert("Error", "Title and description cannot be empty.");
      return;
    }
    const response = await fetch(`${API_URL}/${editTodoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description }),
    });

    const result = await response.json();

    if (response.ok) {
      setTodos((prev) =>
        prev.map((todo) =>
          todo._id === editTodoId ? { ...todo, title, description } : todo
        )
      );
      setTitle("");
      setDescription("");
      setShowForm(false);
      setEditTodoId(null);
    } else {
      alert(result.message || "Error editing todo");
    }
  };

  const handleDeleteTodo = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      setTodos((prev) => prev.filter((todo) => todo._id !== id));
    } else {
      alert("Error deleting todo");
    }
  };

  const handleCancelEdit = () => {
    setTitle("");
    setDescription("");
    setShowForm(false);
    setEditTodoId(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Todos</Text>

      {showForm ? (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Title"
            placeholderTextColor="#B9BBBE"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            placeholderTextColor="#B9BBBE"
            value={description}
            onChangeText={setDescription}
          />
          <TouchableOpacity
            style={styles.saveButton}
            onPress={editTodoId ? handleEditTodo : handleAddTodo}
          >
            <Text style={styles.saveButtonText}>
              {editTodoId ? "Update Todo" : "Add Todo"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.cancelButton]}
            onPress={handleCancelEdit}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={todos}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.todoItem}
                activeOpacity={0.8}
                onPress={() => {
                  setEditTodoId(item._id);
                  setTitle(item.title);
                  setDescription(item.description);
                  setShowForm(true);
                }}
              >
                <View>
                  <Text style={styles.todoTitle}>{item.title}</Text>
                  <Text style={styles.todoDescription}>{item.description}</Text>
                </View>
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    onPress={() => {
                      setEditTodoId(item._id);
                      setTitle(item.title);
                      setDescription(item.description);
                      setShowForm(true);
                    }}
                  >
                    <Icon name="create" size={20} color="#2464EC" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteTodo(item._id)}>
                    <Icon name="trash" size={20} color="red" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowForm(true)}
          >
            <Icon name="add" size={30} color="white" />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#2f3136", // Dark background
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff", // White text
    marginBottom: 15,
    textAlign: "center",
  },
  formContainer: {
    padding: 15,
    backgroundColor: "#36393f", // Dark form background
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: "#40444b", // Darker input background
    color: "#ffffff", // White text for inputs
  },
  todoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#40444b", // Dark item background
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 4,
  },
  todoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff", // White text for title
  },
  todoDescription: {
    fontSize: 14,
    color: "#B9BBBE", // Subtle gray text
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#2464EC", // Discord-like blue
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  saveButton: {
    backgroundColor: "#2464EC",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "red",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
