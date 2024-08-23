import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useAuth } from "@clerk/clerk-expo";

const LogoutButton = () => {
  const { signOut } = useAuth();

  const doLogout = () => {
    signOut();
  };

  return (
    <Pressable
      onPress={doLogout}
      className="flex-row items-center justify-between p-4 border-b-2 border-gray-500 rounded-lg mx-6 mt-12"
    >
      <View className="flex-row items-center">
        <Ionicons name="log-out-outline" size={22} className="mr-2" />
        <Text className="text-base">Sign Out</Text>
      </View>
      <AntDesign name="right" size={18} />
    </Pressable>
  );
};

export default LogoutButton;
