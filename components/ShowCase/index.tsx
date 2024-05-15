import React, { useState } from "react";
import { useMe } from "@/providers/MeProvider";
import { buildAAInitializeDestinationCallData } from "@/libs/userOps";
import Tabs from "../Tabs";
import Header from "../Header";
import AquariumAdd from "../AquariumAdd";

const ShowCase = () => {
  const { me, isMounted, disconnect } = useMe();

  const addAquarium = async () => {
    console.log(
      `Handle Blue Add, me: ${me?.keyId}, ${me?.pubKey}, ${me?.account}`
    );
    buildAAInitializeDestinationCallData(me?.keyId!, me?.pubKey!, me?.account!);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header account={me?.account} disconnect={disconnect} />
      <div className="flex flex-1 items-center justify-between px-12">
        <Tabs />
        <AquariumAdd onClick={addAquarium} />
      </div>
    </div>
  );
};

export default ShowCase;
