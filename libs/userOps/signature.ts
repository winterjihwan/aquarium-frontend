import {
  Chain,
  GetContractReturnType,
  Hex,
  PublicClient,
  WalletClient,
  createPublicClient,
  createWalletClient,
  encodeFunctionData,
  encodePacked,
  getContract,
  http,
  parseAbi,
  toHex,
  encodeAbiParameters,
  Address,
  zeroAddress,
} from "viem";
import { P256Credential, WebAuthn } from "../web-authn";

export class UserOpSig {
  public async getSignature(msgToSign: Hex, keyId: Hex): Promise<Hex> {
    const credentials: P256Credential = (await WebAuthn.get(
      msgToSign
    )) as P256Credential;
    console.log("credentials", credentials);

    if (credentials.rawId !== keyId) {
      throw new Error(
        "Incorrect passkeys used for tx signing. Please sign the transaction with the correct logged-in account"
      );
    }

    const signature = encodePacked(
      ["uint8", "uint48", "bytes"],
      [
        1,
        0,
        encodeAbiParameters(
          [
            {
              type: "tuple",
              name: "credentials",
              components: [
                {
                  name: "authenticatorData",
                  type: "bytes",
                },
                {
                  name: "clientDataJSON",
                  type: "string",
                },
                {
                  name: "challengeLocation",
                  type: "uint256",
                },
                {
                  name: "responseTypeLocation",
                  type: "uint256",
                },
                {
                  name: "r",
                  type: "bytes32",
                },
                {
                  name: "s",
                  type: "bytes32",
                },
              ],
            },
          ],
          [
            {
              authenticatorData: credentials.authenticatorData,
              clientDataJSON: JSON.stringify(credentials.clientData),
              challengeLocation: BigInt(23),
              responseTypeLocation: BigInt(1),
              r: credentials.signature.r,
              s: credentials.signature.s,
            },
          ]
        ),
      ]
    );
    console.log(`authenticatorData: ${credentials.authenticatorData}`);
    console.log(`clientDataJSON: ${JSON.stringify(credentials.clientData)}`);
    console.log(`challengeLocation: ${BigInt(23)}`);
    console.log(`responseTypeLocation: ${BigInt(1)}`);
    console.log(`r: ${credentials.signature.r}`);
    console.log(`s: ${credentials.signature.s}`);
    console.log(
      "encoded signature: ",
      encodeAbiParameters(
        [
          {
            type: "tuple",
            name: "credentials",
            components: [
              {
                name: "authenticatorData",
                type: "bytes",
              },
              {
                name: "clientDataJSON",
                type: "string",
              },
              {
                name: "challengeLocation",
                type: "uint256",
              },
              {
                name: "responseTypeLocation",
                type: "uint256",
              },
              {
                name: "r",
                type: "bytes32",
              },
              {
                name: "s",
                type: "bytes32",
              },
            ],
          },
        ],
        [
          {
            authenticatorData: credentials.authenticatorData,
            clientDataJSON: JSON.stringify(credentials.clientData),
            challengeLocation: BigInt(23),
            responseTypeLocation: BigInt(1),
            r: credentials.signature.r,
            s: credentials.signature.s,
          },
        ]
      )
    );

    return signature;
  }
}
