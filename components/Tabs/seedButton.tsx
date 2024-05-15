import React from "react";

interface SeedButtonProps {
  seed: { name: string; addresses: string[] };
  isClicked: boolean;
  handleSeedClick: () => void;
}

const SeedButton: React.FC<SeedButtonProps> = ({
  seed,
  isClicked,
  handleSeedClick,
}) => {
  return (
    <button
      className={`px-4 py-2 ${
        isClicked ? "bg-gray-500 text-white" : "bg-white"
      }`}
      onClick={handleSeedClick}
    >
      {seed.name}
    </button>
  );
};

export default SeedButton;
