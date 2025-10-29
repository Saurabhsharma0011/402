'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Taskbar from './Taskbar';
import StartMenu from './StartMenu';
import Window from './Window';
import XPayApp from '../apps/XPayApp';
import XVaultApp from '../apps/XVaultApp';
import Agent402App from '../apps/Agent402App';
import XSwapApp from '../apps/XSwapApp';
import XBridgeApp from '../apps/XBridgeApp';
import XRobotApp from '../apps/XRobotApp';
import XScanApp from '../apps/XScanApp';
import XFeedApp from '../apps/XFeedApp';
import XChartApp from '../apps/XChartApp';
import XFaucetApp from '../apps/XFaucetApp';
// Removed fake token system - focusing on mainnet transactions

// Desktop App Icons
const desktopApps = [
  { id: 'x402pay', name: 'x402pay', icon: '💳', desc: 'Instant Payments' },
  { id: 'x402agent', name: 'x402agent', icon: '🔮', desc: 'Custom Agents' },
  { id: 'x402fetch', name: 'x402fetch', icon: '🌐', desc: 'Data Fetching' },
  { id: 'x402vault', name: 'x402vault', icon: '🔐', desc: 'Your Vault' },
  { id: 'x402scan', name: 'x402scan', icon: '🔍', desc: 'Token Scanner' },
  { id: 'x402chart', name: 'x402chart', icon: '📊', desc: 'Live Charts' },
  { id: 'x402feed', name: 'x402feed', icon: '📰', desc: 'News Feed' },
  { id: 'x402faucet', name: 'x402faucet', icon: '🪙', desc: 'Claim Faucet' },
  { id: 'x402task', name: 'x402task', icon: '⚙️', desc: 'Automation' },
  { id: 'x402swap', name: 'x402swap', icon: '🔄', desc: 'Token Swap' },
  { id: 'x402bridge', name: 'x402bridge', icon: '🌉', desc: 'Cross-chain' },
  { id: 'x402robot', name: 'x402robot', icon: '🤖', desc: 'Build Your Bot' },
  { id: 'x402dao', name: 'x402dao', icon: '🏛️', desc: 'Governance' },
];

