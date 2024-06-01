import React, { useEffect, useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { useAnimations, useGLTF } from "@react-three/drei"
import * as THREE from "three"

export default function Dory(props) {
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
      <group name="DoryArmature_47" position={[-2.523, 2.693, 3.813]} rotation={[0.697, 0.18, 0.206]}>
        <group name="GLTF_created_3">
          <primitive object={nodes.GLTF_created_3_rootJoint} />
          <group name="Plane_46" />
          <skinnedMesh
            name="Object_54"
            geometry={nodes.Object_54.geometry}
            material={materials.DoryBlue}
            skeleton={nodes.Object_54.skeleton}
          />
          <skinnedMesh
            name="Object_55"
            geometry={nodes.Object_55.geometry}
            material={materials.DoryYellow}
            skeleton={nodes.Object_55.skeleton}
          />
          <skinnedMesh
            name="Object_56"
            geometry={nodes.Object_56.geometry}
            material={materials.DoryBlack}
            skeleton={nodes.Object_56.skeleton}
          />
        </group>
      </group>
    </group>
  )
}
