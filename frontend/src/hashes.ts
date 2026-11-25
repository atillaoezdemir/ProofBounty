import { type Hash, keccak256, stringToHex } from "viem";

/** Hash of a text as stored in the bounty (keccak256 of its UTF-8 bytes). */
export function hashText(text: string): Hash {
  return keccak256(stringToHex(text));
}
