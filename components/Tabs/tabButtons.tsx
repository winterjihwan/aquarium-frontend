import React from "react";

interface TabButtonsProps {
  activeTab: string;
  handleTabClick: (tab: string) => void;
}

const TabButtons: React.FC<TabButtonsProps> = ({
  activeTab,
  handleTabClick,
}) => {
  return (
    <div className="flex border-b border-gray-200">
      <button
        className={`flex-1 py-2 text-center border-b-2 ${
          activeTab === "tab1"
            ? "border-blue-500 text-blue-500"
            : "border-transparent text-gray-500"
        }`}
        onClick={() => handleTabClick("tab1")}
      >
        A1
      </button>
      <button
        className={`flex-1 py-2 text-center border-b-2 ${
          activeTab === "tab2"
            ? "border-blue-500 text-blue-500"
            : "border-transparent text-gray-500"
        }`}
        onClick={() => handleTabClick("tab2")}
      >
        A2
      </button>
    </div>
  );
};

export default TabButtons;
