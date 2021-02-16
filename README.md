# Filecoin Oracle on Ethereum - `smart contracts`

This is an experimental proof-of-concept smart contract for a Filecoin oracle on Ethereum.

It was built as part of the Protocol Labs remote hack week held from February 1st, 2020 to February 5th, 2020.

## Architecture

The experimental Filecoin Oracle consists of two parts:

1. `smart contracts` - Solidity smart contracts for Ethereum

2. `web oracle` - [A trusted web service which monitors the state of the Filecoin blockchain](https://github.com/dirkmc/filecoin-deal-proofs-svc)

---

The web oracle continuously monitors the Filecoin blockchain, once an hour processes the state for all deals, and produces a merkle tree root hash of the serialized data. This service is backed by the [Filecoin Sentinel](https://github.com/filecoin-project/sentinel).

Users are able to query data CIDs of interest on the web oracle and get a merkle inclusion proof with all the relevant data for the data CID at that point in time:`dataCid`, `pieceCid`, `dealId`, `provider`, `startEpoch`, `endEpoch`, `signedEpoch`

## Usage

Once deployed, you can use two of the public methods:

### SubmitProof

`SubmitProof` verifies an inclusion proof and emits a `StoredCid` event for other contracts to consume.

```solidity
  function submitProof(
    ...
  ) public {
    ...
  }
```

### VerifyProof

`VerifyProof` verifies an inclusion proof, similarly to `SubmitProof`, and returns a boolean to the caller.

```solidity
  function verifyProof(
    ...
  ) public view returns(bool) {
    ...
  }
```

## References

This code is based on and heavily influenced by the following libraries:

* [Uniswap Merkle Distributor](https://github.com/Uniswap/merkle-distributor)

* [OpenZeppelin contracts](https://github.com/OpenZeppelin/openzeppelin-contracts)
