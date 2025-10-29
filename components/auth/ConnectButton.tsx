'use client';

import { usePrivy, useLogin } from '@privy-io/react-auth';

export default function ConnectButton() {
  const { ready, authenticated, user, logout } = usePrivy();
  const { login } = useLogin({
    onComplete: ({ user, isNewUser }) => {
      console.log('Login complete:', { user, isNewUser });
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });

  // If not authenticated, show login button
  if (!authenticated) {
    return (
      <div className="flex items-center gap-4">
        <button
          disabled={!ready}
          onClick={() => login()}
          className="px-6 py-3 bg-black border-2 border-green-400 text-green-400 font-mono uppercase tracking-wider
                   hover:bg-green-400 hover:text-black transition-all duration-300
                   disabled:opacity-50 disabled:cursor-not-allowed
                   shadow-[0_0_10px_rgba(34,197,94,0.3)] hover:shadow-[0_0_20px_rgba(34,197,94,0.6)]"
        >
          {!ready ? 'Loading...' : '[ Connect Wallet ]'}
        </button>
      </div>
    );
  }

  // If authenticated, show user info and logout
  return (
    <div className="flex items-center gap-4">
      <div className="px-4 py-2 bg-black border border-green-400/50 text-green-400 font-mono text-sm">
        <span className="opacity-70">Connected as:</span>{' '}
        <span className="font-bold">
          {user?.wallet?.address?.slice(0, 6)}...{user?.wallet?.address?.slice(-4)}
        </span>
      </div>
      
      <button
        onClick={logout}
        className="px-4 py-2 bg-black border border-red-500/50 text-red-500 font-mono text-sm uppercase
                 hover:bg-red-500 hover:text-black transition-all duration-300
                 shadow-[0_0_10px_rgba(239,68,68,0.3)] hover:shadow-[0_0_20px_rgba(239,68,68,0.6)]"
      >
        [ Logout ]
      </button>
    </div>
  );
}
