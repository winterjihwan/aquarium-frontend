import React from "react";
import { useGLTF } from "@react-three/drei";

export function Tuna(props) {
  const { nodes, materials } = useGLTF("/fish/fish.gltf");
  return (
    <group {...props} dispose={null}>
      <group
        name="TunaArmature_33"
        position={[-1.953, 3.909, -2.514]}
        rotation={[-3.064, -0.671, -2.528]}
      >
        <group name="GLTF_created_2">
          <primitive object={nodes.GLTF_created_2_rootJoint} />
          <group name="Tuna_32" />
          <skinnedMesh
            name="Object_40"
            geometry={nodes.Object_40.geometry}
            material={materials.Fish}
            skeleton={nodes.Object_40.skeleton}
          />
          <skinnedMesh
            name="Object_41"
            geometry={nodes.Object_41.geometry}
            material={materials.FishUnderside}
            skeleton={nodes.Object_41.skeleton}
          />
        </group>
      </group>
    </group>
  );
}
