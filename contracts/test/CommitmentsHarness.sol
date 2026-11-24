// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.34;

import {Commitments} from "../shared/Commitments.sol";

/// @dev Exposes the library for TypeScript tests.
contract CommitmentsHarness {
  function report(bytes32 reportHash, bytes32 salt, address whitehat) external pure returns (bytes32) {
    return Commitments.report(reportHash, salt, whitehat);
  }

  function tier(uint256 submissionId, uint8 tierValue, bytes32 salt) external pure returns (bytes32) {
    return Commitments.tier(submissionId, tierValue, salt);
  }
}
