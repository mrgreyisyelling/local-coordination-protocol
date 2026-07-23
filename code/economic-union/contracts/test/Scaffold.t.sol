// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import { Test } from "forge-std/Test.sol";
import { Scaffold } from "../src/Scaffold.sol";

contract ScaffoldTest is Test {
    Scaffold private scaffold;

    function setUp() public {
        scaffold = new Scaffold();
    }

    function testReturnsOne() public view {
        assertEq(scaffold.value(), 1);
    }
}
