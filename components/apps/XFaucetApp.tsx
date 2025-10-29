'use client';

import { useRouter } from 'next/navigation';

export default function XFaucetApp() {
  const router = useRouter();

  return (
    <div className="h-full flex flex-col bg-black">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-400/10 to-purple-500/10 border-b border-green-400/30 px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="text-4xl">🪙</div>
          <div>
            <h2 className="text-xl font-mono font-bold text-green-400">x402faucet</h2>
            <p className="text-xs text-green-400/60 font-mono">Claim x402 Tokens • SPL Token Faucet</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full space-y-6">
          {/* Faucet Portal */}
          <div className="bg-green-400/10 border-2 border-green-400/30 rounded-lg p-6 text-center">
            <div className="text-6xl mb-4">🪙</div>
            <h3 className="text-green-400 font-mono text-2xl font-bold mb-3">
              x402 Token Faucet
            </h3>
            <p className="text-green-400/80 font-mono text-sm mb-4">
              Claim real SPL tokens on Solana Devnet
            </p>
            <p className="text-green-400/40 font-mono text-xs">
              Get 10,000 x402 tokens and 1 SOL for gas fees
            </p>
          </div>

          {/* Go to Faucet Button */}
          <button
            onClick={() => router.push('/faucet')}
            className="w-full bg-green-400/20 hover:bg-green-400/30 border-2 border-green-400 
                     text-green-400 font-mono font-bold py-4 px-6 rounded-lg transition-all
                     hover:shadow-[0_0_20px_rgba(0,255,65,0.3)] active:scale-95"
          >
            🚀 Go to Faucet Page
          </button>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div className="bg-black border border-green-400/30 rounded-lg p-4">
              <div className="text-3xl mb-2">🪙</div>
              <h4 className="text-green-400 font-mono font-bold text-sm mb-1">10,000 Tokens</h4>
              <p className="text-green-400/60 font-mono text-xs">
                Claim 10,000 x402 tokens per request
              </p>
            </div>

            <div className="bg-black border border-green-400/30 rounded-lg p-4">
              <div className="text-3xl mb-2">💧</div>
              <h4 className="text-green-400 font-mono font-bold text-sm mb-1">1 SOL Airdrop</h4>
              <p className="text-green-400/60 font-mono text-xs">
                Get Devnet SOL for transaction fees
              </p>
            </div>

            <div className="bg-black border border-green-400/30 rounded-lg p-4">
              <div className="text-3xl mb-2">⏱️</div>
              <h4 className="text-green-400 font-mono font-bold text-sm mb-1">30-Min Cooldown</h4>
              <p className="text-green-400/60 font-mono text-xs">
                Claim once every 30 minutes
              </p>
            </div>

            <div className="bg-black border border-green-400/30 rounded-lg p-4">
              <div className="text-3xl mb-2">🔗</div>
              <h4 className="text-green-400 font-mono font-bold text-sm mb-1">On-Chain</h4>
              <p className="text-green-400/60 font-mono text-xs">
                Real SPL tokens on Solana Devnet
              </p>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-400/5 border border-blue-400/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-blue-400 text-2xl">ℹ️</div>
              <div>
                <h4 className="text-blue-400 font-mono font-bold text-sm mb-1">How it Works</h4>
                <p className="text-blue-400/60 font-mono text-xs">
                  The x402 faucet distributes real SPL tokens on Solana Devnet. Each application costs 4,000 tokens per interaction. 
                  Claim 10,000 tokens and 1 SOL every 30 minutes. Your tokens are stored on-chain in your wallet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
