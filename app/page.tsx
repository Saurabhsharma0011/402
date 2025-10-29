'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useState, useEffect } from 'react';
import BootSequence from '@/components/os/BootSequence';
import LoginTerminal from '@/components/os/LoginTerminal';
import Desktop from '@/components/os/Desktop';
import MobileWarning from '@/components/MobileWarning';

export default function Home() {
  const { authenticated, ready, logout } = usePrivy();
  const [bootComplete, setBootComplete] = useState(false);
  const [showBoot, setShowBoot] = useState(true);

  useEffect(() => {
    // Check if user has seen boot sequence in this session
    const hasBooted = sessionStorage.getItem('x402os_booted');
    if (hasBooted) {
      setShowBoot(false);
      setBootComplete(true);
    }

    // Logout user when they close the tab or navigate away
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Clear session and logout
      sessionStorage.removeItem('x402os_booted');
      localStorage.removeItem('privy:token');
      localStorage.removeItem('privy:refresh_token');
      
      // Logout from Privy
      if (authenticated) {
        logout();
      }
    };

    // Handle page visibility change (when tab is hidden)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User switched tabs or minimized browser
        sessionStorage.setItem('x402os_tab_hidden', Date.now().toString());
      } else {
        // User came back to the tab
        const hiddenTime = sessionStorage.getItem('x402os_tab_hidden');
        if (hiddenTime) {
          const timeDiff = Date.now() - parseInt(hiddenTime);
          // If user was away for more than 30 seconds, logout
          if (timeDiff > 30000) {
            sessionStorage.clear();
            localStorage.removeItem('privy:token');
            localStorage.removeItem('privy:refresh_token');
            if (authenticated) {
              logout();
            }
            window.location.reload();
          }
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [authenticated, logout]);

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
  return (
    <>
      <MobileWarning />
      <Desktop />
    </>
  );
}
