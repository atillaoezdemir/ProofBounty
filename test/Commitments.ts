import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";
import { encodeAbiParameters, keccak256, parseAbiParameters, toHex } from "viem";

// The dApp must build its commitments exactly like this.
describe("Commitments", async function () {
  const { viem } = await network.create();
  const salt = keccak256(toHex("salt"));

  it("report commitment matches the off-chain encoding", async function () {
    const harness = await viem.deployContract("CommitmentsHarness");
    const reportHash = keccak256(toHex("report"));
    const whitehat = "0x00000000000000000000000000000000000000A1";

    const expected = keccak256(
      encodeAbiParameters(parseAbiParameters("bytes32, bytes32, address"), [
        reportHash,
        salt,
        whitehat,
      ]),
    );
    assert.equal(await harness.read.report([reportHash, salt, whitehat]), expected);
  });
});
