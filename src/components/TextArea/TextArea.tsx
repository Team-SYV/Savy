import React, { useState } from "react";
import { TextInput, View } from "react-native";

interface TextAreaProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  containerStyles?: string;
  textInputStyles?: string;
}

const TextArea: React.FC<TextAreaProps> = ({
  placeholder = "",
  value,
  onChangeText,
  containerStyles = "",
  textInputStyles = "",
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className={`${containerStyles}`}>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        multiline
        textAlignVertical="top"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`rounded-lg text-base p-3 bg-[#FBFBFB] border ${
          isFocused ? "border-[#B5B5B5]" : "border-[#DFDFDF]"
        } ${textInputStyles}`}
      />
    </View>
  );
};

export default TextArea;
