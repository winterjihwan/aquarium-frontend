import { ethers } from "ethers";
import { abi as CREATOR__ABI } from "@/constants/artifacts/contracts/Creator.sol/Creator.json";
import { Creator__ADDRESS } from "@/utils/constants";

export const listenToCreatorCreation = async () => {
  const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);

  const Creator = new ethers.Contract(Creator__ADDRESS, CREATOR__ABI, provider);

  Creator.on("CreatedAccount", (account: string) => {
    console.log(`New account created: ${account}`);
  });

  console.log(
    `Listening to CreatedAccount events on contract ${Creator__ADDRESS}`
  );
};
