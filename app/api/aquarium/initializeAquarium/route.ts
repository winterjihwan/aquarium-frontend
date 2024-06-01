import { NextRequest, NextResponse } from "next/server"
import { ethers } from "ethers"
import { abi as AN__ABI } from "@/constants/artifacts/contracts/AccountNative.sol/AccountNative.json"

export async function POST(req: NextRequest) {
  // const body = await req.json()
  // const { contractAddress } = body
  // if (!contractAddress) {
  //   return NextResponse.json({ message: "Missing contract address" }, { status: 400 })
  // }
  // try {
  //   const provider = new ethers.JsonRpcProvider(process.env.RPC_URL as string)
  //   const wallet = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider)
  //   const AN = new ethers.Contract(contractAddress, AN__ABI, wallet)
  //   const tx = await AN.initializeAquarium()
  //   await tx.wait()
  //   return NextResponse.json({ message: "Aquarium initialized successfully", txHash: tx.hash })
  // } catch (error) {
  //   console.error(error)
  //   return NextResponse.json(
  //     {
  //       message: "Initialization failed",
  //       error: (error as Error).message,
  //     },
  //     { status: 500 }
  //   )
  // }
}
