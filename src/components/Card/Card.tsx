import React from "react";
import {
  View,
  Text,
  Image,
  ImageSourcePropType,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { createInterview } from "@/api";
import { useUser } from "@clerk/clerk-expo";

interface CardProps {
  imageSource: ImageSourcePropType;
  text: string;
  cardClassName?: string;
  textClassName?: string;
}

const Card: React.FC<CardProps> = ({
  imageSource,
  text,
  cardClassName = "",
  textClassName = "",
}) => {
  const router = useRouter();
  const user = useUser();

  const handlePress = async () => {
    try {
      const interviewType = text.includes("Record Yourself")
        ? "record"
        : "virtual";
      const interviewData = {
        user_id: user.user?.id,
        type: interviewType,
      };
      const interviewId = await createInterview(interviewData);

      if (interviewType === "record") {
        router.push(
          `/record-yourself/job-information?interviewId=${interviewId}`
        );
      } else {
        router.push(
          `/virtual-interview/job-information?interviewId=${interviewId}`
        );
      }
    } catch (error) {
      console.error("Failed to create interview:", error);
    }
  };

  return (
    <View
      className={`border border-[#D0D0D0] bg-[#FBFBFB] rounded-2xl max-h-[140px] ${cardClassName}`}
    >
      <View className="flex-row items-center justify-center">
        <View className="flex-col items-center justify-center mr-5 ml-5">
          <Text
            className={`text-[#006277] font-bold max-w-[120px] text-center mb-3 text-[13px] ${textClassName}`}
          >
            {text}
          </Text>

          <TouchableOpacity onPress={handlePress}>
            <View className={`bg-[#00AACE] rounded-lg px-4 py-3`}>
              <Text className="text-white text-[9px] font-semibold">
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
