import React from "react";
import { Link, Stack } from "expo-router";
import LoginForm from "@/components/Form/LoginForm";
import {
  View,
  Text,
  Image,
  ScrollView,
  SafeAreaView,
  Platform,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import GoogleSignInButton from "@/components/Button/GoogleSignInButton";
import { LinearGradient } from "expo-linear-gradient";

// hook to warm up and cool down the web browser for authentication.
export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    if (Platform.OS !== "web") {
      void WebBrowser.warmUpAsync();
      return () => {
        void WebBrowser.coolDownAsync();
      };
    }
  }, []);
};
WebBrowser.maybeCompleteAuthSession();

const Login = () => {
  useWarmUpBrowser();
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <SafeAreaView className="bg-white min-h-full">
      <LinearGradient colors={["#E3FAFF", "#FFFFFF"]}>
        <ScrollView>
          <Stack.Screen options={{ headerShown: false }} />

          <View className="w-24 h-24 self-center mt-36">
            <Image
              source={require("@/assets/images/savy.png")}
              className="w-full h-full"
              resizeMode="contain"
            />
          </View>

          <Text className="text-[32px] text-center font-medium"> Sign In </Text>
          <Text className="text-center mt-1 text-[16px]">
            Use your account to sign in below
          </Text>

          <LoginForm />

          <View className="flex-row items-center justify-center">
            <Text> Don't have an account? </Text>
            <Link
              href="/(auth)/register"
              className="text-[#00657A] underline font-medium ml-1"
            >
              Create Account
            </Link>
          </View>

          <View className="flex-row items-center justify-center mt-12 mb-12 mx-6">
            <View className="flex-1 h-[1px] bg-gray-300" />
            <Text className="text-center mx-2 text-gray-600"> or </Text>
            <View className="flex-1 h-[1px] bg-gray-300" />
          </View>

          <GoogleSignInButton
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Login;
