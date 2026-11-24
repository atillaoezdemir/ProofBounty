// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.34;

/// @notice Public encryption keys used for off-chain messages and evidence.
interface IKeyRegistry {
  event KeySet(address indexed user, bytes publicKey);

  function setKey(bytes calldata publicKey) external;

  function keyOf(address user) external view returns (bytes memory);
}
