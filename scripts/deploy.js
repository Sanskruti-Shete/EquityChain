const { ethers } = require("hardhat");

async function main() {
  const network = hre.network.name;
  console.log(`Deploying contracts to ${network}...`);

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Get account balance
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), network === 'sepolia' ? 'SepoliaETH' : 'ETH');
  
  // Check minimum balance for deployment
  const minBalance = ethers.parseEther("0.1");
  if (balance < minBalance) {
    console.error(`Insufficient balance. Need at least 0.1 ${network === 'sepolia' ? 'SepoliaETH' : 'ETH'} for deployment.`);
    if (network === 'sepolia') {
      console.log("Get Sepolia ETH from: https://sepoliafaucet.com/");
    }
    process.exit(1);
  }

  // Deploy ProjectFactory
  const ProjectFactory = await ethers.getContractFactory("ProjectFactory");
  const projectFactory = await ProjectFactory.deploy(deployer.address); // Fee recipient
  
  await projectFactory.waitForDeployment();
  const factoryAddress = await projectFactory.getAddress();
  
  console.log("ProjectFactory deployed to:", factoryAddress);
  console.log("Fee recipient set to:", deployer.address);

  // Verify deployment
  const platformFee = await projectFactory.platformFeePercentage();
  console.log("Platform fee:", platformFee.toString(), "basis points (", (Number(platformFee) / 100).toString(), "%)");

  console.log("\nDeployment completed!");
  console.log(`Network: ${network}`);
  console.log(`Chain ID: ${await deployer.provider.getNetwork().then(n => n.chainId)}`);
  console.log("Update CONTRACT_ADDRESSES in src/contracts/contractAddresses.ts with:");
  console.log(`${network === 'sepolia' ? '11155111' : network === 'localhost' ? '31337' : 'CHAIN_ID'}: {`);
  console.log(`  projectFactory: '${factoryAddress}',`);
  console.log(`},`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });