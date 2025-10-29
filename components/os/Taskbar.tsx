'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useState, useEffect } from 'react';

interface TaskbarProps {
  onStartClick: () => void;
  showStartMenu: boolean;
}

export default function Taskbar({ onStartClick, showStartMenu }: TaskbarProps) {
  const { user, logout } = usePrivy();
  const [currentTime, setCurrentTime] = useState('');

  // Update clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const time = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
      const date = now.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      setCurrentTime(`${time} • ${date}`);
    };
    
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-black/95 border-t-2 border-green-400/50 
                    backdrop-blur-lg z-40 shadow-[0_-4px_20px_rgba(0,255,65,0.2)]">
      <div className="flex items-center h-full px-4 gap-4">
        {/* Start Button */}
        <button
          onClick={onStartClick}
          className={`flex items-center gap-2 px-6 py-2 font-mono font-bold transition-all
                   border-2 rounded ${
                     showStartMenu 
                       ? 'bg-green-400 text-black border-green-400' 
                       : 'bg-black text-green-400 border-green-400/50 hover:bg-green-400/10 hover:border-green-400'
                   }`}
        >
          <span className="text-2xl">⚡</span>
          <span>START</span>
        </button>

        {/* Separator */}
        <div className="w-px h-8 bg-green-400/30"></div>

        {/* Quick Launch Apps */}
        <div className="flex items-center gap-2">
          {['💳', '🤖', '🔐', '📊'].map((icon, i) => (
            <button
              key={i}
              className="w-12 h-12 flex items-center justify-center text-2xl
                       bg-black border border-green-400/30 rounded
                       hover:bg-green-400/10 hover:border-green-400/50 transition-all
                       active:scale-95"
            >
              {icon}
            </button>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* System Tray */}
        <div className="flex items-center gap-4">
          {/* Wallet Info */}
          <div className="flex items-center gap-2 px-3 py-1 bg-green-400/10 border border-green-400/30 rounded">
            <span className="text-green-400">💰</span>
            <span className="text-green-400 font-mono text-xs">
              {user?.wallet?.address?.slice(0, 4)}...{user?.wallet?.address?.slice(-4) || 'Guest'}
            </span>
          </div>

          {/* Network Status */}
          <div className="flex items-center gap-2 px-3 py-1 bg-green-400/10 border border-green-400/30 rounded">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-green-400 font-mono text-xs">Solana</span>
          </div>

          {/* Clock */}
          <div className="px-3 py-1 bg-green-400/10 border border-green-400/30 rounded">
            <div className="text-green-400 font-mono text-xs text-center">
              {currentTime}
            </div>
          </div>

          {/* Power Button */}
          <button
            onClick={logout}
            className="w-10 h-10 flex items-center justify-center text-xl
                     bg-red-500/20 border border-red-500/50 rounded
                     hover:bg-red-500/30 hover:border-red-500 transition-all
                     active:scale-95"
            title="Logout"
          >
            ⏻
          </button>
        </div>
      </div>
    </div>
  );
}
