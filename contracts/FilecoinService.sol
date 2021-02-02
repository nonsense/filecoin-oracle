// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract FilecoinService {
  address public owner;

  event NewCid(string cid);

  struct Cid {
    string cid;
    string miner;
  }

  mapping(string => string[]) public cidsToMiners; // cid -> miners[]

  mapping(address => bool) public managers; // managers -> who can update cids

  string[] public cids; // all cids

  // *** constructor ***

  constructor() {
    console.log("deploying a FilecoinService contract");

    owner = msg.sender;
    managers[msg.sender] = true;
  }

  // *** main methods ***

  function subscribeCid(string memory cid) public {
    cids.push(cid); // TODO: check that we don't have it???

    emit NewCid(cid);
  }

  function getAllCids() public view returns (string[] memory) {
    console.log("getAllCids()");
    return cids;
  }

  function getMinersForCid(string memory cid) public view returns (string[] memory) {
    console.log("getMinersForCid(cid == '%s')", cid);
    return cidsToMiners[cid];
  }

  function updateOne(string memory cid, string memory miner) external onlyManager {
    console.log("updateOne(cid == '%s' ; miner == '%s')", cid, miner);
    cidsToMiners[cid].push(miner);
  }

  function getMinersForCidLength(string memory cid) public view returns (uint) {
    console.log("getMinersForCidLength(cid == '%s')", cid);
    return cidsToMiners[cid].length;
  }

  // *** manager and owner functionality and modifiers ***

  modifier onlyOwner() {
    require(msg.sender == owner, "only the owner of the contract can call this method");
    _;
  }

  modifier onlyManager() {
    require(managers[msg.sender] == true, "only managers allowed to call this method");
    _;
  }

  function addManager(address _manager) external onlyOwner {
    managers[_manager] = true;
  }

  function removeManager(address _manager) external onlyOwner {
    managers[_manager] = false;
  }
}
