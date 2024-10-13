import { View, Text, Image } from "react-native";
import React from "react";
import Card from "@/components/Card/Card";
import HorizontalCard from "@/components/Card/HorizontalCard";

const Home = () => {
  return (
    <View className="p-5 bg-white min-h-full">
      <View className="flex flex-row items-center mt-4">
        <Text className="text-[23px] font-semibold">Welcome</Text>
        <Image
          source={require("@/assets/icons/hand.png")}
          className="ml-1 w-7 h-7"
        />
      </View>

      <Text className="text-sm font-light">
        Get ready to ace interviews and advance your career with ease.
      </Text>

      <Text className="text-[14px] font-medium mt-7 mb-3">
        Practice Interview
      </Text>

      <View className="mb-4">
        <Card
          imageSource={require("@/assets/images/virtual-interview.png")}
          text="Talk with Virtual Interviewer"
          textClassName="text-[15px]"
          buttonLink="/virtual-interview/job-information"
        />
      </View>

      <Card
        imageSource={require("@/assets/images/record-yourself.png")}
        text="Record Yourself"
        textClassName="text-[16px]"
        buttonLink="/record-yourself/job-information"
      />

      <Text className="text-text-[14px] font-medium mt-7 mb-3">
        Read Interview Tips
      </Text>

      <HorizontalCard />
    </View>
  );
};

export default Home;
