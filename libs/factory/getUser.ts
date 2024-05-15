import { Address, Hex } from "viem";

export type User = {
  id: Hex;
  pubKey: { x: Hex; y: Hex };
  account: Address;
  balance: bigint;
};

export async function getUser(id: Hex): Promise<User> {
  const response = await fetch(`/api/users/${id}`, {
    method: "GET",
  });

  let user = await response.json();
  user = JSON.parse(user);

  return {
    id: user.id,
    pubKey: {
      x: user.publicKey.x,
      y: user.publicKey.y,
    },
    account: user.account,
    balance: user.balance,
  };
}
