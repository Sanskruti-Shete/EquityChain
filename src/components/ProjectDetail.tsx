import React, { useState } from 'react';
import { ArrowLeft, Users, Clock, TrendingUp, Shield, Calendar, FileText, DollarSign, MessageCircle } from 'lucide-react';
import { useWeb3 } from '../hooks/useWeb3';
import { ContractService } from '../services/contractService';
import { Project } from '../data/mockData';

interface ProjectDetailProps {
  projectAddress: string;
  onBack: () => void;
  isConnected: boolean;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ projectAddress, onBack, isConnected }) => {
  const { provider, signer, chainId, account } = useWeb3();
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);
  const [isInvesting, setIsInvesting] = useState(false);
  const [investmentError, setInvestmentError] = useState<string | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  React.useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!provider || !chainId || !projectAddress) {
        setLoading(false);
        return;
      }

      try {
        const contractService = new ContractService(provider, signer, chainId);
        const projectDetails = await contractService.getProjectDetails(projectAddress);
        
        setProject({
          id: projectAddress,
          address: projectAddress,
          ...projectDetails
        });
      } catch (err) {
        console.error('Error fetching project details:', err);
        setError('Failed to load project details');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [provider, signer, chainId, projectAddress]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={onBack}
          className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Projects
        </button>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={onBack}
          className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Projects
        </button>
        <div className="text-center">
          <p className="text-red-600">{error || 'Project not found'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  

  const fundingPercentage = (project.currentFunding / project.fundingGoal) * 100;
  const estimatedEquity = investmentAmount ? (parseFloat(investmentAmount) / project.fundingGoal) * project.equityOffered : 0;

  const handleInvest = () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }
    setShowInvestmentModal(true);
  };

  const confirmInvestment = () => {
    if (!provider || !signer || !chainId) {
      setInvestmentError('Wallet not connected');
      return;
    }
    
    makeInvestment();
  };

  const makeInvestment = async () => {
    setIsInvesting(true);
    setInvestmentError(null);
    
    try {
      const contractService = new ContractService(provider!, signer!, chainId!);
      
      // Use the actual contract address
      const result = await contractService.investInProject(projectAddress, investmentAmount);
      
      if (result.success) {
        setShowInvestmentModal(false);
        alert(`Investment of $${investmentAmount} submitted successfully! Transaction: ${result.transactionHash}`);
        setInvestmentAmount('');
      } else {
        setInvestmentError(result.error || 'Investment failed');
      }
    } catch (error: any) {
      console.error('Investment error:', error);
      setInvestmentError(error.message || 'Investment failed');
    } finally {
      setIsInvesting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={onBack}
        className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Projects
      </button>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-64 object-cover rounded-xl mb-6"
          />

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
                <span className="inline-flex px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {project.category}
                </span>
              </div>
            </div>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {project.description}
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Project Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Founded</span>
                    <span className="font-medium">2023</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Team Size</span>
                    <span className="font-medium">12 employees</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Revenue</span>
                    <span className="font-medium">$500K ARR</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Market</span>
                    <span className="font-medium">$2.1B TAM</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-green-600" />
                  Smart Contract
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Contract Address</span>
                    <span className="font-mono text-sm">0xABC...123</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Token Standard</span>
                    <span className="font-medium">ERC-20</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Audit Status</span>
                    <span className="text-green-600 font-medium">✓ Verified</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Lock Period</span>
                    <span className="font-medium">12 months</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Timeline</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-4"></div>
                  <div>
                    <p className="font-medium">KYC & Due Diligence</p>
                    <p className="text-sm text-gray-500">Complete investor verification</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-4"></div>
                  <div>
                    <p className="font-medium">Investment Period</p>
                    <p className="text-sm text-gray-500">Active funding round - {project.daysLeft} days remaining</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-300 rounded-full mr-4"></div>
                  <div>
                    <p className="font-medium">Token Distribution</p>
                    <p className="text-sm text-gray-500">Equity tokens distributed after funding closes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                ${project.currentFunding.toLocaleString()}
              </div>
              <div className="text-gray-500">
                raised of ${project.fundingGoal.toLocaleString()} goal
              </div>
            </div>

            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full"
                  style={{ width: `${Math.min(fundingPercentage, 100)}%` }}
                />
              </div>
              <div className="text-sm text-gray-500 text-center">
                {fundingPercentage.toFixed(1)}% funded
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Users className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                <div className="font-semibold text-gray-900">{project.investors}</div>
                <div className="text-gray-500">Investors</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Clock className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                <div className="font-semibold text-gray-900">{project.daysLeft}</div>
                <div className="text-gray-500">Days Left</div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-500">Equity Offered</span>
                <span className="font-semibold text-green-600">{project.equityOffered}%</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-500">Min Investment</span>
                <span className="font-semibold">${project.minInvestment.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Valuation</span>
                <span className="font-semibold">${(project.fundingGoal / project.equityOffered * 100).toLocaleString()}</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Investment Amount ($)
              </label>
              <input
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                placeholder={`Min: ${project.minInvestment}`}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {estimatedEquity > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  Estimated equity: {estimatedEquity.toFixed(4)}%
                </p>
              )}
            </div>

            <button
              onClick={handleInvest}
              disabled={!investmentAmount || parseFloat(investmentAmount) < project.minInvestment}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isConnected ? 'Invest Now' : 'Connect Wallet to Invest'}
            </button>
            
            <div className="text-center mt-3">
              <p className="text-xs text-gray-500 flex items-center justify-center">
                <MessageCircle className="h-3 w-3 mr-1" />
                Questions about investing? Ask our AI assistant
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Investment Protection
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Smart contract audited</li>
              <li>• KYC verified project team</li>
              <li>• Milestone-based fund release</li>
              <li>• Investor voting rights</li>
            </ul>
          </div>
        </div>
      </div>

      {showInvestmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Investment</h3>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-500">Investment Amount</span>
                <span className="font-semibold">${parseFloat(investmentAmount || '0').toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Estimated Equity</span>
                <span className="font-semibold text-green-600">{estimatedEquity.toFixed(4)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Platform Fee</span>
                <span className="font-semibold">${(parseFloat(investmentAmount || '0') * 0.025).toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold">${(parseFloat(investmentAmount || '0') * 1.025).toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            {investmentError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-800 text-sm">{investmentError}</p>
              </div>
            )}
            
            <div className="flex space-x-4">
              <button
                onClick={() => setShowInvestmentModal(false)}
                disabled={isInvesting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmInvestment}
                disabled={isInvesting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isInvesting ? 'Processing...' : 'Confirm Investment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};