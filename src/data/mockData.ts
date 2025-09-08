export interface Project {
  id: string;
  address: string; // Add contract address field
  title: string;
  description: string;
  image: string;
  category: string;
  fundingGoal: number;
  currentFunding: number;
  investors: number;
  daysLeft: number;
  minInvestment: number;
  equityOffered: number;
}

export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'EcoTech Solutions',
    description: 'Revolutionary solar panel technology that increases efficiency by 40% while reducing manufacturing costs. Our patented nanotechnology coating maximizes energy absorption.',
    image: 'https://images.pexels.com/photos/9875419/pexels-photo-9875419.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Clean Energy',
    fundingGoal: 200000,
    currentFunding: 125000,
    investors: 45,
    daysLeft: 25,
    minInvestment: 1000,
    equityOffered: 12
  },
  {
    id: '2',
    title: 'AI Medical Diagnostics',
    description: 'Machine learning platform that can diagnose diseases from medical imaging with 95% accuracy. Reducing diagnosis time from days to minutes.',
    image: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'HealthTech',
    fundingGoal: 500000,
    currentFunding: 380000,
    investors: 78,
    daysLeft: 18,
    minInvestment: 2500,
    equityOffered: 8
  },
  {
    id: '3',
    title: 'Quantum Computing Labs',
    description: 'Developing quantum processors for commercial applications. Our breakthrough in quantum error correction makes practical quantum computing possible.',
    image: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Quantum Tech',
    fundingGoal: 1000000,
    currentFunding: 750000,
    investors: 125,
    daysLeft: 42,
    minInvestment: 5000,
    equityOffered: 6
  },
  {
    id: '4',
    title: 'Urban Farming Network',
    description: 'IoT-enabled vertical farming systems that use 90% less water and produce 10x more yield per square foot than traditional farming methods.',
    image: 'https://images.pexels.com/photos/4505459/pexels-photo-4505459.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'AgriTech',
    fundingGoal: 300000,
    currentFunding: 87000,
    investors: 32,
    daysLeft: 35,
    minInvestment: 1500,
    equityOffered: 15
  },
  {
    id: '5',
    title: 'Blockchain Identity',
    description: 'Decentralized identity verification system that gives users complete control over their personal data while enabling seamless authentication.',
    image: 'https://images.pexels.com/photos/8358118/pexels-photo-8358118.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Blockchain',
    fundingGoal: 400000,
    currentFunding: 290000,
    investors: 89,
    daysLeft: 12,
    minInvestment: 2000,
    equityOffered: 10
  },
  {
    id: '6',
    title: 'Neural Prosthetics',
    description: 'Brain-computer interface technology that allows paralyzed patients to control robotic limbs with thought alone. Clinical trials show 85% success rate.',
    image: 'https://images.pexels.com/photos/8439093/pexels-photo-8439093.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'BioTech',
    fundingGoal: 750000,
    currentFunding: 425000,
    investors: 67,
    daysLeft: 28,
    minInvestment: 3000,
    equityOffered: 9
  }
];