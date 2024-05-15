import { NextRequest, NextResponse } from "next/server"
import { ethers } from "ethers"
import { abi as AN__ABI } from "@/constants/artifacts/contracts/AccountNative.sol/AccountNative.json"

export async function POST(request: NextRequest) {
  const { newAquarium, AN__ADDRESS } = await request.json()

  if (!newAquarium || !AN__ADDRESS) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 })
  }

  try {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL as string)
    const wallet = new ethers.Wallet(
      process.env.PRIVATE_KEY as string,
      provider
    )

    const AN = new ethers.Contract(AN__ADDRESS, AN__ABI, wallet)

    const tx = await AN.addAquarium(newAquarium)
    await tx.wait()

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
