const { expect } = require("chai");
// const { keccak256 } = require("keccak256");

describe("FilecoinService", function() {
  it("deploys", async function() {
    const FilecoinService = await ethers.getContractFactory("FilecoinService");

    bytes32 merkleRoot = 1234:
    uint256 epoch = 1234;
    const fs = await FilecoinService.deploy(merkleRoot, epoch);

    await fs.deployed();
  });
});
