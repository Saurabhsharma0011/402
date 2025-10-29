'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';

export default function WalletInfo() {
  const { authenticated, user } = usePrivy();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    // In a real implementation, you'd fetch the Solana balance here
    // using Connection from @solana/web3.js
    if (authenticated && user?.wallet?.address) {
      // Simulated balance for demo
      setBalance(1.234);
    }
  }, [authenticated, user]);

  if (!authenticated || !user) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 p-6 bg-black border-2 border-green-400/30 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
      {/* Terminal Header */}
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-green-400/30">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="ml-2 text-green-400/70 font-mono text-sm">x402OS://xVault</span>
      </div>

      {/* Wallet Details */}
      <div className="space-y-3 font-mono text-sm">
        <div className="flex justify-between">
          <span className="text-green-400/70">STATUS:</span>
          <span className="text-green-400">● CONNECTED</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-green-400/70">WALLET:</span>
          <span className="text-green-400">{user.wallet?.address || 'N/A'}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-green-400/70">CHAIN:</span>
          <span className="text-green-400">SOLANA-MAINNET</span>
        </div>
        
        {balance !== null && (
          <div className="flex justify-between">
            <span className="text-green-400/70">BALANCE:</span>
            <span className="text-green-400">{balance.toFixed(4)} SOL</span>
          </div>
        )}
        
        <div className="flex justify-between">
          <span className="text-green-400/70">AUTH METHOD:</span>
          <span className="text-green-400">{user.linkedAccounts[0]?.type?.toUpperCase() || 'WALLET'}</span>
        </div>

        <div className="flex justify-between pt-3 mt-3 border-t border-green-400/30">
          <span className="text-green-400/70">SESSION XP:</span>
          <span className="text-green-400 animate-pulse">0 XP</span>
        </div>
      </div>

      {/* System Message */}
      <div className="mt-4 p-3 bg-green-400/5 border border-green-400/20">
        <p className="text-green-400/80 font-mono text-xs">
          <span className="text-green-400">&gt;</span> System initialized. Ready for payment-verified actions.
        </p>
      </div>
    </div>
  );
}
