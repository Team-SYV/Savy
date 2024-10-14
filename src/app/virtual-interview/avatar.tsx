import { useAnimations, useFBX, useGLTF, useTexture } from "@react-three/drei";
import React, { useEffect, useMemo, useState } from "react";
import {
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  SRGBColorSpace,
  Vector2,
} from "three";
import * as THREE from "three";
import createAnimation from "./converter";
import { useFrame } from "@react-three/fiber";
import blinkData from "./blendDataBlink.json";
import { generateViseme } from "@/api";
import _ from "lodash";

interface AvatarProps {
  avatar_url: string;
  speak: boolean;
  setSpeak: React.Dispatch<React.SetStateAction<boolean>>;
  text: string;
  playing: boolean;
}

const Avatar = ({
  avatar_url,
  speak,
  setSpeak,
  text,
  playing,
}: AvatarProps) => {
  const gltf = useGLTF(avatar_url);
  let morphTargetDictionaryBody = null;
  let morphTargetDictionaryLowerTeeth = null;

  const [
    bodyTexture,
    eyesTexture,
    teethTexture,
    bodySpecularTexture,
    bodyRoughnessTexture,
    bodyNormalTexture,
    teethNormalTexture,
    // teethSpecularTexture,
    hairTexture,
    tshirtDiffuseTexture,
    tshirtNormalTexture,
    tshirtRoughnessTexture,
    hairAlphaTexture,
    hairNormalTexture,
    hairRoughnessTexture,
  ] = useTexture([
    ".@/assets/public/images/body.webp",
    ".@/assets/public/images/eyes.webp",
    ".@/assets/public/images/teeth_diffuse.webp",
    ".@/assets/public/images/body_specular.webp",
    ".@/assets/public/images/body_roughness.webp",
    ".@/assets/public/images/body_normal.webp",
    ".@/assets/public/images/teeth_normal.webp",
    // ".@/assets/public/images/teeth_specular.webp",
    ".@/assets/public/images/h_color.webp",
    ".@/assets/public/images/tshirt_diffuse.webp",
    ".@/assets/public/images/tshirt_normal.webp",
    ".@/assets/public/images/tshirt_roughness.webp",
    ".@/assets/public/images/h_alpha.webp",
    ".@/assets/public/images/h_normal.webp",
    ".@/assets/public/images/h_roughness.webp",
  ]);
  _.each(
    [
      bodyTexture,
      eyesTexture,
      teethTexture,
      teethNormalTexture,
      bodySpecularTexture,
      bodyRoughnessTexture,
      bodyNormalTexture,
      tshirtDiffuseTexture,
      tshirtNormalTexture,
      tshirtRoughnessTexture,
      hairAlphaTexture,
      hairNormalTexture,
      hairRoughnessTexture,
    ],
    (t: { colorSpace: string; flipY: boolean }) => {
      t.colorSpace = SRGBColorSpace;
      t.flipY = false;
    }
  );
  gltf.scene.traverse((node: any) => {
    if (
      node.type === "Mesh" ||
      node.type === "LineSegments" ||
      node.type === "SkinnedMesh"
    ) {
      node.castShadow = true;
      node.receiveShadow = true;
      node.frustumCulled = false;

      if (node.name.includes("Body")) {
        node.material = new MeshPhysicalMaterial();
        node.material.map = bodyTexture;
        node.material.roughness = 1.7;
        node.material.roughnessMap = bodyRoughnessTexture;
        node.material.normalMap = bodyNormalTexture;
        node.material.normalScale = new Vector2(0.6, 0.6);
        morphTargetDictionaryBody = node.morphTargetDictionary;
        node.material.envMapIntensity = 0.8;
      }

      if (node.name.includes("Eyes")) {
        node.material = new MeshStandardMaterial();
        node.material.map = eyesTexture;
        node.material.roughness = 0.1;
        node.material.envMapIntensity = 0.5;
      }

      if (node.name.includes("Teeth")) {
        node.material = new MeshStandardMaterial();
        node.material.map = teethTexture;
        node.material.normalMap = teethNormalTexture;
        node.material.roughness = 0.1;
        node.material.envMapIntensity = 0.7;
      }

      if (node.name.includes("Hair")) {
        node.material = new MeshStandardMaterial();
        node.material.map = hairTexture;
        node.material.alphaMap = hairAlphaTexture;
        node.material.normalMap = hairNormalTexture;
        node.material.roughnessMap = hairRoughnessTexture;
        node.material.transparent = true;
        node.material.depthWrite = false;
        node.material.side = 2;
        node.material.color.setHex(0x000000);
        node.material.envMapIntensity = 0.3;
      }

      if (node.name.includes("TSHIRT")) {
        node.material = new MeshStandardMaterial();
        node.material.map = tshirtDiffuseTexture;
        node.material.roughnessMap = tshirtRoughnessTexture;
        node.material.normalMap = tshirtNormalTexture;
        node.material.color.setHex(0xffffff);
        node.material.envMapIntensity = 0.5;
      }

      if (node.name.includes("TeethLower")) {
        morphTargetDictionaryLowerTeeth = node.morphTargetDictionary;
      }
    }
  });
  const [clips, setClips] = useState([]);
  const mixer = useMemo(() => new THREE.AnimationMixer(gltf.scene), []);

  useEffect(() => {
    if (speak === false) return;

    generateViseme(text)
      .then((response) => {
        let { blendData } = response.data;

        let newClips = [
          createAnimation(blendData, morphTargetDictionaryBody, "HG_Body"),
          createAnimation(
            blendData,
            morphTargetDictionaryLowerTeeth,
            "HG_TeethLower"
          ),
        ];

        setClips(newClips);
      })
      .catch((err) => {
        console.error(err);
        setSpeak(false);
      });
  }, [speak]);

  let idleFbx = useFBX("./idle.fbx");
  let { clips: idleClips } = useAnimations(idleFbx.animations);

  idleClips[0].tracks = _.filter(idleClips[0].tracks, (track) => {
    return (
      track.name.includes("Head") ||
      track.name.includes("Neck") ||
      track.name.includes("Spine2")
    );
  });

  idleClips[0].tracks = _.map(idleClips[0].tracks, (track) => {
    if (track.name.includes("Head")) {
      track.name = "head.quaternion";
    }

    if (track.name.includes("Neck")) {
      track.name = "neck.quaternion";
    }

    if (track.name.includes("Spine")) {
      track.name = "spine2.quaternion";
    }

    return track;
  });

  useEffect(() => {
    let idleClipAction = mixer.clipAction(idleClips[0]);
    idleClipAction.play();

    let blinkClip = createAnimation(
      blinkData,
      morphTargetDictionaryBody,
      "HG_Body"
    );
    let blinkAction = mixer.clipAction(blinkClip);
    blinkAction.play();
  }, []);

  useEffect(() => {
    if (playing === false) return;

    _.each(clips, (clip: THREE.AnimationClip) => {
      let clipAction = mixer.clipAction(clip);
      clipAction.setLoop(THREE.LoopOnce, 1);
      clipAction.play();
    });
  }, [playing]);

  useFrame((_state, delta) => {
    mixer.update(delta);
  });

  return (
    <group name="avatar">
      <primitive object={gltf.scene} dispose={null} />
    </group>
  );
};

export default Avatar;
