import { ethers } from "ethers"
import { abi as AN__ABI } from "../../constants/artifacts/contracts/AccountNative.sol/AccountNative.json"

export const fetchLC = async (AN__ADDRESS: string) => {
  const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL)

  const AN = new ethers.Contract(AN__ADDRESS, AN__ABI, provider)

  try {
    const logicallyConnectedAccounts: string[] =
      await AN.getLogicallyConnectedAccounts()
    console.log("Logically Connected Accounts:", logicallyConnectedAccounts)
    return logicallyConnectedAccounts
  } catch (error) {
    console.error("Error fetching logically connected accounts:", error)
    throw error
  }
}
