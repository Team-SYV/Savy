import React, { useState } from "react";
import { View, Text, SafeAreaView, ScrollView, Image } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { Stack } from "expo-router";
import { useSignIn } from "@clerk/clerk-expo";
import CustomFormField from "@/components/FormField/CustomFormField";
import CustomButton from "@/components/Button/CustomButton";
import BackToLogin from "@/components/Button/BackToLogin";
import BottomHalfModal from "@/components/Modal/BottomHalfModal";
import OTPTextInput from "react-native-otp-textinput";
import {
  validateConfirmPassword,
  validatePassword,
} from "@/utils/validateRegister";

const ResetPassword = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [loading, setLoading] = useState(false);
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");

  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
    general: "",
  });

  const handleInputChange = (text: string, field: keyof typeof errors) => {
    switch (field) {
      case "password":
        setPassword(text);
        setErrors((prev) => ({
          ...prev,
          password: text
            ? validatePassword(text, submitted)
            : "Password is required",
        }));
        break;
      case "confirmPassword":
        setConfirmPassword(text);
        setErrors((prev) => ({
          ...prev,
          confirmPassword: text
            ? validateConfirmPassword(password, text, submitted)
            : "Confirm password is required",
        }));
        break;
    }
  };

  const isFormValid = () => {
    const passwordError = validatePassword(password, submitted);
    const confirmPasswordError = validateConfirmPassword(
      password,
      confirmPassword,
      submitted
    );

    setErrors({
      password: passwordError,
      confirmPassword: confirmPasswordError,
      general: "",
    });

    return !passwordError && !confirmPasswordError;
  };

  const onRequestReset = async () => {
    if (!emailAddress) {
      setErrors((prev) => ({
        ...prev,
        general: "Email is required to reset the password",
      }));
      return;
    }
    setLoading(true);
    setErrors((prev) => ({ ...prev, general: "" }));

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: emailAddress,
      });
      setSuccessfulCreation(true);
    } catch (err: any) {
      setErrors((prev) => ({
        ...prev,
        general: err.errors[0]?.message || "An unknown error occurred",
      }));
      setTimeout(() => setErrors((prev) => ({ ...prev, general: "" })), 3000);
    } finally {
      setLoading(false);
    }
  };

  const onReset = async () => {
    setSubmitted(true);
    if (!isLoaded) return;

    if (!isFormValid()) return;

    setLoading(true);

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });
      alert("Password reset successfully");
      await setActive({ session: result.createdSessionId });
    } catch (err: any) {
      setErrors((prev) => ({
        ...prev,
        general: err.errors[0]?.message || "An unknown error occurred",
      }));
      setTimeout(() => setErrors((prev) => ({ ...prev, general: "" })), 3000);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    if (isFormValid()) {
      setIsModalVisible(true);
    }
  };

  return (
    <SafeAreaView className="bg-white min-h-full p-6">
      <ScrollView>
        <Stack.Screen options={{ headerShown: false }} />
        <Spinner visible={loading} />

        {!successfulCreation ? (
          <View className="mt-32">
            <View className="w-60 h-60 self-center">
              <Image
                source={require("@/assets/icons/password.png")}
                className="w-full h-full"
                resizeMode="contain"
              />
            </View>

            <Text className="text-3xl text-center font-medium mt-6">
              Forgot Password?
            </Text>

            <Text className="text-center mt-2">
              Enter your email account to reset password and
            </Text>

            <CustomFormField
              title="Email"
              placeholder="Enter your email"
              value={emailAddress}
              onChangeText={(text) => setEmailAddress(text)}
              otherStyles="mb- mt-12"
              keyboardType="email-address"
            />

            {errors.general && (
              <Text className="text-red-500 text-center mt-2 text-sm">
                {errors.general}
              </Text>
            )}

            <CustomButton
              title="Reset Password"
              onPress={onRequestReset}
              containerStyles="bg-[#00AACE] h-16 w-full rounded-2xl mt-6 mb-1"
              textStyles="text-white text-[17px]"
              isLoading={loading}
            />

            <BackToLogin />
          </View>
        ) : (
          <View className="mt-32">
            <View className="w-60 h-60 self-center">
              <Image
                source={require("@/assets/icons/password.png")}
                className="w-full h-full"
                resizeMode="contain"
              />
            </View>

            <Text className="text-3xl text-center font-medium mt-6">
              Set New Password
            </Text>

            <Text className="text-center mt-2 mb-4">
              Please enter your new password
            </Text>

            <CustomFormField
              title="Password"
              placeholder="New Password"
              value={password}
              onChangeText={(text) => handleInputChange(text, "password")}
              otherStyles="mb-1"
            />
            {errors.password && (
              <Text className="text-red-500 text-sm">{errors.password}</Text>
            )}

            <CustomFormField
              title="Confirm Password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={(text) =>
                handleInputChange(text, "confirmPassword")
              }
              otherStyles="mb-1 mt-4"
            />
            {errors.confirmPassword && (
              <Text className="text-red-500 text-sm">
                {errors.confirmPassword}
              </Text>
            )}

            <CustomButton
              title="Request Code"
              onPress={openModal}
              containerStyles="bg-[#00AACE] h-16 w-full rounded-2xl mt-6 mb-1"
              textStyles="text-white text-[17px]"
              isLoading={loading}
            />

            <BackToLogin />
          </View>
        )}
      </ScrollView>

      <BottomHalfModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      >
        <View className="mt-4"></View>
        <View className="w-40 h-40 self-center">
          <Image
            source={require("@/assets/icons/email.png")}
            className="w-full h-full"
            resizeMode="contain"
          />
        </View>

        <Text className="text-3xl text-center font-medium mt-2">
          Verify Your Email
        </Text>

        <Text className="text-center mt-2 mb-5">
          Please enter the 6 digit code sent to your email
        </Text>

        <View className="mt-3 items-center">
          <OTPTextInput
            tintColor={"#00AACE"}
            inputCount={6}
            handleTextChange={(code) => setCode(code)}
          />
        </View>

        <CustomButton
          title="Reset Password"
          onPress={onReset}
          containerStyles="bg-[#00AACE] h-16 w-full rounded-2xl mt-6 mb-1"
          textStyles="text-white text-[17px]"
          isLoading={loading}
        />
      </BottomHalfModal>
    </SafeAreaView>
  );
};

export default ResetPassword;
