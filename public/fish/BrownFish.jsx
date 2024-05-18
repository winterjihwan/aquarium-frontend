import React from "react";
import { useGLTF } from "@react-three/drei";

export function BrownFish(props) {
  const { nodes, materials } = useGLTF("/fish/fish.gltf");
  return (
    <group {...props} dispose={null}>
      <group
        name="BrownFishArmature_13"
        position={[-2.071, 4.396, 0.755]}
        rotation={[-1.175, -0.652, -0.906]}
      >
        <group name="GLTF_created_0">
          <primitive object={nodes.GLTF_created_0_rootJoint} />
          <group name="BrownFish_12" />
          <skinnedMesh
            name="Object_7"
            geometry={nodes.Object_7.geometry}
            material={materials.BrownFish}
            skeleton={nodes.Object_7.skeleton}
          />
          <skinnedMesh
            name="Object_8"
            geometry={nodes.Object_8.geometry}
            material={materials.RedPart}
            skeleton={nodes.Object_8.skeleton}
          />
        </group>
      </group>
    </group>
  );
}
