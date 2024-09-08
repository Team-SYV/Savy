import { View, Text, Image } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import Logout from "@/components/Profile/Logout";

const Profile = () => {
  const { user } = useUser();

  return (
    <View className="pt-12 bg-white min-h-full">
      <View className="relative flex-row items-center justify-center">
        <Link href="/(profile)/edit-profile">
          <View style={{ position: "relative" }}>
            <Image
              source={{ uri: user?.imageUrl }}
              className="w-20 h-20 rounded-full border-2 border-[#008FAE]"
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

        <View className="flex-col ml-2">
          <Text className="text-lg font-medium ml-1">
            {user?.firstName} {user?.lastName}
          </Text>

          <Text className="font-normal ml-1">
            {user?.emailAddresses[0].emailAddress}
          </Text>
        </View>

        <Image
          source={require("@/assets/icons/gold-medal.png")}
          className="w-14 h-14 ml-12"
        />
      </View>

      <Logout />
    </View>
  );
};

export default Profile;
