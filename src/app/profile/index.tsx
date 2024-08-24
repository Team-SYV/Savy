import { View, Text, Image } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import LogoutButton from "@/components/Profile/LogoutButton";

const Profile = () => {
  const { user } = useUser();

  return (
    <View className="mt-12">
      <View className="flex-row items-center justify-center">
        <Image
          source={{ uri: user?.imageUrl }}
          className="w-20 h-20 rounded-full"
        />

        <View className="flex-col ml-2">
          <View className="flex-row items-center">
            <Text className="text-xl font-medium"> {user?.firstName} </Text>
            <Text className="text-xl font-medium"> {user?.lastName} </Text>
          </View>

          <Text> {user?.emailAddresses[0].emailAddress} </Text>
        </View>

        <Image
          source={require("@/assets/icons/gold-medal.png")}
          className="w-14 h-14 ml-8"
        />
      </View>

      <LogoutButton />
    </View>
  );
};

export default Profile;
