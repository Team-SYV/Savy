import React from "react";
import { SafeAreaView, ScrollView, View, Text } from "react-native";
import { Link, Stack } from "expo-router";
import RegisterForm from "@/components/Form/RegisterForm";

const Register = () => {
  return (
    <SafeAreaView className="top-36 flex-1 bg-transparent p-2">
      <ScrollView>
        <Stack.Screen options={{ headerShown: false }} />

        <Text className="text-3xl font-medium "> Create Account </Text>
        <Text className="text-lg ml-2">
          Create your account by filling the information below
        </Text>

        <RegisterForm />

        <View className="flex-row items-center justify-center mt-2">
          <Text> Already have an account? </Text>
          <Link
            href="/(auth)/login"
            className="text-[#00657A] underline font-medium ml-1"
          >
            Sign in
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Register;
