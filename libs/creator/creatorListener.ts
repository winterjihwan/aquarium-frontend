import { ethers } from "ethers"
import { abi as CREATOR__ABI } from "@/constants/artifacts/contracts/Creator.sol/Creator.json"
import { Creator__ADDRESS } from "@/utils/constants"

export const listenToCreatorCreation = async () => {
  const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL)
  const wallet = new ethers.Wallet(
    process.env.NEXT_PUBLIC_PRIVATE_KEY!,
    provider
  )

  const Creator = new ethers.Contract(Creator__ADDRESS, CREATOR__ABI, wallet)

  Creator.on("CreatedAccount", async (account: string) => {
    console.log(`New account created: ${account}`)

    try {
      const tx = await Creator.addAquarium("arb-sepolia")
      console.log("Transaction sent:", tx.hash)

      const txr = await tx.wait()
      console.log("Transaction mined:", txr.transactionHash)
    } catch (error) {
      console.error("Failed to add aquarium:", error)
    }
  })

  console.log(
    `Listening to CreatedAccount events on contract ${Creator__ADDRESS}`
  )
}
