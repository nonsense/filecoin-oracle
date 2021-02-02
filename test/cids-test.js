const { expect } = require("chai");
const { keccak256 } = require("keccak256");

describe("FilecoinService", function() {
  it("Should subscribe to a new cid", async function() {
    const FilecoinService = await ethers.getContractFactory("FilecoinService");
    const fs = await FilecoinService.deploy();

    await fs.deployed();
    await fs.subscribeCid("cid1");
    expect(await fs.getMinersForCidLength("cid1")).to.equal(0);
    await fs.updateOne("cid1", "miner1");
    expect(await fs.getMinersForCidLength("cid1")).to.equal(1);
  });

  it("Should subscribe to a new cid", async function() {
    const FilecoinService = await ethers.getContractFactory("FilecoinService");
    const fs = await FilecoinService.deploy();

    await fs.deployed();
    await fs.subscribeCid("cid1");
    await fs.subscribeCid("cid2");
    await fs.subscribeCid("cid3");


    expected = ["cid1", "cid2", "cid3"];
    got = fs.getAllCids();

    //expect(keccak256(abi.encodePacked(expected))).to.equal(keccak256(abi.encodePacked(got)));
    //expect(await fs.getAllCids()).to.equal(expectAllCids);
  });
});
