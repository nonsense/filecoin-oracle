import chai, { expect } from 'chai'
import { solidity, MockProvider, deployContract } from 'ethereum-waffle'
import { Contract, BigNumber, constants } from 'ethers'
import CidsTree from '../src/cids-tree'

import FilecoinService from '../artifacts/contracts/FilecoinService.sol/FilecoinService.json'

chai.use(solidity)

const overrides = {
  gasLimit: 9999999,
}

const ZERO_BYTES32 = '0x0000000000000000000000000000000000000000000000000000000000000000'


describe('FilecoinService', () => {
  const provider = new MockProvider({
    ganacheOptions: {
      hardfork: 'istanbul',
      mnemonic: 'horn horn horn horn horn horn horn horn horn horn horn horn',
      gasLimit: 9999999,
    },
  })

  const wallets = provider.getWallets()
  const [wallet0, wallet1] = wallets

  describe('#merkleRoot', () => {
    it('returns the zero merkle root', async () => {
      const filecoinService = await deployContract(wallet0, FilecoinService, [ZERO_BYTES32, 100000], overrides)
      expect(await filecoinService.merkleRoot()).to.eq(ZERO_BYTES32)
    })
  })

  describe('#submitProof', () => {
    it('fails for empty proof', async () => {
      const filecoinService = await deployContract(wallet0, FilecoinService, [ZERO_BYTES32, 100000], overrides)
      await expect(filecoinService.submitProof(
    "dataCid",
    "pieceCid",
    123,
    "provider",
    10,
    100,
    50,
    []
      )).to.be.revertedWith(
        'invalid proof'
      )
    })

    describe('two account tree', () => {
      let filecoinService: Contract
      let tree: CidsTree
      beforeEach('deploy', async () => {
        tree = new CidsTree([
          {  dataCid: "datacid1234", pieceCid: "piececid1234", dealId: BigNumber.from(150505), provider: "fprovider1", startEpoch: BigNumber.from(10), endEpoch: BigNumber.from(2000), signedEpoch: BigNumber.from(50) },
          {  dataCid: "datacid2345", pieceCid: "piececid2345", dealId: BigNumber.from(267775), provider: "fprovider2", startEpoch: BigNumber.from(100), endEpoch: BigNumber.from(4000), signedEpoch: BigNumber.from(250) },
        ])
        filecoinService = await deployContract(wallet0, FilecoinService, [tree.getHexRoot(), 10000], overrides)
      })

      it('successful proof', async () => {
        const proof0 = tree.getProof("datacid1234", "piececid1234", BigNumber.from(150505), "fprovider1", BigNumber.from(10), BigNumber.from(2000), BigNumber.from(50))
        await expect(filecoinService.submitProof("datacid1234", "piececid1234", BigNumber.from(150505), "fprovider1", BigNumber.from(10), BigNumber.from(2000), BigNumber.from(50), proof0, overrides))
          .to.emit(filecoinService, 'StoredCid')
          //.withArgs(0, wallet0.address, 100)
      })
    })
  })
});
