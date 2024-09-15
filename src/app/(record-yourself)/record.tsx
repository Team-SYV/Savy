import React, { useEffect, useState, useRef } from "react";
import { Camera, CameraView } from "expo-camera";
import { Stack } from "expo-router";
import { Video, ResizeMode } from "expo-av";
import NextModal from "@/components/Modal/NextModal";
import LoadingSpinner from "@/components/Loading/LoadingSpinner";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";

const Record: React.FC = () => {
  const cameraRef = useRef(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState(60);
  const [recordedVideos, setRecordedVideos] = useState<string[]>([]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [allQuestionsRecorded, setAllQuestionsRecorded] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Request Camera and Microphone Permissions
  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | null
  >(null);
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const microphonePermission =
        await Camera.requestMicrophonePermissionsAsync();

      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMicrophonePermission(microphonePermission.status === "granted");
    })();
  }, []);

  // Countdown timer which is decrementing every second while recording is active.
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording && recordingTime > 0) {
      timer = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev <= 1) {
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timer);
      if (!isRecording) {
        setRecordingTime(60);
      }
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  // Check if permission has been granted
  if (hasCameraPermission === null || hasMicrophonePermission === null) {
    return <LoadingSpinner />;
  } else if (!hasCameraPermission) {
    return (
      <Text className="text-center">Permission for camera not granted.</Text>
    );
  } else if (!hasMicrophonePermission) {
    return (
      <Text className="text-center">
        Permission for microphone not granted.
      </Text>
    );
  }

  // Record a video
  const recordVideo = async () => {
    if (cameraRef.current) {
      setIsRecording(true);
      setRecordingTime(60);

      try {
        const recordedVideo = await cameraRef.current.recordAsync();
        setRecordedVideos((prev) => [...prev, recordedVideo.uri]);
        setIsModalVisible(true);
      } catch (error) {
        console.error("Error recording video:", error);
      } finally {
        setIsRecording(false);
      }
    } else {
      console.error("Camera reference is null or undefined.");
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (cameraRef.current) {
      setIsRecording(false);
      cameraRef.current.stopRecording();
      setIsModalVisible(true);
    }
  };

  // Sample Questions
  const questions = [
    "Tell me about yourself.",
    "What are your greatest strengths?",
    "How do you prioritize your tasks?",
    "Why should we hire you?",
    "Describe a challenging situation you faced at work and how you handled it.",
  ];

  // Going to next question
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setIsModalVisible(false);
    } else {
      setAllQuestionsRecorded(true);
      setIsModalVisible(false);
      console.log("Recorded-videos:", recordedVideos);
    }
  };

  // Format for countdown timer
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  // Sample function to show the recorded videos
  const renderVideoItem = ({ item }: { item: string }) => (
    <View className="pb-12">
      <Video
        source={{ uri: item }}
        style={styles.video}
        useNativeControls
        isLooping={false}
        resizeMode={ResizeMode.CONTAIN}
      />
    </View>
  );

  return (
    <View className="flex-1 justify-center">
      <Stack.Screen options={{ headerShown: false }} />
      {allQuestionsRecorded ? (
        <FlatList
          data={recordedVideos}
          keyExtractor={(item) => item}
          renderItem={renderVideoItem}
          className="p-4"
        />
      ) : (
        <CameraView
          mode="video"
          style={styles.camera}
          facing="front"
          ref={cameraRef}
        >
          <View className="absolute bottom-10 left-0 right-0 items-center mx-2">
            <Text
              className={`text-center mb-4 px-4 py-4 rounded-xl ${
                isRecording
                  ? "text-red-600 font-medium text-2xl"
                  : "bg-black/80 text-white text-lg font-light"
              }`}
            >
              {isRecording
                ? formatTime(recordingTime)
                : `${currentQuestionIndex + 1}. ${
                    questions[currentQuestionIndex] || ""
                  }`}
            </Text>

            <TouchableOpacity
              onPress={isRecording ? stopRecording : recordVideo}
            >
              <Image
                source={
                  isRecording
                    ? require("@/assets/icons/stop.png")
                    : require("@/assets/icons/record.png")
                }
                className="w-24 h-24"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </CameraView>
      )}

      <NextModal
        isVisible={isModalVisible}
        onNext={handleNext}
        onClose={() => setIsModalVisible(false)}
        isLastQuestion={currentQuestionIndex === questions.length - 1}
      />
    </View>
  );
};

export default Record;

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  video: {
    width: "100%",
    height: 700,
  },
});
