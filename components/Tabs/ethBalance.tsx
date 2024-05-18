// EthBalance.tsx
import React, { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useMe } from "@/providers/MeProvider"

interface EthBalanceProps {
  setBalance: (balance: number) => void
}

const EthBalance: React.FC<EthBalanceProps> = ({ setBalance }) => {
  const { me } = useMe()
  const [ethBalance, setEthBalance] = useState<string | null>(null)

  useEffect(() => {
    const fetchBalance = async () => {
      if (me?.account) {
        try {
          const provider = new ethers.JsonRpcProvider(
            process.env.NEXT_PUBLIC_RPC_URL
          )
          const balance = await provider.getBalance(me.account)
          const formattedBalance = ethers.formatEther(balance)
          const formattedBalanceFixed = parseFloat(formattedBalance).toFixed(6)
          setEthBalance(formattedBalanceFixed)
          setBalance(parseFloat(formattedBalanceFixed))
        } catch (error) {
          console.error("Failed to fetch ETH balance:", error)
        }
      }
    }

    fetchBalance()
  }, [me?.account])

  return (
    <div className="text-lg">
      ETH Balance: {ethBalance !== null ? `${ethBalance} ETH` : "Loading..."}
    </div>
  )
}

export default EthBalance
