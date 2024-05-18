import { ethers } from "ethers"
import { abi as CREATOR__ABI } from "@/constants/artifacts/contracts/Creator.sol/Creator.json"
import { abi as AN__ABI } from "@/constants/artifacts/contracts/AccountNative.sol/AccountNative.json"
import { Creator__ADDRESS } from "@/utils/constants"

export const listenToCreatorCreation = async (
  AN__ADDRESS: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL)
    const provider_arbitrum = new ethers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL
    )
    const wallet = new ethers.Wallet(
      process.env.NEXT_PUBLIC_PRIVATE_KEY!,
      provider
    )
    const wallet_arbitrum = new ethers.Wallet(
      process.env.NEXT_PUBLIC_PRIVATE_KEY!,
      provider_arbitrum
    )

    const Creator = new ethers.Contract(
      Creator__ADDRESS,
      CREATOR__ABI,
      wallet_arbitrum
    )
    const AN = new ethers.Contract(AN__ADDRESS, AN__ABI, wallet)

    Creator.on("CreatedAccount", async (account: string) => {
      console.log(`New account created: ${account}`)

      try {
        const tx_lc = await AN.logicalConnect(account)
        console.log("Transaction sent:", tx_lc.hash)

        const txr_lc = await tx_lc.wait()
        console.log("Transaction mined:", txr_lc.transactionHash)

        const tx = await AN.addAquarium("arb-sepolia")
        console.log("Transaction sent:", tx.hash)

        const txr = await tx.wait()
        console.log("Transaction mined:", txr.transactionHash)

        resolve(account)
      } catch (error) {
        console.error("Failed to add aquarium:", error)
        reject(error)
      }
    })

    console.log(
      `Listening to CreatedAccount events on contract ${Creator__ADDRESS}`
    )
  })
}
