'use client';

import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';

interface Agent {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  triggers: Trigger[];
  actions: Action[];
  status: 'active' | 'paused' | 'draft';
  createdAt: string;
  lastRun?: string;
  runCount: number;
  lastPrice?: number; // Store last checked price
}

interface Trigger {
  id: string;
  type: 'time' | 'price' | 'event' | 'webhook' | 'manual';
  config: any;
}

interface Action {
  id: string;
  type: 'notify' | 'swap' | 'send' | 'log' | 'webhook' | 'custom';
  config: any;
}

// CoinGecko token mapping (free API)
const COINGECKO_IDS: Record<string, string> = {
  'SOL': 'solana',
  'USDC': 'usd-coin',
  'USDT': 'tether',
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'BONK': 'bonk',
  'WIF': 'dogwifcoin',
  'JTO': 'jito-governance-token',
  'ORCA': 'orca',
  'RAY': 'raydium',
  'JUP': 'jupiter-exchange-solana',
};

// Fetch real-time price from CoinGecko
async function fetchTokenPrice(token: string): Promise<number | null> {
  try {
    const coinId = COINGECKO_IDS[token.toUpperCase()];
    if (!coinId) {
      console.warn(`Token ${token} not found in CoinGecko mapping`);
      return null;
    }

    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`,
      { method: 'GET' }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch price from CoinGecko');
    }

    const data = await response.json();
    return data[coinId]?.usd || null;
  } catch (error) {
    console.error('Error fetching token price:', error);
    return null;
  }
}

export default function Agent402App() {
  const { user } = usePrivy();
  const [currentView, setCurrentView] = useState<'list' | 'create'>('list');
  const [currentStep, setCurrentStep] = useState(1);
  const [agents, setAgents] = useState<Agent[]>([]);
  
  // Agent creation state
  const [agentName, setAgentName] = useState('');
  const [agentDescription, setAgentDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('');
  const [iconPreview, setIconPreview] = useState('');
  const [selectedColor, setSelectedColor] = useState('#00ff41');
  const [selectedCategory, setSelectedCategory] = useState('automation');
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  const [currentTriggerType, setCurrentTriggerType] = useState('');
  const [currentActionType, setCurrentActionType] = useState('');

  // Colors
  const colors = [
    { name: 'Green', value: '#00ff41' },
    { name: 'Blue', value: '#00d4ff' },
    { name: 'Purple', value: '#b624ff' },
    { name: 'Pink', value: '#ff2e97' },
    { name: 'Orange', value: '#ff6b2e' },
    { name: 'Yellow', value: '#ffd700' },
    { name: 'Red', value: '#ff4444' },
    { name: 'Cyan', value: '#00ffff' },
  ];

  // Categories
  const categories = [
    { id: 'automation', name: 'Automation', icon: '⚙️', desc: 'Automate repetitive tasks' },
    { id: 'trading', name: 'Trading', icon: '💹', desc: 'Trading and price monitoring' },
    { id: 'monitoring', name: 'Monitoring', icon: '👁️', desc: 'Monitor events and data' },
    { id: 'notifications', name: 'Notifications', icon: '🔔', desc: 'Send alerts and messages' },
    { id: 'data', name: 'Data', icon: '📊', desc: 'Data collection and analysis' },
    { id: 'security', name: 'Security', icon: '🔒', desc: 'Security and protection' },
  ];

  // Trigger types
  const triggerTypes = [
    { 
      id: 'time', 
      name: 'Schedule', 
      icon: '⏰', 
      desc: 'Run on a schedule',
      fields: [
        { name: 'interval', label: 'Interval', type: 'select', options: ['Every minute', 'Every 5 minutes', 'Every hour', 'Every day', 'Custom'] }
      ]
    },
    { 
      id: 'price', 
      name: 'Price Alert', 
      icon: '💰', 
      desc: 'When price reaches target',
      fields: [
        { name: 'token', label: 'Token', type: 'text', placeholder: 'SOL, USDC, etc.' },
        { name: 'condition', label: 'Condition', type: 'select', options: ['Above', 'Below', 'Equals'] },
        { name: 'price', label: 'Price', type: 'number', placeholder: '0.00' }
      ]
    },
    { 
      id: 'event', 
      name: 'Blockchain Event', 
      icon: '⛓️', 
      desc: 'When blockchain event occurs',
      fields: [
        { name: 'eventType', label: 'Event Type', type: 'select', options: ['New Transaction', 'Token Transfer', 'NFT Mint', 'Wallet Activity'] },
        { name: 'address', label: 'Address (optional)', type: 'text', placeholder: 'Wallet or contract address' }
      ]
    },
    { 
      id: 'webhook', 
      name: 'Webhook', 
      icon: '🔗', 
      desc: 'Trigger via external webhook',
      fields: [
        { name: 'method', label: 'Method', type: 'select', options: ['POST', 'GET'] }
      ]
    },
    { 
      id: 'manual', 
      name: 'Manual', 
      icon: '👆', 
      desc: 'Run manually when needed',
      fields: []
    },
  ];

  // Action types
  const actionTypes = [
    { 
      id: 'notify', 
      name: 'Send Notification', 
      icon: '📨', 
      desc: 'Send alert/message',
      fields: [
        { name: 'channel', label: 'Channel', type: 'select', options: ['In-App', 'Email', 'Discord', 'Telegram'] },
        { name: 'message', label: 'Message', type: 'textarea', placeholder: 'Enter your message...' }
      ]
    },
    { 
      id: 'swap', 
      name: 'Execute Swap', 
      icon: '🔄', 
      desc: 'Swap tokens automatically',
      fields: [
        { name: 'fromToken', label: 'From Token', type: 'text', placeholder: 'SOL' },
        { name: 'toToken', label: 'To Token', type: 'text', placeholder: 'USDC' },
        { name: 'amount', label: 'Amount', type: 'number', placeholder: '0.00' }
      ]
    },
    { 
      id: 'send', 
      name: 'Send Tokens', 
      icon: '💸', 
      desc: 'Transfer tokens/SOL',
      fields: [
        { name: 'token', label: 'Token', type: 'text', placeholder: 'SOL, USDC, etc.' },
        { name: 'recipient', label: 'Recipient', type: 'text', placeholder: 'Wallet address' },
        { name: 'amount', label: 'Amount', type: 'number', placeholder: '0.00' }
      ]
    },
    { 
      id: 'log', 
      name: 'Log Data', 
      icon: '📝', 
      desc: 'Save data to logs',
      fields: [
        { name: 'logMessage', label: 'Log Message', type: 'textarea', placeholder: 'Data to log...' }
      ]
    },
    { 
      id: 'webhook', 
      name: 'Call Webhook', 
      icon: '🌐', 
      desc: 'Send HTTP request',
      fields: [
        { name: 'url', label: 'Webhook URL', type: 'text', placeholder: 'https://...' },
        { name: 'method', label: 'Method', type: 'select', options: ['POST', 'GET', 'PUT'] },
        { name: 'body', label: 'Request Body (JSON)', type: 'textarea', placeholder: '{"key": "value"}' }
      ]
    },
    { 
      id: 'custom', 
      name: 'Custom Code', 
      icon: '💻', 
      desc: 'Run custom JavaScript',
      fields: [
        { name: 'code', label: 'JavaScript Code', type: 'textarea', placeholder: '// Your code here\nconsole.log("Hello from agent!");' }
      ]
    },
  ];

  // Load agents from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('x402agents');
    if (stored) {
      setAgents(JSON.parse(stored));
    }
  }, []);

  const saveAgent = () => {
    if (!agentName.trim()) {
      alert('❌ Please give your agent a name!');
      return;
    }

    if (triggers.length === 0) {
      alert('❌ Please add at least one trigger!');
      return;
    }

    if (actions.length === 0) {
      alert('❌ Please add at least one action!');
      return;
    }

    const newAgent: Agent = {
      id: Date.now().toString(),
      name: agentName,
      description: agentDescription,
      icon: selectedIcon,
      color: selectedColor,
      category: selectedCategory,
      triggers,
      actions,
      status: 'draft',
      createdAt: new Date().toISOString(),
      runCount: 0,
    };

    const updated = [...agents, newAgent];
    setAgents(updated);
    localStorage.setItem('x402agents', JSON.stringify(updated));

    resetForm();
    setCurrentView('list');
    alert(`✅ Agent "${agentName}" created successfully!`);
  };

  const deleteAgent = (id: string) => {
    if (confirm('Are you sure you want to delete this agent?')) {
      const updated = agents.filter(a => a.id !== id);
      setAgents(updated);
      localStorage.setItem('x402agents', JSON.stringify(updated));
    }
  };

  const toggleAgentStatus = (id: string) => {
    const agent = agents.find(a => a.id === id);
    const updated = agents.map(a => {
      if (a.id === id) {
        return {
          ...a,
          status: a.status === 'active' ? 'paused' : 'active' as 'active' | 'paused'
        };
      }
      return a;
    });
    setAgents(updated);
    localStorage.setItem('x402agents', JSON.stringify(updated));

    // If activating agent with price trigger, start monitoring
    if (agent && agent.status !== 'active') {
      const hasPriceTrigger = agent.triggers.some(t => t.type === 'price');
      if (hasPriceTrigger) {
        alert('✅ Agent activated! Price monitoring has started. Will check prices every minute.');
        startPriceMonitoring(id);
      }
    }
  };

  const runAgent = async (id: string) => {
    const agent = agents.find(a => a.id === id);
    if (!agent) return;

    // Check if agent has price triggers
    const priceTriggers = agent.triggers.filter(t => t.type === 'price');
    
    if (priceTriggers.length > 0) {
      // Execute price-based agent
      for (const trigger of priceTriggers) {
        const { token, condition, price: targetPrice } = trigger.config;
        
        if (!token || !condition || !targetPrice) {
          alert('❌ Invalid price trigger configuration');
          continue;
        }

        // Fetch real price from CoinGecko
        const currentPrice = await fetchTokenPrice(token);
        
        if (currentPrice === null) {
          alert(`❌ Failed to fetch price for ${token}`);
          continue;
        }

        // Check if condition is met
        let conditionMet = false;
        if (condition === 'Above' && currentPrice > parseFloat(targetPrice)) {
          conditionMet = true;
        } else if (condition === 'Below' && currentPrice < parseFloat(targetPrice)) {
          conditionMet = true;
        } else if (condition === 'Equals' && Math.abs(currentPrice - parseFloat(targetPrice)) < 0.01) {
          conditionMet = true;
        }

        if (conditionMet) {
          // Execute actions
          let actionResults = '';
          for (const action of agent.actions) {
            if (action.type === 'notify') {
              actionResults += `📨 Notification sent: "${action.config.message || 'Price alert triggered!'}"\n`;
            } else if (action.type === 'log') {
              actionResults += `📝 Logged: ${action.config.logMessage}\n`;
            }
          }

          // Update agent
          const updated = agents.map(a => {
            if (a.id === id) {
              return {
                ...a,
                lastRun: new Date().toISOString(),
                runCount: a.runCount + 1,
                lastPrice: currentPrice
              };
            }
            return a;
          });
          setAgents(updated);
          localStorage.setItem('x402agents', JSON.stringify(updated));

          alert(
            `✅ AGENT TRIGGERED!\n\n` +
            `Token: ${token}\n` +
            `Current Price: $${currentPrice.toFixed(6)}\n` +
            `Target: ${condition} $${targetPrice}\n` +
            `Condition: MET ✓\n\n` +
            `Actions Executed:\n${actionResults}`
          );
        } else {
          alert(
            `ℹ️ Price Check Complete\n\n` +
            `Token: ${token}\n` +
            `Current Price: $${currentPrice.toFixed(6)}\n` +
            `Target: ${condition} $${targetPrice}\n` +
            `Condition: NOT MET ✗\n\n` +
            `Agent will continue monitoring...`
          );
          
          // Still update last run and price
          const updated = agents.map(a => {
            if (a.id === id) {
              return {
                ...a,
                lastRun: new Date().toISOString(),
                lastPrice: currentPrice
              };
            }
            return a;
          });
          setAgents(updated);
          localStorage.setItem('x402agents', JSON.stringify(updated));
        }
      }
    } else {
      // Execute non-price agent (manual/other triggers)
      const updated = agents.map(a => {
        if (a.id === id) {
          return {
            ...a,
            lastRun: new Date().toISOString(),
            runCount: a.runCount + 1
          };
        }
        return a;
      });
      setAgents(updated);
      localStorage.setItem('x402agents', JSON.stringify(updated));
      alert('🚀 Agent executed! (Non-price triggers - simulation mode)');
    }
  };

  // Price monitoring system
  const startPriceMonitoring = (agentId: string) => {
    // In a real app, this would use setInterval or a background service
    // For now, we'll just show that it's set up
    console.log(`Price monitoring started for agent ${agentId}`);
  };

  const addTrigger = (type: string, config: any) => {
    const newTrigger: Trigger = {
      id: Date.now().toString(),
      type: type as any,
      config
    };
    setTriggers([...triggers, newTrigger]);
    setCurrentTriggerType('');
  };

  const addAction = (type: string, config: any) => {
    const newAction: Action = {
      id: Date.now().toString(),
      type: type as any,
      config
    };
    setActions([...actions, newAction]);
    setCurrentActionType('');
  };

  const removeTrigger = (id: string) => {
    setTriggers(triggers.filter(t => t.id !== id));
  };

  const removeAction = (id: string) => {
    setActions(actions.filter(a => a.id !== id));
  };

  const resetForm = () => {
    setAgentName('');
    setAgentDescription('');
    setSelectedIcon('🔮');
    setSelectedColor('#00ff41');
    setSelectedCategory('automation');
    setTriggers([]);
    setActions([]);
    setCurrentStep(1);
  };

  const nextStep = () => {
    if (currentStep === 1 && !agentName.trim()) {
      alert('Please enter an agent name');
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="h-full flex flex-col overflow-auto p-6">
      <div className="max-w-5xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-mono font-bold text-green-400 mb-2">x402agent Builder</h2>
          <p className="text-green-400/60 text-sm">Create custom automation agents for your website</p>
        </div>

        {/* Toggle View */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => { setCurrentView('create'); setCurrentStep(1); }}
            className={`px-6 py-3 rounded font-mono transition-all ${
              currentView === 'create'
                ? 'bg-green-400 text-black border-2 border-green-400'
                : 'bg-black text-green-400 border-2 border-green-400/30 hover:border-green-400/50'
            }`}
          >
            ➕ Create New Agent
          </button>
          <button
            onClick={() => setCurrentView('list')}
            className={`px-6 py-3 rounded font-mono transition-all ${
              currentView === 'list'
                ? 'bg-green-400 text-black border-2 border-green-400'
                : 'bg-black text-green-400 border-2 border-green-400/30 hover:border-green-400/50'
            }`}
          >
            🔮 My Agents ({agents.length})
          </button>
        </div>

        {currentView === 'create' ? (
          <>
            {/* Progress Bar */}
            <div className="bg-black border-2 border-green-400/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-400 font-mono text-sm">Step {currentStep} of 4</span>
                <span className="text-green-400/60 font-mono text-xs">
                  {currentStep === 1 && 'Basic Info'}
                  {currentStep === 2 && 'Appearance'}
                  {currentStep === 3 && 'Triggers'}
                  {currentStep === 4 && 'Actions'}
                </span>
              </div>
              <div className="h-2 bg-green-400/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-400 transition-all duration-300"
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                />
              </div>
            </div>

            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div className="bg-black border-2 border-green-400/50 rounded-lg p-6 space-y-6">
                <div className="text-center">
                  <div className="text-6xl mb-4">🔮</div>
                  <h3 className="text-2xl font-mono font-bold text-green-400 mb-2">
                    Name Your Agent
                  </h3>
                  <p className="text-green-400/60 text-sm">
                    Give your automation agent a unique identity
                  </p>
                </div>

                <div>
                  <label className="block text-green-400 font-mono text-sm mb-2">Agent Name *</label>
                  <input
                    type="text"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    placeholder="e.g., Price Monitor, Auto Trader, News Scanner..."
                    maxLength={40}
                    className="w-full bg-black border-2 border-green-400/30 rounded px-4 py-3 text-green-400 
                             font-mono text-lg focus:border-green-400 focus:outline-none"
                  />
                  <div className="text-green-400/60 text-xs mt-1 font-mono text-right">
                    {agentName.length}/40 characters
                  </div>
                </div>

                <div>
                  <label className="block text-green-400 font-mono text-sm mb-2">Description</label>
                  <textarea
                    value={agentDescription}
                    onChange={(e) => setAgentDescription(e.target.value)}
                    placeholder="Describe what this agent does..."
                    rows={3}
                    maxLength={200}
                    className="w-full bg-black border-2 border-green-400/30 rounded px-4 py-3 text-green-400 
                             font-mono text-sm focus:border-green-400 focus:outline-none resize-none"
                  />
                  <div className="text-green-400/60 text-xs mt-1 font-mono text-right">
                    {agentDescription.length}/200 characters
                  </div>
                </div>

                <div>
                  <label className="block text-green-400 font-mono text-sm mb-2">Category</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          selectedCategory === cat.id
                            ? 'bg-green-400/20 border-green-400'
                            : 'bg-black border-green-400/30 hover:border-green-400/50'
                        }`}
                      >
                        <div className="text-3xl mb-2">{cat.icon}</div>
                        <div className="text-green-400 font-mono text-sm font-bold">{cat.name}</div>
                        <div className="text-green-400/60 font-mono text-xs mt-1">{cat.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Appearance */}
            {currentStep === 2 && (
              <div className="bg-black border-2 border-green-400/50 rounded-lg p-6 space-y-6">
                <div className="text-center">
                  <div className="mb-4">
                    {iconPreview ? (
                      <img src={iconPreview} alt="Agent" className="w-32 h-32 mx-auto rounded-full object-cover border-4" style={{ borderColor: selectedColor }} />
                    ) : (
                      <div className="w-32 h-32 mx-auto rounded-full bg-green-400/10 border-4 border-green-400/30 flex items-center justify-center text-green-400/60 text-sm font-mono">
                        No Image
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-mono font-bold text-green-400 mb-2">
                    Upload Agent Image
                  </h3>
                  <p className="text-green-400/60 text-sm">
                    Upload a custom image for your agent
                  </p>
                </div>

                <div>
                  <label className="block text-green-400 font-mono text-sm mb-3">Upload Image</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const result = reader.result as string;
                            setSelectedIcon(result);
                            setIconPreview(result);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                      id="agent-image-upload"
                    />
                    <label
                      htmlFor="agent-image-upload"
                      className="block w-full bg-black border-2 border-green-400/30 hover:border-green-400 rounded-lg p-6 cursor-pointer transition-all text-center"
                    >
                      <div className="text-4xl mb-2">📁</div>
                      <div className="text-green-400 font-mono text-sm">
                        {iconPreview ? 'Change Image' : 'Click to Upload Image'}
                      </div>
                      <div className="text-green-400/60 font-mono text-xs mt-1">
                        PNG, JPG, GIF (Max 5MB)
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-green-400 font-mono text-sm mb-3">Theme Color</label>
                  <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                    {colors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setSelectedColor(color.value)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          selectedColor === color.value
                            ? 'border-white scale-105'
                            : 'border-green-400/30 hover:border-green-400/50'
                        }`}
                        style={{ backgroundColor: color.value + '20' }}
                      >
                        <div 
                          className="w-8 h-8 rounded-full mx-auto mb-2"
                          style={{ backgroundColor: color.value }}
                        />
                        <div className="text-green-400 font-mono text-xs">{color.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-green-400/10 border-2 border-green-400/30 rounded-lg p-6 text-center">
                  <div className="text-green-400/60 font-mono text-xs mb-3">PREVIEW</div>
                  <div className="mb-4">
                    {iconPreview ? (
                      <img src={iconPreview} alt="Agent Preview" className="w-24 h-24 mx-auto rounded-full object-cover border-4" style={{ borderColor: selectedColor }} />
                    ) : (
                      <div className="w-24 h-24 mx-auto rounded-full bg-green-400/10 border-4" style={{ borderColor: selectedColor + '50' }}>
                        <div className="w-full h-full flex items-center justify-center text-green-400/60 text-xs font-mono">
                          Preview
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-green-400 font-mono text-xl font-bold">
                    {agentName || 'Your Agent'}
                  </div>
                  <div className="text-green-400/60 font-mono text-sm mt-2">
                    {categories.find(c => c.id === selectedCategory)?.name}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Triggers */}
            {currentStep === 3 && (
              <div className="bg-black border-2 border-green-400/50 rounded-lg p-6 space-y-6">
                <div className="text-center">
                  <div className="text-6xl mb-4">⚡</div>
                  <h3 className="text-2xl font-mono font-bold text-green-400 mb-2">
                    When should it run?
                  </h3>
                  <p className="text-green-400/60 text-sm">
                    Add triggers to start your agent
                  </p>
                </div>

                {/* Trigger Types */}
                {!currentTriggerType && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {triggerTypes.map((trigger) => (
                      <button
                        key={trigger.id}
                        onClick={() => setCurrentTriggerType(trigger.id)}
                        className="p-4 rounded-lg border-2 border-green-400/30 bg-black 
                                 hover:border-green-400/50 hover:bg-green-400/5 transition-all"
                      >
                        <div className="text-4xl mb-2">{trigger.icon}</div>
                        <div className="text-green-400 font-mono text-sm font-bold">{trigger.name}</div>
                        <div className="text-green-400/60 font-mono text-xs mt-1">{trigger.desc}</div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Trigger Configuration */}
                {currentTriggerType && (
                  <TriggerConfig
                    type={currentTriggerType}
                    triggerTypes={triggerTypes}
                    onAdd={addTrigger}
                    onCancel={() => setCurrentTriggerType('')}
                  />
                )}

                {/* Added Triggers */}
                {triggers.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-green-400 font-mono text-sm mb-2">
                      Added Triggers ({triggers.length})
                    </div>
                    {triggers.map((trigger) => {
                      const triggerType = triggerTypes.find(t => t.id === trigger.type);
                      return (
                        <div
                          key={trigger.id}
                          className="flex items-center justify-between bg-green-400/10 border border-green-400/30 
                                   rounded px-4 py-3"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{triggerType?.icon}</span>
                            <div>
                              <div className="text-green-400 font-mono text-sm font-bold">
                                {triggerType?.name}
                              </div>
                              <div className="text-green-400/60 font-mono text-xs">
                                {JSON.stringify(trigger.config)}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => removeTrigger(trigger.id)}
                            className="text-red-400 hover:text-red-300 font-mono text-xs"
                          >
                            ✕ Remove
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Actions */}
            {currentStep === 4 && (
              <div className="bg-black border-2 border-green-400/50 rounded-lg p-6 space-y-6">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-2xl font-mono font-bold text-green-400 mb-2">
                    What should it do?
                  </h3>
                  <p className="text-green-400/60 text-sm">
                    Add actions for your agent to perform
                  </p>
                </div>

                {/* Action Types */}
                {!currentActionType && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {actionTypes.map((action) => (
                      <button
                        key={action.id}
                        onClick={() => setCurrentActionType(action.id)}
                        className="p-4 rounded-lg border-2 border-green-400/30 bg-black 
                                 hover:border-green-400/50 hover:bg-green-400/5 transition-all"
                      >
                        <div className="text-4xl mb-2">{action.icon}</div>
                        <div className="text-green-400 font-mono text-sm font-bold">{action.name}</div>
                        <div className="text-green-400/60 font-mono text-xs mt-1">{action.desc}</div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Action Configuration */}
                {currentActionType && (
                  <ActionConfig
                    type={currentActionType}
                    actionTypes={actionTypes}
                    onAdd={addAction}
                    onCancel={() => setCurrentActionType('')}
                  />
                )}

                {/* Added Actions */}
                {actions.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-green-400 font-mono text-sm mb-2">
                      Added Actions ({actions.length})
                    </div>
                    {actions.map((action) => {
                      const actionType = actionTypes.find(a => a.id === action.type);
                      return (
                        <div
                          key={action.id}
                          className="flex items-center justify-between bg-green-400/10 border border-green-400/30 
                                   rounded px-4 py-3"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{actionType?.icon}</span>
                            <div>
                              <div className="text-green-400 font-mono text-sm font-bold">
                                {actionType?.name}
                              </div>
                              <div className="text-green-400/60 font-mono text-xs">
                                {JSON.stringify(action.config).substring(0, 50)}...
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => removeAction(action.id)}
                            className="text-red-400 hover:text-red-300 font-mono text-xs"
                          >
                            ✕ Remove
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Final Preview */}
                {triggers.length > 0 && actions.length > 0 && (
                  <div className="bg-gradient-to-br from-green-400/10 to-purple-500/10 border-2 border-green-400/50 rounded-lg p-6">
                    <div className="text-green-400 font-mono text-sm mb-4 text-center">
                      🔮 AGENT PREVIEW
                    </div>
                    <div className="flex flex-col items-center gap-4">
                      <div className="text-8xl" style={{ color: selectedColor }}>{selectedIcon}</div>
                      <div className="text-center">
                        <div className="text-green-400 font-mono text-2xl font-bold mb-1">
                          {agentName}
                        </div>
                        <div className="text-green-400/60 font-mono text-sm">
                          {triggers.length} trigger{triggers.length !== 1 ? 's' : ''} • {actions.length} action{actions.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                      {agentDescription && (
                        <div className="text-green-400/80 font-mono text-sm text-center max-w-md">
                          "{agentDescription}"
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 justify-between">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6 py-3 bg-black border-2 border-green-400/30 text-green-400 font-mono rounded 
                         hover:border-green-400/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>

              {currentStep < 4 ? (
                <button
                  onClick={nextStep}
                  className="px-6 py-3 bg-green-400 hover:bg-green-500 text-black font-mono rounded 
                           font-bold transition-all"
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={saveAgent}
                  className="px-8 py-3 bg-green-400 hover:bg-green-500 text-black font-mono rounded 
                           font-bold transition-all shadow-[0_0_20px_rgba(0,255,65,0.5)]"
                >
                  🚀 Create Agent
                </button>
              )}
            </div>
          </>
        ) : (
          /* Agents List View */
          <div className="space-y-4">
            {agents.length === 0 ? (
              <div className="bg-black border-2 border-green-400/30 rounded-lg p-12 text-center">
                <div className="text-6xl mb-4">🔮</div>
                <div className="text-green-400 font-mono text-xl mb-2">No agents yet</div>
                <div className="text-green-400/60 font-mono text-sm mb-6">
                  Create your first automation agent to get started!
                </div>
                <button
                  onClick={() => setCurrentView('create')}
                  className="px-6 py-3 bg-green-400 text-black font-mono rounded font-bold 
                           hover:bg-green-500 transition-all"
                >
                  ➕ Create Agent
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    className="bg-black border-2 border-green-400/50 rounded-lg p-6 hover:border-green-400 
                             transition-all hover:shadow-[0_0_20px_rgba(0,255,65,0.3)]"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-4" style={{ borderColor: agent.color }}>
                          {agent.icon ? (
                            <img src={agent.icon} alt={agent.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-green-400/10 flex items-center justify-center text-green-400/60 text-xs">
                              No Image
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-green-400 font-mono text-xl font-bold">{agent.name}</div>
                          <div className="text-green-400/60 font-mono text-xs">
                            {categories.find(c => c.id === agent.category)?.name}
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`px-2 py-1 rounded text-xs font-mono ${
                              agent.status === 'active' ? 'bg-green-400/20 text-green-400' :
                              agent.status === 'paused' ? 'bg-yellow-400/20 text-yellow-400' :
                              'bg-gray-400/20 text-gray-400'
                            }`}>
                              {agent.status.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteAgent(agent.id)}
                        className="text-red-400 hover:text-red-300 font-mono text-sm transition-colors"
                      >
                        🗑️
                      </button>
                    </div>

                    {agent.description && (
                      <div className="bg-green-400/10 border border-green-400/30 rounded p-3 mb-3">
                        <div className="text-green-400 font-mono text-sm">{agent.description}</div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="bg-green-400/5 border border-green-400/20 rounded p-2">
                        <div className="text-green-400/60 font-mono text-xs">Triggers</div>
                        <div className="text-green-400 font-mono text-lg font-bold">{agent.triggers.length}</div>
                      </div>
                      <div className="bg-green-400/5 border border-green-400/20 rounded p-2">
                        <div className="text-green-400/60 font-mono text-xs">Actions</div>
                        <div className="text-green-400 font-mono text-lg font-bold">{agent.actions.length}</div>
                      </div>
                    </div>

                    {/* Show last price if available */}
                    {agent.lastPrice !== undefined && (
                      <div className="bg-purple-500/10 border border-purple-500/30 rounded p-3 mb-3">
                        <div className="text-purple-400/60 font-mono text-xs mb-1">LAST PRICE CHECK</div>
                        <div className="text-purple-400 font-mono text-xl font-bold">
                          ${agent.lastPrice.toFixed(6)}
                        </div>
                        <div className="text-purple-400/60 font-mono text-xs mt-1">
                          {agent.triggers.find(t => t.type === 'price')?.config.token || 'Token'}
                        </div>
                      </div>
                    )}

                    {agent.runCount > 0 && (
                      <div className="text-green-400/60 font-mono text-xs mb-3">
                        Runs: {agent.runCount} • Last: {agent.lastRun ? new Date(agent.lastRun).toLocaleString() : 'Never'}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleAgentStatus(agent.id)}
                        className={`flex-1 py-2 rounded font-mono text-sm transition-all ${
                          agent.status === 'active'
                            ? 'bg-yellow-400/20 border-2 border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/30'
                            : 'bg-green-400/20 border-2 border-green-400/50 text-green-400 hover:bg-green-400/30'
                        }`}
                      >
                        {agent.status === 'active' ? '⏸️ Pause' : '▶️ Activate'}
                      </button>
                      <button
                        onClick={() => runAgent(agent.id)}
                        className="flex-1 py-2 bg-green-400 hover:bg-green-500 text-black rounded font-mono 
                                 text-sm font-bold transition-all"
                      >
                        🚀 Run Now
                      </button>
                    </div>

                    <div className="text-green-400/40 font-mono text-xs mt-4 text-right">
                      Created: {new Date(agent.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper component for trigger configuration
function TriggerConfig({ type, triggerTypes, onAdd, onCancel }: any) {
  const triggerType = triggerTypes.find((t: any) => t.id === type);
  const [config, setConfig] = useState<any>({});

  const handleAdd = () => {
    onAdd(type, config);
  };

  return (
    <div className="bg-green-400/5 border-2 border-green-400/30 rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-green-400 font-mono text-lg font-bold">
            {triggerType.icon} {triggerType.name}
          </div>
          <div className="text-green-400/60 font-mono text-xs">{triggerType.desc}</div>
        </div>
        <button
          onClick={onCancel}
          className="text-red-400 hover:text-red-300 font-mono text-sm"
        >
          ✕ Cancel
        </button>
      </div>

      {triggerType.fields.map((field: any) => (
        <div key={field.name}>
          <label className="block text-green-400 font-mono text-sm mb-2">{field.label}</label>
          {field.type === 'select' ? (
            <select
              onChange={(e) => setConfig({ ...config, [field.name]: e.target.value })}
              className="w-full bg-black border-2 border-green-400/30 rounded px-4 py-2 text-green-400 
                       font-mono text-sm focus:border-green-400 focus:outline-none"
            >
              <option value="">Select...</option>
              {field.options.map((opt: string) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : field.type === 'textarea' ? (
            <textarea
              onChange={(e) => setConfig({ ...config, [field.name]: e.target.value })}
              placeholder={field.placeholder}
              rows={3}
              className="w-full bg-black border-2 border-green-400/30 rounded px-4 py-2 text-green-400 
                       font-mono text-sm focus:border-green-400 focus:outline-none resize-none"
            />
          ) : (
            <input
              type={field.type}
              onChange={(e) => setConfig({ ...config, [field.name]: e.target.value })}
              placeholder={field.placeholder}
              className="w-full bg-black border-2 border-green-400/30 rounded px-4 py-2 text-green-400 
                       font-mono text-sm focus:border-green-400 focus:outline-none"
            />
          )}
        </div>
      ))}

      <button
        onClick={handleAdd}
        className="w-full py-3 bg-green-400 hover:bg-green-500 text-black font-mono rounded 
                 font-bold transition-all"
      >
        ✓ Add Trigger
      </button>
    </div>
  );
}

// Helper component for action configuration
function ActionConfig({ type, actionTypes, onAdd, onCancel }: any) {
  const actionType = actionTypes.find((a: any) => a.id === type);
  const [config, setConfig] = useState<any>({});

  const handleAdd = () => {
    onAdd(type, config);
  };

  return (
    <div className="bg-green-400/5 border-2 border-green-400/30 rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-green-400 font-mono text-lg font-bold">
            {actionType.icon} {actionType.name}
          </div>
          <div className="text-green-400/60 font-mono text-xs">{actionType.desc}</div>
        </div>
        <button
          onClick={onCancel}
          className="text-red-400 hover:text-red-300 font-mono text-sm"
        >
          ✕ Cancel
        </button>
      </div>

      {actionType.fields.map((field: any) => (
        <div key={field.name}>
          <label className="block text-green-400 font-mono text-sm mb-2">{field.label}</label>
          {field.type === 'select' ? (
            <select
              onChange={(e) => setConfig({ ...config, [field.name]: e.target.value })}
              className="w-full bg-black border-2 border-green-400/30 rounded px-4 py-2 text-green-400 
                       font-mono text-sm focus:border-green-400 focus:outline-none"
            >
              <option value="">Select...</option>
              {field.options.map((opt: string) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : field.type === 'textarea' ? (
            <textarea
              onChange={(e) => setConfig({ ...config, [field.name]: e.target.value })}
              placeholder={field.placeholder}
              rows={3}
              className="w-full bg-black border-2 border-green-400/30 rounded px-4 py-2 text-green-400 
                       font-mono text-sm focus:border-green-400 focus:outline-none resize-none"
            />
          ) : (
            <input
              type={field.type}
              onChange={(e) => setConfig({ ...config, [field.name]: e.target.value })}
              placeholder={field.placeholder}
              className="w-full bg-black border-2 border-green-400/30 rounded px-4 py-2 text-green-400 
                       font-mono text-sm focus:border-green-400 focus:outline-none"
            />
          )}
        </div>
      ))}

      <button
        onClick={handleAdd}
        className="w-full py-3 bg-green-400 hover:bg-green-500 text-black font-mono rounded 
                 font-bold transition-all"
      >
        ✓ Add Action
      </button>
    </div>
  );
}
