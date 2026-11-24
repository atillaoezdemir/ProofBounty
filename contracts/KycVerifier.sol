// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.34;

import {IKycVerifier} from "./interfaces/IKycVerifier.sol";
import {NotImplemented} from "./shared/NotImplemented.sol";

contract KycVerifier is IKycVerifier {
  function attest(address) external {
    revert NotImplemented();
  }

  function isVerified(address) external view returns (bool) {
    revert NotImplemented();
  }
}
