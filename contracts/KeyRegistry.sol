// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.34;

import {IKeyRegistry} from "./interfaces/IKeyRegistry.sol";
import {NotImplemented} from "./shared/NotImplemented.sol";

contract KeyRegistry is IKeyRegistry {
  function setKey(bytes calldata) external {
    revert NotImplemented();
  }

  function keyOf(address) external view returns (bytes memory) {
    revert NotImplemented();
  }
}
