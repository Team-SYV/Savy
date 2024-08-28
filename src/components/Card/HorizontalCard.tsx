import { FlatList, Text, View, Image } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const data = [
  {
    title: "Most Common Interview Questions with Answer",
    image:
      "https://www.apcinc.com/wp-content/uploads/2023/09/Job-Interview-2.png",
  },
  {
    title: "Most Common Interview Questions with Answer",
    image:
      "https://newsroom.haas.berkeley.edu/wp-content/uploads/2018/07/AdobeStock_267017177-job-interview-tiny-scaled.jpeg",
  },
  {
    title: "Most Common Interview Questions with Answer",
    image:
      "https://static1.squarespace.com/static/5e62c2a449e8484d6ccc9c2b/t/6356a38bf33a6d5962aa9192/1666622347442/male-applicant-having-job-interview.jpg?format=1500w",
  },
];

const HorizontalCard = () => {
  return (
    <View>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View className="border border-gray-200 rounded-2xl bg-[#BBEEF8] mr-5 h-[260px] w-[310px]">
            <Image
              source={{ uri: item.image }}
              className="h-[180px] rounded-t-2xl"
              resizeMode="cover"
            />
            <Text className="font-medium p-2 max-w-[200px]">{item.title}</Text>

            <View className="flex flex-row items-center">
              <Text className="text-sm pl-2">Read more</Text>
              <Ionicons name="arrow-forward" size={15} className="pl-1" />
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default HorizontalCard;
