import React from "react";
import { Stack, useRouter } from "expo-router";
import { TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const RecordLayout = () => {
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
            <Ionicons name="arrow-back" size={23} color="black" />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen
        name="job-information"
        options={{
          headerTitle: () => (
            <Text className="text-center text-[16px] font-semibold text-[#2a2a2a]">
              Record Yourself
            </Text>
          ),
        }}
      />

      <Stack.Screen
        name="file-upload"
        options={{
          headerTitle: () => (
            <Text className="text-center text-[16px] font-semibold text-[#2a2a2a]">
              File Upload
            </Text>
          ),
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="record"
        options={{
          headerTitle: () => (
            <Text className="text-center text-[16px] font-semibold text-[#2a2a2a]">
              Record Yourself
            </Text>
          ),
          headerBackVisible: false,
        }}
      />
    </Stack>
  );
};

export default RecordLayout;