export default function Desktop() {
  const router = useRouter();
  const { user, logout } = usePrivy();
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [openApp, setOpenApp] = useState<string | null>(null);
  const [showTradeMenu, setShowTradeMenu] = useState(false);
  const [showPumpMenu, setShowPumpMenu] = useState(false);
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [showGoMenu, setShowGoMenu] = useState(false);
  const [showWindowMenu, setShowWindowMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const address = user?.wallet?.address;
  const isConnected = !!address;

  const handleAppClick = async (appId: string) => {
    // Open the app directly - no fake token deduction for mainnet focus
    setOpenApp(appId);
    setShowStartMenu(false);
    
    console.log(`App ${appId} opened - ready for mainnet transactions`);
  };

  const handleFaucetClick = () => {
    router.push('/faucet');
  };

  const handleLogout = async () => {
    const confirmed = confirm('Are you sure you want to logout? You will need to login again to access x402os.');
    if (confirmed) {
      sessionStorage.clear();
      localStorage.removeItem('privy:token');
      localStorage.removeItem('privy:refresh_token');
      await logout();
      window.location.reload();
    }
  };

  const renderAppContent = () => {
    switch (openApp) {
      case 'x402pay':
        return <XPayApp />;
      case 'x402agent':
        return <Agent402App />;
      case 'x402vault':
        return <XVaultApp />;
      case 'x402swap':
        return <XSwapApp />;
      case 'x402bridge':
        return <XBridgeApp />;
      case 'x402robot':
        return <XRobotApp />;
      case 'x402scan':
        return <XScanApp />;
      case 'x402feed':
        return <XFeedApp />;
      case 'x402chart':
        return <XChartApp />;
      case 'x402faucet':
        return <XFaucetApp />;
      case 'x402fetch':
        return (
          <div className="h-full flex flex-col overflow-auto p-6 bg-black">
            <div className="max-w-4xl mx-auto w-full space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-mono font-bold text-green-400 mb-2">x402fetch</h2>
                <p className="text-green-400/60 text-sm">Mini Search Engine • Search anything</p>
              </div>
              
              <div className="bg-green-400/10 border-2 border-green-400/50 rounded-lg p-8">
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && searchQuery.trim()) {
                        window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
                      }
                    }}
                    placeholder="Search the web..."
                    className="flex-1 bg-black border-2 border-green-400/30 rounded px-4 py-3 text-green-400 
                             font-mono text-lg focus:border-green-400 focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      if (searchQuery.trim()) {
                        window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
                      }
                    }}
                    className="bg-green-400 hover:bg-green-500 text-black font-mono px-6 py-3 rounded 
                             font-bold transition-all"
                  >
                    🔍 Search
                  </button>
                </div>
                
                <div className="grid grid-cols-3 gap-3 mt-6">
                  <button
                    onClick={() => window.open('https://www.google.com', '_blank')}
                    className="bg-black border border-green-400/30 rounded p-4 hover:border-green-400 
                             transition-all text-green-400 font-mono"
                  >
                    🌐 Google
                  </button>
                  <button
                    onClick={() => window.open('https://solscan.io', '_blank')}
                    className="bg-black border border-green-400/30 rounded p-4 hover:border-green-400 
                             transition-all text-green-400 font-mono"
                  >
                    ◎ Solscan
                  </button>
                  <button
                    onClick={() => window.open('https://birdeye.so', '_blank')}
                    className="bg-black border border-green-400/30 rounded p-4 hover:border-green-400 
                             transition-all text-green-400 font-mono"
                  >
                    🐦 Birdeye
                  </button>
                  <button
                    onClick={() => window.open('https://dexscreener.com/solana', '_blank')}
                    className="bg-black border border-green-400/30 rounded p-4 hover:border-green-400 
                             transition-all text-green-400 font-mono"
                  >
                    📊 DexScreener
                  </button>
                  <button
                    onClick={() => window.open('https://twitter.com/search', '_blank')}
                    className="bg-black border border-green-400/30 rounded p-4 hover:border-green-400 
                             transition-all text-green-400 font-mono"
                  >
                    🐦 Twitter
                  </button>
                  <button
                    onClick={() => window.open('https://github.com', '_blank')}
                    className="bg-black border border-green-400/30 rounded p-4 hover:border-green-400 
                             transition-all text-green-400 font-mono"
                  >
                    💻 GitHub
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="h-full flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <div className="text-6xl">
                {desktopApps.find(a => a.id === openApp)?.icon}
              </div>
              <div className="text-green-400 font-mono text-2xl font-bold">
                {desktopApps.find(a => a.id === openApp)?.name}
              </div>
              <div className="text-green-400/60 font-mono text-sm">
                This app is under development
              </div>
              <div className="text-green-400/40 font-mono text-xs max-w-md">
                Check back soon! We're building amazing features for this application.
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Wallpaper Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/osososo.jpg)',
        }}
      >
        {/* Overlay for better contrast */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
      
      {/* macOS Menu Bar - Top */}
      <div className="absolute top-0 left-0 right-0 h-7 bg-black/30 backdrop-blur-2xl border-b border-white/10 z-50">
        <div className="h-full px-4 flex items-center justify-between">
          {/* Left - Logo & App Menu */}
          <div className="flex items-center gap-4 text-white/90 text-xs font-medium">
            <button className="hover:bg-white/10 px-2 py-1 rounded transition-colors text-lg">
              🔷
            </button>
            <button className="hover:bg-white/10 px-2 py-1 rounded transition-colors font-semibold">
              x402os
            </button>
            
            {/* Trade Menu */}
            <div className="relative">
              <button 
                onClick={() => setShowTradeMenu(!showTradeMenu)}
                className="hover:bg-white/10 px-2 py-1 rounded transition-colors"
              >
                Trade
              </button>
              {showTradeMenu && (
                <div className="absolute top-full left-0 mt-1 bg-black/95 backdrop-blur-xl border border-green-400/30 rounded-lg shadow-xl min-w-[200px] z-50">
                  <a 
                    href="https://pump.fun" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block px-4 py-2 text-green-400 hover:bg-green-400/20 transition-colors font-mono text-xs"
                  >
                    🚀 Pump.fun
                  </a>
                  <a 
                    href="https://raydium.io" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block px-4 py-2 text-green-400 hover:bg-green-400/20 transition-colors font-mono text-xs"
                  >
                    ⚡ Raydium
                  </a>
                  <a 
                    href="https://jup.ag" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block px-4 py-2 text-green-400 hover:bg-green-400/20 transition-colors font-mono text-xs"
                  >
                    🪐 Jupiter
                  </a>
                </div>
              )}
            </div>

            {/* Pump Menu */}
            <div className="relative">
              <button 
                onClick={() => setShowPumpMenu(!showPumpMenu)}
                className="hover:bg-white/10 px-2 py-1 rounded transition-colors"
              >
                Pump
              </button>
              {showPumpMenu && (
                <div className="absolute top-full left-0 mt-1 bg-black/95 backdrop-blur-xl border border-green-400/30 rounded-lg shadow-xl min-w-[200px] z-50">
                  <button 
                    onClick={() => window.open('https://pump.fun', '_blank')}
                    className="block w-full text-left px-4 py-2 text-green-400 hover:bg-green-400/20 transition-colors font-mono text-xs"
                  >
                    🔥 Create Token
                  </button>
                  <button 
                    onClick={() => window.open('https://pump.fun/board', '_blank')}
                    className="block w-full text-left px-4 py-2 text-green-400 hover:bg-green-400/20 transition-colors font-mono text-xs"
                  >
                    📊 Leaderboard
                  </button>
                  <button 
                    onClick={() => window.open('https://pump.fun', '_blank')}
                    className="block w-full text-left px-4 py-2 text-green-400 hover:bg-green-400/20 transition-colors font-mono text-xs"
                  >
                    💎 Trending
                  </button>
                </div>
              )}
            </div>

            {/* View Menu */}
            <div className="relative">
              <button 
                onClick={() => setShowViewMenu(!showViewMenu)}
                className="hover:bg-white/10 px-2 py-1 rounded transition-colors"
              >
                View
              </button>
              {showViewMenu && (
                <div className="absolute top-full left-0 mt-1 bg-black/95 backdrop-blur-xl border border-green-400/30 rounded-lg shadow-xl min-w-[200px] z-50">
                  <button 
                    onClick={() => setOpenApp('x402vault')}
                    className="block w-full text-left px-4 py-2 text-green-400 hover:bg-green-400/20 transition-colors font-mono text-xs"
                  >
                    🔐 My Vault
                  </button>
                  <button 
                    onClick={() => setOpenApp('x402scan')}
                    className="block w-full text-left px-4 py-2 text-green-400 hover:bg-green-400/20 transition-colors font-mono text-xs"
                  >
                    🔍 Token Scanner
                  </button>
                  <button 
                    onClick={() => setOpenApp('x402chart')}
                    className="block w-full text-left px-4 py-2 text-green-400 hover:bg-green-400/20 transition-colors font-mono text-xs"
                  >
                    📊 Live Charts
                  </button>
                </div>
              )}
            </div>

            {/* Go Menu */}
            <div className="relative">
              <button 
                onClick={() => setShowGoMenu(!showGoMenu)}
                className="hover:bg-white/10 px-2 py-1 rounded transition-colors"
              >
                Go
              </button>
              {showGoMenu && (
                <div className="absolute top-full left-0 mt-1 bg-black/95 backdrop-blur-xl border border-green-400/30 rounded-lg shadow-xl min-w-[200px] z-50">
                  <button 
                    onClick={() => setOpenApp('x402swap')}
                    className="block w-full text-left px-4 py-2 text-green-400 hover:bg-green-400/20 transition-colors font-mono text-xs"
                  >
                    🔄 Swap Tokens
                  </button>
                  <button 
                    onClick={() => setOpenApp('x402bridge')}
                    className="block w-full text-left px-4 py-2 text-green-400 hover:bg-green-400/20 transition-colors font-mono text-xs"
                  >
                    🌉 Bridge
                  </button>
                  <button 
                    onClick={() => setOpenApp('x402pay')}
                    className="block w-full text-left px-4 py-2 text-green-400 hover:bg-green-400/20 transition-colors font-mono text-xs"
                  >
                    💳 Send Payment
                  </button>
                  <button 
                    onClick={() => router.push('/faucet')}
                    className="block w-full text-left px-4 py-2 text-green-400 hover:bg-green-400/20 transition-colors font-mono text-xs"
                  >
                    🪙 Faucet
                  </button>
                </div>
              )}
            </div>

            {/* Window Menu */}
            <div className="relative">
              <button 
                onClick={() => setShowWindowMenu(!showWindowMenu)}
                className="hover:bg-white/10 px-2 py-1 rounded transition-colors"
              >
                Window
              </button>
              {showWindowMenu && (
                <div className="absolute top-full left-0 mt-1 bg-black/95 backdrop-blur-xl border border-green-400/30 rounded-lg shadow-xl min-w-[200px] z-50">
                  <button 
                    onClick={() => setOpenApp(null)}
                    className="block w-full text-left px-4 py-2 text-green-400 hover:bg-green-400/20 transition-colors font-mono text-xs"
                  >
                    ❌ Close All
                  </button>
                  <button 
                    onClick={() => setOpenApp('x402agent')}
                    className="block w-full text-left px-4 py-2 text-green-400 hover:bg-green-400/20 transition-colors font-mono text-xs"
                  >
                    🔮 AI Agent
                  </button>
                  <button 
                    onClick={() => setOpenApp('x402robot')}
                    className="block w-full text-left px-4 py-2 text-green-400 hover:bg-green-400/20 transition-colors font-mono text-xs"
                  >
                    🤖 Trading Bot
                  </button>
                  <button 
                    onClick={() => setOpenApp('x402feed')}
                    className="block w-full text-left px-4 py-2 text-green-400 hover:bg-green-400/20 transition-colors font-mono text-xs"
                  >
                    📰 News Feed
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Center - Contract Address */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
            <div className="group relative bg-green-400/10 border border-green-400/30 rounded px-3 py-1 flex items-center gap-2 hover:bg-green-400/20 transition-all">
              <span className="text-green-400 font-mono text-xs font-bold">Contract:</span>
              <span className="text-green-400/80 font-mono text-xs">CA WILL LIVE SOON</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText('CA WILL LIVE SOON');
                  alert('✅ Contract address copied to clipboard!');
                }}
                className="text-green-400 hover:text-green-300 transition-colors"
                title="Copy contract address"
              >
                📋
              </button>
              
              {/* Hover Tooltip */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                <div className="bg-black/95 backdrop-blur-xl border-2 border-green-400/50 rounded-lg p-3 shadow-2xl min-w-[250px]">
                  <div className="text-green-400 font-mono text-xs font-bold mb-2">x402 Token</div>
                  <div className="space-y-1 text-green-400/80 font-mono text-xs">
                    <div>📍 Network: Solana Mainnet</div>
                    <div>🪙 Symbol: x402</div>
                    <div>💰 Faucet: 100K tokens</div>
                    <div>⏱️ Cooldown: 30 min</div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-green-400/30">
                    <div className="text-green-400/60 text-xs">Contract launching soon!</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - System Icons */}
          <div className="flex items-center gap-3 text-white/90 text-xs">
            {/* Social Media Links */}
            <button 
              onClick={() => window.open('https://t.me/x402os', '_blank')}
              className="hover:bg-blue-400/20 bg-blue-400/10 px-3 py-1 rounded transition-colors font-mono border border-blue-400/30 hover:border-blue-400/50"
              title="Join our Telegram"
            >
              ✈️ Telegram
            </button>
            
            <button 
              onClick={() => window.open('https://x.com/x402os', '_blank')}
              className="hover:bg-sky-400/20 bg-sky-400/10 px-3 py-1 rounded transition-colors font-mono border border-sky-400/30 hover:border-sky-400/50"
              title="Follow us on Twitter/X"
            >
              🐦 Twitter
            </button>

            {/* Faucet Button */}
            <button 
              onClick={handleFaucetClick}
              className="hover:bg-green-400/20 bg-green-400/10 px-3 py-1 rounded transition-colors font-mono border border-green-400/30 hover:border-green-400/50"
              title="Claim x402 tokens"
            >
              🪙 Faucet
            </button>

            <button className="hover:bg-white/10 px-2 py-1 rounded transition-colors flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
              {isConnected && address ? 
                `${address.slice(0, 4)}...${address.slice(-4)}` : 
                'Guest'
              }
            </button>
            <button className="hover:bg-white/10 px-2 py-1 rounded transition-colors">
              🔋 100%
            </button>
            <button className="hover:bg-white/10 px-2 py-1 rounded transition-colors">
              📶
            </button>
            <button className="hover:bg-white/10 px-2 py-1 rounded transition-colors">
              🔍
            </button>
            <button className="hover:bg-white/10 px-2 py-1 rounded transition-colors">
              {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
            </button>
            <button 
              onClick={handleLogout}
              className="hover:bg-red-500/20 bg-red-500/10 px-3 py-1 rounded transition-colors font-semibold border border-red-500/30"
              title="Logout from x402os"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Area */}
      <div className="relative pt-7 h-full">
        {/* Desktop Icons Grid - Right aligned like macOS */}
        <div className="absolute top-8 right-8 grid grid-cols-1 gap-3 max-w-[120px]">
          {desktopApps.slice(0, 8).map((app) => (
            <button
              key={app.id}
              onClick={() => handleAppClick(app.id)}
              className="group flex flex-col items-center gap-1 p-2 rounded-lg
                       hover:bg-white/10 backdrop-blur-sm transition-all duration-200
                       active:scale-95"
            >
              {/* Icon with glow */}
              <div className="text-5xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]
                           group-hover:scale-110 transition-transform">
                {app.icon}
              </div>
              
              {/* App Name */}
              <div className="text-white font-medium text-xs text-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                {app.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* macOS-style Dock - Bottom */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-40">
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl px-3 py-2 
                     shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <div className="flex items-end gap-2">
            {desktopApps.map((app) => (
              <button
                key={app.id}
                onClick={() => handleAppClick(app.id)}
                className="group relative flex flex-col items-center transition-all duration-200
                         hover:-translate-y-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                title={app.name}
              >
                {/* Dock Icon */}
                <div className={`text-5xl transition-all duration-200 group-hover:text-6xl
                             ${openApp === app.id ? 'scale-110' : 'scale-100'}`}>
                  {app.icon}
                </div>
                
                {/* Active Indicator */}
                {openApp === app.id && (
                  <div className="absolute -bottom-1 w-1 h-1 bg-white rounded-full"></div>
                )}

                {/* Tooltip on hover */}
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 
                             opacity-0 group-hover:opacity-100 transition-opacity duration-200
                             bg-gray-900/95 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg
                             whitespace-nowrap pointer-events-none shadow-lg border border-white/10">
                  {app.name}
                  <div className="text-[10px] text-gray-400">{app.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Start Menu - Hidden in macOS style, can be accessed via menu bar */}
      {showStartMenu && (
        <div className="absolute top-8 left-4 z-50">
          <StartMenu 
            apps={desktopApps}
            onAppClick={handleAppClick}
            onClose={() => setShowStartMenu(false)}
          />
        </div>
      )}

      {/* App Window */}
      {openApp && (
        <Window
          title={desktopApps.find(a => a.id === openApp)?.name || ''}
          icon={desktopApps.find(a => a.id === openApp)?.icon || ''}
          onClose={() => setOpenApp(null)}
          defaultWidth={openApp === 'xai' ? 900 : 800}
          defaultHeight={openApp === 'xvault' ? 700 : 600}
        >
          {renderAppContent()}
        </Window>
      )}
    </div>
  );
}
