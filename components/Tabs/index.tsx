import React, { useState } from "react";

interface TabsProps {
  isTab2Locked: boolean;
}

const Tabs = () => {
  const [activeTab, setActiveTab] = useState("tab1");
  const [message, setMessage] = useState("");
  const [isTab2Locked, setIsTab2Locked] = useState(false);

  const handleTabClick = (tab: string) => {
    if (tab === "tab2" && isTab2Locked) {
      setMessage("Locked... need to unlock a new aquarium");
    } else {
      setActiveTab(tab);
      setMessage("");
    }
  };

  return (
    <div className="w-64 h-96 bg-white shadow">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className={`flex-1 py-2 text-center border-b-2 ${
            activeTab === "tab1"
              ? "border-blue-500 text-blue-500"
              : "border-transparent text-gray-500"
          }`}
          onClick={() => handleTabClick("tab1")}
        >
          Aquarium One
        </button>
        <button
          className={`flex-1 py-2 text-center border-b-2 ${
            activeTab === "tab2"
              ? "border-blue-500 text-blue-500"
              : "border-transparent text-gray-500"
          }`}
          onClick={() => handleTabClick("tab2")}
        >
          Aquarium Two
        </button>
      </div>
      {/* Tab Contents */}
      <div className="p-4">
        {activeTab === "tab1" && (
          <div>
            {/* Content for Tab 1 */}
            <div>Select pools you'd like to invest</div>
            <div className="mt-4 space-x-2">
              <button className="px-4 py-2">Seed1</button>
              <button className="px-4 py-2">Seed2</button>
            </div>
          </div>
        )}
        {activeTab === "tab2" && (
          <div>
            {/* Content for Tab 2 */}
            <div>Select pools you'd like to invest</div>
            <div className="mt-4 space-x-2">
              <button className="px-4 py-2">Seed1</button>
              <button className="px-4 py-2">Seed2</button>
            </div>
          </div>
        )}
        {message && <div className="text-red-500 mt-2">{message}</div>}
      </div>
    </div>
  );
};

export default Tabs;
