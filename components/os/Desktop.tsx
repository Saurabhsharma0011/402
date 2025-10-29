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
import { useX402Token } from '@/hooks/useX402Token';
import { X402_CONFIG } from '@/utils/x402Token';

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
  const { balance, hasEnoughTokens, deductTokens, fetchBalance } = useX402Token();
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [openApp, setOpenApp] = useState<string | null>(null);
  const [deductingTokens, setDeductingTokens] = useState(false);
  const [showDeductNotification, setShowDeductNotification] = useState(false);

  const handleAppClick = async (appId: string) => {
    // Check if user has enough tokens (4,000 per app)
    if (!hasEnoughTokens(X402_CONFIG.APP_FEE)) {
      const confirmed = confirm(
        `⚠️ You need ${X402_CONFIG.APP_FEE.toLocaleString()} x402 tokens to use this application!\n\n` +
        `Your balance: ${balance.x402.toLocaleString()} tokens\n\n` +
        `Click OK to go to the faucet and claim tokens.`
      );
      if (confirmed) {
        router.push('/faucet');
      }
      return;
    }

    // Deduct tokens for app usage
    setDeductingTokens(true);
    try {
      const success = await deductTokens(X402_CONFIG.APP_FEE);
      
      if (!success) {
        throw new Error('Failed to deduct tokens');
      }

      // Open the app after successful deduction
      setOpenApp(appId);
      setShowStartMenu(false);
      
      // Show notification
      setShowDeductNotification(true);
      setTimeout(() => setShowDeductNotification(false), 3000);
      
      console.log(`App ${appId} opened - ${X402_CONFIG.APP_FEE} tokens deducted`);
    } catch (error) {
      console.error('Error deducting tokens:', error);
      alert('Failed to process token payment. Please try again.');
    } finally {
      setDeductingTokens(false);
    }
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
      {/* Token Deduction Notification */}
      {showDeductNotification && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-green-400/90 backdrop-blur-sm border-2 border-green-500 rounded-lg px-6 py-3 shadow-lg">
            <p className="text-black font-bold text-sm">
              ✅ {X402_CONFIG.APP_FEE.toLocaleString()} x402 tokens deducted
            </p>
          </div>
        </div>
      )}

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
          {/* Left - Apple Menu & App Name */}
          <div className="flex items-center gap-4 text-white/90 text-xs font-medium">
            <button className="hover:bg-white/10 px-2 py-1 rounded transition-colors">
              🍎
            </button>
            <button className="hover:bg-white/10 px-2 py-1 rounded transition-colors font-semibold">
              x402os
            </button>
            <button className="hover:bg-white/10 px-2 py-1 rounded transition-colors">
              File
            </button>
            <button className="hover:bg-white/10 px-2 py-1 rounded transition-colors">
              Edit
            </button>
            <button className="hover:bg-white/10 px-2 py-1 rounded transition-colors">
              View
            </button>
            <button className="hover:bg-white/10 px-2 py-1 rounded transition-colors">
              Go
            </button>
            <button className="hover:bg-white/10 px-2 py-1 rounded transition-colors">
              Window
            </button>
          </div>

          {/* Right - System Icons */}
          <div className="flex items-center gap-3 text-white/90 text-xs">
            {/* x402 Balance Display */}
            <div className="flex items-center gap-2 bg-green-400/20 border border-green-400/50 px-3 py-1 rounded">
              <span className="text-green-400 font-mono font-bold">💰 {balance.x402.toLocaleString()}</span>
              <span className="text-green-400/60 font-mono text-[10px]">x402</span>
            </div>
            
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
              {user?.wallet?.address?.slice(0, 4)}...{user?.wallet?.address?.slice(-4) || 'Guest'}
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
              disabled={deductingTokens}
              className="group flex flex-col items-center gap-1 p-2 rounded-lg
                       hover:bg-white/10 backdrop-blur-sm transition-all duration-200
                       active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {/* Icon with glow */}
              <div className="text-5xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]
                           group-hover:scale-110 transition-transform">
                {deductingTokens ? '⏳' : app.icon}
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
                disabled={deductingTokens}
                className="group relative flex flex-col items-center transition-all duration-200
                         hover:-translate-y-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                title={app.name}
              >
                {/* Dock Icon */}
                <div className={`text-5xl transition-all duration-200 group-hover:text-6xl
                             ${openApp === app.id ? 'scale-110' : 'scale-100'}`}>
                  {deductingTokens ? '⏳' : app.icon}
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
