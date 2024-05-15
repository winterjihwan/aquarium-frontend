import React from "react";

interface HeaderProps {
  account?: string;
  disconnect: () => void;
}

const Header: React.FC<HeaderProps> = ({ account, disconnect }) => {
  return (
    <header className="w-full p-4 bg-white shadow flex items-center">
      <div className="flex items-center space-x-2">
        <span className="text-gray-500">{account}</span>
      </div>
      <button onClick={disconnect} className="ml-auto text-red-500">
        Disconnect
      </button>
    </header>
  );
};

export default Header;
