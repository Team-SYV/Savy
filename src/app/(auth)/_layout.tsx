import React from "react";
import { Stack } from "expo-router";

const AuthLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="login"></Stack.Screen>
      <Stack.Screen name="register"></Stack.Screen>
    </Stack>
  );
};

export default AuthLayout;
