import React from 'react';
import { Coins, User, Plus, BarChart3, Wallet, MessageCircle } from 'lucide-react';
import { useWeb3 } from '../hooks/useWeb3';
import type { Page } from '../App';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const { account, isConnected, isConnecting, connectWallet, disconnectWallet, error } = useWeb3();

  const getNetworkName = (chainId: number) => {
    const networks: { [key: number]: string } = {
      1: 'Ethereum',
      11155111: 'Sepolia',
      137: 'Polygon',
      31337: 'Localhost'
    };
    return networks[chainId] || 'Unknown';
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <Coins className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">EquityChain</span>
          </div>

          <nav className="hidden md:flex space-x-8">
            <button
              onClick={() => onNavigate('home')}
              className={`text-sm font-medium transition-colors ${
                currentPage === 'home' 
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-1' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Discover
            </button>
            <button
              onClick={() => onNavigate('investor-dashboard')}
              className={`text-sm font-medium transition-colors ${
                currentPage === 'investor-dashboard' 
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-1' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Portfolio
            </button>
            <button
              onClick={() => onNavigate('creator-dashboard')}
              className={`text-sm font-medium transition-colors ${
                currentPage === 'creator-dashboard' 
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-1' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              My Projects
            </button>
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => onNavigate('create-project')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Project
            </button>
            
            <div className="hidden md:flex items-center text-gray-400 text-sm">
              <MessageCircle className="h-4 w-4 mr-1" />
              <span>AI Assistant available</span>
            </div>
            
            {isConnected ? (
              <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg">
                <Wallet className="h-4 w-4" />
                <div className="text-sm">
                  <div className="font-medium">{formatAddress(account!)}</div>
                  <div className="text-xs text-green-600">Sepolia Testnet</div>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="text-xs text-green-600 hover:text-green-800 ml-2"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <Wallet className="h-4 w-4 mr-2" />
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}
            
            {error && (
              <div className="text-xs text-red-600 mt-1">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};