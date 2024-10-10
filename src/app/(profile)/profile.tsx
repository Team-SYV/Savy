import { View, Text, Image } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import Logout from "@/components/Profile/Logout";
import Subscribe from "@/components/Profile/Subscribe";
import ShareFeedback from "@/components/Profile/ShareFeedback";

const Profile = () => {
  const { user } = useUser();

  return (
    <View className="pt-10 bg-white min-h-full">
      <View className="flex items-center justify-center> mb-4">
        <Link href="/(profile)/edit-profile">
          <View style={{ position: "relative" }}>
            <Image
              source={{ uri: user?.imageUrl }}
              className="w-[105px] h-[105px] rounded-full border-2 border-[#008FAE]"
            />
            <MaterialCommunityIcons
              name="pencil"
              size={16}
              color="#008FAE"
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                backgroundColor: "white",
                borderWidth: 1,
                borderColor: "#008FAE",
                borderRadius: 50,
                padding: 4,
                textAlign: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
          </View>
        </Link>
      </View>

      <View className="flex-col ml-2">
        <Text className="text-2xl font-medium text-center mb-1">
          {user?.firstName} {user?.lastName}
        </Text>

        <Text className="font-normal ml-1 text-center">
          {user?.emailAddresses[0].emailAddress}
        </Text>
      </View>

      <Subscribe />
      <ShareFeedback />
      <Logout />
    </View>
  );
};

export default Profile;
