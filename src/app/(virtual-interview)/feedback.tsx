import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { router, Stack } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";

const Feedback = () => {
  return (
    <View className="flex-1 items-center justify-center ">
      <Stack.Screen
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.push("/home")}>
              <AntDesign name="arrowleft" size={24} color="white" />
            </TouchableOpacity>
          ),
        }}
      />
      <Text className="text-4xl text-[#00748C]"> Coming Soon </Text>
    </View>
  );
};

export default Feedback;
