import React from "react";
import { Modal, View, Text } from "react-native";
import CustomButton from "../Button/CustomButton";

interface NextModalProps {
  isVisible: boolean;
  onNext: () => void;
  onClose: () => void;
  isLastQuestion: boolean;
}

const NextModal: React.FC<NextModalProps> = ({
  isVisible,
  onNext,
  onClose,
  isLastQuestion,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/70">
        <View className="bg-white rounded-xl items-center shadow-lg px-16 py-6">
          <Text className="text-lg mb-6">
            {isLastQuestion
              ? "Get your interview results"
              : "Ready for the next question?"}
          </Text>
          <CustomButton
            title={isLastQuestion ? "Get Results" : "Next"}
            onPress={onNext}
            containerStyles={`bg-[#00AACE] h-[45px] rounded-3xl px-[82px]`}
            textStyles="text-white text-base font-semibold"
          />
        </View>
      </View>
    </Modal>
  );
};

export default NextModal;
