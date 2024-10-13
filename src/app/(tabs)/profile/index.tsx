import { View, Text, Image } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import React from "react";
import Logout from "@/components/Profile/Logout";
import Subscribe from "@/components/Profile/Subscribe";
import ShareFeedback from "@/components/Profile/ShareFeedback";
import EditProfileButton from "@/components/Profile/EditProfileButton";

const Profile = () => {
  const { user } = useUser();

  return (
    <View className="flex-1 bg-white">
      <Image
        source={require("@/assets/images/job-interview.png")}
        className="h-[170px]"
      />

      <View className="p-4">
        <View className="flex items-center justify-center mb-4 -mt-20">
          <Image
            source={{ uri: user?.imageUrl }}
            className="w-[110px] h-[110px] rounded-full border-2 border-[#008FAE]"
          />
        </View>

        <View className="flex-col">
          <Text className="text-[22px] font-medium text-center mb-1">
            {user?.firstName} {user?.lastName}
          </Text>
          <Text className="font-normal text-center">
            {user?.emailAddresses[0].emailAddress}
          </Text>
        </View>
      </View>

      <Subscribe />
      <EditProfileButton />
      <ShareFeedback />
      <Logout />
    </View>
  );
};

export default Profile;
