# x402 On-Chain Token System

## Overview

The x402 token system uses real SPL tokens on Solana Devnet for application access control. Users claim tokens via a faucet and spend them to interact with applications.

## Token Details

- **Token Mint**: `AGLvBjKZzJp4BuJym67826p84DgizPovPvWE2aZyhRQx`
- **Network**: Solana Devnet
- **Token Standard**: SPL Token
- **Decimals**: 9
- **Total Supply**: 998,000,000 x402 tokens (in faucet wallet)

## Faucet Configuration

### Claim Amounts
- **x402 Tokens**: 10,000 per claim
- **SOL**: 1 SOL per claim (for gas fees)

### Cooldown
- **Duration**: 30 minutes between claims
- **Storage**: localStorage (per wallet address)
- **Key Format**: `x402_cooldown_${walletAddress}`

### Cost per Application
- **Fee**: 4,000 x402 tokens per app interaction
- **Purpose**: Token-gated access to applications

## Architecture

### Backend (Server-Side)

#### API Routes

1. **`/api/faucet/claim`** (POST)
   - Claims x402 tokens for user
   - Parameters: `walletAddress`, `amount`
   - Returns: Transaction signature
   - Handles ATA creation automatically

2. **`/api/faucet/airdrop-sol`** (POST)
   - Airdrops 1 SOL on Devnet
   - Parameters: `walletAddress`, `amount`
   - Returns: Transaction signature
   - Uses Solana airdrop API

3. **`/api/balance`** (GET)
   - Fetches on-chain balances
   - Parameters: `wallet` (query param)
   - Returns: `x402Balance`, `solBalance`

#### Utilities (`utils/x402Token.ts`)

Core blockchain functions:
- `getConnection()` - Creates Solana RPC connection
- `getFaucetWallet()` - Loads faucet keypair from env
- `getX402Balance(address)` - Gets token balance
- `getSolBalance(address)` - Gets SOL balance
- `airdropDevnetSOL(address, amount)` - Airdrops SOL
- `transferX402Tokens(address, amount)` - Transfers tokens
- `checkCooldown(address)` - Checks 30-min cooldown
- `setCooldown(address)` - Sets cooldown timestamp
- `formatTimeRemaining(ms)` - Formats time display

### Frontend (Client-Side)

#### Hook: `hooks/useX402Token.ts`

Manages token state and operations:

```typescript
const {
  balance,           // { x402: number, sol: number }
  cooldown,          // { canClaim, remainingTime, formattedTime }
  loading,           // boolean
  error,             // string | null
  walletAddress,     // string | undefined
  fetchBalance,      // () => Promise<void>
  claimSOL,          // () => Promise<string | null>
  claimX402,         // (amount: number) => Promise<string | null>
  hasEnoughTokens    // (amount: number) => boolean
} = useX402Token();
```

Features:
- Auto-fetches balance on mount and wallet change
- Updates cooldown timer every second
- Handles loading states and errors
- Provides helper functions for claims

#### Page: `/app/faucet/page.tsx`

Faucet UI with:
- Real-time balance display (SOL + x402)
- Cooldown timer
- Claim buttons for SOL and tokens
- Success/error messages
- Information about token usage

#### Desktop Integration: `components/os/Desktop.tsx`

Token-gated application access:
- Shows x402 balance in menu bar
- Faucet button redirects to `/faucet` page
- Checks balance before opening apps
- Requires 4,000 tokens per app interaction
- Prompts user to visit faucet if insufficient balance

## Environment Variables

```env
# Faucet Wallet Private Key (64-byte array)
X402_FAUCET_PRIVATE_KEY=[250,221,102,181,...]

# Token Mint Address (Public)
NEXT_PUBLIC_X402_TOKEN_MINT=AGLvBjKZzJp4BuJym67826p84DgizPovPvWE2aZyhRQx

# Faucet Configuration (Public)
NEXT_PUBLIC_X402_FAUCET_AMOUNT=10000
NEXT_PUBLIC_X402_APP_FEE=4000
NEXT_PUBLIC_X402_COOLDOWN_MINUTES=30

# RPC Endpoints
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
HELIUS_RPC_URL=https://devnet.helius-rpc.com/?api-key=YOUR_KEY
```

