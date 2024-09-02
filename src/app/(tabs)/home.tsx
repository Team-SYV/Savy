import { View, Text, Image } from "react-native";
import React from "react";
import Card from "@/components/Card/Card";
import HorizontalCard from "@/components/Card/HorizontalCard";
import { Link } from "expo-router";

const Home = () => {
  return (
    <View className="p-4 bg-white min-h-full">
      <View className="flex flex-row items-center mt-8">
        <Text className="text-3xl font-semibold">Welcome</Text>
        <Image
          source={require("@/assets/icons/hand.png")}
          className="ml-1 w-9 h-9"
        />
      </View>

      <Text className="text-sm font-light">
        Get ready to ace interviews and advance your career with ease.
      </Text>

      <Text className="text-base font-medium mt-12 mb-2">
        Practice Interview
      </Text>
      <View className="flex flex-row items-center justify-center">
        <Card
          imageSource={require("@/assets/images/virtual-interview.png")}
          text="Talk with Virtual Interviewer"
          cardClassName="mr-4"
        />

        <Link href="/record-yourself">
          <Card
            imageSource={require("@/assets/images/record-yourself.png")}
            text="Record Yourself"
          />
        </Link>
      </View>

      <Text className="text-base font-medium mt-12 mb-3">
        Read Interview Tips
      </Text>

      <HorizontalCard />
    </View>
  );
};

export default Home;
