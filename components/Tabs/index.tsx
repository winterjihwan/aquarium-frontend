import React, { useState } from "react"
import TabContent from "./tabContent"
import SelectedSeeds from "./selectedSeeds"
import TabButtons from "./tabButtons"
import { seeds } from "./seeds" // Import the seeds data

interface TabsProps {
  isTab2Locked: boolean
}

const Tabs: React.FC<TabsProps> = ({ isTab2Locked }) => {
  const [activeTab, setActiveTab] = useState("tab1")
  const [message, setMessage] = useState("")
  const [clickedSeeds, setClickedSeeds] = useState<string[]>([])

  const handleTabClick = (tab: string) => {
    if (tab === "tab2" && isTab2Locked) {
      setMessage("Locked... need to unlock a new aquarium")
    } else {
      setActiveTab(tab)
      setMessage("")
    }
  }

  const handleSeedClick = (seed: string) => {
    const [name, tab] = seed.split("_tab")
    const tabSeeds = clickedSeeds.filter((s) => !s.includes(`_tab${tab}`))

    if (clickedSeeds.includes(seed)) {
      setClickedSeeds(tabSeeds)
    } else {
      setClickedSeeds([...tabSeeds, seed])
    }
  }

  return (
    <div>
      <div className="w-64 h-96 bg-white shadow">
        <TabButtons activeTab={activeTab} handleTabClick={handleTabClick} />

        <div className="p-4">
          {activeTab === "tab1" && (
            <TabContent
              seeds={seeds.tab1}
              activeTab={activeTab}
              clickedSeeds={clickedSeeds}
              handleSeedClick={handleSeedClick}
            />
          )}
          {activeTab === "tab2" && (
            <TabContent
              seeds={seeds.tab2}
              activeTab={activeTab}
              clickedSeeds={clickedSeeds}
              handleSeedClick={handleSeedClick}
            />
          )}
          {message && <div className="text-red-500 mt-2">{message}</div>}
        </div>
      </div>

      <SelectedSeeds clickedSeeds={clickedSeeds} seeds={seeds} />
    </div>
  )
}

export default Tabs
