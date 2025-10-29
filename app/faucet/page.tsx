'use client';

import { useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useX402Token } from '@/hooks/useX402Token';
import { X402_CONFIG } from '@/utils/x402Token';

export default function FaucetPage() {
  const router = useRouter();
  const { authenticated, user } = usePrivy();
  const {
    balance,
    cooldown,
    loading,
    error,
    claimX402
  } = useX402Token();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authenticated) {
      router.push('/');
    }
  }, [authenticated, router]);

  const handleClaimX402 = async () => {
    if (!cooldown.canClaim) return;
    
    const result = await claimX402(X402_CONFIG.FAUCET_AMOUNT);
    if (result) {
      alert(`Success! Claimed ${X402_CONFIG.FAUCET_AMOUNT.toLocaleString()} x402 tokens`);
    }
  };

  if (!authenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => router.push('/')}
          className="mb-8 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        >
          ← Back to Desktop
        </button>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">x402 Faucet</h1>
          <p className="text-xl text-gray-300">
            Claim free x402 tokens to use applications
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Wallet: {user?.wallet?.address?.slice(0, 8)}...{user?.wallet?.address?.slice(-6)}
          </p>
        </div>

        {/* Balance Display */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Your Balances</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-xl p-6">
              <div className="text-sm text-gray-300 mb-2">SOL Balance (Mainnet)</div>
              <div className="text-4xl font-bold">
                {loading ? '...' : balance.sol.toFixed(4)} SOL
              </div>
              <div className="text-xs text-gray-400 mt-2">Real mainnet balance</div>
            </div>
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-6">
              <div className="text-sm text-gray-300 mb-2">x402 Token Balance</div>
              <div className="text-4xl font-bold">
                {loading ? '...' : balance.x402.toLocaleString()} x402
              </div>
              <div className="text-xs text-gray-400 mt-2">Available for use</div>
            </div>
          </div>
        </div>

        {/* Cooldown Warning */}
        {!cooldown.canClaim && (
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-4 mb-8 text-center">
            <p className="text-lg">
              ⏰ Cooldown Active: Wait {cooldown.formattedTime} before claiming again
            </p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-8 text-center">
            <p className="text-lg">❌ {error}</p>
          </div>
        )}

        {/* Faucet Actions */}
        <div className="max-w-md mx-auto mb-8">
          {/* Claim x402 - Centered */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🪙</div>
              <h3 className="text-3xl font-bold mb-2">
                Claim {X402_CONFIG.FAUCET_AMOUNT.toLocaleString()} x402
              </h3>
              <p className="text-gray-300">
                Get tokens to use x402 applications
              </p>
            </div>
            <button
              onClick={handleClaimX402}
              disabled={!cooldown.canClaim || loading}
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all ${
                !cooldown.canClaim || loading
                  ? 'bg-gray-500 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 hover:scale-105'
              }`}
            >
              {loading ? 'Processing...' : 'Claim Tokens'}
            </button>
          </div>
        </div>

        {/* Information */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-4">How it Works</h3>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start">
              <span className="mr-3">🎯</span>
              <span>Each x402 application costs <strong>{X402_CONFIG.APP_FEE.toLocaleString()} tokens</strong> per interaction</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3">⏱️</span>
              <span>You can claim once every <strong>30 minutes</strong></span>
            </li>
            <li className="flex items-start">
              <span className="mr-3">🪙</span>
              <span>Claim <strong>{X402_CONFIG.FAUCET_AMOUNT.toLocaleString()} x402 tokens</strong> per claim</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3">💾</span>
              <span>Tokens are tracked in your browser (localStorage)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3">🔗</span>
              <span>Connected to <strong>Solana Mainnet</strong> for real wallet data</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3">✨</span>
              <span>Use tokens to interact with all x402 applications</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
