import React from "react";
import { useMe } from "@/providers/MeProvider";
import { buildAAInitializeDestinationCallData } from "@/libs/userOps";

const ShowCase = () => {
  const { me, isMounted } = useMe();

  const handleBlueAdd = async () => {
    console.log("Button clicked!");
    buildAAInitializeDestinationCallData(me?.keyId!, me?.pubKey!, me?.account!);
  };
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="w-full p-4 bg-white shadow flex items-center">
        <div className="flex items-center space-x-2">
          <span>Username</span>
          <span className="text-gray-500">{me?.account}</span>
        </div>
      </header>

      <div className="flex-1 flex items-center">
        <main className="flex-1 flex items-center ml-12">
          <div className="w-64 h-96 bg-white shadow flex items-center justify-center text-2xl">
            Incubate
          </div>
        </main>

        <div className="mr-6">
          <button
            className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg"
            onClick={handleBlueAdd}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowCase;
