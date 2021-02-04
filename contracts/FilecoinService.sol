// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

import "@openzeppelin/contracts/cryptography/MerkleProof.sol";

import "hardhat/console.sol";

contract FilecoinService {
  address public owner;
  mapping(address => bool) public managers; // managers -> who can update cids

  event StoredCid(
    string dataCid,
    string pieceCid,
    uint256 dealId,
    string provider,
    uint256 startEpoch,
    uint256 endEpoch,
    uint256 signedEpoch
  );

  struct MerkleUpdate {
      uint256 updatedAtTimestamp;
      bytes32 merkleRoot;
      uint256 epoch;
  }

  MerkleUpdate public state;

  function merkleRoot() external view returns (bytes32) {
    return state.merkleRoot;
  }

  // *** constructor ***

  constructor(bytes32 _merkleRoot, uint256 _epoch) {
    console.log("deploying a FilecoinService contract");

    owner = msg.sender;
    managers[msg.sender] = true;

    state.merkleRoot = _merkleRoot;
    state.epoch = _epoch;
    state.updatedAtTimestamp = block.timestamp;
  }

  // *** public methods ***

  function submitProof(
    string calldata dataCid,
    string calldata pieceCid,
    uint256 dealId,
    string calldata provider,
    uint256 startEpoch,
    uint256 endEpoch,
    uint256 signedEpoch,
    bytes32[] calldata merkleProof
  ) public {
    // verify the merkle proof
    bytes32 node = keccak256(abi.encodePacked(dataCid, pieceCid, dealId, provider, startEpoch, endEpoch, signedEpoch));
    require(MerkleProof.verify(merkleProof, state.merkleRoot, node), 'invalid proof');

    emit StoredCid(dataCid, pieceCid, dealId, provider, startEpoch, endEpoch, signedEpoch);
  }

  function verifyProof(
    string calldata dataCid,
    string calldata pieceCid,
    uint256 dealId,
    string calldata provider,
    uint256 startEpoch,
    uint256 endEpoch,
    uint256 signedEpoch,
    bytes32[] calldata merkleProof
  ) public view returns(bool) {
    // verify the merkle proof
    bytes32 node = keccak256(abi.encodePacked(dataCid, pieceCid, dealId, provider, startEpoch, endEpoch, signedEpoch));

    return MerkleProof.verify(merkleProof, state.merkleRoot, node);
  }

  // *** manager methods ***

  function updateState(bytes32 _merkleRoot, uint256 _epoch) external onlyManager {
    state.merkleRoot = _merkleRoot;
    state.epoch = _epoch;
    state.updatedAtTimestamp = block.timestamp;
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
