import CustomButton from "@/components/Button/CustomButton";
import Stepper from "@/components/Stepper/Stepper";
import React, { useState } from "react";
import { View, SafeAreaView, ScrollView } from "react-native";

const RecordYourself = () => {
  const steps = [
    { title: "Industry", placeholder: "Job Position" },
    { title: "Job Position", placeholder: "Job Position" },
    { title: "Job Position", placeholder: "Job Position" },
    { title: "Job Position", placeholder: "Job Position" },
    { title: "Job Position", placeholder: "Job Position" },
    { title: "Job Position", placeholder: "Job Position" },
  ];

  const [activeStep, setActiveStep] = useState(0);

  const handleStepPress = (index: number) => {
    setActiveStep(index);
  };

  const handleNextStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  return (
    <SafeAreaView className="flex-1 p-5">
      <ScrollView className="flex-grow mt-12">
        {steps.map((step, index) => (
          <View key={index}>
            <Stepper
              isActive={index === activeStep}
              isCompleted={index < activeStep}
              onStepPress={handleStepPress}
              section={step}
              index={index}
              isLastStep={index === steps.length - 1}
            />
          </View>
        ))}
      </ScrollView>

      <View className="absolute bottom-1 left-0 right-0 flex-row flex items-center justify-center px-6">
        <CustomButton
          title="Prev"
          onPress={handlePrevStep}
          containerStyles={`border border-[#00AACE] h-14 rounded-xl mb-4 mx-2 w-1/2`}
          textStyles="text-[#00AACE] text-[16px] font-semibold"
          disabled={activeStep === 0}
        />

        <CustomButton
          title={activeStep === steps.length - 1 ? "Finish" : "Next"}
          onPress={handleNextStep}
          containerStyles={`bg-[#00AACE] h-14 rounded-xl mb-4 w-1/2 mx-2`}
          textStyles="text-white text-[16px] font-semibold"
          disabled={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default RecordYourself;
