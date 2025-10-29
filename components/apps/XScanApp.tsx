'use client';

import { useEffect } from 'react';

export default function XScanApp() {
  useEffect(() => {
    // Open the website in a new tab when the app loads
    window.open('https://www.x402scan.com', '_blank');
  }, []);

  return (
    <div className="h-full flex flex-col bg-black">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-400/10 to-blue-500/10 border-b border-green-400/30 px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="text-4xl">🔍</div>
          <div>
            <h2 className="text-xl font-mono font-bold text-green-400">x402scan</h2>
            <p className="text-xs text-green-400/60 font-mono">Token Scanner & Analytics</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-6 max-w-2xl">
          <div className="text-6xl mb-4">🔍</div>
          
          <h3 className="text-2xl font-mono font-bold text-green-400">
            x402scan Web Interface
          </h3>
          
          <p className="text-green-400/80 font-mono text-sm">
            The x402scan website has been opened in a new tab.
          </p>

          <div className="bg-green-400/10 border-2 border-green-400/30 rounded-lg p-6">
            <p className="text-green-400/60 font-mono text-xs mb-4">
              If the website didn't open automatically, click below:
            </p>
            
            <a
              href="https://www.x402scan.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-green-400 hover:bg-green-500 text-black font-mono rounded 
                       font-bold transition-all shadow-[0_0_20px_rgba(0,255,65,0.3)]"
            >
              🚀 Open x402scan.com
            </a>
          </div>

          <div className="mt-8 space-y-3">
            <div className="bg-black border border-green-400/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">📊</div>
                <div className="text-left">
                  <div className="text-green-400 font-mono text-sm font-bold">Token Analysis</div>
                  <div className="text-green-400/60 font-mono text-xs">
                    Comprehensive token metadata and holder analysis
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black border border-green-400/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">🔒</div>
                <div className="text-left">
                  <div className="text-green-400 font-mono text-sm font-bold">Security Scanning</div>
                  <div className="text-green-400/60 font-mono text-xs">
                    Rug pull detection and contract verification
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black border border-green-400/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">💎</div>
                <div className="text-left">
                  <div className="text-green-400 font-mono text-sm font-bold">Liquidity Check</div>
                  <div className="text-green-400/60 font-mono text-xs">
                    Real-time liquidity pool and market data
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-green-400/30">
            <p className="text-green-400/40 font-mono text-xs">
              💡 Tip: Keep this window open while using x402scan.com for easy access
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
