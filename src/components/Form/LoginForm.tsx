import React, { useState } from "react";
import { View, Text } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { useSignIn } from "@clerk/clerk-expo";
import CustomInput from "../FormInput/CustomFormInput";
import CustomButton from "../Button/CustomButton";
import PasswordInput from "../FormInput/PasswordInput";

const LoginForm = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSignInPress = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);
    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });
      await setActive({ session: completeSignIn.createdSessionId });
    } catch (err) {
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center p-4">
      <Spinner visible={loading} />

      <CustomInput
        placeholder="Email"
        value={emailAddress}
        onChangeText={setEmailAddress}
        marginTop="mt-6"
        marginBottom="mb-2"
      />

      <PasswordInput
        value={password}
        placeholder="Password"
        onChangeText={setPassword}
        marginTop="mt-6"
        marginBottom="mb-5"
      />

      <CustomButton
        title="Sign In"
        onPress={onSignInPress}
        bgColor="bg-[#00AACE]"
        textColor="text-white"
        width="w-full"
        height="h-16"
        borderRadius="rounded-2xl"
        textSize="text-[20px]"
        marginTop="mt-8"
        marginBottom="mb-1"
      />
    </View>
  );
};

export default LoginForm;
