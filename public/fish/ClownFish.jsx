import React, { useEffect, useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { useAnimations, useGLTF } from "@react-three/drei"
import * as THREE from "three"

export function ClownFish(props) {
  const group = useRef()
  const { nodes, materials, animations } = useGLTF("/fish/fish.gltf")
  const { actions } = useAnimations(animations, group)

  const [direction, setDirection] = useState(1)
  const [position, setPosition] = useState(0)
  const [rotationY, setRotationY] = useState(Math.PI)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    if (actions.FishSwimming) {
      actions.FishSwimming.play()
    }
  }, [actions])

  useFrame(() => {
    if (position > 200) {
      setDirection(-1)
      setRotationY(0)
      setPosition(0)
    } else if (position < -200) {
      setDirection(1)
      setRotationY(Math.PI)
      setPosition(0)
    }
    const newPosition = position + direction * 0.2
    setPosition(newPosition)
    if (group.current) {
      group.current.position.z = newPosition
      group.current.rotation.y = rotationY
    }
  })

  const handleClick = () => {
    console.log("Hi")
  }

  return (
    <group
      ref={group}
      {...props}
      dispose={null}
      onPointerOver={(e) => {
        setHovered(true)
        document.body.style.cursor = "pointer"
      }}
      onPointerOut={(e) => {
        setHovered(false)
        document.body.style.cursor = "auto"
      }}
      onClick={handleClick}
    >
      <group
        name="ClownFishArmature_23"
        position={[-0.06, 1.876, 0.925]}
        rotation={[0.194, -0.464, 0.083]}
      >
        <group name="GLTF_created_1">
          <primitive object={nodes.GLTF_created_1_rootJoint} />
          <group name="ClownFish_22" />
          <skinnedMesh
            name="Object_25"
            geometry={nodes.Object_25.geometry}
            material={materials.ClownFishOrange}
            skeleton={nodes.Object_25.skeleton}
          />
          <skinnedMesh
            name="Object_26"
            geometry={nodes.Object_26.geometry}
            material={materials.ClownFishWhite}
            skeleton={nodes.Object_26.skeleton}
          />
          <skinnedMesh
            name="Object_27"
            geometry={nodes.Object_27.geometry}
            material={materials.ClownFishBlack}
            skeleton={nodes.Object_27.skeleton}
          />
        </group>
      </group>
    </group>
  )
}
useGLTF.preload("/fish/fish.gltf")
