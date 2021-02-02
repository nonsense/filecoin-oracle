// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract FilecoinService {
  event NewCid(string cid);

  struct Cid {
    string cid;
    string miner;
  }

  // cid -> miners[]
  mapping(string => string[]) public cidsToMiners;

  // all cids
  string[] public cids;

  constructor() {
    console.log("Deploying a FilecoinService");
  }

  function subscribeCid(string memory cid) public {
    cids.push(cid); // TODO: check that we don't have it???

    emit NewCid(cid);
  }

  function get(string memory cid) public view returns (string[] memory) {
    console.log("Getting cid '%s'", cid);
    return cidsToMiners[cid];

  }

  function updateOne(string memory cid, string memory miner) public {
    cidsToMiners[cid].push(miner);
  }

  function length(string memory cid) public view returns (uint) {
    return cidsToMiners[cid].length;
  }
}
