import { ethers } from "ethers"
import { abi as FACTORY__ABI } from "@/constants/artifacts/contracts/AccountFactory.sol/AccountFactory.json"
import { Hex, stringify, toHex } from "viem"
import { AF_ETH_ADDRESS } from "@/utils/constants"

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL)

// Define the factory contract instance
const AccountFactory = new ethers.Contract(
  AF_ETH_ADDRESS as string,
  FACTORY__ABI,
  provider
)

export async function GET(_req: Request, { params }: { params: { id: Hex } }) {
  const { id } = params
  if (!id) {
    return Response.json(JSON.parse(stringify({ error: "id is required" })))
  }
  console.log(`ID: ${id}`)

  const balance = BigInt(0)

  const user = await AccountFactory.getUser(id)
  console.log(`User: ${user}`)
  console.log(`User: ${user.id}`)
  console.log(`User: ${user.account}`)
  console.log(`User: ${user.publicKey}`)
  // console.log(`typeof user: ${typeof user}`);
  // console.log(`User object parsed: ${user.id}`);

  const userObject = {
    id: user.id,
    account: user.account,
    publicKey: {
      x: user.publicKey[0],
      y: user.publicKey[1],
    },
    balance: user.balance,
  }

  // return Response.json(JSON.parse(stringify({ ...user, id: userId, balance })));
  return Response.json(stringify(userObject))
}
