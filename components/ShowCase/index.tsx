// components/ShowCase.tsx

import React, { useEffect, useState } from "react"
import { useMe } from "@/providers/MeProvider"
import Tabs from "../Tabs"
import Header from "../Header"
import AquariumAdd from "../AquariumAdd"
import { listenToCreatorCreation } from "@/libs/creator"
import { fetchAquariums } from "@/libs/aquarium/fetchAquarium"
import AquariumList from "@/components/AquariumList"
import {
  buildAAInitializeDestinationCallData,
  buildAquariumInitializeCallData,
} from "@/libs/userOps"

const ShowCase = () => {
  const { me, isMounted, disconnect } = useMe()
  const [accounts, setAccounts] = useState<string[]>([])
  const [aquariums, setAquariums] = useState<string[]>([])

  const addAquarium = async () => {
    console.log(
      `Handle add aquarium, me: ${me?.keyId}, ${me?.pubKey!}, ${me?.account!}`
    )
    buildAAInitializeDestinationCallData(me?.keyId!, me?.pubKey!, me?.account!)
  }

  const initializeAquarium = async () => {
    if (!me?.account) return

    buildAquariumInitializeCallData(me.keyId, me.pubKey!, me.account)
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
        .then((aquariums: any) => setAquariums(aquariums))
        .catch((error: any) =>
          console.error("Error fetching aquariums:", error)
        )
    }
  }, [me?.account])

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header account={me?.account} disconnect={disconnect} />
      <div className="flex flex-1 items-center justify-between px-12">
        <Tabs />
        <div className="flex flex-col items-center">
          <AquariumList
            aquariums={aquariums}
            initializeAquarium={initializeAquarium}
          />
        </div>
        <AquariumAdd onClick={addAquarium} />
      </div>
    </div>
  )
}

export default ShowCase
