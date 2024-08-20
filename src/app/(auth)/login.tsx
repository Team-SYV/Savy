import { Link, Stack } from "expo-router";
import React from "react";
import LoginForm from "@/components/Form/LoginForm";
import { View, Text, Image, ScrollView, SafeAreaView } from "react-native";

const Login = () => {
  return (
    <SafeAreaView className="top-44 flex-1 bg-transparent p-4">
      <ScrollView>
        <Stack.Screen options={{ headerShown: false }} />

        <View className="w-28 h-28 self-center ">
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;
