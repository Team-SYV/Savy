import React from "react";
import { Stack } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const ProfileLayout = () => {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerTitle: () => (
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              textAlign: "center",
              color: "white",
            }}
          >
            Profile
          </Text>
        ),
        headerStyle: {
          backgroundColor: "#008FAE",
        },
        headerTitleAlign: "center",
        headerLeft: () => (
          <TouchableOpacity
            style={{ padding: 10 }}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
};

export default ProfileLayout;
