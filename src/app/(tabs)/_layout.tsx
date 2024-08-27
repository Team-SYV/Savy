import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useAuth } from "@clerk/clerk-expo";
import { ProfileButton } from "@/components/Profile/ProfileButton";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";

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
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.5,
          elevation: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          bottom: 7,
          borderRadius: 20,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerTitle: "Savy",
          headerRight: () => <ProfileButton />,
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
          headerTitle: "Savy",
          headerRight: () => <ProfileButton />,
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
          headerTitle: "Savy",
          headerRight: () => <ProfileButton />,
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
          headerTitle: "Savy",
          headerRight: () => <ProfileButton />,
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
