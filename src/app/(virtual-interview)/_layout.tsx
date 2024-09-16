import React from "react";
import { Stack, useRouter } from "expo-router";
import { TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const VILayout = () => {
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
            <Text className="text-center text-lg font-medium text-white">
              Talk with Virtual Interviewer
            </Text>
          ),
        }}
      />

      <Stack.Screen
        name="file-upload"
        options={{
          headerTitle: () => (
            <Text className="text-center text-lg font-medium text-white">
              Talk with Virtual Interviewer
            </Text>
          ),
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="virtual-interview"
        options={{
          headerTitle: () => (
            <Text className="text-center text-lg font-medium text-white">
              Practice Area
            </Text>
          ),
          headerBackVisible: false,
        }}
      />
    </Stack>
  );
};

export default VILayout;
