'use client';

import { usePrivy } from '@privy-io/react-auth';

export default function XVaultApp() {
  const { user } = usePrivy();

  const assets = [
    { symbol: 'SOL', name: 'Solana', balance: '2.5', value: '$125.00', change: '+5.2%' },
    { symbol: 'USDC', name: 'USD Coin', balance: '100.00', value: '$100.00', change: '0%' },
    { symbol: 'BONK', name: 'Bonk', balance: '1M', value: '$25.50', change: '+12.8%' },
  ];

  const recentActivity = [
    { type: 'x402pay', action: 'Sent 0.5 SOL', time: '2 hours ago', cost: '0.001 USDC' },
    { type: 'x402ai', action: 'AI Query', time: '5 hours ago', cost: '0.005 USDC' },
    { type: 'x402scan', action: 'Token Scan', time: '1 day ago', cost: '0.003 USDC' },
    { type: 'x402fetch', action: 'API Call', time: '2 days ago', cost: '0.002 USDC' },
  ];

  return (
    <div className="h-full overflow-auto p-6 space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Balance */}
        <div className="bg-green-400/10 border-2 border-green-400/50 rounded-lg p-6">
          <div className="text-green-400/60 text-sm font-mono mb-2">Total Balance</div>
          <div className="text-green-400 text-3xl font-mono font-bold">$250.50</div>
          <div className="text-green-400 text-sm font-mono mt-2">+8.5% this month</div>
        </div>

        {/* XP Points */}
        <div className="bg-purple-500/10 border-2 border-purple-500/50 rounded-lg p-6">
          <div className="text-purple-400/60 text-sm font-mono mb-2">XP Points</div>
          <div className="text-purple-400 text-3xl font-mono font-bold">1,250</div>
          <div className="text-purple-400 text-sm font-mono mt-2">Level 5 User</div>
        </div>

        {/* Total Spent */}
        <div className="bg-yellow-500/10 border-2 border-yellow-500/50 rounded-lg p-6">
          <div className="text-yellow-400/60 text-sm font-mono mb-2">Total Spent</div>
          <div className="text-yellow-400 text-3xl font-mono font-bold">$12.50</div>
          <div className="text-yellow-400 text-sm font-mono mt-2">This month</div>
        </div>
      </div>

      {/* Wallet Info */}
      <div className="bg-black border-2 border-green-400/30 rounded-lg p-6">
        <h3 className="text-green-400 font-mono font-bold text-lg mb-4">Wallet Information</h3>
        <div className="space-y-3">
          <div className="flex justify-between font-mono text-sm">
            <span className="text-green-400/60">Address:</span>
            <span className="text-green-400">{user?.wallet?.address?.slice(0, 20)}...</span>
          </div>
          <div className="flex justify-between font-mono text-sm">
            <span className="text-green-400/60">Email:</span>
            <span className="text-green-400">{user?.email?.address || 'Not connected'}</span>
          </div>
          <div className="flex justify-between font-mono text-sm">
            <span className="text-green-400/60">Network:</span>
            <span className="text-green-400">Solana Mainnet-Beta</span>
          </div>
          <div className="flex justify-between font-mono text-sm">
            <span className="text-green-400/60">Member Since:</span>
            <span className="text-green-400">{new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Assets */}
      <div className="bg-black border-2 border-green-400/30 rounded-lg p-6">
        <h3 className="text-green-400 font-mono font-bold text-lg mb-4">Your Assets</h3>
        <div className="space-y-3">
          {assets.map((asset) => (
            <div
              key={asset.symbol}
              className="flex items-center justify-between p-4 bg-green-400/5 border border-green-400/20 
                       rounded hover:bg-green-400/10 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-400/20 border border-green-400/50 rounded-full 
                             flex items-center justify-center font-mono font-bold text-green-400">
                  {asset.symbol[0]}
                </div>
                <div>
                  <div className="font-mono font-bold text-green-400">{asset.symbol}</div>
                  <div className="text-green-400/60 text-xs font-mono">{asset.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono font-bold text-green-400">{asset.balance} {asset.symbol}</div>
                <div className="text-green-400/60 text-xs font-mono">{asset.value}</div>
                <div className={`text-xs font-mono ${asset.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                  {asset.change}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-black border-2 border-green-400/30 rounded-lg p-6">
        <h3 className="text-green-400 font-mono font-bold text-lg mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity.map((activity, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 bg-green-400/5 border border-green-400/20 
                       rounded hover:bg-green-400/10 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="text-2xl">
                  {activity.type === 'x402pay' && '💳'}
                  {activity.type === 'x402ai' && '🤖'}
                  {activity.type === 'x402scan' && '🔍'}
                  {activity.type === 'x402fetch' && '🌐'}
                </div>
                <div>
                  <div className="font-mono text-green-400">{activity.type}</div>
                  <div className="text-green-400/60 text-xs font-mono">{activity.action}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-green-400 text-sm">{activity.cost}</div>
                <div className="text-green-400/60 text-xs font-mono">{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* XP Progress */}
      <div className="bg-purple-500/10 border-2 border-purple-500/30 rounded-lg p-6">
        <h3 className="text-purple-400 font-mono font-bold text-lg mb-4">XP Progress</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm font-mono mb-2">
              <span className="text-purple-400/60">Level 5</span>
              <span className="text-purple-400">1,250 / 2,000 XP</span>
            </div>
            <div className="w-full bg-black border border-purple-500/30 rounded-full h-4">
              <div 
                className="bg-purple-500 h-full rounded-full transition-all duration-500"
                style={{ width: '62.5%' }}
              />
            </div>
          </div>
          <div className="text-purple-400/60 text-xs font-mono">
            750 XP until Level 6 • Earn XP by using x402 apps
          </div>
        </div>
      </div>
    </div>
  );
}
