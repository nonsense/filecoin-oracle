const { expect } = require("chai");

describe("FilecoinService", function() {
  it("Should subscribe to a new cid", async function() {
    const FilecoinService = await ethers.getContractFactory("FilecoinService");
    const fs = await FilecoinService.deploy();

    await fs.deployed();
    await fs.subscribeCid("cid1");
    expect(await fs.length("cid1")).to.equal(0);
    await fs.updateOne("cid1", "miner1");
    expect(await fs.length("cid1")).to.equal(1);
  });
});
