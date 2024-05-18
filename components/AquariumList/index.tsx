import React, { Suspense, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { Aq } from "../../public/aquarium_v4/aq"
import { Dory } from "../../public/fish/Dory"
import { ClownFish } from "../../public/fish/ClownFish"

interface AquariumListProps {
  aquariums: string[]
  stakedPools: { [key: string]: string[] }
  initializeAquarium: () => void
}

const getRandomPosition = (range: number) => [
  (Math.random() - 0.5) * range,
  (Math.random() - 0.5) * range,
  (Math.random() - 0.5) * range,
]

const AquariumList: React.FC<AquariumListProps> = ({ aquariums, stakedPools, initializeAquarium }) => {
  const [currentAquariumIndex, setCurrentAquariumIndex] = useState(0)

  const nextAquarium = () => {
    setCurrentAquariumIndex((prevIndex) => (prevIndex + 1) % aquariums.length)
  }

  const prevAquarium = () => {
    setCurrentAquariumIndex((prevIndex) => (prevIndex === 0 ? aquariums.length - 1 : prevIndex - 1))
  }

  return (
    <div className="w-full h-full p-4 flex flex-col">
      {aquariums.length === 0 ? (
        <button onClick={initializeAquarium} className="btn btn-primary">
          Initialize Aquarium
        </button>
      ) : (
        <div className="w-full h-full flex flex-col items-center">
          <div className="w-full flex justify-end mb-4 space-x-4">
            <div className="relative group">
              <button
                onClick={prevAquarium}
                className={`btn ${aquariums.length === 1 ? " text-gray-400 cursor-default" : "btn-primary"}`}
                disabled={aquariums.length === 1}
              >
                Prev
              </button>
              {aquariums.length === 1 && (
                <div className="absolute bottom-full mb-2 hidden group-hover:block p-2 bg-gray-700 text-white text-xs rounded">
                  Only 1 aquarium
                </div>
              )}
            </div>
            <div className="relative group">
              <button
                onClick={nextAquarium}
                className={`btn ${aquariums.length === 1 ? " text-gray-400 cursor-default" : "btn-primary"}`}
                disabled={aquariums.length === 1}
              >
                Next
              </button>
              {aquariums.length === 1 && (
                <div className="absolute bottom-full mb-2 hidden group-hover:block p-2 bg-gray-700 text-white text-xs rounded">
                  Only 1 aquarium
                </div>
              )}
            </div>
          </div>
          <div className="w-full h-full flex-grow">
            {aquariums.map(
              (aquarium, index) =>
                index === currentAquariumIndex && (
                  <div key={index} style={{ height: "75vh" }}>
                    <Canvas camera={{ position: [0, 0, 500], fov: 50, far: 20000 }}>
                      <ambientLight intensity={5} />
                      <pointLight position={[10, 10, 10]} />
                      <OrbitControls enableZoom={false} />
                      <Suspense fallback={null}>
                        <Aq />
                        {stakedPools[aquarium]?.map((pool, poolIndex) => {
                          const position = getRandomPosition(20)
                          return index === 0 ? (
                            <ClownFish key={poolIndex} position={position} scale={20} />
                          ) : (
                            <Dory key={poolIndex} position={position} scale={20} />
                          )
                        })}
                      </Suspense>
                    </Canvas>
                  </div>
                )
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AquariumList