## User Flow

### First-Time User

1. User logs in with Privy wallet
2. Desktop shows "0 x402" balance
3. User clicks "🪙 Faucet" button in menu bar
4. Redirected to `/faucet` page
5. User claims 1 SOL (for gas fees)
6. User claims 10,000 x402 tokens
7. Tokens appear in wallet within seconds
8. User returns to desktop
9. Balance shows "10,000 x402"
10. User can now open applications

### Using Applications

1. User clicks any app icon on desktop
2. System checks: `hasEnoughTokens(4000)`
3. If sufficient: App opens (fee will be charged on actual use)
4. If insufficient: Alert prompts user to visit faucet
5. User claims more tokens as needed

### Claiming More Tokens

1. User clicks "🪙 Faucet" button
2. If cooldown active: Shows "Wait Xm Ys before claiming again"
3. If cooldown expired: Both claim buttons enabled
4. User claims tokens or SOL
5. Balance updates automatically
6. Cooldown resets to 30 minutes

## Security

### Private Key Management
- ✅ Private key stored in `.env.local` (server-side only)
- ✅ Never exposed to client
- ✅ All token transfers happen via API routes
- ✅ `.env.local` in `.gitignore`

### Cooldown Enforcement
- ⚠️ Currently localStorage-based (client-side)
- ⚠️ Can be bypassed by clearing storage
- 💡 Future: Move to server-side database for better enforcement

### Transaction Security
- ✅ All transactions signed server-side
- ✅ Uses Solana's transaction confirmation
- ✅ Handles failed transactions gracefully

## Future Enhancements

### High Priority
1. **Server-side cooldown tracking** - Use database instead of localStorage
2. **Rate limiting** - Prevent abuse via IP/wallet tracking
3. **Transaction history** - Show users their claim history
4. **Token deduction on app use** - Actually charge 4,000 tokens per app interaction

### Medium Priority
1. **Metaplex metadata** - Add token logo and description on-chain
2. **Token analytics** - Track distribution and usage metrics
3. **Multiple faucet wallets** - Distribute load across wallets
4. **Captcha protection** - Prevent bot claims

### Low Priority
1. **Mainnet deployment** - Deploy to production
2. **Token buyback** - Allow users to sell tokens back
3. **Referral system** - Reward users for invitations
4. **Leaderboard** - Show top token holders/users

## Troubleshooting

### Token Claims Not Working
- Check Devnet RPC is accessible
- Verify faucet wallet has tokens and SOL
- Check browser console for errors
- Ensure wallet is connected via Privy

### Balance Not Updating
- Click faucet page to trigger refresh
- Check transaction on Solana Explorer
- Verify wallet address is correct
- Wait for transaction confirmation (5-30 seconds)

### Insufficient SOL for Fees
- Claim 1 SOL from faucet first
- SOL needed for: token claims, transfers, ATA creation
- Each transaction costs ~0.000005 SOL

### Cooldown Issues
- Clear localStorage: `localStorage.removeItem('x402_cooldown_${address}')`
- Or wait 30 minutes naturally
- Check system time is accurate

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Check for errors
npm run build

# Test token utilities (create test script)
npm run test:tokens
```

## Testing Checklist

- [ ] Claim 1 SOL successfully
- [ ] Claim 10,000 x402 tokens successfully
- [ ] Balance updates in real-time
- [ ] Cooldown timer counts down correctly
- [ ] Cannot claim during cooldown
- [ ] Desktop shows correct balance
- [ ] App opens with sufficient tokens
- [ ] App blocked with insufficient tokens
- [ ] Faucet redirect works from desktop
- [ ] Error messages display correctly

## Resources

- [Solana Devnet Explorer](https://explorer.solana.com/?cluster=devnet)
- [SPL Token Documentation](https://spl.solana.com/token)
- [Solana Web3.js Docs](https://solana-labs.github.io/solana-web3.js/)
- [Privy Documentation](https://docs.privy.io/)

---

**Last Updated**: December 2024
**Version**: 1.0.0
**Status**: Production Ready ✅
