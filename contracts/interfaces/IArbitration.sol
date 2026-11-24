// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.34;

/// @notice Juror-based arbitration. Juror functions (stake, vote, ...) are added by the module owner.
interface IArbitration {
  event DisputeOpened(uint256 indexed disputeId, uint256 indexed submissionId);
  event Ruled(uint256 indexed disputeId, uint256 indexed submissionId, uint8 awardedTier);

  /// @notice Opens a dispute. Only the submissions contract. msg.value must equal
  /// decisionBond + disputeBond; arbitration returns the winner's bond and pays the jurors.
  function openDispute(
    uint256 submissionId,
    address company,
    address whitehat,
    uint8 claimedTier,
    uint256 decisionBond,
    uint256 disputeBond
  ) external payable returns (uint256 disputeId);
}
