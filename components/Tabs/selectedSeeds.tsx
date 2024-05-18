import {
  buildCallIncubateCallData,
  buildTransferSeedCallData,
} from "@/libs/userOps"
import { useMe } from "@/providers/MeProvider"
import React, { useEffect, useState } from "react"
import EthBalance from "./ethBalance"
import { fetchLC } from "@/libs/user/fetchLC"
import { accountDestinationStakePoolEventListener } from "@/libs/creator/accountDestinationStakePoolEventListener"

interface SelectedSeedsProps {
  clickedSeeds: string[]
  seeds: {
    tab1: { name: string; addresses: string[] }[]
    tab2: { name: string; addresses: string[] }[]
  }
}

const SelectedSeeds: React.FC<SelectedSeedsProps> = ({
  clickedSeeds,
  seeds,
}) => {
  const { me } = useMe()
  const [balance, setBalance] = useState<number>(0)
  const [accountDestination, setAccountDestination] = useState<string>("")

  const handleIncubate = () => {
    console.log(`Clicked Seeds: ${clickedSeeds}`)

    const addresses = clickedSeeds.flatMap((seed) => {
      const [name, tab] = seed.split("_tab")
      const tabSeeds = seeds[`tab${tab}` as "tab1" | "tab2"]
      const seedData = tabSeeds.find((s) => s.name === name)
      return seedData ? seedData.addresses : []
    })

    console.log(addresses)
    _handleIncubate(addresses)
  }

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms))

  const _handleIncubate = async (seeds: string[]) => {
    try {
      const accounts = await fetchLC(me?.account!)
      setAccountDestination(accounts[0])
      console.log("Fetched logically connected accounts:", accounts)

      buildTransferSeedCallData(
        me?.keyId!,
        me?.pubKey!,
        me?.account!,
        accounts[0],
        seeds[0],
        seeds[1],
        seeds[2],
        seeds[3]
      )

      await delay(15000)

      buildCallIncubateCallData(
        me?.keyId!,
        me?.pubKey!,
        me?.account!,
        accounts[0],
        seeds[2],
        seeds[3]
      )

      accountDestinationStakePoolEventListener(accounts[0], me?.account!)
    } catch (error) {
      console.error("Error:", error)
    }
  }

  useEffect(() => {
    if (accountDestination && me?.account) {
      accountDestinationStakePoolEventListener(accountDestination, me.account)
    }
  }, [accountDestination, me?.account])

  return (
    <div className="mt-4 bg-white shadow p-4">
      <EthBalance setBalance={setBalance} />
      <div className="mt-4 bg-white shadow p-4">
        <div className="text-lg">Selected Seeds:</div>
        <div className="mt-2 space-x-2">
          {clickedSeeds.length > 0 ? (
            clickedSeeds.map((seed) => (
              <span key={seed} className="px-4 py-2 bg-gray-300 rounded">
                {seed.replace("_tab1", "").replace("_tab2", "")}
              </span>
            ))
          ) : (
            <span>No fish selected.. :(</span>
          )}
        </div>
        <button
          className={`mt-4 px-4 py-2 rounded ${
            balance >= 0.1
              ? "bg-blue-500 text-white"
              : // : "bg-gray-500 text-white cursor-not-allowed"
                "bg-gray-500 text-white"
          }`}
          onClick={balance >= 0.1 ? handleIncubate : handleIncubate}
          title={balance < 0.1 ? "Balance is below 0.1 ETH" : ""}
        >
          Incubate!
        </button>
      </div>
    </div>
  )
}

export default SelectedSeeds
