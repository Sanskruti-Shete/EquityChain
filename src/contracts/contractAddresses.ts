// Contract addresses for different networks
export const CONTRACT_ADDRESSES = {
  // Ethereum Sepolia Testnet
  11155111: {
    projectFactory: '0x5FbDB2315678afecb367f032d93F642f64180aa3', // Update after deployment
  },
  // Local development
  31337: {
    projectFactory: '0x5FbDB2315678afecb367f032d93F642f64180aa3', // Hardhat default
  },
  // Ethereum Mainnet
  1: {
    projectFactory: '0x0000000000000000000000000000000000000000', // Deploy and update
  },
  // Polygon Mainnet
  137: {
    projectFactory: '0x0000000000000000000000000000000000000000', // Deploy and update
  },
  // Polygon Mumbai Testnet
  80001: {
    projectFactory: '0x0000000000000000000000000000000000000000', // Deploy and update
  },
};

export const SUPPORTED_NETWORKS = {
  11155111: 'Sepolia Testnet',
  31337: 'Localhost',
  1: 'Ethereum Mainnet',
  137: 'Polygon Mainnet',
  80001: 'Polygon Mumbai',
};

export const getContractAddress = (chainId: number, contract: string) => {
  const addresses = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES];
  if (!addresses) {
    throw new Error(`Unsupported network: ${chainId}`);
  }
  return addresses[contract as keyof typeof addresses];
};