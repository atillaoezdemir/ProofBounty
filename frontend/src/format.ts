import type { Address } from "viem";

export function shortAddress(address: Address): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function formatPeriod(seconds: bigint): string {
  const days = Number(seconds) / 86_400;
  return `${days} ${days === 1 ? "day" : "days"}`;
}
