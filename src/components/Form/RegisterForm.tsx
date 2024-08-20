import React, { useState } from "react";
import { View, Text } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import Spinner from "react-native-loading-spinner-overlay";
import CustomInput from "../FormInput/CustomFormInput";
import PasswordInput from "../FormInput/PasswordInput";
import CustomButton from "../Button/CustomButton";
import BottomHalfModal from "../Modal/BottomHalfModal";
import OTPTextInput from "react-native-otp-textinput";

const RegisterForm = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);

    try {
      // Create the user on Clerk
      await signUp.create({
        emailAddress,
        password,
      });

      // Send verification Email
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
    } catch (err) {
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  // Verify the email address
  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      await setActive({ session: completeSignUp.createdSessionId });
    } catch (err) {
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
      setPendingVerification(false);
    }
  };

  return (
    <View>
      <Spinner visible={loading} />

      <CustomInput
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        marginTop="mt-10"
        marginBottom="mb-3"
      />

      <CustomInput
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        marginTop="mt-2"
        marginBottom="mb-3"
      />

      <CustomInput
        placeholder="Email"
        value={emailAddress}
        onChangeText={setEmailAddress}
        marginTop="mt-2"
        marginBottom="mb-3"
      />

      <PasswordInput
        value={password}
        placeholder="Password"
        onChangeText={setPassword}
        marginTop="mt-2"
        marginBottom="mb-3"
      />

      <PasswordInput
        value={confirmPassword}
        placeholder="Confirm Password"
        onChangeText={setConfirmPassword}
        marginTop="mt-2"
        marginBottom="mb-5"
      />

      <CustomButton
        title="Sign Up"
        onPress={onSignUpPress}
        bgColor="bg-[#00AACE]"
        textColor="text-white"
        width="w-full"
        height="h-16"
        borderRadius="rounded-2xl"
        textSize="text-[20px]"
        marginTop="mt-6"
        marginBottom="mb-1"
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
            bgColor="bg-[#00AACE]"
            textColor="text-white"
            width="w-full"
            height="h-16"
            borderRadius="rounded-2xl"
            textSize="text-[20px]"
            marginTop="mt-6"
            marginBottom="mb-1"
          />
        </BottomHalfModal>
      )}
    </View>
  );
};

export default RegisterForm;
