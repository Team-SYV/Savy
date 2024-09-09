import React, { useState } from "react";
import { View, Text } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { useSignIn } from "@clerk/clerk-expo";
import CustomFormField from "../FormField/CustomFormField";
import CustomButton from "../Button/CustomButton";
import { validateEmail, validatePassword } from "@/utils/validateLogin";
import { Link } from "expo-router";

const LoginForm = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });

  // Handles input change and sets validation errors based on field type
  const handleInputChange = (text: string, field: "email" | "password") => {
    const updatedErrors = { ...errors };
    if (field === "email") {
      setEmailAddress(text);
      updatedErrors.email = text
        ? validateEmail(text, submitted)
        : "Email is required";
    } else {
      setPassword(text);
      updatedErrors.password = text
        ? validatePassword(text, submitted)
        : "Password is required";
    }
    setErrors(updatedErrors);
  };

  // Checks if the form is valid
  const isFormValid = () => {
    const emailError = validateEmail(emailAddress, submitted);
    const passwordError = validatePassword(password, submitted);

    setErrors({
      email: emailError,
      password: passwordError,
      general: "",
    });

    return !emailError && !passwordError;
  };

  // Handles sign in button press
  const onSignInPress = async () => {
    setSubmitted(true);

    if (!isLoaded || !isFormValid()) return;

    setLoading(true);
    setErrors((prev) => ({ ...prev, general: "" }));

    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });
      await setActive({ session: completeSignIn.createdSessionId });
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        general: err.errors?.[0]?.message || "An unknown error occurred",
      }));
      setTimeout(() => {
        setErrors((prev) => ({ ...prev, general: "" }));
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center p-4">
      <Spinner visible={loading} />

      <CustomFormField
        title="Email Address"
        placeholder="Email"
        value={emailAddress}
        onChangeText={(text) => handleInputChange(text, "email")}
        otherStyles="mt-5 mb-1"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {errors.email && (
        <Text className="text-red-600 text-sm ml-1">{errors.email}</Text>
      )}

      <CustomFormField
        title="Password"
        placeholder="Password"
        value={password}
        onChangeText={(text) => handleInputChange(text, "password")}
        otherStyles="mt-5 mb-1"
      />

      <View className="flex-row items-center justify-between mt-1 mb-1">
        <View className="flex-grow">
          {errors.password && (
            <Text className="text-red-500 text-sm">{errors.password}</Text>
          )}
        </View>

        <Link href="/(auth)/reset-password" className="text-right text-sm ml-2">
          Forgot Password?
        </Link>
      </View>

      {errors.general && (
        <Text className="text-red-500 text-sm text-center mt-2">
          {errors.general}
        </Text>
      )}

      <CustomButton
        title="Sign In"
        onPress={onSignInPress}
        containerStyles="bg-[#00AACE] h-[55px] w-full rounded-2xl mt-6"
        textStyles="text-white text-[20px]"
        isLoading={loading}
      />
    </View>
  );
};

export default LoginForm;
