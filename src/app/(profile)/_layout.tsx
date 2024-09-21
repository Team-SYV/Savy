import React from "react";
import { Stack, useRouter } from "expo-router";
import { TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ProfileLayout = () => {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#008FAE",
        },
        headerTitleAlign: "center",
        headerLeft: () => (
          <TouchableOpacity
            style={{ padding: 1 }}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen
        name="profile"
        options={{
          headerTitle: () => (
            <Text className="text-center text-xl font-bold text-white">
              Profile
            </Text>
          ),
        }}
      />
      <Stack.Screen
        name="edit-profile"
        options={{
          headerTitle: () => (
            <Text className="text-center text-xl font-bold text-white">
              Edit Profile
            </Text>
          ),
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="feedback"
        options={{
          headerTitle: () => (
            <Text className="text-center text-xl font-bold text-white">
              Feedback
            </Text>
          ),
          headerBackVisible: false,
        }}
      />
    </Stack>
  );
};

export default ProfileLayout;
