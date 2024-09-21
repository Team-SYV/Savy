import React from "react";
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
  return (
    <View className={`${containerStyles}`}>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        multiline
        textAlignVertical="top"
        className={`border border-[#5D5D5D] rounded-lg text-base p-3 h-32
          ${textInputStyles}`}
      />
    </View>
  );
};

export default TextArea;
