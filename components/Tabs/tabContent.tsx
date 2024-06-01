import React from "react"
import SeedButton from "./seedButton"

interface TabContentProps {
  seeds: { name: string; addresses: string[] }[]
  activeTab: string
  clickedSeeds: string[]
  handleSeedClick: (seed: string) => void
}

const TabContent: React.FC<TabContentProps> = ({ seeds, activeTab, clickedSeeds, handleSeedClick }) => {
  return (
    <div>
      <div>Select fish you would like to incubate</div>
      <div className="mt-4 space-x-2">
        {seeds.map((seed) => (
          <SeedButton
            key={seed.addresses[0]}
            seed={seed}
            isClicked={clickedSeeds.includes(`${seed.name}_${activeTab}`)}
            handleSeedClick={() => handleSeedClick(`${seed.name}_${activeTab}`)}
          />
        ))}
      </div>
    </div>
  )
}

export default TabContent
