import React from "react";
import { router, Stack } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ProfileLayout = () => {
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
            <Ionicons name="arrow-back" size={23} color="#2a2a2a" />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="edit-profile"
        options={{
          headerTitle: () => (
            <Text className="text-center text-[18px] font-bold text-[#2a2a2a]">
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
            <Text className="text-center text-[18px] font-bold text-[#2a2a2a]">
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
