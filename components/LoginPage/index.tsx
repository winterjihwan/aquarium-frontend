"use client";
import { useMe } from "@/providers/MeProvider";
import React, { useState } from "react";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const { create, get, returning, isLoading } = useMe();
  const [createForm, setCreateForm] = useState(!returning);

  return (
    <div className="flex flex-col items-center justify-between w-full relative gap-8">
      {!isLoading && (
        <form
          className="flex flex-col items-center w-full gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (createForm) {
              username && create(username);
            } else {
              get();
            }
          }}
        >
          {createForm && (
            <div className="flex gap-2 w-64">
              <input
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Wallet name"
                disabled={isLoading}
                className="p-2 border rounded w-full"
              />
              <button
                className="w-28 text-center border rounded p-2"
                type="submit"
              >
                CREATE
              </button>
            </div>
          )}
          {!createForm && (
            <button className="w-64 border rounded p-2" type="submit">
              LOG IN
            </button>
          )}
        </form>
      )}

      <div className="flex w-full justify-end whitespace-nowrap">
        {!createForm && !isLoading && (
          <button
            onClick={() => !isLoading && setCreateForm(true)}
            className="text-sm text-blue-500 underline"
          >
            or create a new wallet
          </button>
        )}
        {createForm && !isLoading && (
          <button
            onClick={() => !isLoading && setCreateForm(false)}
            className="text-sm text-blue-500 underline"
          >
            or log in with an existing passkey
          </button>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
