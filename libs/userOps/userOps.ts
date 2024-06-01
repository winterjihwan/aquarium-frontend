import { ethers } from "ethers"
import { abi as EP__ABI } from "@/constants/artifacts/contracts/EntryPoint.sol/EntryPoint.json"
import { abi as PM__ABI } from "@/constants/artifacts/contracts/Paymaster.sol/Paymaster.json"
import { abi as AF__ABI } from "@/constants/artifacts/contracts/AccountFactory.sol/AccountFactory.json"
import { abi as AN__ABI } from "@/constants/artifacts/contracts/AccountNative.sol/AccountNative.json"
import { UserOpSig } from "../userOpsSignature/signature"
import { Contract } from "ethers"
import { Address, encodePacked, toHex } from "viem"
import {
  Creator__ADDRESS,
  AF_ETH_ADDRESS,
  EP_ETH_ADDRESS,
  PM_ETH_ADDRESS,
  AF_ARB_ADDRESS,
  EP_ARB_ADDRESS,
  PM_ARB_ADDRESS,
  CCIPRouter_ETH__ADDRESS,
  CCIPRouter_ARB__ADDRESS,
  ETHCHAIN,
  ARBCHAIN,
  WETH__ADDRESS,
  WETH__ABI,
  USDC__ADDRESS,
  ERC20__ABI,
  FACTORY__ADDRESS,
  ROUTER__ADDRESS,
  WETH_USDC_PAIR__ADDRESS,
  FACTORY_ARB__ADDRESS,
  ROUTER_ARB__ADDRESS,
  USDC_LINK_PAIR_ARB__ADDRESS,
  USDC_ARB__ADDRESS,
  LINK_ARB__ADDRESS,
  WETH_ARB__ADDRESS,
  MULTICALL__ADDRESS,
} from "../../utils/constants"

// public key = 0x10F8BBF39357b5b1Ee82F0C7Bf9d82371df2a1Ff

interface UserOperation {
  sender: string | undefined
  nonce: string
  initCode: string
  callData: any
  paymasterAndData: string
  signature: string
  preVerificationGas?: number | string
  verificationGasLimit?: number | string
  callGasLimit?: number | string
  maxFeePerGas?: string
  maxPriorityFeePerGas?: string
}

const userOpSig = new UserOpSig()
const acquireSig = async (userOpHash: any, keyId: any) => {
  const msgToSign = encodePacked(["uint8", "uint48", "bytes32"], [1, 0, userOpHash])
  const signature = await userOpSig.getSignature(msgToSign, keyId)
  return signature
}

export const buildAquariumInitializeCallData = (id: string, publicKey: { x: string; y: string }, address: string) => {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL as string)

  const AccountNative = new ethers.Contract(address, AN__ABI, provider) as Contract

  const AquariumInitializeCallData = AccountNative.interface.encodeFunctionData("initializeAquarium")

  console.log({ AquariumInitializeCallData })

  createUserOp(id, [publicKey.x, publicKey.y] as [string, string], address, AquariumInitializeCallData)
}

export const buildAAInitializeDestinationCallData = (
  id: string,
  publicKey: { x: string; y: string },
  address: string
) => {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL as string)

  const AccountNative = new ethers.Contract(address, AN__ABI, provider) as Contract

  const AAInitializeDestinationCallData = AccountNative.interface.encodeFunctionData("AAInitializeDestination", [
    ARBCHAIN,
    Creator__ADDRESS,
    AF_ARB_ADDRESS,
    address,
    CCIPRouter_ARB__ADDRESS,
    PM_ETH_ADDRESS,
  ])

  console.log({ id, publicKey, address, AAInitializeDestinationCallData })

  createUserOp(id, [publicKey.x, publicKey.y] as [string, string], address, AAInitializeDestinationCallData)
}

export const buildTransferSeedCallData = (
  id: string,
  publicKey: { x: string; y: string },
  address: string,
  addressDestination: string,
  native_token1: string,
  native_token2: string,
  destination_token1: string,
  destination_token2: string
) => {
  const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL as string)

  const AccountNative = new ethers.Contract(address, AN__ABI, provider) as Contract

  const initialValue = ethers.parseEther("0.1")
  const deadline = Math.floor(Date.now() / 1000) + 60 * 5

  const transferSeedCallData = AccountNative.interface.encodeFunctionData("incubate", [
    ARBCHAIN,
    addressDestination,
    USDC__ADDRESS,
    native_token1,
    native_token2,
    destination_token1,
    destination_token2,
    initialValue,
    deadline,
    PM_ETH_ADDRESS,
  ])

  console.log({
    native_token1,
    native_token2,
    destination_token1,
    destination_token2,
    transferSeedCallData,
    address,
    addressDestination,
  })

  createUserOp(id, [publicKey.x, publicKey.y] as [string, string], address, transferSeedCallData)
}

export const buildCallIncubateCallData = (
  id: string,
  publicKey: { x: string; y: string },
  address: string,
  addressDestination: string,
  destination_token1: string,
  destination_token2: string
) => {
  const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL as string)

  const AccountNative = new ethers.Contract(address, AN__ABI, provider) as Contract

  const callIncubateCallData = AccountNative.interface.encodeFunctionData("incubateDestination", [
    ARBCHAIN,
    addressDestination,
    destination_token1,
    destination_token2,
    PM_ETH_ADDRESS,
  ])

  console.log({
    destination_token1,
    destination_token2,
    callIncubateCallData,
    address,
    addressDestination,
  })

  createUserOp(id, [publicKey.x, publicKey.y] as [string, string], address, callIncubateCallData)
}

