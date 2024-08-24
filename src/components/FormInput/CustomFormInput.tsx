import React from "react";
import { TextInput } from "react-native";

const CustomInput = ({
  placeholder,
  value,
  onChangeText,
  marginTop,
  marginBottom,
}) => {
  return (
    <TextInput
      autoCapitalize="none"
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      className={`h-[58px] border border-[#5D5D5D] rounded-2xl px-5 bg-white text-base text-[#5D5D5D] placeholder:text-[#5D5D5D] focus:border-[#000000] ${marginTop} ${marginBottom}`}
    />
  );
};

export default CustomInput;
