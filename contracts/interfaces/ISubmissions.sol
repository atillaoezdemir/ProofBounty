// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.34;

/// @notice Submission lifecycle: commit, reveal, decision, dispute.
interface ISubmissions {
  enum Status {
    None,
    Submitted,
    Revealed,
    Accepted,
    Rejected,
    Disputed,
    Paid,
    Closed
  }

  struct Submission {
    uint256 bountyId;
    address whitehat;
    Status status;
    uint64 deadline; // end of the period that the current status is waiting on
    bytes32 commitment; // Commitments.report
    bytes32 reasonHash; // set on reject
    bytes32 conversationHash; // latest anchored message hash
  }

  event Committed(
    uint256 indexed submissionId,
    uint256 indexed bountyId,
    address indexed whitehat,
    bytes32 commitment
  );
  event Revealed(uint256 indexed submissionId, bytes32 conversationHash);
  event Accepted(uint256 indexed submissionId);
  event Rejected(uint256 indexed submissionId, bytes32 reasonHash, bytes32 conversationHash);
  event Disputed(uint256 indexed submissionId, uint256 indexed disputeId, bytes32 conversationHash);
  event Finalized(uint256 indexed submissionId, Status status);

  // Whitehat

  /// @notice Commits a report. msg.value must equal the submission bond.
  function commit(
    uint256 bountyId,
    bytes32 commitment
  ) external payable returns (uint256 submissionId);

  /// @notice Marks the report as delivered off-chain and starts the decision period.
  function markRevealed(uint256 submissionId, bytes32 conversationHash) external;

  /// @notice Disputes a rejection within the appeal period. msg.value must equal the dispute bond.
  function dispute(uint256 submissionId, bytes32 conversationHash) external payable;

  // Company

  /// @notice Accepts a report.
  function accept(uint256 submissionId) external;

  /// @notice Rejects with a reason. msg.value must equal the rejection bond.
  function reject(
    uint256 submissionId,
    bytes32 reasonHash,
    bytes32 conversationHash
  ) external payable;

  // Anyone

  /// @notice Applies the outcome once the current period has ended.
  function finalize(uint256 submissionId) external;

  function getSubmission(uint256 submissionId) external view returns (Submission memory);

  // Arbitration

  /// @notice Applies a ruling. Only the arbitration contract.
  function onRuling(uint256 submissionId, bool valid) external;
}
