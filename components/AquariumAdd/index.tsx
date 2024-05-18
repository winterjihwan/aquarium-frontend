import React from "react"

interface AquariumAddProps {
  onClick: () => void
  aquariums: string[]
}

const AquariumAdd: React.FC<AquariumAddProps> = ({ onClick, aquariums }) => {
  const isDisabled = aquariums.length >= 2

  return (
    <button
      className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
        isDisabled ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 text-white"
      }`}
      onClick={!isDisabled ? onClick : undefined}
      disabled={isDisabled}
    >
      +
    </button>
  )
}

export default AquariumAdd
