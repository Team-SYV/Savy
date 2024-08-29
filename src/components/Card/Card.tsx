import React from "react";
import { View, Text, Image, ImageSourcePropType } from "react-native";

interface CardProps {
  imageSource: ImageSourcePropType;
  text: string;
  cardClassName?: string;
}

const Card: React.FC<CardProps> = ({
  imageSource,
  text,
  cardClassName = "",
}) => {
  return (
    <View
      className={`border border-gray-200 w-[188px] h-[160x] rounded-3xl ${cardClassName}`}
    >
      <Image source={imageSource} className="w-full h-[110] rounded-t-3xl" />
      <Text className="text-sm text-center my-5 font-semibold text-[#00748C]">
        {text}
      </Text>
    </View>
  );
};

export default Card;
