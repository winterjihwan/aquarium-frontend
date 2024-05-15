import { ethers } from "ethers"
import { abi as FACTORY__ABI } from "@/constants/artifacts/contracts/AccountFactory.sol/AccountFactory.json"
import { AF_ETH_ADDRESS } from "@/utils/constants"
import { Hex } from "viem"

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL)
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider)
const AccountFactory = new ethers.Contract(
  AF_ETH_ADDRESS as string,
  FACTORY__ABI,
  wallet
)

export async function POST(req: Request) {
  const { id, pubKey } = (await req.json()) as {
    id: Hex
    pubKey: [string, string]
  }
  console.log("cp1")
  // id: hex -> string first

  const user = await AccountFactory.getUser(id)
  console.log("cp2")

  if (user.account !== ethers.ZeroAddress) {
    return Response.json(undefined)
  }

  const saveUserTx = await AccountFactory.saveUser(id.toString(), pubKey)
  // await saveUserTx.wait();

  const smartWalletAddress = await AccountFactory.getCounterfactualAddress(
    pubKey
  )

  const sendWeiTx = await wallet.sendTransaction({
    to: smartWalletAddress,
    value: ethers.parseUnits("1", "wei"), // Adjust the value as needed
  })
  // await sendWeiTx.wait();

  const createdUser = {
    id,
    account: smartWalletAddress,
    pubKey: {
      x: pubKey[0],
      y: pubKey[1],
    },
  }

  return Response.json(createdUser)
}
