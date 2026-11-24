// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.34;

import {IBountyEscrow} from "./interfaces/IBountyEscrow.sol";
import {Linked} from "./shared/Linked.sol";
import {NotImplemented} from "./shared/NotImplemented.sol";

contract BountyEscrow is IBountyEscrow, Linked {
  function createBounty(BountyParams calldata) external payable returns (uint256) {
    revert NotImplemented();
  }

  function requestWithdrawal(uint256) external {
    revert NotImplemented();
  }

  function withdraw(uint256) external {
    revert NotImplemented();
  }

  function getBounty(uint256) external view returns (Bounty memory) {
    revert NotImplemented();
  }

  function pendingCount(uint256) external view returns (uint256) {
    revert NotImplemented();
  }

  function registerPending(uint256) external onlySubmissions {
    revert NotImplemented();
  }

  function clearPending(uint256) external onlySubmissions {
    revert NotImplemented();
  }

  function payout(uint256, address, uint8) external onlySubmissions {
    revert NotImplemented();
  }
}
