'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useState, useEffect } from 'react';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

interface Transaction {
  signature: string;
  timestamp: number;
  type: string;
  status: 'success' | 'error';
}

export default function XVaultApp() {
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address;
  
  const [solBalance, setSolBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!walletAddress) return;

    const fetchWalletData = async () => {
      try {
        setLoading(true);
        setError(null);

        const rpcUrl = process.env.NEXT_PUBLIC_HELIUS_RPC_URL || 'https://api.mainnet-beta.solana.com';
        const connection = new Connection(rpcUrl, 'confirmed');
        const publicKey = new PublicKey(walletAddress);

        const balance = await connection.getBalance(publicKey);
        setSolBalance(balance / LAMPORTS_PER_SOL);

        const signatures = await connection.getSignaturesForAddress(publicKey, { limit: 10 });
        
        const txs: Transaction[] = signatures.map(sig => ({
          signature: sig.signature,
          timestamp: sig.blockTime ? sig.blockTime * 1000 : Date.now(),
          type: sig.err ? 'Failed Transaction' : 'Transaction',
          status: sig.err ? 'error' : 'success'
        }));

        setTransactions(txs);
      } catch (err: any) {
        console.error('Error fetching wallet data:', err);
        setError(err.message || 'Failed to fetch wallet data');
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [walletAddress]);

  const timeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="h-full overflow-auto p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-400/10 border-2 border-green-400/50 rounded-lg p-6">
          <div className="text-green-400/60 text-sm font-mono mb-2">SOL Balance</div>
          {loading ? (
            <div className="text-green-400 text-xl font-mono">Loading...</div>
          ) : error ? (
            <div className="text-red-400 text-sm font-mono">{error}</div>
          ) : (
            <>
              <div className="text-green-400 text-3xl font-mono font-bold">
                {solBalance.toFixed(4)} SOL
              </div>
              <div className="text-green-400/60 text-sm font-mono mt-2">Mainnet Balance</div>
            </>
          )}
        </div>

        <div className="bg-purple-500/10 border-2 border-purple-500/50 rounded-lg p-6">
          <div className="text-purple-400/60 text-sm font-mono mb-2">Recent Transactions</div>
          <div className="text-purple-400 text-3xl font-mono font-bold">{transactions.length}</div>
          <div className="text-purple-400/60 text-sm font-mono mt-2">Last 10 transactions</div>
        </div>
      </div>

      <div className="bg-black border-2 border-green-400/30 rounded-lg p-6">
        <h3 className="text-green-400 font-mono font-bold text-lg mb-4">Wallet Information</h3>
        <div className="space-y-3">
          <div className="flex justify-between font-mono text-sm">
            <span className="text-green-400/60">Address:</span>
            <span className="text-green-400 break-all">{walletAddress}</span>
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

      <div className="bg-black border-2 border-green-400/30 rounded-lg p-6">
        <h3 className="text-green-400 font-mono font-bold text-lg mb-4">Transaction History</h3>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="text-green-400 font-mono animate-pulse">Loading transactions...</div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="text-red-400 font-mono text-sm">{error}</div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-green-400/60 font-mono">No transactions found</div>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.signature}
                className="flex items-center justify-between p-4 bg-green-400/5 border border-green-400/20 rounded hover:bg-green-400/10 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="text-2xl">
                    {tx.status === 'success' ? '✅' : '❌'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-green-400 text-sm">{tx.type}</div>
                    <div className="text-green-400/60 text-xs font-mono truncate">
                      {tx.signature.slice(0, 30)}...
                    </div>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-green-400/60 text-xs font-mono whitespace-nowrap">
                    {timeAgo(tx.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {transactions.length > 0 && (
          <div className="mt-4 text-center">
            <a
              href={`https://solscan.io/account/${walletAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-green-400/10 border border-green-400/30 rounded text-green-400 font-mono text-sm hover:bg-green-400/20 transition-colors"
            >
              View on Solscan →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
