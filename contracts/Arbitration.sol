// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.34;

import {IArbitration} from "./interfaces/IArbitration.sol";
import {Linked} from "./shared/Linked.sol";
import {NotImplemented} from "./shared/NotImplemented.sol";

contract Arbitration is IArbitration, Linked {
  function openDispute(
    uint256,
    address,
    address,
    uint8,
    uint256,
    uint256
  ) external payable onlySubmissions returns (uint256) {
    revert NotImplemented();
  }
}
