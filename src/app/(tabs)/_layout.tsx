import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useAuth } from "@clerk/clerk-expo";
import { ProfileButton } from "@/components/Profile/ProfileButton";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Image, View, Text } from "react-native";

const HeaderLeft = () => (
  <View className="flex-row items-center">
    <Image
      source={require("@/assets/images/svy.png")}
      className="w-10 h-10 ml-2"
    />
    <Text className="text-white text-xl font-bold"> Savy </Text>
  </View>
);

const TabLayout = () => {
  const { isSignedIn } = useAuth();

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: "#008FAE",
        },
        headerTintColor: "#fff",
        tabBarActiveTintColor: "#008FAE",
        tabBarInactiveTintColor: "#7F7F7F",
        tabBarStyle: {
          height: 62,
          position: "absolute",
          bottom: 10,
          left: 10,
          right: 10,
          borderRadius: 15,
          borderTopWidth: 0,
          shadowColor: "#000",
          elevation: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          bottom: 10,
          borderRadius: 20,
        },
        headerRight: () => <ProfileButton />,
        headerTitle: () => null,
        headerLeft: () => <HeaderLeft />,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ size, color }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
          tabBarLabel: "Home",
        }}
        redirect={!isSignedIn}
      />

      <Tabs.Screen
        name="history"
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons name="history" size={size} color={color} />
          ),
          tabBarLabel: "History",
        }}
        redirect={!isSignedIn}
      />

      <Tabs.Screen
        name="leaderboard"
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons name="leaderboard" size={size} color={color} />
          ),
          tabBarLabel: "Leaderboard",
        }}
        redirect={!isSignedIn}
      />

      <Tabs.Screen
        name="progress"
        options={{
          tabBarIcon: ({ size, color }) => (
            <AntDesign name="barschart" size={size} color={color} />
          ),
          tabBarLabel: "Progress",
        }}
        redirect={!isSignedIn}
      />
    </Tabs>
  );
};

export default TabLayout;
