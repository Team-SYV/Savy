import { Message, Role } from "@/types/Chat";
import { useUser } from "@clerk/clerk-expo";
import * as Speech from "expo-speech";
import { Audio } from "expo-av";
import uuid from "react-native-uuid";
import React, { useEffect, useRef, useState } from "react";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { generateAnswerFeedback, getQuestions, transcribeAudio } from "@/api";
import Avatar from "./avatar";
import { loadGLTFAsync } from "./loader";

const VirtualInterview = () => {
  const { user } = useUser();
  const { jobId } = useLocalSearchParams();
  const flatListRef = useRef<FlatList>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [recording, setRecording] = useState<Audio.Recording | undefined>(
    undefined
  );
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // useEffect(() => {
  //   const loadAvatar = async () => {
  //     try {
  //       const result = await loadGLTFAsync({
  //         asset: "@/assets/public/model.glb", // Make sure the path is correct
  //         onAssetRequested: () => {
  //           // Placeholder for asset request handling
  //         },
  //       });

  //       if (typeof result === "string") {
  //         setAvatarUrl(result); // Ensure the result is a string before setting it
  //       } else {
  //         console.error("Expected a string URL for the avatar, got:", result);
  //       }
  //     } catch (error) {
  //       console.error("Error loading avatar:", error);
  //     }
  //   };

  //   loadAvatar();
  // }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await getQuestions(jobId);
        const allQuestions = response.map((q) =>
          q.question.replace(/^\d+\.\s*/, "")
        );
        setQuestions(allQuestions);

        // Display the first question only initially
        if (allQuestions.length > 0) {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              id: uuid.v4() as string,
              role: Role.Bot,
              content: allQuestions[0],
            },
          ]);
        }
      } catch (error) {
        Alert.alert("Error", error.message);
      }
    };
    fetchQuestions();
  }, [jobId]);

  // Scroll to the bottom whenever messages update
  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // Automatically read the bot's message when it gets added to the chat
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === Role.Bot) {
      speak(lastMessage.content);
    }
  }, [messages]);

  const speak = async (message: string) => {
    Speech.speak(message, { rate: 1.0 });
    setIsSpeaking(true);
    setTimeout(() => {
      setIsSpeaking(false);
    }, 5000);
  };

  // Request permission
  const requestPermissions = async () => {
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== "granted") {
      console.error("Microphone permission not granted");
    }
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  // Start recording
  const startRecording = async () => {
    Speech.stop();

    try {
      if (recording) {
        await stopRecording();
      }

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(newRecording);
      setIsRecording(true);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    if (!recording) return;

    await recording.stopAndUnloadAsync();

    const uri = recording.getURI();

    try {
      const file = {
        uri: uri,
        name: "recording.m4a",
        type: "audio/m4a",
      };

      // Call the API to transcribe audio
      const transcription = await transcribeAudio(file);

      // Add the user's transcription to messages
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: uuid.v4() as string, role: Role.User, content: transcription },
      ]);

      const form = new FormData();
      form.append("previous_question", questions[currentQuestionIndex]);
      form.append("previous_answer", transcription);

      // Get feedback on the user's answer
      const feedback = await generateAnswerFeedback(form);

      console.log(feedback);

      setMessages((prevMessages) => [
        ...prevMessages,
        { id: uuid.v4() as string, role: Role.Bot, content: feedback },
      ]);

      // Display the next question after the feedback
      const nextQuestionIndex = currentQuestionIndex + 1;
      if (nextQuestionIndex < questions.length) {
        setCurrentQuestionIndex(nextQuestionIndex);

        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: uuid.v4() as string,
            role: Role.Bot,
            content: questions[nextQuestionIndex],
          },
        ]);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: uuid.v4() as string,
            role: Role.Bot,
            content:
              "Your interview is complete. Thank you for your time and participation!",
          },
        ]);
        setTimeout(() => {
          router.push("(virtual-interview)/feedback");
        }, 12000);
      }
    } catch (error) {
      console.error("Failed to transcribe audio", error.message || error);
    }

    setRecording(undefined);
  };
  const renderMessage = ({ item }: { item: Message }) => (
    <View
      className={`flex-row my-2 mx-4 ${
        item.role === Role.Bot ? "justify-start" : "justify-end"
      }`}
    >
      {item.role === Role.Bot && (
        <View className="flex items-start">
          <View className="flex-row items-center mb-1">
            <Image
              source={require("@/assets/images/savy.png")}
              className="w-5 h-5 rounded-full mr-1"
            />
            <Text className="text-sm"> Savy </Text>
          </View>
          <View className="bg-[#CDF1F8] p-4 rounded-lg max-w-[315px] border border-[#ADE3ED]">
            <Text className="text-base">{item.content}</Text>
          </View>
        </View>
      )}

      {item.role === Role.User && (
        <View className="flex items-end">
          <View className="flex-row items-center mb-1">
            <Text className="text-sm"> {user.firstName} </Text>
            <Image
              source={{
                uri: user.imageUrl || "https://via.placeholder.com/150",
              }}
              className="w-5 h-5 rounded-full ml-2"
            />
          </View>
          <View className="bg-[#ecebeb] p-4 rounded-lg max-w-[315px] border border-[#D8D8D8]">
            <Text className="text-base">{item.content}</Text>
          </View>
        </View>
      )}
    </View>
  );

  const handleBackButtonPress = () => {
    setIsConfirmationVisible(true);
  };

  return (
    <View className="flex-1 justify-between bg-white">
      <Stack.Screen
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={handleBackButtonPress}>
              <Ionicons name="arrow-back" size={24} color="#2a2a2a" />
            </TouchableOpacity>
          ),
        }}
      />
      {/* <Image
        source={require("@/assets/images/avatar.png")}
        className="w-[96%] h-56 rounded-xl mx-auto mt-4 mb-2"
      /> */}

      {/* <Avatar
        avatar_url={avatarUrl}
        speak={isSpeaking}
        setSpeak={setIsSpeaking}
        text={
          messages
            .slice()
            .reverse()
            .find((msg) => msg.role === Role.Bot)?.content || ""
        }
        playing={isSpeaking}
      /> */}

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
      />
      <View className="flex-row p-2 bg-white shadow-md justify-center border-gray-300 border">
        {isRecording ? (
          <TouchableOpacity className="p-3" onPress={stopRecording}>
            <Image
              source={require("@/assets/icons/stop-mic.png")}
              className="w-14 h-14 rounded-full"
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity className="p-3" onPress={startRecording}>
            <Image
              source={require("@/assets/icons/mic.png")}
              className="w-14 h-14 rounded-full"
            />
          </TouchableOpacity>
        )}
      </View>

      <ConfirmationModal
        isVisible={isConfirmationVisible}
        title="Discard Interview?"
        message={
          <Text>
            Exiting now will discard your progress.{"\n"}
            Are you sure you want to leave?
          </Text>
        }
        onConfirm={() => {
          Speech.stop();
          setIsConfirmationVisible(false);
          router.push("/home");
        }}
        onClose={() => setIsConfirmationVisible(false)}
      />
    </View>
  );
};

export default VirtualInterview;
