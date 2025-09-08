import { ethers } from 'ethers';
import { PROJECT_FACTORY_ABI, EQUITY_TOKEN_ABI } from '../contracts/abis';
import { getContractAddress } from '../contracts/contractAddresses';

export class ContractService {
  private provider: ethers.BrowserProvider;
  private signer: ethers.JsonRpcSigner;
  private chainId: number;

  constructor(provider: ethers.BrowserProvider, signer: ethers.JsonRpcSigner, chainId: number) {
    this.provider = provider;
    this.signer = signer;
    this.chainId = chainId;
  }

  // Project Factory Methods
  async createProject(projectData: {
    name: string;
    symbol: string;
    description: string;
    category: string;
    fundingGoal: string;
    equityPercentage: string;
    minInvestment: string;
    maxInvestment: string;
    fundingDuration: string;
  }) {
    try {
      const factoryAddress = getContractAddress(this.chainId, 'projectFactory');
      const factory = new ethers.Contract(factoryAddress, PROJECT_FACTORY_ABI, this.signer);

      const tx = await factory.createProject(
        projectData.name,
        projectData.symbol,
        projectData.description,
        projectData.category,
        ethers.parseEther(projectData.fundingGoal),
        parseInt(projectData.equityPercentage),
        ethers.parseEther(projectData.minInvestment),
        ethers.parseEther(projectData.maxInvestment),
        parseInt(projectData.fundingDuration) * 24 * 60 * 60 // Convert days to seconds
      );

      const receipt = await tx.wait();
      
      // Extract the project address from the event
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = factory.interface.parseLog(log);
          return parsed?.name === 'ProjectCreated';
        } catch {
          return false;
        }
      });

      if (event) {
        const parsed = factory.interface.parseLog(event);
        return {
          success: true,
          projectAddress: parsed?.args[0],
          transactionHash: receipt.hash,
        };
      }

      return {
        success: true,
        transactionHash: receipt.hash,
      };
    } catch (error: any) {
      console.error('Error creating project:', error);
      return {
        success: false,
        error: error.message || 'Failed to create project',
      };
    }
  }

  async getApprovedProjects() {
    try {
      const factoryAddress = getContractAddress(this.chainId, 'projectFactory');
      const factory = new ethers.Contract(factoryAddress, PROJECT_FACTORY_ABI, this.provider);

      const result = await factory.getApprovedProjects();
      const projectAddresses = result || [];
      const projects = [];

      for (const address of projectAddresses) {
        const projectInfo = await factory.projects(address);
        const equityToken = new ethers.Contract(address, EQUITY_TOKEN_ABI, this.provider);
        
        const [fundingProgress, timeRemaining, investorCount] = await Promise.all([
          equityToken.getFundingProgress(),
          equityToken.getTimeRemaining(),
          equityToken.getInvestorCount(),
        ]);

        projects.push({
          id: address,
          address,
          name: projectInfo.name,
          category: projectInfo.category,
          creator: projectInfo.creator,
          fundingGoal: ethers.formatEther(projectInfo.fundingGoal),
          equityPercentage: projectInfo.equityPercentage.toString(),
          currentFunding: ethers.formatEther(fundingProgress.raised),
          investors: investorCount.toString(),
          daysLeft: Math.ceil(Number(timeRemaining) / (24 * 60 * 60)),
          createdAt: new Date(Number(projectInfo.createdAt) * 1000),
        });
      }

      return { success: true, projects };
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch projects',
        projects: [],
      };
    }
  }

  async getProjectDetails(projectAddress: string) {
    try {
      const equityToken = new ethers.Contract(projectAddress, EQUITY_TOKEN_ABI, this.provider);
      const factoryAddress = getContractAddress(this.chainId, 'projectFactory');
      const factory = new ethers.Contract(factoryAddress, PROJECT_FACTORY_ABI, this.provider);

      const [
        projectInfo,
        fundingProgress,
        timeRemaining,
        investorCount,
        minInvestment,
        maxInvestment,
        tokenPrice,
        fundingActive,
        fundingSuccessful,
        description,
      ] = await Promise.all([
        factory.projects(projectAddress),
        equityToken.getFundingProgress(),
        equityToken.getTimeRemaining(),
        equityToken.getInvestorCount(),
        equityToken.minInvestment(),
        equityToken.maxInvestment(),
        equityToken.tokenPrice(),
        equityToken.fundingActive(),
        equityToken.fundingSuccessful(),
        equityToken.projectDescription(),
      ]);

      return {
        success: true,
        project: {
          address: projectAddress,
          name: projectInfo.name,
          description,
          category: projectInfo.category,
          creator: projectInfo.creator,
          fundingGoal: ethers.formatEther(projectInfo.fundingGoal),
          currentFunding: ethers.formatEther(fundingProgress.raised),
          equityPercentage: projectInfo.equityPercentage.toString(),
          investors: investorCount.toString(),
          daysLeft: Math.ceil(Number(timeRemaining) / (24 * 60 * 60)),
          minInvestment: ethers.formatEther(minInvestment),
          maxInvestment: ethers.formatEther(maxInvestment),
          tokenPrice: ethers.formatEther(tokenPrice),
          fundingActive,
          fundingSuccessful,
          fundingPercentage: Number(fundingProgress.percentage),
        },
      };
    } catch (error: any) {
      console.error('Error fetching project details:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch project details',
      };
    }
  }

  async investInProject(projectAddress: string, amount: string) {
    try {
      const equityToken = new ethers.Contract(projectAddress, EQUITY_TOKEN_ABI, this.signer);

      const tx = await equityToken.invest({
        value: ethers.parseEther(amount),
      });

      const receipt = await tx.wait();

      return {
        success: true,
        transactionHash: receipt.hash,
      };
    } catch (error: any) {
      console.error('Error investing in project:', error);
      return {
        success: false,
        error: error.message || 'Failed to invest in project',
      };
    }
  }

  async getInvestorData(projectAddress: string, investorAddress: string) {
    try {
      const equityToken = new ethers.Contract(projectAddress, EQUITY_TOKEN_ABI, this.provider);

      const [investorInfo, tokenBalance] = await Promise.all([
        equityToken.investors(investorAddress),
        equityToken.balanceOf(investorAddress),
      ]);

      return {
        success: true,
        data: {
          investment: ethers.formatEther(investorInfo.investment),
          tokens: ethers.formatEther(investorInfo.tokens),
          tokenBalance: ethers.formatEther(tokenBalance),
          timestamp: new Date(Number(investorInfo.timestamp) * 1000),
          isActive: investorInfo.isActive,
        },
      };
    } catch (error: any) {
      console.error('Error fetching investor data:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch investor data',
      };
    }
  }

  async withdrawFunds(projectAddress: string) {
    try {
      const equityToken = new ethers.Contract(projectAddress, EQUITY_TOKEN_ABI, this.signer);

      const tx = await equityToken.withdrawFunds();
      const receipt = await tx.wait();

      return {
        success: true,
        transactionHash: receipt.hash,
      };
    } catch (error: any) {
      console.error('Error withdrawing funds:', error);
      return {
        success: false,
        error: error.message || 'Failed to withdraw funds',
      };
    }
  }

  async requestRefund(projectAddress: string) {
    try {
      const equityToken = new ethers.Contract(projectAddress, EQUITY_TOKEN_ABI, this.signer);

      const tx = await equityToken.refund();
      const receipt = await tx.wait();

      return {
        success: true,
        transactionHash: receipt.hash,
      };
    } catch (error: any) {
      console.error('Error requesting refund:', error);
      return {
        success: false,
        error: error.message || 'Failed to request refund',
      };
    }
  }
}