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
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      onPress={!disabled ? onPress : null}
      className={`${bgColor} ${width} ${height} ${borderRadius} ${marginTop} ${marginBottom} flex items-center justify-center`}
      activeOpacity={0.9}
      style={{ opacity: disabled ? 0.8 : 1 }}
      disabled={disabled}
    >
      <Text className={`${textColor} ${textSize} text-center`}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
