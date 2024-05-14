import { ethers } from "ethers";
import { abi as FACTORY__ABI } from "@/constants/artifacts/AccountFactory.json";

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider);

// Define the factory contract instance
const AccountFactory = new ethers.Contract(
  process.env.FACTORY__ADDRESS as string,
  FACTORY__ABI,
  wallet
);

export async function POST(req: Request) {
  const { id, pubKey } = (await req.json()) as {
    id: string;
    pubKey: [string, string];
  };

  const user = await AccountFactory.getUser(id);

  if (user.account !== ethers.ZeroAddress) {
    return Response.json(undefined);
  }

  const saveUserTx = await AccountFactory.saveUser(id, pubKey);
  await saveUserTx.wait();

  const smartWalletAddress = await AccountFactory.getCounterfactualAddress(
    pubKey
  );

  const sendWeiTx = await wallet.sendTransaction({
    to: smartWalletAddress,
    value: ethers.parseUnits("1", "wei"), // Adjust the value as needed
  });
  await sendWeiTx.wait();

  const createdUser = {
    id,
    account: smartWalletAddress,
    pubKey,
  };

  return Response.json(createdUser);
}
