import { parseEther } from "viem";
import { type BountyParams, type BountyText, DAY } from "./bounty";
import { hashText } from "./hashes";

/** The form fields as typed by the company. */
export interface BountyFormValues {
  title: string;
  scope: string;
  versions: string[]; // one per target
  knownIssues: string;
  reward: string; // ETH
  submissionBond: string;
  rejectionBond: string;
  disputeBond: string;
  revealPeriod: string; // days
  decisionPeriod: string;
  appealPeriod: string;
  noticePeriod: string;
}

/** Periods and bonds are examples; the final values are open (docs/open-questions.md). */
export const INITIAL_VALUES: BountyFormValues = {
  title: "",
  scope: "",
  versions: [""],
  knownIssues: "",
  reward: "",
  submissionBond: "0.1",
  rejectionBond: "0.5",
  disputeBond: "0.5",
  revealPeriod: "3",
  decisionPeriod: "14",
  appealPeriod: "7",
  noticePeriod: "7",
};

const MAX_DAYS = 3650;

function parseText(label: string, value: string): string {
  const text = value.trim();
  if (text === "") throw new Error(`${label} must not be empty.`);
  return text;
}

function parseAmount(label: string, value: string): bigint {
  const text = value.trim();
  if (!/^\d{1,9}(\.\d{1,18})?$/.test(text)) {
    throw new Error(`${label} must be an amount in ETH, such as 0.5.`);
  }
  const amount = parseEther(text);
  if (amount === 0n) throw new Error(`${label} must be greater than 0.`);
  return amount;
}

function parsePeriod(label: string, value: string): bigint {
  const text = value.trim();
  if (!/^\d{1,4}$/.test(text) || Number(text) < 1 || Number(text) > MAX_DAYS) {
    throw new Error(`${label} must be between 1 and ${MAX_DAYS} whole days.`);
  }
  return BigInt(text) * DAY;
}

/** Turns the form into the createBounty parameters. Throws with a message for the user. */
export function parseBountyForm(values: BountyFormValues): {
  params: BountyParams;
  text: BountyText;
} {
  const title = parseText("Title", values.title);
  const scope = parseText("Scope", values.scope);
  const versions = values.versions.map((version, index) =>
    parseText(`Version of target ${index + 1}`, version),
  );

  return {
    text: { title, scope },
    params: {
      reward: parseAmount("Reward", values.reward),
      scopeHash: hashText(scope),
      versionHashes: versions.map(hashText),
      knownIssuesHash: hashText(values.knownIssues.trim()),
      submissionBond: parseAmount("Submission bond", values.submissionBond),
      rejectionBond: parseAmount("Rejection bond", values.rejectionBond),
      disputeBond: parseAmount("Dispute bond", values.disputeBond),
      revealPeriod: parsePeriod("Reveal period", values.revealPeriod),
      decisionPeriod: parsePeriod("Decision period", values.decisionPeriod),
      appealPeriod: parsePeriod("Appeal period", values.appealPeriod),
      noticePeriod: parsePeriod("Notice period", values.noticePeriod),
      requiresKyc: true,
    },
  };
}
