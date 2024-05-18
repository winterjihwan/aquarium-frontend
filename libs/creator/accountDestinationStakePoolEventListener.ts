import { ethers } from "ethers"
import { abi as AD__ABI } from "../../constants/artifacts/contracts/AccountDestination.sol/AccountDestination.json"
import { abi as AN__ABI } from "../../constants/artifacts/contracts/AccountNative.sol/AccountNative.json"

interface LiquidityAddedEvent {
  amountA: BigInt
  amountB: BigInt
  liquidity: BigInt
}

export const accountDestinationStakePoolEventListener = async (
  AD__ADDRESS: string,
  AN__ADDRESS: string
) => {
  const provider_arb = new ethers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL
  )
  const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL)

  const wallet_arb = new ethers.Wallet(
    process.env.NEXT_PUBLIC_PRIVATE_KEY!,
    provider_arb
  )
  const wallet = new ethers.Wallet(
    process.env.NEXT_PUBLIC_PRIVATE_KEY!,
    provider
  )

  const AD = new ethers.Contract(AD__ADDRESS, AD__ABI, wallet_arb)
  const AN = new ethers.Contract(AN__ADDRESS, AN__ABI, wallet)

  AD.on(
    "LiquidityAdded",
    async (amountA: BigInt, amountB: BigInt, liquidity: BigInt) => {
      console.log(`Liquidity added for account ${AD__ADDRESS}:`)
      console.log(`Amount A: ${amountA.toString()}`)
      console.log(`Amount B: ${amountB.toString()}`)
      console.log(`Liquidity: ${liquidity.toString()}`)

      try {
        const aquarium = "arb-sepolia"
        const newFish = "USDC/LINK"
        const tx = await AN.addStakedPool(aquarium, newFish)
        await tx.wait()
        console.log(
          `addStakedPool called on AN contract with aquarium: ${aquarium} and newFish: ${newFish}`
        )
      } catch (error) {
        console.error("Error calling addStakedPool on AN contract:", error)
      }
    }
  )

  console.log(`Listening to LiquidityAdded events for account ${AD__ADDRESS}`)
}
