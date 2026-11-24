// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.34;

import {ISubmissions} from "./interfaces/ISubmissions.sol";
import {IArbitration} from "./interfaces/IArbitration.sol";
import {IBountyEscrow} from "./interfaces/IBountyEscrow.sol";
import {IKycVerifier} from "./interfaces/IKycVerifier.sol";
import {NotImplemented} from "./shared/NotImplemented.sol";

contract Submissions is ISubmissions {
  IBountyEscrow public immutable escrow;
  IArbitration public immutable arbitration;
  IKycVerifier public immutable kycVerifier;

  error NotArbitration();

  constructor(IBountyEscrow escrow_, IArbitration arbitration_, IKycVerifier kycVerifier_) {
    escrow = escrow_;
    arbitration = arbitration_;
    kycVerifier = kycVerifier_;
  }

  function commit(uint256, bytes32) external payable returns (uint256) {
    revert NotImplemented();
  }

  function markRevealed(uint256, bytes32) external {
    revert NotImplemented();
  }

  function dispute(uint256, uint8, bytes32) external payable {
    revert NotImplemented();
  }

  function accept(uint256, bytes32) external payable {
    revert NotImplemented();
  }

  function reject(uint256, bytes32, bytes32) external payable {
    revert NotImplemented();
  }

  function openTier(uint256, uint8, bytes32) external {
    revert NotImplemented();
  }

  function finalize(uint256) external {
    revert NotImplemented();
  }

  function getSubmission(uint256) external view returns (Submission memory) {
    revert NotImplemented();
  }

  function onRuling(uint256, uint8) external {
    require(msg.sender == address(arbitration), NotArbitration());
    revert NotImplemented();
  }
}
