'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useState, useEffect, useRef } from 'react';

export default function Terminal() {
  const { user, logout } = usePrivy();
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<string[]>([
    '╔════════════════════════════════════════════════════════════════╗',
    '║  Welcome to x402OS - The Payment Gateway Operating System     ║',
    '╚════════════════════════════════════════════════════════════════╝',
    '',
    `Logged in as: ${user?.wallet?.address || user?.email?.address || 'User'}`,
    `Session started: ${new Date().toLocaleString()}`,
    '',
    'Type "help" for available commands or "apps" to see x402 applications',
    '',
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Auto-focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCommand = (cmd: string) => {
    if (!cmd.trim()) {
      setHistory(prev => [...prev, '$ ', '']);
      setCommand('');
      return;
    }

    const trimmed = cmd.trim().toLowerCase();
    let output = '';

    switch (trimmed) {
      case 'help':
        output = `
┌─────────────────────────────────────────────────────────────┐
│                    AVAILABLE COMMANDS                        │
├─────────────────────────────────────────────────────────────┤
│  help        - Show this help message                        │
│  apps        - List available x402 applications              │
│  balance     - Check your wallet balance                     │
│  xpay        - Launch xPay (instant payments)                │
│  xai         - Launch xAI (AI assistant)                     │
│  xfetch      - Launch xFetch (data fetching)                 │
│  xvault      - Open your vault dashboard                     │
│  status      - Show system status                            │
│  whoami      - Display user information                      │
│  clear       - Clear terminal screen                         │
│  logout      - Sign out of x402OS                            │
└─────────────────────────────────────────────────────────────┘
        `;
        break;

      case 'apps':
        output = `
┌──────────────────────────────────────────────────────────────┐
│                  x402 APPLICATION SUITE                       │
├──────────────────────────────────────────────────────────────┤
│  [01] xPay     - Instant Solana payments (0.001 USDC/tx)     │
│  [02] xFetch   - Web2/Web3 data fetching (0.002 USDC/call)   │
│  [03] xAI      - AI assistant (0.005 USDC/query)             │
│  [04] xVault   - Wallet & XP dashboard (Free)                │
│  [05] xScan    - Token/wallet analyzer (0.003 USDC/scan)     │
│  [06] xChart   - Live crypto charts (0.001 USDC/chart)       │
│  [07] xFeed    - Pay-per-article news (0.002 USDC/article)   │
│  [08] xTask    - Automation engine (0.004 USDC/task)         │
│  [09] xSwap    - Token swaps (0.003 USDC + network fees)     │
│  [10] xBridge  - Cross-chain bridge (0.005 USDC + gas)       │
│  [11] xNFT     - NFT marketplace (0.002 USDC/listing)        │
│  [12] xDAO     - Governance platform (Free voting)           │
├──────────────────────────────────────────────────────────────┤
│  Type the app name (e.g., "xpay") to launch                  │
└──────────────────────────────────────────────────────────────┘
        `;
        break;

      case 'balance':
        output = `
┌──────────────────────────────────────────────────────────────┐
│                      WALLET BALANCE                          │
├──────────────────────────────────────────────────────────────┤
│  Wallet Address: ${user?.wallet?.address?.slice(0, 20) || 'Not connected'}...           │
│                                                              │
│  SOL:      Loading...                                        │
│  USDC:     Loading...                                        │
│  XP:       0 (Start using apps to earn XP!)                  │
│                                                              │
│  Total Transactions: 0                                       │
│  Total Spent: 0 USDC                                         │
└──────────────────────────────────────────────────────────────┘
        `;
        break;

      case 'status':
        output = `
┌──────────────────────────────────────────────────────────────┐
│                      SYSTEM STATUS                           │
├──────────────────────────────────────────────────────────────┤
│  OS Version:        x402OS v1.0.0                            │
│  Network:           Solana Mainnet-Beta                      │
│  RPC Status:        ● Online                                 │
│  Payment Protocol:  ● Active                                 │
│  Authentication:    ● Verified                               │
│  xCore Controller:  ● Running                                │
│                                                              │
│  Active Sessions:   1                                        │
│  Uptime:            ${new Date().toLocaleTimeString()}                         │
└──────────────────────────────────────────────────────────────┘
        `;
        break;

      case 'whoami':
        output = `
┌──────────────────────────────────────────────────────────────┐
│                      USER INFORMATION                        │
├──────────────────────────────────────────────────────────────┤
│  Wallet:   ${user?.wallet?.address || 'Not connected'}        │
│  Email:    ${user?.email?.address || 'Not connected'}         │
│  User ID:  ${user?.id || 'Unknown'}                           │
│  Type:     ${user?.wallet ? 'Wallet User' : 'Email User'}     │
│  Created:  ${user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}│
└──────────────────────────────────────────────────────────────┘
        `;
        break;

      case 'xpay':
        output = `
[INFO] Launching xPay - Instant Solana Payments
[INFO] Payment system initializing...
[ERROR] xPay module not yet implemented
[TIP] This feature is under development. Check back soon!
        `;
        break;

      case 'xai':
        output = `
[INFO] Launching xAI - AI Assistant
[INFO] Connecting to AI backend...
[ERROR] xAI module not yet implemented
[TIP] This feature is under development. Check back soon!
        `;
        break;

      case 'xfetch':
        output = `
[INFO] Launching xFetch - Data Fetching Service
[INFO] Initializing HTTP/Web3 connectors...
[ERROR] xFetch module not yet implemented
[TIP] This feature is under development. Check back soon!
        `;
        break;

      case 'xvault':
        output = `
[INFO] Opening xVault Dashboard...
[INFO] Loading wallet data...
[ERROR] xVault module not yet implemented
[TIP] This feature is under development. Check back soon!
        `;
        break;

      case 'clear':
        setHistory([]);
        setCommand('');
        return;

      case 'logout':
        output = '[INFO] Logging out of x402OS...\n[INFO] Session terminated. Goodbye!';
        setHistory(prev => [...prev, `$ ${cmd}`, output, '']);
        setTimeout(() => {
          logout();
        }, 1000);
        setCommand('');
        return;

      default:
        output = `[ERROR] Command not found: "${cmd}"\n[TIP] Type "help" for available commands`;
    }

    setHistory(prev => [...prev, `$ ${cmd}`, output, '']);
    setCommand('');
  };

  return (
    <div className="fixed inset-0 bg-black text-green-400 font-mono overflow-hidden flex flex-col">
      {/* CRT Scanlines */}
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(transparent_50%,rgba(16,185,129,0.02)_50%)] bg-[length:100%_4px] animate-scan" />
      
      {/* Terminal Header */}
      <div className="border-b-2 border-green-400/30 px-6 py-3 bg-black/50 backdrop-blur relative z-10 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold">
            x402<span className="text-purple-500">OS</span>
          </div>
          <div className="text-xs text-green-400/60 border-l border-green-400/30 pl-4">
            Terminal v1.0.0
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-green-400/60">
            <span className="text-purple-400">●</span> {user?.wallet?.address?.slice(0, 6)}...{user?.wallet?.address?.slice(-4) || user?.email?.address}
          </div>
          <button
            onClick={logout}
            className="text-xs border border-red-500/50 px-3 py-1 rounded text-red-500 hover:bg-red-500/20 transition-colors"
          >
            LOGOUT
          </button>
        </div>
      </div>

      {/* Terminal Content - Scrollable */}
      <div 
        className="flex-1 overflow-y-auto px-6 py-4 relative z-10"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="space-y-1 pb-20">
          {history.map((line, idx) => (
            <div key={idx} className="whitespace-pre-wrap text-sm leading-relaxed">
              {line}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Command Input - Fixed at bottom */}
      <div className="border-t-2 border-green-400/30 px-6 py-3 bg-black/80 backdrop-blur relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-purple-400 font-bold">$</span>
          <input
            ref={inputRef}
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCommand(command);
              }
            }}
            className="flex-1 bg-transparent outline-none text-green-400 text-sm"
            placeholder="Enter command... (type 'help' for commands)"
            autoComplete="off"
            spellCheck="false"
          />
          <span className="animate-pulse text-green-400 font-bold">█</span>
        </div>
      </div>
    </div>
  );
}
