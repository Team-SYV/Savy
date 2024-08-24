import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useAuth } from "@clerk/clerk-expo";
import { ProfileButton } from "@/components/Profile/ProfileButton";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Text } from "react-native";

const TabLayout = () => {
  const { isSignedIn } = useAuth();

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: "#008FAE",
        },
        headerTintColor: "#fff",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerTitle: "Savy",
          headerRight: () => <ProfileButton />,
          tabBarActiveTintColor: "#008FAE",
          tabBarIcon: ({ size, color }) => (
            <FontAwesome name="home" size={size} color={color} marginTop={4} />
          ),

          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? "#008FAE" : "gray",
                fontSize: 11,
                padding: 2,
              }}
              className=""
            >
              Home
            </Text>
          ),
        }}
        redirect={!isSignedIn}
      />

      <Tabs.Screen
        name="history"
        options={{
          headerTitle: "Savy",
          headerRight: () => <ProfileButton />,
          tabBarActiveTintColor: "#008FAE",
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons
              name="history"
              size={size}
              color={color}
              marginTop={4}
            />
          ),

          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? "#008FAE" : "gray",
                fontSize: 11,
                padding: 2,
              }}
            >
              History
            </Text>
          ),
        }}
        redirect={!isSignedIn}
      />

      <Tabs.Screen
        name="get-pro"
        options={{
          headerTitle: "Savy",
          headerRight: () => <ProfileButton />,
          tabBarActiveTintColor: "#008FAE",
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons
              name="crown-outline"
              size={size}
              color={color}
              marginTop={4}
            />
          ),

          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? "#008FAE" : "gray",
                fontSize: 11,
                padding: 2,
              }}
            >
              GetPro
            </Text>
          ),
        }}
        redirect={!isSignedIn}
      />

      <Tabs.Screen
        name="leaderboard"
        options={{
          headerTitle: "Savy",
          headerRight: () => <ProfileButton />,
          tabBarActiveTintColor: "#008FAE",
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons
              name="leaderboard"
              size={size}
              color={color}
              marginTop={4}
            />
          ),

          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? "#008FAE" : "gray",
                fontSize: 11,
                padding: 2,
              }}
            >
              Leaderboard
            </Text>
          ),
        }}
        redirect={!isSignedIn}
      />

      <Tabs.Screen
        name="progress"
        options={{
          headerTitle: "Savy",
          headerRight: () => <ProfileButton />,
          tabBarActiveTintColor: "#008FAE",
          tabBarIcon: ({ size, color }) => (
            <AntDesign
              name="barschart"
              size={size}
              color={color}
              marginTop={4}
            />
          ),

          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? "#008FAE" : "gray",
                fontSize: 11,
                padding: 2,
              }}
            >
              Progress
            </Text>
          ),
        }}
        redirect={!isSignedIn}
      />
    </Tabs>
  );
};

export default TabLayout;
