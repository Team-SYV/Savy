import React from "react";
import { TextInput } from "react-native";

interface CustomInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  marginTop?: string;
  marginBottom?: string;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
}

const CustomInput: React.FC<CustomInputProps> = ({
  placeholder,
  value,
  onChangeText,
  marginTop = "",
  marginBottom = "",
  keyboardType = "default",
}) => {
  return (
    <TextInput
      autoCapitalize="none"
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      className={`h-[58px] border border-[#5D5D5D] rounded-2xl px-5 bg-white text-base text-[#5D5D5D] placeholder:text-[#5D5D5D] focus:border-[#000000] ${marginTop} ${marginBottom}`}
    />
  );
};

export default CustomInput;
