import { Tabs } from "expo-router";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useAuth } from "@clerk/clerk-expo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const TabLayout = () => {
  const { isSignedIn } = useAuth();

  // Helper function to hide tab bar on specific routes
  const shouldTabBarBeVisible = (route: any) => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? "profile";
    return !(routeName === "edit-profile" || routeName === "share-feedback");
  };

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
            height: 72,
          },
          headerTitle: () => (
            <Text className="text-center text-[18px] font-semibold text-[#FFFFFF]">
              Leaderboard
            </Text>
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
