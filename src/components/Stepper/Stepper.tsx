import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface StepperProps {
  isActive: boolean;
  onStepPress: (step: number) => void;
  index: number;
  isCompleted: boolean;
  section: SectionProps;
  isLastStep: boolean;
}

interface SectionProps {
  title: string;
}

interface FieldTitleProps {
  title: string;
}

const Stepper = ({
  isActive,
  onStepPress,
  section,
  index,
  isCompleted,
  isLastStep,
}: StepperProps) => {
  return (
    <View className="flex-row items-center">
      <View className="flex items-center">
        <TouchableOpacity
          onPress={() => onStepPress(index)}
          className={`w-9 h-9 rounded-full flex items-center justify-center ${
            isCompleted
              ? "bg-[#00AACE]"
              : `border-2 ${isActive ? "border-[#00AACE]" : "border-gray-300"}`
          }`}
        >
          {isCompleted && (
            <MaterialIcons name="check" size={20} color="white" />
          )}
        </TouchableOpacity>

        {!isLastStep && (
          <View
            className={`w-0.5 flex-1 min-h-16 ${
              isCompleted ? "bg-[#00AACE]" : "bg-gray-300"
            }`}
          />
        )}
      </View>

      <TouchableOpacity
        activeOpacity={1}
        onPress={() => onStepPress(index)}
        className={` ${!isLastStep ? "ml-4 mb-16" : "ml-4"}`}
      >
        <FieldTitle title={section.title} />
      </TouchableOpacity>
    </View>
  );
};

const FieldTitle = ({ title }: FieldTitleProps) => {
  return <Text className="text-base text-gray-800">{title}</Text>;
};

export default Stepper;
