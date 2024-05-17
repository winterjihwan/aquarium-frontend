import React from "react"

interface AquariumListProps {
  aquariums: string[]
  stakedPools: { [key: string]: string[] }
  initializeAquarium: () => void
}

const AquariumList: React.FC<AquariumListProps> = ({
  aquariums,
  stakedPools,
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
            <li key={index} className="p-4 m-2 bg-white rounded shadow">
              <h3 className="text-xl font-semibold">{aquarium}</h3>
              <div className="mt-4">
                <h4 className="text-lg font-medium">Staked Pools:</h4>
                {stakedPools[aquarium] ? (
                  <ul>
                    {stakedPools[aquarium].map((pool, poolIndex) => (
                      <li key={poolIndex}>{pool}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No staked pools found.</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default AquariumList
