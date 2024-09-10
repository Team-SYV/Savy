import { CameraView, useCameraPermissions } from "expo-camera";
import { useState, useRef } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { Audio } from "expo-av";
import { Stack } from "expo-router";

const Record = () => {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [audioPermission, requestAudioPermission] = Audio.usePermissions();
  
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [playbackUri, setPlaybackUri] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);

  const cameraRef = useRef(null);

  if (!cameraPermission) {
    return <View />;
  }

  if (!cameraPermission.granted) {
    return (
      <View>
        <Text>We need your permission to show the camera</Text>
        <Button onPress={requestCameraPermission} title="Grant Permission" />
      </View>
    );
  }

  async function startRecording() {
    try {
      if (audioPermission.status !== "granted") {
        console.log("Requesting permission..");
        await requestAudioPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      if (cameraRef.current) {
        console.log("Starting recording..");
        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        setRecording(recording);
        console.log("Recording started");
      }
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    console.log("Stopping recording..");
    if (recording) {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setPlaybackUri(uri);
      setRecording(null);
      setPlaying(false);
      console.log("Recording stopped and stored at", uri);
    }
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
  }

  async function playRecording() {
    if (playbackUri) {
      setPlaying(true);
      const { sound } = await Audio.Sound.createAsync({ uri: playbackUri });
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && !status.isPlaying) {
          setPlaying(false);
        }
      });
    }
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <CameraView
        style={styles.camera}
        facing="front" // Adjust to your preferred camera type
        ref={cameraRef}
      >
        <View style={styles.controls}>
          <TouchableOpacity
            onPress={recording ? stopRecording : startRecording}
          >
            <Image
              source={
                recording
                  ? require("@/assets/icons/stop.png")
                  : require("@/assets/icons/record.png")
              }
              style={styles.icon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          {playbackUri && !playing && (
            <TouchableOpacity onPress={playRecording}>
              <Text style={styles.playButton}>Play Recording</Text>
            </TouchableOpacity>
          )}
        </View>
      </CameraView>
    </View>
  );
};

export default Record;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  controls: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    marginHorizontal: 16,
    alignItems: "center",
  },
  icon: {
    width: 96,
    height: 96,
  },
  playButton: {
    fontSize: 20,
    color: "blue",
    marginTop: 10,
  },
});
