import { ethers } from "ethers";
import { abi as FACTORY_ABI } from "@/constants/artifacts/AccountFactory.json";

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

// Define the factory contract instance
const AccountFactory = new ethers.Contract(
  process.env.FACTORY__ADDRESS as string,
  FACTORY_ABI,
  provider
);

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ error: "id is required" }), {
      status: 400,
    });
  }

  const userId = id; // Convert id to BigNumber

  const user = await AccountFactory.getUser(userId);

  // Use ethers' provider.getBalance method instead of direct contract call
  let balance = 0;

  // Using Etherscan API to fetch balance as Sepolia RPC node may be inconsistent
  if (user?.account && user.account !== ethers.ZeroAddress) {
    const response = await fetch(
      `https://api-sepolia.etherscan.io/api?module=account&action=balance&address=${user.account}&tag=latest&apikey=${process.env.ETHERSCAN_API_KEY}`,
      { cache: "no-store" }
    );
    const resultJSON = await response.json();
    balance = resultJSON?.result || "0";
  }

  return new Response(
    JSON.stringify({
      ...user,
      // id: userId.toHexString(),
      id: userId,
      balance: balance.toString(),
    }),
    { status: 200 }
  );
}
