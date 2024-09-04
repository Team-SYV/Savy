import React, { useState } from "react";
import { View, Text } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { useSignUp } from "@clerk/clerk-expo";
import CustomButton from "../Button/CustomButton";
import BottomHalfModal from "../Modal/BottomHalfModal";
import OTPTextInput from "react-native-otp-textinput";
import CustomFormField from "../FormField/CustomFormField";
import {
  validateFirstName,
  validateLastName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "@/utils/validateRegister";
const RegisterForm = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (text: string, field: keyof typeof errors) => {
    switch (field) {
      case "firstName":
        setFirstName(text);
        setErrors((prev) => ({
          ...prev,
          firstName: text
            ? validateFirstName(text, submitted)
            : "First name is required",
        }));
        break;
      case "lastName":
        setLastName(text);
        setErrors((prev) => ({
          ...prev,
          lastName: text
            ? validateLastName(text, submitted)
            : "Last name is required",
        }));
        break;
      case "emailAddress":
        setEmailAddress(text);
        setErrors((prev) => ({
          ...prev,
          emailAddress: text
            ? validateEmail(text, submitted)
            : "Email is required",
        }));
        break;
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
    const firstNameError = validateFirstName(firstName, submitted);
    const lastNameError = validateLastName(lastName, submitted);
    const emailError = validateEmail(emailAddress, submitted);
    const passwordError = validatePassword(password, submitted);
    const confirmPasswordError = validateConfirmPassword(
      password,
      confirmPassword,
      submitted
    );

    setErrors({
      firstName: firstNameError,
      lastName: lastNameError,
      emailAddress: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
    });

    return (
      !firstNameError &&
      !lastNameError &&
      !emailError &&
      !passwordError &&
      !confirmPasswordError
    );
  };

  const onSignUpPress = async () => {
    setSubmitted(true);

    if (!isLoaded || !isFormValid()) return;

    setLoading(true);
    setErrors((prev) => ({ ...prev, general: "" }));

    try {
      await signUp.create({
        emailAddress,
        password,
        firstName,
        lastName,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
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

  const onPressVerify = async () => {
    if (!isLoaded) return;

    setLoading(true);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      await setActive({ session: completeSignUp.createdSessionId });
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
      setPendingVerification(false);
    }
  };

  return (
    <View className="flex-1 justify-center p-2">
      <Spinner visible={loading} />

      <CustomFormField
        title="First Name"
        placeholder="First Name"
        value={firstName}
        onChangeText={(text) => handleInputChange(text, "firstName")}
        otherStyles="mt-7 mb-1"
      />
      {errors.firstName && (
        <Text className="text-red-600 text-sm ml-1">{errors.firstName}</Text>
      )}

      <CustomFormField
        title="Last Name"
        placeholder="Last Name"
        value={lastName}
        onChangeText={(text) => handleInputChange(text, "lastName")}
        otherStyles="mt-5 mb-1"
      />
      {errors.lastName && (
        <Text className="text-red-600 text-sm ml-1">{errors.lastName}</Text>
      )}

      <CustomFormField
        title="Email"
        placeholder="Email"
        value={emailAddress}
        onChangeText={(text) => handleInputChange(text, "emailAddress")}
        otherStyles="mt-5 mb-1"
        keyboardType="email-address"
      />
      {errors.emailAddress && (
        <Text className="text-red-600 text-sm ml-1">{errors.emailAddress}</Text>
      )}

      <CustomFormField
        title="Password"
        placeholder="Password"
        value={password}
        onChangeText={(text) => handleInputChange(text, "password")}
        otherStyles="mt-5 mb-1"
      />
      {errors.password && (
        <Text className="text-red-600 text-sm ml-1">{errors.password}</Text>
      )}

      <CustomFormField
        title="Password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={(text) => handleInputChange(text, "confirmPassword")}
        otherStyles="mt-5 mb-1"
      />
      {errors.confirmPassword && (
        <Text className="text-red-600 text-sm ml-1">
          {errors.confirmPassword}
        </Text>
      )}

      <CustomButton
        title="Sign Up"
        onPress={onSignUpPress}
        containerStyles="bg-[#00AACE] h-16 w-full rounded-2xl mt-6 mb-1"
        textStyles="text-white text-[20px]"
        isLoading={loading}
      />

      {/* Verification Modal */}
      {pendingVerification && (
        <BottomHalfModal
          isVisible={pendingVerification}
          onClose={() => {
            setPendingVerification(false);
          }}
        >
          <View className="items-center">
            <Text className="mt-3 text-2xl font-bold">Email Verification</Text>
            <Text className="mt-5 text-center text-lg">
              Please enter the 6-digit code that {"\n"}
              was sent to your email.
            </Text>
          </View>
          <View className="mt-3 items-center">
            <OTPTextInput
              tintColor={"#00AACE"}
              inputCount={6}
              handleTextChange={(code) => setCode(code)}
            />
          </View>

          <CustomButton
            title="Verify Email"
            onPress={onPressVerify}
            containerStyles="bg-[#00AACE] h-16 w-full rounded-2xl mt-6 mb-1"
            textStyles="text-white text-[20px]"
            isLoading={loading}
          />
        </BottomHalfModal>
      )}
    </View>
  );
};

export default RegisterForm;
