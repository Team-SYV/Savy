import { Tabs } from "expo-router";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useAuth } from "@clerk/clerk-expo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { Text, View, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const TabLayout = () => {
  const { isSignedIn } = useAuth();

  // Helper function to hide tab bar on specific routes
  const shouldTabBarBeVisible = (route: any) => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? "profile";
    return !(routeName === "edit-profile" || routeName === "share-feedback");
  };

  const HeaderLeft = () => (
    <View className="flex-row items-center">
      <Image
        source={require("@/assets/images/syv.png")}
        className="w-9 h-9 ml-3"
      />
      <Text className="text-white text-xl font-semibold"> Savy </Text>
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        headerShadowVisible: false,
        tabBarActiveTintColor: "#008FAE",
        tabBarInactiveTintColor: "#7F7F7F",
        tabBarStyle: {
          height: 56,
          position: "absolute",
          bottom: 10,
          left: 8,
          right: 8,
          borderRadius: 15,
          borderTopWidth: 0,
          shadowColor: "#000",
          elevation: 5,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          marginBottom: 6,
        },
        tabBarIconStyle: {
          marginTop: 6,
        },
        tabBarItemStyle: {
          marginHorizontal: 8,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ size, color }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
          tabBarLabel: "Home",
          headerShown: true,
          headerStyle: {
            backgroundColor: "#009CBD",
            height: 75,
          },
          headerLeft: () => <HeaderLeft />,
          headerRight: () => (
            <Image
              source={require("@/assets/images/streak.png")}
              style={{ width: 28, height: 28, marginRight: 12 }}
            />
          ),
          headerTitle: () => null,
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
          headerShown: true,
          headerTitleAlign: "center",
          headerShadowVisible: true,
          headerStyle: {
            backgroundColor: "#009CBD",
            height: 75,
          },
          headerTitle: () => (
            <View className="flex items-center justify-center">
              <View className="flex-row items-center justify-center">
                <Text className="text-[18px] font-semibold text-[#FFFFFF] mr-2">
                  Leaderboard
                </Text>
                <Image
                  source={require("@/assets/icons/trophy.png")}
                  style={{ width: 20, height: 16 }}
                />
              </View>
            </View>
          ),
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

      <Tabs.Screen
        name="profile"
        options={({ route }) => ({
          tabBarIcon: ({ size, color }) => (
            <FontAwesome5 name="user-circle" size={size} color={color} />
          ),
          tabBarLabel: "Profile",
          tabBarStyle: shouldTabBarBeVisible(route)
            ? {
                height: 56,
                position: "absolute",
                bottom: 10,
                left: 8,
                right: 8,
                borderRadius: 15,
                borderTopWidth: 0,
                shadowColor: "#000",
                elevation: 5,
              }
            : { display: "none" },
        })}
        redirect={!isSignedIn}
      />
    </Tabs>
  );
};

export default TabLayout;
