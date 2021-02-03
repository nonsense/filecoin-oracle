import MerkleTree from './merkle-tree'
import { BigNumber, utils } from 'ethers'

export default class CidsTree {
  private readonly tree: MerkleTree
  constructor(cids: { dataCid: string; pieceCid: string; dealId: BigNumber; provider: string; startEpoch: BigNumber; endEpoch: BigNumber; signedEpoch: BigNumber }[]) {
    this.tree = new MerkleTree(
      cids.map(({ dataCid, pieceCid, dealId, provider, startEpoch, endEpoch, signedEpoch}) => {
        return CidsTree.toNode(dataCid, pieceCid, dealId, provider, startEpoch, endEpoch, signedEpoch)
      })
    )
  }

  public static verifyProof(
    dataCid: string,
    pieceCid: string,
    dealId: BigNumber,
    provider: string,
    startEpoch: BigNumber,
    endEpoch: BigNumber,
    signedEpoch: BigNumber,
    proof: Buffer[],
    root: Buffer
  ): boolean {
    let pair = CidsTree.toNode(dataCid, pieceCid, dealId, provider, startEpoch, endEpoch, signedEpoch)
    for (const item of proof) {
      pair = MerkleTree.combinedHash(pair, item)
    }

    return pair.equals(root)
  }

  // keccak256(abi.encode(dataCid, pieceCid, dealId, provider, startEpoch, endEpoch, signedEpoch))
  public static toNode(dataCid: string, pieceCid: string, dealId:  BigNumber, provider: string, startEpoch: BigNumber, endEpoch: BigNumber, signedEpoch: BigNumber): Buffer {
    return Buffer.from(
      utils.solidityKeccak256(['string', 'string', 'uint256', 'string', 'uint256', 'uint256', 'uint256'], [dataCid, pieceCid, dealId, provider, startEpoch, endEpoch, signedEpoch]).substr(2),
      'hex'
    )
  }

  public getHexRoot(): string {
    return this.tree.getHexRoot()
  }

  // returns the hex bytes32 values of the proof
  public getProof(dataCid: string, pieceCid: string, dealId:  BigNumber, provider: string, startEpoch: BigNumber, endEpoch: BigNumber, signedEpoch: BigNumber): string[] {
    return this.tree.getHexProof(CidsTree.toNode(dataCid, pieceCid, dealId, provider, startEpoch, endEpoch, signedEpoch))
  }
}

