import React, { useState } from "react";
import { View, Text } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { useSignIn } from "@clerk/clerk-expo";
import CustomFormField from "../FormField/CustomFormField";
import CustomButton from "../Button/CustomButton";
import { validateEmail, validatePassword } from "@/utils/validateLogin";

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

  //Handles email input change and sets validation errors.
  const handleEmailChange = (text: string) => {
    setEmailAddress(text);
    setErrors((prev) => ({
      ...prev,
      email: text ? validateEmail(text, submitted) : "Email is required",
    }));
  };

  //Handles password input change and sets validation errors.
  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setErrors((prev) => ({
      ...prev,
      password: text
        ? validatePassword(text, submitted)
        : "Password is required",
    }));
  };

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
        onChangeText={handleEmailChange}
        otherStyles="mt-7 mb-1"
        keyboardType="email-address"
      />
      {errors.email && (
        <Text className="text-red-600 text-sm ml-1">{errors.email}</Text>
      )}

      <CustomFormField
        title="Password"
        placeholder="Password"
        value={password}
        onChangeText={handlePasswordChange}
        otherStyles="mt-7 mb-1"
      />
      {errors.password && (
        <Text className="text-red-500 text-sm ml-1">{errors.password}</Text>
      )}

      {errors.general && (
        <Text className="text-red-500 text-sm text-center mt-2">
          {errors.general}
        </Text>
      )}

      <CustomButton
        title="Sign In"
        onPress={onSignInPress}
        containerStyles="bg-[#00AACE] h-16 w-full rounded-2xl mt-10 mb-1"
        textStyles="text-white text-[20px]"
        isLoading={loading}
      />
    </View>
  );
};

export default LoginForm;
