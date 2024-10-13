import React from "react";
import {
  View,
  Text,
  Image,
  ImageSourcePropType,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

interface CardProps {
  imageSource: ImageSourcePropType;
  text: string;
  cardClassName?: string;
  textClassName?: string;
  buttonLink?: string;
}

const Card: React.FC<CardProps> = ({
  imageSource,
  text,
  cardClassName = "",
  textClassName = "",
  buttonLink = "",
}) => {
  const router = useRouter();

  const handlePress = () => {
    if (buttonLink) {
      router.push(buttonLink);
    }
  };

  return (
    <View
      className={`border border-[#D0D0D0] bg-[#FBFBFB] rounded-2xl max-h-[140px] ${cardClassName}`}
    >
      <View className="flex-row items-center justify-center">
        <View className="flex-col items-center justify-center mr-5 ml-5">
          <Text
            className={`text-[#006277] font-semibold max-w-[120px] text-center mb-3 ${textClassName}`}
          >
            {text}
          </Text>

          <TouchableOpacity onPress={handlePress}>
            <View className={`bg-[#00AACE] rounded-lg px-4 py-3`}>
              <Text className="text-white text-[11px] font-semibold">
                START INTERVIEW
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <Image
          source={imageSource}
          className="max-w-[50%] h-[120px] rounded-2xl"
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

export default Card;
