import React from "react";
import { Pressable, Text, View } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";

const ShareFeedback = () => {
  const navigateToFeedback = () => {
    router.push("/profile/share-feedback");
  };

  return (
    <View>
      <Pressable
        onPress={navigateToFeedback}
        className="flex-row items-center justify-between p-4 rounded-lg mx-4 mt-3"
      >
        <View className="flex-row items-center">
          <Entypo name="text-document" size={18} className="mr-2" />
          <Text className="text-base">Share Your Feedback</Text>
        </View>
        <AntDesign name="right" size={18} />
      </Pressable>
    </View>
  );
};

export default ShareFeedback;
