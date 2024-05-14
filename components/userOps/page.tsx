"use client";
import React, { useState } from "react";
import { UserOpSig } from "../../libs/userOps/signature";
import { encodePacked } from "viem";

const userOpSig = new UserOpSig();

const getSig = async (userOpHash, keyId) => {
  try {
    const msgToSign = encodePacked(
      ["uint8", "uint48", "bytes32"],
      [1, 0, userOpHash]
    );
    const signature = await userOpSig.getSignature(msgToSign, keyId);
    return signature;
  } catch (error) {
    console.error("Error getting signature:", error);
    return null;
  }
};

const UserOpInit = () => {
  const [userOpHash, setUserOpHash] = useState("");
  const [keyId, setKeyId] = useState("");
  const [signature, setSignature] = useState("");

  const handleGenerateSignature = async () => {
    if (userOpHash && keyId) {
      const sig = await getSig(userOpHash, keyId);
      setSignature(sig!);
    } else {
      alert("Please provide both userOpHash and keyId.");
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">UserOpInit</h1>
      <input
        type="text"
        placeholder="Enter userOpHash"
        value={userOpHash}
        onChange={(e) => setUserOpHash(e.target.value)}
        className="border p-2 mb-2 w-full max-w-md"
      />
      <input
        type="text"
        placeholder="Enter keyId"
        value={keyId}
        onChange={(e) => setKeyId(e.target.value)}
        className="border p-2 mb-2 w-full max-w-md"
      />
      <button
        onClick={handleGenerateSignature}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
      >
        Generate Signature
      </button>
      {signature && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Signature:</h2>
          <p className="break-all">{signature}</p>
        </div>
      )}
    </div>
  );
};

export default UserOpInit;
