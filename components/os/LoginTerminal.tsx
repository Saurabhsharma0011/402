'use client';

import { useLogin, usePrivy } from '@privy-io/react-auth';
import { useState, useEffect } from 'react';

export default function LoginTerminal() {
  const { login } = useLogin({
    onComplete: ({ user, isNewUser }) => {
      console.log('✅ Login complete:', { user, isNewUser });
    },
    onError: (error) => {
      console.error('❌ Login error:', error);
    },
  });
  
  const { ready } = usePrivy();
  const [displayText, setDisplayText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  const fullText = '> AUTHENTICATION REQUIRED';

  // Typing animation
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setDisplayText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50);
    return () => clearInterval(timer);
  }, []);

  // Cursor blink
  useEffect(() => {
    const cursor = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 530);
    return () => clearInterval(cursor);
  }, []);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-40 overflow-hidden">
      {/* CRT Scanlines */}
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(transparent_50%,rgba(16,185,129,0.02)_50%)] bg-[length:100%_4px] animate-scan" />
      
      <div className="w-full max-w-3xl p-8 relative z-10">
        {/* Terminal Window */}
        <div className="border-2 border-green-400/50 rounded-lg bg-black/80 backdrop-blur shadow-[0_0_30px_rgba(16,185,129,0.3)]">
          {/* Terminal Header */}
          <div className="border-b border-green-400/30 px-4 py-2 flex items-center gap-2 bg-green-400/5">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
            </div>
            <div className="flex-1 text-center text-green-400/60 text-xs font-mono">
              x402OS Terminal - v1.0.0
            </div>
          </div>

          {/* Terminal Content */}
          <div className="p-8">
            {/* ASCII Art Logo */}
            <pre className="text-green-400 text-xs mb-6 leading-tight opacity-80">
{`
    ╔════════════════════════════════════════════════════╗
    ║                                                    ║
    ║   ██╗  ██╗██╗  ██╗ ██████╗ ██████╗  ██████╗ ███████╗
    ║   ╚██╗██╔╝██║  ██║██╔═████╗╚════██╗██╔═══██╗██╔════╝
    ║    ╚███╔╝ ███████║██║██╔██║ █████╔╝██║   ██║███████╗
    ║    ██╔██╗ ╚════██║████╔╝██║██╔═══╝ ██║   ██║╚════██║
    ║   ██╔╝ ██╗     ██║╚██████╔╝███████╗╚██████╔╝███████║
    ║   ╚═╝  ╚═╝     ╚═╝ ╚═════╝ ╚══════╝ ╚═════╝ ╚══════╝
    ║                                                    ║
    ║                    x 4 0 2 o s                     ║
    ║                                                    ║
    ╚════════════════════════════════════════════════════╝
`}
            </pre>

            {/* Title with typing effect */}
            <div className="text-green-400 text-2xl font-mono mb-6 font-bold">
              {displayText}
              {cursorVisible && <span className="text-green-400">█</span>}
            </div>

            {/* HTTP 402 Badge */}
            <div className="mb-6 text-center">
              <div className="inline-block border-2 border-purple-500/70 px-6 py-3 rounded bg-purple-500/10">
                <span className="text-purple-400 font-mono text-lg font-bold">
                  HTTP 402: PAYMENT GATEWAY
                </span>
              </div>
            </div>

            {/* System Info */}
            <div className="space-y-2 mb-8 text-green-400/70 text-sm font-mono bg-black/40 p-4 rounded border border-green-400/20">
              <p className="flex justify-between">
                <span>{'>'} System:</span>
                <span className="text-green-400">x402OS v1.0.0</span>
              </p>
              <p className="flex justify-between">
                <span>{'>'} Network:</span>
                <span className="text-green-400">Solana Mainnet-Beta</span>
              </p>
              <p className="flex justify-between">
                <span>{'>'} Protocol:</span>
                <span className="text-green-400">Micro-payment per action</span>
              </p>
              <p className="flex justify-between">
                <span>{'>'} Auth Status:</span>
                <span className="text-yellow-400 animate-pulse">AWAITING CREDENTIALS</span>
              </p>
            </div>

            {/* Login Button */}
            <button
              onClick={login}
              disabled={!ready}
              className="w-full bg-green-400 hover:bg-green-500 text-black font-mono py-4 px-6 rounded 
                       transition-all duration-200 hover:shadow-[0_0_30px_rgba(16,185,129,0.6)]
                       border-2 border-green-400 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed
                       active:scale-[0.98]"
            >
              {!ready ? '[ INITIALIZING... ]' : '[ AUTHENTICATE & ENTER SYSTEM ]'}
            </button>

            {/* Footer Info */}
            <div className="mt-6 text-center space-y-2">
              <div className="text-green-400/50 text-xs font-mono">
                <p>✓ Email Login • ✓ Wallet Connect • ✓ SMS Verification</p>
              </div>
              <div className="text-purple-400/60 text-xs font-mono border-t border-green-400/10 pt-4 mt-4">
                <p>Every action in x402OS requires verified payment on Solana blockchain</p>
                <p className="mt-1">Powered by Privy • Secured by Solana</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
