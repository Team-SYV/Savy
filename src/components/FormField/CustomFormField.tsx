import React, { useState } from "react";
import {
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CustomInputProps extends TextInputProps {
  title: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  otherStyles?: string;
}

const CustomFormField: React.FC<CustomInputProps> = ({
  title,
  value,
  placeholder,
  onChangeText,
  otherStyles,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = title === "Password" || title === "ConfirmPassword";

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <View className="relative w-full h-[55px] px-1 rounded-2xl border border-[#5D5D5D] flex flex-row items-center">
        <TextInput
          key={
            isPasswordField ? (showPassword ? "text" : "password") : undefined
          }
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isPasswordField && !showPassword}
          className="flex-1 px-2 bg-white text-base text-[#5D5D5D] placeholder:text-[#5D5D5D]"
          {...props}
        />

        {isPasswordField && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="absolute right-4"
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={24}
              color="#5D5D5D"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CustomFormField;
