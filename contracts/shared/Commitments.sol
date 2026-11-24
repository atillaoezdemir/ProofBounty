// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.34;

/// @notice The commitment encodings used by the platform contracts and the dApp.
library Commitments {
  function report(
    bytes32 reportHash,
    bytes32 salt,
    address whitehat
  ) internal pure returns (bytes32) {
    return keccak256(abi.encode(reportHash, salt, whitehat));
  }
}
