'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#00ff41',
          walletChainType: 'solana-only',
          walletList: ['detected_wallets', 'phantom', 'solflare', 'backpack'],
        },
        
        loginMethods: ['email', 'wallet', 'sms'],
        
        externalWallets: {
          solana: {
            connectors: toSolanaWalletConnectors(),
          },
        },
        
        embeddedWallets: {
          solana: {
            createOnLogin: 'users-without-wallets',
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
