// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.34;

import {Arbitration} from "../contracts/Arbitration.sol";
import {BountyEscrow} from "../contracts/BountyEscrow.sol";
import {KycVerifier} from "../contracts/KycVerifier.sol";
import {Submissions} from "../contracts/Submissions.sol";
import {Linked} from "../contracts/shared/Linked.sol";
import {Test} from "forge-std/Test.sol";

contract LinkedTest is Test {
  BountyEscrow escrow;
  Arbitration arbitration;
  Submissions submissions;

  function setUp() public {
    escrow = new BountyEscrow();
    arbitration = new Arbitration();
    submissions = new Submissions(escrow, arbitration, new KycVerifier());
  }

  function test_LinkOnce() public {
    escrow.linkSubmissions(address(submissions));
    assertEq(escrow.submissions(), address(submissions));
    vm.expectRevert(Linked.AlreadyLinked.selector);
    escrow.linkSubmissions(address(1));
  }

  function test_OnlyDeployerLinks() public {
    vm.prank(address(2));
    vm.expectRevert(Linked.NotDeployer.selector);
    escrow.linkSubmissions(address(submissions));
  }

  function test_RejectsZeroAddress() public {
    vm.expectRevert(Linked.ZeroAddress.selector);
    escrow.linkSubmissions(address(0));
  }

  function test_OnlySubmissionsCallsEscrow() public {
    vm.expectRevert(Linked.NotSubmissions.selector);
    escrow.registerPending(1);
    vm.expectRevert(Linked.NotSubmissions.selector);
    escrow.clearPending(1);
    vm.expectRevert(Linked.NotSubmissions.selector);
    escrow.payout(1, address(3));
  }

  function test_OnlySubmissionsOpensDispute() public {
    vm.expectRevert(Linked.NotSubmissions.selector);
    arbitration.openDispute(1, address(1), address(2), 0, 0);
  }

  function test_OnlyArbitrationRules() public {
    vm.expectRevert(Submissions.NotArbitration.selector);
    submissions.onRuling(1, false);
  }
}
