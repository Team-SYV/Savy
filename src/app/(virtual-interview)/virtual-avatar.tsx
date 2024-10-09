import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  useTexture,
  Loader,
  Environment,
  OrthographicCamera,
  useFBX,
  useAnimations,
} from "@react-three/drei";
import * as THREE from "three";
import ReactAudioPlayer from "react-audio-player";
import { MeshStandardMaterial, MeshPhysicalMaterial, Vector2 } from "three";
import createAnimation from "./converter";
import blinkData from "./blendDataBlink.json";
import { talk } from "@/api";

// Define props
interface VirtualAvatarProps {
  avatarUrl: string;
  initialText: string;
}

const VirtualAvatar: React.FC<VirtualAvatarProps> = ({
  avatarUrl,
  initialText,
}) => {
  const gltf = useGLTF(avatarUrl) as any;
  const [speak, setSpeak] = useState(false);
  const [text, setText] = useState(initialText);
  const [audioSource, setAudioSource] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [morphTargets, setMorphTargets] = useState<any>({});
  const audioPlayer = useRef<ReactAudioPlayer>(null);
  const host = process.env.EXPO_PUBLIC_BASE_URL

  // Set textures
  const textures = useTexture([
    "/images/body.webp",
    "/images/eyes.webp",
    "/images/teeth_diffuse.webp",
    "/images/body_specular.webp",
    "/images/body_roughness.webp",
    "/images/body_normal.webp",
    "/images/teeth_normal.webp",
    "/images/h_color.webp",
    "/images/tshirt_diffuse.webp",
    "/images/tshirt_normal.webp",
    "/images/tshirt_roughness.webp",
    "/images/h_alpha.webp",
    "/images/h_normal.webp",
    "/images/h_roughness.webp",
  ]);

  // Assign textures to correct colorspace
  const assignTextures = useCallback(() => {
    textures.forEach((texture: any) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.flipY = false;
    });
  }, [textures]);

  useEffect(() => {
    assignTextures();
  }, [assignTextures]);

  // Handle model setup
  useEffect(() => {
    let morphTargetDictionaryBody: any = null;
    let morphTargetDictionaryLowerTeeth: any = null;

    gltf.scene.traverse((node: any) => {
      if (node.type === "Mesh" || node.type === "SkinnedMesh") {
        node.castShadow = true;
        node.receiveShadow = true;

        if (node.name.includes("Body")) {
          node.material = new MeshPhysicalMaterial({
            map: textures[0],
            roughnessMap: textures[4],
            normalMap: textures[5],
          });
          morphTargetDictionaryBody = node.morphTargetDictionary;
        }
        if (node.name.includes("Teeth")) {
          node.material = new MeshStandardMaterial({
            map: textures[2],
            normalMap: textures[6],
          });
          morphTargetDictionaryLowerTeeth = node.morphTargetDictionary;
        }
        // Handle other material setups...
      }
    });

    setMorphTargets({
      morphTargetDictionaryBody,
      morphTargetDictionaryLowerTeeth,
    });
  }, [gltf, textures]);

  const mixer = useMemo(
    () => new THREE.AnimationMixer(gltf.scene),
    [gltf.scene]
  );
  const { clips: idleClips } = useAnimations(useFBX("/idle.fbx").animations);

  // Play idle and blink animations
  useEffect(() => {
    const idleClipAction = mixer.clipAction(idleClips[0]);
    idleClipAction.play();

    const blinkClip = createAnimation(
      blinkData,
      morphTargets.morphTargetDictionaryBody,
      "HG_Body"
    );
    const blinkAction = mixer.clipAction(blinkClip);
    blinkAction.play();
  }, [idleClips, mixer, morphTargets]);

  // Handle speech
  const handleSpeech = useCallback(async () => {
    try {
      const response = await talk(text);
      const { blendData, filename } = response.data;

      const newClips = [
        createAnimation(
          blendData,
          morphTargets.morphTargetDictionaryBody,
          "HG_Body"
        ),
        createAnimation(
          blendData,
          morphTargets.morphTargetDictionaryLowerTeeth,
          "HG_TeethLower"
        ),
      ];
      setAudioSource(host + filename);
      newClips.forEach((clip) => {
        const clipAction = mixer.clipAction(clip);
        clipAction.setLoop(THREE.LoopOnce, 1);
        clipAction.play();
      });
    } catch (error) {
      console.error("Speech generation failed:", error);
    }
  }, [mixer, morphTargets, text]);

  useEffect(() => {
    if (speak) {
      handleSpeech();
    }
  }, [speak, handleSpeech]);

  useFrame((_, delta) => mixer.update(delta));

  // Event handlers
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setText(e.target.value);

  const handlePlay = () => {
    audioPlayer.current?.audioEl.current?.play();
    setPlaying(true);
  };

  const handleAudioEnd = () => {
    setAudioSource(null);
    setSpeak(false);
    setPlaying(false);
  };

  return (
    <div className="virtual-avatar">
      <div className="input-area">
        <textarea value={text} onChange={handleTextChange} />
        <button onClick={() => setSpeak(true)}>Speak</button>
      </div>

      <Canvas shadows flat linear>
        <OrthographicCamera makeDefault zoom={60} position={[0, 1.65, 3]} />
        <Environment files="/envmap.hdr" />
        <primitive object={gltf.scene} dispose={null} />
      </Canvas>

      {audioSource && (
        <ReactAudioPlayer
          ref={audioPlayer}
          src={audioSource}
          onEnded={handleAudioEnd}
          onCanPlayThrough={handlePlay}
        />
      )}

      <Loader />
    </div>
  );
};

export default VirtualAvatar;
