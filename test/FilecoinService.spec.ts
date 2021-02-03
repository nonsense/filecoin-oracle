import chai, { expect } from 'chai'
import { solidity, MockProvider, deployContract } from 'ethereum-waffle'
import { Contract, BigNumber, constants } from 'ethers'
import BalanceTree from '../src/balance-tree'

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
  })
});
