'use client';

import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import Image from 'next/image';

export default function XPayApp() {
  const { user } = usePrivy();
  const [activeTab, setActiveTab] = useState<'send' | 'receive' | 'history'>('send');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [token, setToken] = useState('SOL');

  const transactions = [
    { id: 1, type: 'sent', amount: '0.5 SOL', to: 'abc...xyz', date: '2025-10-28', fee: '0.001 USDC' },
    { id: 2, type: 'received', amount: '1.2 USDC', from: 'def...123', date: '2025-10-27', fee: '0.001 USDC' },
    { id: 3, type: 'sent', amount: '0.25 SOL', to: 'ghi...456', date: '2025-10-26', fee: '0.001 USDC' },
  ];

  const handleSend = () => {
    console.log('Sending:', { amount, recipient, token });
    alert(`Sending ${amount} ${token} to ${recipient}\nFee: 0.001 USDC`);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header with Logo */}
      <div className="bg-gradient-to-r from-green-400/10 to-purple-500/10 border-b border-green-400/30 px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 flex-shrink-0">
            <Image 
              src="/solanapay.png" 
              alt="x402pay logo" 
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
          <div>
            <h2 className="text-xl font-mono font-bold text-green-400">x402pay</h2>
            <p className="text-xs text-green-400/60 font-mono">Instant Solana Payments • Powered by Solana Pay</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-green-400/30">{['send', 'receive', 'history'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`flex-1 py-3 px-4 font-mono text-sm uppercase transition-colors ${
              activeTab === tab
                ? 'bg-green-400/20 text-green-400 border-b-2 border-green-400'
                : 'text-green-400/60 hover:text-green-400 hover:bg-green-400/5'
            }`}
          >
            {tab === 'send' && '📤'} {tab === 'receive' && '📥'} {tab === 'history' && '📜'} {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Send Tab */}
        {activeTab === 'send' && (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-mono font-bold text-green-400 mb-2">Send Payment</h2>
              <p className="text-green-400/60 text-sm">Instant Solana transfers with minimal fees</p>
            </div>

            {/* Token Selection */}
            <div>
              <label className="block text-green-400 font-mono text-sm mb-2">Select Token</label>
              <div className="grid grid-cols-3 gap-3">
                {['SOL', 'USDC', 'USDT'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setToken(t)}
                    className={`py-3 px-4 border-2 rounded font-mono transition-all ${
                      token === t
                        ? 'bg-green-400/20 border-green-400 text-green-400'
                        : 'bg-black border-green-400/30 text-green-400/60 hover:border-green-400/50'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Input */}
            <div>
              <label className="block text-green-400 font-mono text-sm mb-2">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-black border-2 border-green-400/30 rounded px-4 py-3 text-green-400 
                         font-mono text-xl focus:border-green-400 focus:outline-none"
              />
              <div className="text-green-400/60 text-xs mt-1 font-mono">≈ $0.00 USD</div>
            </div>

            {/* Recipient Input */}
            <div>
              <label className="block text-green-400 font-mono text-sm mb-2">Recipient Address</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Enter Solana address..."
                className="w-full bg-black border-2 border-green-400/30 rounded px-4 py-3 text-green-400 
                         font-mono text-sm focus:border-green-400 focus:outline-none"
              />
            </div>

            {/* Fee Display */}
            <div className="bg-green-400/5 border border-green-400/30 rounded p-4">
              <div className="flex justify-between text-sm font-mono">
                <span className="text-green-400/60">Network Fee:</span>
                <span className="text-green-400">~0.000005 SOL</span>
              </div>
              <div className="flex justify-between text-sm font-mono mt-2">
                <span className="text-green-400/60">x402pay Fee:</span>
                <span className="text-green-400">0.001 USDC</span>
              </div>
              <div className="border-t border-green-400/30 mt-3 pt-3">
                <div className="flex justify-between font-mono font-bold">
                  <span className="text-green-400">Total:</span>
                  <span className="text-green-400">{amount || '0.00'} {token}</span>
                </div>
              </div>
            </div>

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={!amount || !recipient}
              className="w-full bg-green-400 hover:bg-green-500 text-black font-mono py-4 px-6 rounded 
                       font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed
                       shadow-[0_0_20px_rgba(0,255,65,0.3)] hover:shadow-[0_0_30px_rgba(0,255,65,0.5)]"
            >
              🚀 SEND PAYMENT
            </button>
          </div>
        )}

        {/* Receive Tab */}
        {activeTab === 'receive' && (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-mono font-bold text-green-400 mb-2">Receive Payment</h2>
              <p className="text-green-400/60 text-sm">Share your address or QR code</p>
            </div>

            {/* QR Code Placeholder */}
            <div className="flex justify-center">
              <div className="w-64 h-64 bg-green-400/10 border-2 border-green-400/30 rounded-lg 
                           flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">📱</div>
                  <div className="text-green-400/60 font-mono text-sm">QR Code</div>
                </div>
              </div>
            </div>

            {/* Address Display */}
            <div>
              <label className="block text-green-400 font-mono text-sm mb-2">Your Address</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={user?.wallet?.address || 'Not connected'}
                  readOnly
                  className="flex-1 bg-black border-2 border-green-400/30 rounded px-4 py-3 text-green-400 
                           font-mono text-sm"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(user?.wallet?.address || '')}
                  className="bg-green-400/20 border-2 border-green-400/50 rounded px-4 hover:bg-green-400/30 
                           transition-colors text-green-400 font-mono"
                >
                  📋 Copy
                </button>
              </div>
            </div>

            {/* Payment Link */}
            <div>
              <label className="block text-green-400 font-mono text-sm mb-2">Payment Link</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={`https://x402os.com/pay/${user?.wallet?.address?.slice(0, 8)}`}
                  readOnly
                  className="flex-1 bg-black border-2 border-green-400/30 rounded px-4 py-3 text-green-400 
                           font-mono text-sm"
                />
                <button
                  className="bg-green-400/20 border-2 border-green-400/50 rounded px-4 hover:bg-green-400/30 
                           transition-colors text-green-400 font-mono"
                >
                  🔗 Share
                </button>
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-mono font-bold text-green-400 mb-2">Transaction History</h2>
              <p className="text-green-400/60 text-sm">All your x402pay transactions</p>
            </div>

            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-green-400/5 border border-green-400/30 rounded p-4 hover:bg-green-400/10 
                         transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {tx.type === 'sent' ? '📤' : '📥'}
                    </span>
                    <div>
                      <div className="font-mono font-bold text-green-400">
                        {tx.type === 'sent' ? 'Sent' : 'Received'}
                      </div>
                      <div className="text-green-400/60 text-xs font-mono">
                        {tx.type === 'sent' ? `To: ${tx.to}` : `From: ${tx.from}`}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-green-400">{tx.amount}</div>
                    <div className="text-green-400/60 text-xs font-mono">{tx.date}</div>
                  </div>
                </div>
                <div className="text-green-400/60 text-xs font-mono">Fee: {tx.fee}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
