import React, { useState, useCallback, useEffect } from "react"
import { useMe } from "@/providers/MeProvider"
import Tabs from "../Tabs"
import Header from "../Header"
import AquariumAdd from "../AquariumAdd"
import AquariumList from "@/components/AquariumList"
import { buildAAInitializeDestinationCallData, buildAquariumInitializeCallData } from "@/libs/userOps"
import { useAquariums, useStakedPools } from "@/hooks/useAquarium"
import { listenToCreatorCreation } from "@/libs/creator"

const ShowCase = () => {
  const { me, isMounted, disconnect } = useMe()
  const [accounts, setAccounts] = useState<string[]>([])
  const [createdAccount, setCreatedAccount] = useState<string | null>(null)
  const [isTab2Locked, setIsTab2Locked] = useState(true)

  const handleAccountCreated = useCallback((account: string) => {
    setAccounts((prevAccounts) => [...prevAccounts, account])
    console.log(`New account created: ${account}`)
  }, [])

  useEffect(() => {
    listenToCreatorCreation(me?.account!)
  }, [me?.account])

  const aquariums = useAquariums(me?.account)
  const stakedPools = useStakedPools(aquariums, me?.account)

  useEffect(() => {
    if (aquariums.length > 1) setIsTab2Locked(false)
    else setIsTab2Locked(true)
  }, [aquariums])

  const handleAddAquarium = async () => {
    console.log(`Handle add aquarium, me: ${me?.keyId}, ${me?.pubKey!}, ${me?.account!}`)
    buildAAInitializeDestinationCallData(me?.keyId!, me?.pubKey!, me?.account!)
  }

  const handleInitializeAquarium = async () => {
    if (!me?.account) return
    buildAquariumInitializeCallData(me.keyId, me.pubKey!, me.account)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header account={me?.account} disconnect={disconnect} />
      <div className="w-full flex flex-1 items-center justify-between px-12">
        <Tabs isTab2Locked={isTab2Locked} />
        <AquariumList aquariums={aquariums} stakedPools={stakedPools} initializeAquarium={handleInitializeAquarium} />
        <AquariumAdd onClick={handleAddAquarium} aquariums={aquariums} />
      </div>
    </div>
  )
}

export default ShowCase
