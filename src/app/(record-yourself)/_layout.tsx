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
        name="job-information"
        options={{
          headerTitle: () => (
            <Text className="text-center text-xl font-bold text-white">
              Record Yourself
            </Text>
          ),
        }}
      />

      <Stack.Screen
        name="file-upload"
        options={{
          headerTitle: () => (
            <Text className="text-center text-xl font-bold text-white">
              Record Yourself
            </Text>
          ),
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="record"
        options={{
          headerTitle: () => (
            <Text className="text-center text-xl font-bold text-white">
              Record Yourself
            </Text>
          ),
        }}
      />
    </Stack>
  );
};

export default ProfileLayout;
