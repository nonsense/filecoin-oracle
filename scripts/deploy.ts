import { ethers } from 'hardhat'
import { deployContract } from 'ethereum-waffle'
import { Contract } from 'ethers'

import FilecoinService from '../artifacts/contracts/FilecoinService.sol/FilecoinService.json'

const overrides = {
  gasLimit: 9500000,
}

const ZERO_BYTES32 = '0x0000000000000000000000000000000000000000000000000000000000000000'

async function main() {

  const [deployer] = await ethers.getSigners();

  console.log(
    "Deploying contracts with the account:",
    deployer.address
  );
  
  const filecoinService : Contract = await deployContract(deployer, FilecoinService, [ZERO_BYTES32, 100000], overrides)

  console.log("Oracle address:", filecoinService.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
