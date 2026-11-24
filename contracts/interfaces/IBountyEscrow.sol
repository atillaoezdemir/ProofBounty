// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.34;

/// @notice Bounty listings and reward escrow.
interface IBountyEscrow {
  /// @dev Amounts in wei, periods in seconds.
  struct BountyParams {
    uint256[] tierRewards; // index 0 = tier 1, last = top tier; ascending
    bytes32 scopeHash;
    bytes32[] versionHashes; // one per target in scope
    bytes32 knownIssuesHash;
    uint256 submissionBond; // paid by the whitehat on commit
    uint256 decisionBond; // paid by the company on accept and on reject
    uint256 disputeBond; // paid by the whitehat on dispute
    uint64 revealPeriod;
    uint64 decisionPeriod;
    uint64 appealPeriod;
    uint64 noticePeriod; // delay between requestWithdrawal and withdraw
    bool requiresKyc;
  }

  struct Bounty {
    address company;
    bool open;
    BountyParams params;
  }

  event BountyCreated(uint256 indexed bountyId, address indexed company);
  event WithdrawalRequested(uint256 indexed bountyId, uint256 availableAt);
  event BountyClosed(uint256 indexed bountyId);
  event RewardPaid(uint256 indexed bountyId, address indexed whitehat, uint8 tier, uint256 amount);

  /// @notice Posts a bounty. msg.value must equal the top tier reward.
  function createBounty(BountyParams calldata params) external payable returns (uint256 bountyId);

  /// @notice Starts the notice period. Only the company.
  function requestWithdrawal(uint256 bountyId) external;

  /// @notice Closes the bounty and returns the reward to the company. Requires that the notice
  /// period has passed and no submission is pending.
  function withdraw(uint256 bountyId) external;

  function getBounty(uint256 bountyId) external view returns (Bounty memory);

  function pendingCount(uint256 bountyId) external view returns (uint256);

  /// @notice Adds a pending submission. Only the submissions contract.
  function registerPending(uint256 bountyId) external;

  /// @notice Removes a pending submission. Only the submissions contract.
  function clearPending(uint256 bountyId) external;

  /// @notice Pays the reward of `tier` (1 = lowest), returns the rest to the company and closes
  /// the bounty. Only the submissions contract.
  function payout(uint256 bountyId, address whitehat, uint8 tier) external;
}
