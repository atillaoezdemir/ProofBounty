// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.34;

/// @notice Simulated KYC attestations.
interface IKycVerifier {
  event Attested(address indexed whitehat);

  function attest(address whitehat) external;

  function isVerified(address whitehat) external view returns (bool);
}
