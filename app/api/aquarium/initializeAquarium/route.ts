import type { NextApiRequest, NextApiResponse } from "next"
import { ethers } from "ethers"
import { abi as AN__ABI } from "@/constants/artifacts/contracts/AccountNative.sol/AccountNative.json"

type Data = {
  message: string
  txHash?: string
  error?: string
}

export async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  const { contractAddress } = req.body

  if (!contractAddress) {
    return res.status(400).json({ message: "Missing contract address" })
  }

  try {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL as string)
    const wallet = new ethers.Wallet(
      process.env.PRIVATE_KEY as string,
      provider
    )

    const AN = new ethers.Contract(contractAddress, AN__ABI, wallet)

    const tx = await AN.initializeAquarium()
    await tx.wait()

    res
      .status(200)
      .json({ message: "Aquarium initialized successfully", txHash: tx.hash })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Initialization failed",
      error: (error as Error).message,
    })
  }
}
