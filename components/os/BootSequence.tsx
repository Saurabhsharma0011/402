'use client';

import { useState, useEffect } from 'react';

const bootMessages = [
  'x402OS v1.0.0 Initializing...',
  'Loading kernel modules...',
  'Mounting Solana blockchain [OK]',
  'Initializing payment verification system...',
  'Starting x402 protocol daemon [OK]',
  'Loading xCore controller...',
  'Checking Privy authentication service [OK]',
  'Loading xPay module...',
  'Loading xAI module...',
  'Loading xFetch module...',
  'Loading xVault module...',
  'System ready. HTTP 402: Payment Gateway.',
];

export default function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [messages, setMessages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < bootMessages.length) {
      const timer = setTimeout(() => {
        setMessages(prev => [...prev, bootMessages[currentIndex]]);
        setCurrentIndex(prev => prev + 1);
      }, 200);
      return () => clearTimeout(timer);
    } else {
      const completeTimer = setTimeout(onComplete, 800);
      return () => clearTimeout(completeTimer);
    }
  }, [currentIndex, onComplete]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 overflow-hidden">
      {/* CRT Scanlines */}
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(transparent_50%,rgba(16,185,129,0.02)_50%)] bg-[length:100%_4px] animate-scan" />
      
      <div className="w-full max-w-4xl p-8 font-mono relative z-10">
        {/* x402OS Logo */}
        <div className="mb-8 text-center">
          <div className="text-green-400 text-7xl font-bold animate-pulse mb-2">
            x402<span className="text-purple-500">OS</span>
          </div>
          <div className="text-green-400/60 text-sm tracking-widest">
            PAYMENT GATEWAY OPERATING SYSTEM
          </div>
        </div>
        
        {/* Boot Messages */}
        <div className="space-y-1 min-h-[300px]">
          {messages.map((msg, idx) => (
            <div key={idx} className="text-green-400 text-sm flex items-start">
              <span className="text-gray-500 mr-3">[{String(idx).padStart(2, '0')}]</span>
              <span className="flex-1">{msg}</span>
              {idx === messages.length - 1 && (
                <span className="ml-2 animate-pulse text-green-400">█</span>
              )}
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mt-8">
          <div className="flex justify-between text-xs text-green-400/60 mb-2">
            <span>Loading system modules...</span>
            <span>{Math.round((currentIndex / bootMessages.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-900 h-3 rounded border border-green-400/30">
            <div 
              className="bg-green-400 h-full rounded transition-all duration-200 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
              style={{ width: `${(currentIndex / bootMessages.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Bottom Status */}
        <div className="mt-6 text-center text-green-400/40 text-xs">
          <p>Solana Mainnet • Devnet Ready • Payment Protocol Active</p>
        </div>
      </div>
    </div>
  );
}
