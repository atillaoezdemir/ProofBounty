// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.34;

/// @notice Links a contract to the submissions contract, once, after deployment.
abstract contract Linked {
  address public immutable deployer;
  address public submissions;

  error NotDeployer();
  error AlreadyLinked();
  error ZeroAddress();
  error NotSubmissions();

  constructor() {
    deployer = msg.sender;
  }

  modifier onlySubmissions() {
    require(msg.sender == submissions, NotSubmissions());
    _;
  }

  function linkSubmissions(address submissions_) external {
    require(msg.sender == deployer, NotDeployer());
    require(submissions == address(0), AlreadyLinked());
    require(submissions_ != address(0), ZeroAddress());
    submissions = submissions_;
  }
}
