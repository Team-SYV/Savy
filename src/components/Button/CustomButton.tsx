import React from "react";
import { TouchableOpacity, Text } from "react-native";

const CustomButton = ({
  title,
  onPress,
  bgColor,
  textColor,
  textSize,
  width,
  height,
  borderRadius,
  marginTop,
  marginBottom,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`${bgColor} ${width} ${height} ${borderRadius} ${marginTop} ${marginBottom} flex items-center justify-center`}
      activeOpacity={0.9}
    >
      <Text className={`${textColor} ${textSize} text-center`}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
