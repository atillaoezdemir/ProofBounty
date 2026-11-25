import { parseEther } from "viem";
import { DAY, type ListedBounty } from "../bounty";
import { hashText } from "../hashes";

// The companies are accounts #1 and #2 of the local Hardhat node.
const ACME = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
const NOVAPAY = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC";

const ACME_SCOPE =
  "Customer-facing web application: remote code execution, SQL injection, authentication bypass and privilege escalation.";
const NOVAPAY_SCOPE =
  "Payment gateway REST API and its webhook service: authentication, payment flow manipulation and data exfiltration.";
const CRM_SCOPE = "Internal CRM: stored XSS and CSRF.";

/** Example bounties until BountyEscrow is implemented (issue #1). All values are examples. */
export const MOCK_BOUNTIES: ListedBounty[] = [
  {
    id: 0n,
    company: ACME,
    open: true,
    title: "ACME web application",
    scope: ACME_SCOPE,
    params: {
      reward: parseEther("5"),
      scopeHash: hashText(ACME_SCOPE),
      versionHashes: [hashText("acme-web@4.2.0")],
      knownIssuesHash: hashText("acme known issues"),
      submissionBond: parseEther("0.1"),
      rejectionBond: parseEther("0.5"),
      disputeBond: parseEther("0.5"),
      revealPeriod: 3n * DAY,
      decisionPeriod: 14n * DAY,
      appealPeriod: 7n * DAY,
      noticePeriod: 7n * DAY,
      requiresKyc: false,
    },
  },
  {
    id: 1n,
    company: NOVAPAY,
    open: true,
    title: "NovaPay payment API",
    scope: NOVAPAY_SCOPE,
    params: {
      reward: parseEther("10"),
      scopeHash: hashText(NOVAPAY_SCOPE),
      versionHashes: [hashText("novapay-api@2.8.1"), hashText("novapay-webhooks@1.3.0")],
      knownIssuesHash: hashText("novapay known issues"),
      submissionBond: parseEther("0.2"),
      rejectionBond: parseEther("1"),
      disputeBond: parseEther("1"),
      revealPeriod: 3n * DAY,
      decisionPeriod: 14n * DAY,
      appealPeriod: 7n * DAY,
      noticePeriod: 14n * DAY,
      requiresKyc: true,
    },
  },
  {
    id: 2n,
    company: ACME,
    open: false,
    title: "ACME internal CRM",
    scope: CRM_SCOPE,
    params: {
      reward: parseEther("2"),
      scopeHash: hashText(CRM_SCOPE),
      versionHashes: [hashText("acme-crm@1.0.7")],
      knownIssuesHash: hashText("acme crm known issues"),
      submissionBond: parseEther("0.05"),
      rejectionBond: parseEther("0.25"),
      disputeBond: parseEther("0.25"),
      revealPeriod: 2n * DAY,
      decisionPeriod: 7n * DAY,
      appealPeriod: 5n * DAY,
      noticePeriod: 5n * DAY,
      requiresKyc: false,
    },
  },
];
