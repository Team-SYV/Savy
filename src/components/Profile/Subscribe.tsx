import React from "react";
import { Pressable, Text, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import GetPro from "../Button/GetPro";

const Subscribe = () => {
  return (
    <View>
      <Pressable className="flex-row items-center justify-between p-4 border-b border-gray-500 rounded-lg mx-4 mt-12">
        <View className="flex-row items-center">
          <MaterialIcons name="subscriptions" size={20} className="mr-2" />
          <Text className="text-base">Subscribe to pro plan</Text>
        </View>
        <GetPro />
      </Pressable>
    </View>
  );
};

export default Subscribe;
