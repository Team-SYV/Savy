import { Message, Role } from "@/types/Chat";
import { useUser } from "@clerk/clerk-expo";
import React, { useEffect, useRef, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { sampleMessages } from "../data/sampleMessage";

const VirtualInterview = () => {
  const flatListRef = useRef<FlatList>(null);
  const { user } = useUser();
  const messages = sampleMessages;

  // Scroll to the bottom whenever messages update
  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      className={`flex-row my-2 mx-4 ${
        item.role === Role.Bot ? "justify-start" : "justify-end"
      }`}
    >
      {item.role === Role.Bot && (
        <View className="flex items-start">
          <View className="flex-row items-center mb-1">
            <Image
              source={require("@/assets/images/savy.png")}
              className="w-5 h-5 rounded-full mr-1"
            />

            <Text className="text-sm"> Savy </Text>
          </View>
          <View className="bg-[#CDF1F8] p-4 rounded-lg max-w-[315px] border border-[#ADE3ED]">
            <Text className="text-base">{item.content}</Text>
          </View>
        </View>
      )}

      {item.role === Role.User && (
        <View className="flex items-end">
          <View className="flex-row items-center mb-1">
            <Text className="text-sm"> {user.firstName} </Text>
            <Image
              source={{
                uri: user.imageUrl || "https://via.placeholder.com/150",
              }}
              className="w-5 h-5 rounded-full ml-2"
            />
          </View>
          <View className="bg-[#ecebeb] p-4 rounded-lg max-w-[315px] border border-[#D8D8D8]">
            <Text className="text-base">{item.content}</Text>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <View className="flex-1 justify-between bg-gray-50">
      <Image
        source={require("@/assets/images/avatar.png")}
        className="w-[96%] h-56 rounded-xl mx-auto mt-4 mb-2"
      />
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
      />
      <View className="flex-row p-2 bg-white shadow-md justify-center border-gray-300 border">
        <TouchableOpacity className="p-2">
          <Image
            source={require("@/assets/icons/mic.png")}
            className="w-12 h-12 rounded-full mr-24"
          />
        </TouchableOpacity>
        <TouchableOpacity className="p-2">
          <Image
            source={require("@/assets/icons/video.png")}
            className="w-12 h-12 rounded-full"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default VirtualInterview;
