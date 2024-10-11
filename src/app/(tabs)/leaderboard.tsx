import { View, Text, Image, ScrollView } from "react-native";
import React from "react";
import { useUser } from "@clerk/clerk-expo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const sampleData = Array.from({ length: 47 }, (_, i) => ({
  rank: i + 4,
  firstName: `FirstName${i + 4}`,
  lastName: `LastName${i + 4}`,
  score: Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000,
  imageUrl:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTL6OmAlvhyskzveIY235fJlDVXvJdwRzHWQxPCaZWWgZgUxzBwsA8tTJSH6r8wC5q0i1Q&usqp=CAU",
}));

const Leaderboard = () => {
  const { user } = useUser();

  return (
    <View className="flex-1 bg-white">
      <Text className="text-lg font-semibold text-center mt-2 text-gray-700">Leaderboard</Text>

      <Image
        source={{
          uri: user.imageUrl || "https://via.placeholder.com/150",
        }}
        className="w-[72px] h-[72px] rounded-full mt-2 mx-auto"
        style={{ zIndex: 1 }}
      />

      <View className="border border-gray-500 mx-12 rounded-2xl mt-[-40]">
        <Text className="text-center mt-12 mb-3 font-medium">
          {user.firstName} {user.lastName}
        </Text>

        <View className="flex-row mx-auto justify-between w-full px-6 pb-6">
          <View className="flex-row items-center">
            <MaterialIcons name="leaderboard" size={30} color="gray" />
            <View className="flex-col items-center ml-2">
              <Text className="text-[11px]">22 Rank</Text>
              <Text className="text-[11px]">My Ranking</Text>
            </View>
          </View>

          <View className="flex-row items-center">
            <FontAwesome5 name="medal" size={30} color="gray" />
            <View className="flex-col items-center ml-2">
              <Text className="text-[11px]">500</Text>
              <Text className="text-[11px]">My Score</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Top 3 Users */}
      <View className="flex-row mx-auto items-center w-full justify-between px-6">
        <View className="flex-col items-center">
          <Image
            source={{
              uri: "https://pics.craiyon.com/2023-10-07/aa159aef2f074a259232a290748da0aa.webp",
            }}
            className="w-24 h-24 rounded-full mt-6 mx-auto"
            style={{ zIndex: 1 }}
          />
          <Text className="text-sm">Chloe Belle</Text>
          <View className="flex-row items-center">
            <FontAwesome5 name="medal" size={12} color="orange" />
            <Text className="text-sm"> 2000 </Text>
          </View>
        </View>

        <View className="flex-col items-center">
          <Image
            source={{
              uri: "https://imgcdn.stablediffusionweb.com/2024/2/24/4abb7f5d-c625-4f72-88dc-3da18e45aad9.jpg",
            }}
            className="w-32 h-32 rounded-full mt-6 mx-auto"
            style={{ zIndex: 1 }}
          />
          <Text className="text-sm">Dave Alivio</Text>
          <View className="flex-row items-center">
            <FontAwesome5 name="medal" size={12} color="orange" />
            <Text className="text-sm"> 2100 </Text>
          </View>
        </View>

        <View className="flex-col items-center">
          <Image
            source={{
              uri: "https://image.lexica.art/full_jpg/ed98a0ce-d195-4c46-bbe1-ca80d8dca227",
            }}
            className="w-24 h-24 rounded-full mt-6 mx-auto"
            style={{ zIndex: 1 }}
          />

          <Text className="text-sm">Ferjen Torred</Text>
          <View className="flex-row items-center">
            <FontAwesome5 name="medal" size={12} color="orange" />
            <Text className="text-sm"> 1900 </Text>
          </View>
        </View>
      </View>

      {/* Scrollable list */}
      <View className="flex-1 mt-2 py-2">
        <ScrollView
          style={{ flex: 1 }}
          className="max-h-[220px] border border-gray-500 mx-4 py-2 rounded-xl"
        >
          {sampleData.map((item, index) => (
            <View
              key={item.rank}
              className={`flex-row border border-gray-500 py-2 rounded-xl justify-between px-4 my-2 mx-4 ${
                index === sampleData.length - 1 ? "mb-6" : ""
              }`}
            >
              <View className="items-center flex-row">
                <Text className="mr-3">{item.rank}</Text>
                <Image
                  source={{ uri: item.imageUrl }}
                  className="w-6 h-6 rounded-full mr-2"
                  style={{ zIndex: 1 }}
                />
                <Text>
                  {item.firstName} {item.lastName}
                </Text>
              </View>

              <View className="flex-row items-center">
                <Text className="mr-1">{item.score}</Text>
                <FontAwesome5 name="medal" size={14} color="gray" />
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default Leaderboard;
