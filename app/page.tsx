'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useState, useEffect } from 'react';
import BootSequence from '@/components/os/BootSequence';
import LoginTerminal from '@/components/os/LoginTerminal';
import Desktop from '@/components/os/Desktop';

export default function Home() {
  const { authenticated, ready } = usePrivy();
  const [bootComplete, setBootComplete] = useState(false);
  const [showBoot, setShowBoot] = useState(true);

  useEffect(() => {
    // Check if user has seen boot sequence in this session
    const hasBooted = sessionStorage.getItem('x402os_booted');
    if (hasBooted) {
      setShowBoot(false);
      setBootComplete(true);
    }
  }, []);

  const handleBootComplete = () => {
    setBootComplete(true);
    sessionStorage.setItem('x402os_booted', 'true');
  };

  // Show boot sequence on first visit
  if (showBoot && !bootComplete) {
    return <BootSequence onComplete={handleBootComplete} />;
  }

  // Wait for Privy to be ready
  if (!ready) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-green-400 font-mono text-lg flex items-center gap-3">
          <div className="animate-spin h-5 w-5 border-2 border-green-400 border-t-transparent rounded-full"></div>
          Loading x402OS...
        </div>
      </div>
    );
  }

  // Show login terminal if not authenticated
  if (!authenticated) {
    return <LoginTerminal />;
  }

  // Show desktop OS when authenticated
  return <Desktop />;
}
