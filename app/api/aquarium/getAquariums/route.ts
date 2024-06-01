import { NextRequest, NextResponse } from "next/server"
import { ethers } from "ethers"
import { abi as AN__ABI } from "@/constants/artifacts/contracts/AccountNative.sol/AccountNative.json"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const AN__ADDRESS = searchParams.get("contractAddress")

  if (!AN__ADDRESS) {
    return NextResponse.json({ error: "Contract address is required" }, { status: 400 })
  }

  try {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL as string)
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider)

    const AN = new ethers.Contract(AN__ADDRESS, AN__ABI, wallet)

    const aquariums: string[] = await AN.getAquariums()
    console.log("Aquariums:", aquariums)

    return NextResponse.json({ aquariums }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}
