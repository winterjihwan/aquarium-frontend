import React from "react";

interface AquariumAddProps {
  onClick: () => void;
}

const AquariumAdd: React.FC<AquariumAddProps> = ({ onClick }) => {
  return (
    <button
      className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg"
      onClick={onClick}
    >
      +
    </button>
  );
};

export default AquariumAdd;
