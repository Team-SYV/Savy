import React, { useState } from "react";
import { View, TextInput, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PasswordInput = ({
  value,
  onChangeText,
  placeholder = "Password",
  marginTop = "",
  marginBottom = "",
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View className={`relative ${marginTop} ${marginBottom}`}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={!isPasswordVisible}
        autoCapitalize="none"
        className="h-[58px] border border-[#5D5D5D] rounded-2xl px-5 bg-white text-base text-[#5D5D5D] placeholder:text-[#5D5D5D] focus:border-[#000000]"
      />
      <Pressable
        onPress={togglePasswordVisibility}
        className="absolute right-4 top-1/2 transform -translate-y-1/2"
      >
        <Ionicons
          name={isPasswordVisible ? "eye-off" : "eye"}
          size={24}
          color="#5D5D5D"
        />
      </Pressable>
    </View>
  );
};

export default PasswordInput;
