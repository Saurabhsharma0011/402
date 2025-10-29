'use client';

import { usePrivy } from '@privy-io/react-auth';

interface App {
  id: string;
  name: string;
  icon: string;
  desc: string;
}

interface StartMenuProps {
  apps: App[];
  onAppClick: (appId: string) => void;
  onClose: () => void;
}

export default function StartMenu({ apps, onAppClick, onClose }: StartMenuProps) {
  const { user } = usePrivy();

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-30"
        onClick={onClose}
      />

      {/* Start Menu Panel */}
      <div className="fixed bottom-16 left-4 w-96 bg-black/95 border-2 border-green-400/50 
                    rounded-lg backdrop-blur-lg z-40 shadow-[0_0_40px_rgba(0,255,65,0.3)]
                    animate-in slide-in-from-bottom-4 duration-200">
        
        {/* User Profile Section */}
        <div className="p-4 border-b border-green-400/30 bg-green-400/5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-400/20 border-2 border-green-400/50 rounded-full 
                         flex items-center justify-center text-2xl">
              👤
            </div>
            <div>
              <div className="text-green-400 font-mono font-bold text-sm">
                {user?.email?.address || 'Wallet User'}
              </div>
              <div className="text-green-400/60 font-mono text-xs">
                {user?.wallet?.address?.slice(0, 8)}...{user?.wallet?.address?.slice(-6)}
              </div>
            </div>
          </div>
        </div>

        {/* Apps Grid */}
        <div className="p-4 max-h-96 overflow-y-auto">
          <div className="text-green-400/60 font-mono text-xs uppercase mb-3 tracking-wider">
            All Applications
          </div>
          <div className="grid grid-cols-3 gap-3">
            {apps.map((app) => (
              <button
                key={app.id}
                onClick={() => {
                  onAppClick(app.id);
                  onClose();
                }}
                className="flex flex-col items-center gap-2 p-3 rounded-lg
                         bg-green-400/5 border border-green-400/20
                         hover:bg-green-400/10 hover:border-green-400/40
                         transition-all duration-200 active:scale-95"
              >
                <span className="text-3xl">{app.icon}</span>
                <span className="text-green-400 font-mono text-xs text-center">
                  {app.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* System Actions */}
        <div className="p-4 border-t border-green-400/30 bg-green-400/5">
          <div className="grid grid-cols-3 gap-2">
            <button className="py-2 px-3 bg-green-400/10 border border-green-400/30 rounded
                            hover:bg-green-400/20 hover:border-green-400/50 transition-all
                            text-green-400 font-mono text-xs">
              ⚙️ Settings
            </button>
            <button className="py-2 px-3 bg-green-400/10 border border-green-400/30 rounded
                            hover:bg-green-400/20 hover:border-green-400/50 transition-all
                            text-green-400 font-mono text-xs">
              📁 Files
            </button>
            <button className="py-2 px-3 bg-red-500/20 border border-red-500/50 rounded
                            hover:bg-red-500/30 hover:border-red-500 transition-all
                            text-red-400 font-mono text-xs">
              ⏻ Logout
            </button>
          </div>
        </div>

        {/* OS Info */}
        <div className="px-4 py-2 border-t border-green-400/30 bg-black/50">
          <div className="text-green-400/40 font-mono text-xs text-center">
            x402os v1.0.0 • HTTP 402 Payment Gateway
          </div>
        </div>
      </div>
    </>
  );
}
