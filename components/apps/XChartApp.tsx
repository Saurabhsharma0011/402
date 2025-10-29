'use client';

import { useEffect, useState } from 'react';

export default function XChartApp() {
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    // Auto-open dexscreener.com when app loads
    if (!opened) {
      window.open('https://dexscreener.com/', '_blank');
      setOpened(true);
    }
  }, [opened]);

  const handleOpenDexScreener = () => {
    window.open('https://dexscreener.com/', '_blank');
  };

  return (
    <div className="h-full flex flex-col bg-black">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-400/10 to-blue-500/10 border-b border-green-400/30 px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="text-4xl">📊</div>
          <div>
            <h2 className="text-xl font-mono font-bold text-green-400">x402chart</h2>
            <p className="text-xs text-green-400/60 font-mono">Live Trading Charts • Powered by DexScreener</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full space-y-6">
          {/* Success Message */}
          <div className="bg-green-400/10 border-2 border-green-400/30 rounded-lg p-6 text-center">
            <div className="text-5xl mb-4">✓</div>
            <h3 className="text-green-400 font-mono text-xl font-bold mb-2">
              DexScreener Opened Successfully!
            </h3>
            <p className="text-green-400/60 font-mono text-sm mb-4">
              The chart viewer has been opened in a new tab
            </p>
            <p className="text-green-400/40 font-mono text-xs">
              If it didn't open, click the button below to launch manually
            </p>
          </div>

          {/* Manual Open Button */}
          <button
            onClick={handleOpenDexScreener}
            className="w-full bg-green-400/20 hover:bg-green-400/30 border-2 border-green-400 
                     text-green-400 font-mono font-bold py-4 px-6 rounded-lg transition-all
                     hover:shadow-[0_0_20px_rgba(0,255,65,0.3)] active:scale-95"
          >
            🚀 Open DexScreener
          </button>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div className="bg-black border border-green-400/30 rounded-lg p-4">
              <div className="text-2xl mb-2">📈</div>
              <h4 className="text-green-400 font-mono font-bold text-sm mb-1">Live Charts</h4>
              <p className="text-green-400/60 font-mono text-xs">
                Real-time price charts for all tokens
              </p>
            </div>

            <div className="bg-black border border-green-400/30 rounded-lg p-4">
              <div className="text-2xl mb-2">💹</div>
              <h4 className="text-green-400 font-mono font-bold text-sm mb-1">Trading Data</h4>
              <p className="text-green-400/60 font-mono text-xs">
                Volume, liquidity, and market stats
              </p>
            </div>

            <div className="bg-black border border-green-400/30 rounded-lg p-4">
              <div className="text-2xl mb-2">🔍</div>
              <h4 className="text-green-400 font-mono font-bold text-sm mb-1">Token Search</h4>
              <p className="text-green-400/60 font-mono text-xs">
                Find any token across all chains
              </p>
            </div>

            <div className="bg-black border border-green-400/30 rounded-lg p-4">
              <div className="text-2xl mb-2">⚡</div>
              <h4 className="text-green-400 font-mono font-bold text-sm mb-1">Multi-Chain</h4>
              <p className="text-green-400/60 font-mono text-xs">
                Solana, Ethereum, BSC, and more
              </p>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-400/5 border border-blue-400/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-blue-400 text-xl">ℹ️</div>
              <div>
                <h4 className="text-blue-400 font-mono font-bold text-sm mb-1">About DexScreener</h4>
                <p className="text-blue-400/60 font-mono text-xs">
                  DexScreener is the #1 platform for tracking DEX trading pairs across multiple blockchains. 
                  View live charts, analyze trading volume, check liquidity pools, and discover trending tokens.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
