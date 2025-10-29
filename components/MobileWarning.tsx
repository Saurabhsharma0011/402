'use client';

import { useEffect, useState } from 'react';

export default function MobileWarning() {
  const [isMobile, setIsMobile] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const smallScreen = window.innerWidth < 768;
      setIsMobile(mobile || smallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isMobile || dismissed) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-lg flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-gradient-to-br from-red-900/40 to-orange-900/40 border-2 border-red-500 rounded-2xl p-8 text-center shadow-2xl">
        {/* Warning Icon */}
        <div className="text-8xl mb-6 animate-pulse">⚠️</div>
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-red-400 mb-4">
          Mobile Device Detected
        </h1>
        
        {/* Message */}
        <p className="text-white/90 text-lg mb-6 leading-relaxed">
          x402os is optimized for <strong className="text-red-400">desktop experience</strong>.
        </p>
        
        <div className="bg-black/40 border border-red-500/30 rounded-lg p-4 mb-6">
          <p className="text-yellow-400 text-sm mb-3">
            📱 For the best experience:
          </p>
          <ul className="text-left text-white/80 text-sm space-y-2">
            <li>• Open this site on a <strong>PC or laptop</strong></li>
            <li>• Or enable <strong>"Desktop Mode"</strong> in your browser</li>
            <li>• Minimum screen width: <strong>768px</strong></li>
          </ul>
        </div>

        {/* How to Enable Desktop Mode */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-6">
          <p className="text-blue-400 text-xs font-bold mb-2">
            📋 How to enable Desktop Mode:
          </p>
          <p className="text-white/70 text-xs text-left">
            <strong>Chrome/Safari:</strong> Menu → Request Desktop Site<br/>
            <strong>Firefox:</strong> Menu → Desktop Site
          </p>
        </div>
        
        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => setDismissed(true)}
            className="w-full bg-red-500/20 hover:bg-red-500/30 border-2 border-red-500 text-red-400 font-bold py-4 px-6 rounded-xl transition-all hover:scale-105"
          >
            ⚠️ Continue Anyway (Not Recommended)
          </button>
          
          <button
            onClick={() => window.history.back()}
            className="w-full bg-white/10 hover:bg-white/20 border border-white/30 text-white/80 font-semibold py-3 px-6 rounded-xl transition-all"
          >
            ← Go Back
          </button>
        </div>

        {/* Footer Warning */}
        <p className="text-red-400/60 text-xs mt-6">
          Mobile users may experience UI issues and limited functionality
        </p>
      </div>
    </div>
  );
}