export const createUserOp = async (id: string, publicKey: [string, string], address: string, inputCallData: any) => {
  const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL)
  const wallet = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY as string, provider)

  const EntryPoint = new ethers.Contract(EP_ETH_ADDRESS, EP__ABI, wallet)
  const Paymaster = new ethers.Contract(PM_ETH_ADDRESS, PM__ABI, provider)
  const AccountFactory = new ethers.Contract(AF_ETH_ADDRESS, AF__ABI, provider) as Contract
  const AccountNative = new ethers.Contract(address, AN__ABI, provider) as Contract

  const signerAddress = address

  let initCode =
    AF_ETH_ADDRESS +
    AccountFactory.interface
      .encodeFunctionData("createAccount", [[publicKey[0], publicKey[1]] as [string, string]])
      .slice(2)

  let sender
  try {
    await EntryPoint.getSenderAddress(initCode)
  } catch (error) {
    if (typeof error === "object" && error !== null && "data" in error) {
      const data = (error as { data: string }).data
      sender = "0x" + data.slice(-40)
    } else {
      console.error(error)
    }
  }
  console.log({ sender, signerAddress })

  const code = await provider.getCode(sender!)
  if (code != "0x") {
    initCode = "0x"
  }

  // CCIP Call ---------------------------------

  // const AAInitializeDestinationCallData =
  //   AccountNative.interface.encodeFunctionData("AAInitializeDestination", [
  //     ARBCHAIN,
  //     Creator__ADDRESS,
  //     AF_ARB_ADDRESS,
  //     signerAddress,
  //     CCIPRouter_ARB__ADDRESS,
  //     PM_ETH_ADDRESS,
  //   ]);

  // Transfer incubation seed ----------------------

  // const initialValue = ethers.parseEther("0.1");
  // const deadline = Math.floor(Date.now() / 1000) + 60 * 5;

  // const transferSeedCallData = AccountNative.interface.encodeFunctionData(
  //   "incubate",
  //   [
  //     ARBCHAIN,
  //     ACCOUNT_DESTINATION__ADDRESS,
  //     USDC__ADDRESS,
  //     WETH__ADDRESS,
  //     USDC__ADDRESS,
  //     USDC_ARB__ADDRESS,
  //     LINK_ARB__ADDRESS,
  //     initialValue,
  //     deadline,
  //     PM_ETH_ADDRESS,
  //   ]
  // );

  // Call incubate---------------------------------
  // const callIncubateCallData = AccountNative.interface.encodeFunctionData(
  //   "incubateDestination",
  //   [
  //     ARBCHAIN,
  //     ACCOUNT_DESTINATION__ADDRESS,
  //     USDC_ARB__ADDRESS,
  //     LINK_ARB__ADDRESS,
  //     PM_ETH_ADDRESS,
  //   ]
  // );
  // ----------------------------------------------

  // Reserves Usdc - Link: 5.938652, 18.856052495146312039

  const userOp: UserOperation = {
    sender, // smart account address
    nonce: "0x" + (await EntryPoint.getNonce(sender, 0)).toString(16),
    initCode,
    callData: inputCallData,
    // callData: AccountNative.interface.encodeFunctionData("initAA"),
    // callData: AAInitializeDestinationCallData,
    // callData: transferSeedCallData,
    // callData: callIncubateCallData,
    paymasterAndData: PM_ETH_ADDRESS,
    signature:
      "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c",
  }

  // const { preVerificationGas, verificationGasLimit, callGasLimit } =
  //   await provider.send("eth_estimateUserOperationGas", [
  //     userOp,
  //     EP_ETH_ADDRESS,
  //   ]);
  // userOp.preVerificationGas = preVerificationGas;
  // userOp.verificationGasLimit = verificationGasLimit;
  // userOp.callGasLimit = callGasLimit;

  // toHex
  // const maxFeePerGas = await provider.getFeeData()
  // userOp.maxFeePerGas = toHex(maxFeePerGas.maxFeePerGas as bigint)
  const mfpg = 7536318724
  userOp.maxFeePerGas = "0x" + mfpg.toString(16)
  // userOp.maxFeePerGas = "0x" + maxFeePerGas!.toString(16);

  //   userOp manual input---------------------------
  const preVerficationGas = 100000
  const verificationGasLimit = 1000000
  const callGasLimit = 1000000
  userOp.preVerificationGas = "0x" + preVerficationGas.toString(16)
  userOp.verificationGasLimit = "0x" + verificationGasLimit.toString(16)
  userOp.callGasLimit = "0x" + callGasLimit.toString(16)

  const maxPriorityFeePerGas = await provider.send("rundler_maxPriorityFeePerGas", [])
  userOp.maxPriorityFeePerGas = maxPriorityFeePerGas

  const userOpHash = await EntryPoint.getUserOpHash(userOp)
  console.log({ userOpHash })

  const sig = await acquireSig(userOpHash, id)
  userOp.signature = sig
  console.log({ sig })

  console.log({ userOp })

  const opHash = await provider.send("eth_sendUserOperation", [userOp, EP_ETH_ADDRESS])

  console.log({ opHash })

  setTimeout(async () => {
    const { transactionHash } = await provider.send("eth_getUserOperationByHash", [opHash])

    console.log({ transactionHash })
  }, 30000)
}
