import React from "react";
import { Stack, useRouter } from "expo-router";
import { TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ProfileLayout = () => {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        headerShadowVisible: false,
        headerLeft: () => (
          <TouchableOpacity
            style={{ padding: 1 }}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color="black" />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen
        name="profile"
        options={{
          headerTitle: () => (
            <Text className="text-center text-xl font-bold text-black">
              Profile
            </Text>
          ),
        }}
      />
      <Stack.Screen
        name="edit-profile"
        options={{
          headerTitle: () => (
            <Text className="text-center text-xl font-bold text-black">
              Edit Profile
            </Text>
          ),
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="share-feedback"
        options={{
          headerTitle: () => (
            <Text className="text-center text-xl font-bold text-black">
              Share Feedback
            </Text>
          ),
          headerBackVisible: false,
        }}
      />
    </Stack>
  );
};

export default ProfileLayout;
