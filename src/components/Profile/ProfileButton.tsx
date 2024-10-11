import React from "react";
import { Pressable, Image } from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";

export const ProfileButton = () => {
  const router = useRouter();
  const { user } = useUser();

  const navigateToProfile = () => {
    router.push("/profile");
  };

  return (
    <Pressable onPress={navigateToProfile} className="mr-2">
      <Image
        source={{ uri: user?.imageUrl || "https://via.placeholder.com/150" }}
        className="w-8 h-8 rounded-full"
      />
    </Pressable>
  );
};
