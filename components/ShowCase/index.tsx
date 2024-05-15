import React, { useEffect, useState } from "react"
import { useMe } from "@/providers/MeProvider"
import { buildAAInitializeDestinationCallData } from "@/libs/userOps"
import Tabs from "../Tabs"
import Header from "../Header"
import AquariumAdd from "../AquariumAdd"
import { listenToCreatorCreation } from "@/libs/creator"

const ShowCase = () => {
  const { me, isMounted, disconnect } = useMe()
  const [accounts, setAccounts] = useState<string[]>([])
  const [aquariums, setAquariums] = useState<string[]>([]) // Ensure aquariums is initialized as an empty array

  const addAquarium = async () => {
    console.log(
      `Handle Blue Add, me: ${me?.keyId}, ${me?.pubKey}, ${me?.account}`
    )
    buildAAInitializeDestinationCallData(me?.keyId!, me?.pubKey!, me?.account!)
  }

  const fetchAquariums = async (address: string) => {
    if (!address) return

    try {
      const response = await fetch(
        `/api/aquarium/getAquariums?contractAddress=${address}`,
        {
          method: "GET",
        }
      )
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      const data = await response.json()
      setAquariums(data.aquariums || []) // Ensure data.aquariums is an array
    } catch (error) {
      console.error("Error fetching aquariums:", error)
      setAquariums([]) // Set aquariums to an empty array in case of error
    }
  }

  useEffect(() => {
    const handleCreatedAccount = (account: string) => {
      setAccounts((prevAccounts) => [...prevAccounts, account])
      console.log(`New account created: ${account}`)
    }

    listenToCreatorCreation()
  }, [])

  useEffect(() => {
    if (me?.account) {
      fetchAquariums(me.account)
    }
  }, [me?.account])

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header account={me?.account} disconnect={disconnect} />
      <div className="flex flex-1 items-center justify-between px-12">
        <Tabs />
        <div className="flex flex-col items-center">
          <input
            type="text"
            placeholder="Enter contract address"
            value={me?.account || ""}
            className="mb-4 p-2 border border-gray-300 rounded"
            disabled
          />
          {aquariums.length > 0 ? (
            <div className="aquarium-list">
              {aquariums.map((aquarium, index) => (
                <div key={index} className="aquarium-item">
                  {aquarium}
                </div>
              ))}
            </div>
          ) : (
            <div>No aquariums found</div>
          )}
        </div>
        <AquariumAdd onClick={addAquarium} />
      </div>
    </div>
  )
}

export default ShowCase
