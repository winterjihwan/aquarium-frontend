// components/AquariumList.tsx

import React from "react"

interface AquariumListProps {
  aquariums: string[]
  initializeAquarium: () => void
}

const AquariumList: React.FC<AquariumListProps> = ({
  aquariums,
  initializeAquarium,
}) => {
  return (
    <div>
      {aquariums.length === 0 ? (
        <button onClick={initializeAquarium} className="btn btn-primary">
          Initialize Aquarium
        </button>
      ) : (
        <ul>
          {aquariums.map((aquarium, index) => (
            <li key={index}>{aquarium}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default AquariumList
