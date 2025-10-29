# x402 Token Economy

## Overview
The x402 token is the native utility token of x402os. Users must hold x402 tokens to access and use applications within the operating system.

## How It Works

### 1. Faucet System
- **Initial Claim**: Users can claim 1000 x402 tokens for free from the faucet
- **Network Selection**: Choose between Mainnet or Devnet
- **Cooldown**: 24-hour cooldown period between claims
- **Access**: Faucet accessible from menu bar or when trying to open apps without tokens

### 2. Token Usage
Each application interaction costs x402 tokens:

#### Application Opening Costs
- **Opening any app**: 1 x402 token
- Apps cannot be opened without sufficient balance
- Balance is checked before each app launch

#### Planned Per-Action Costs (Future Implementation)
- **x402pay**: 10 x402 per payment transaction
- **x402swap**: 5 x402 per swap
- **x402bridge**: 15 x402 per bridge transaction
- **x402vault**: 2 x402 per vault operation
- **x402agent**: 3 x402 per agent execution
- **x402robot**: 5 x402 per bot deployment
- **x402scan**: 1 x402 per scan
- **x402feed**: Free to view
- **x402chart**: Free to view
- **x402task**: 8 x402 per automation setup
- **x402dao**: 20 x402 per governance vote
- **x402fetch**: 2 x402 per data fetch

### 3. Balance Management
- **Real-time Display**: Balance shown in menu bar (💰 icon)
- **Persistent Storage**: Balance stored in localStorage
- **Low Balance Warning**: Alerts when balance is insufficient
- **Auto-refresh**: Balance updates after each transaction

### 4. Network Configuration
- **Devnet**: For testing and development
- **Mainnet**: For production use
- Network choice affects token validity and transactions

## User Flow

### First-Time User
1. User logs in with Privy
2. User tries to open an application
3. System checks for x402 balance
4. If no tokens, faucet modal appears automatically
5. User selects network (Mainnet/Devnet)
6. User clicks "CLAIM x402 TOKENS"
7. 1000 tokens added to balance
8. User can now access all applications

### Returning User
1. Balance persists across sessions (localStorage)
2. Balance displayed in menu bar
3. Can claim more tokens after 24 hours
4. Each app opening deducts 1 token
5. Low balance triggers warning

## Technical Implementation

### Files Created
```
components/faucet/X402Faucet.tsx       - Faucet UI component
hooks/useX402Balance.ts                 - Balance management hook
components/os/Desktop.tsx               - Updated with faucet integration
```

### Key Functions

#### useX402Balance Hook
```typescript
{
  balance: number              // Current token balance
  hasClaimed: boolean          // Whether user has claimed
  network: 'mainnet' | 'devnet' // Selected network
  loading: boolean             // Loading state
  deductTokens: (amount, reason?) => number  // Deduct tokens
  addTokens: (amount) => number               // Add tokens
  resetFaucet: () => void                     // Reset faucet
  refreshBalance: () => void                  // Refresh from storage
}
```

#### X402Faucet Component
- Network selection UI
- Claim button with loading state
- Success animation
- Wallet display
- Faucet details display

### Storage Keys
- `x402_faucet_claimed`: boolean - Has user claimed tokens
- `x402_balance`: string - Current token balance
- `x402_network`: string - Selected network (mainnet/devnet)

## Security Features

1. **Wallet Verification**: Must have connected wallet to claim
2. **Rate Limiting**: 24-hour cooldown (frontend enforcement)
3. **Balance Validation**: Checks before every app action
4. **Network Isolation**: Tokens tied to specific network
5. **Session Persistence**: Tokens persist across page refreshes

## Future Enhancements

### Phase 1 (Current)
- [x] Basic faucet functionality
- [x] Token balance display
- [x] App access control
- [x] Network selection

### Phase 2 (Planned)
- [ ] On-chain token minting (real SPL token)
- [ ] Per-action token deduction
- [ ] Token purchase system
- [ ] Referral rewards
- [ ] Staking mechanism

### Phase 3 (Future)
- [ ] Token marketplace
- [ ] Premium subscriptions
- [ ] DAO governance with tokens
- [ ] Cross-app token sharing
- [ ] Analytics dashboard

## Token Economics

### Supply
- **Initial Faucet**: 1000 x402 per user
- **Maximum Supply**: To be determined
- **Distribution**: Faucet, purchases, rewards

### Utility
- **Primary**: Application access
- **Secondary**: Transaction fees
- **Tertiary**: Governance voting (future)

### Burn Mechanism
- Tokens deducted are burned (removed from circulation)
- Deflationary model encourages token retention
- Future: Token recovery through staking

## Support & Troubleshooting

### Common Issues

**"Insufficient x402 tokens" error**
- Solution: Click the faucet button (🪙) in menu bar
- Claim more tokens if 24 hours have passed

**Balance not updating**
- Solution: Refresh the page
- Check browser's localStorage isn't blocked

**Can't claim tokens**
- Ensure wallet is connected
- Check network selection is correct
- Wait for cooldown period to expire

**Lost tokens after logout**
- Tokens are stored in browser localStorage
- Same browser + device = tokens persist
- Different browser/device = need to claim again

## Developer Notes

### Testing
```bash
# Reset faucet for testing
localStorage.removeItem('x402_faucet_claimed')
localStorage.removeItem('x402_balance')
localStorage.removeItem('x402_network')
```

### Customization
```typescript
// Change initial claim amount in X402Faucet.tsx
localStorage.setItem('x402_balance', '1000'); // Change this value

// Change app opening cost in Desktop.tsx
deductTokens(1, `Opening ${appId} app`); // Change 1 to desired amount
```

### Integration
To add token deduction to an app:
```typescript
import { useX402Balance } from '@/hooks/useX402Balance';

function YourApp() {
  const { balance, deductTokens } = useX402Balance();
  
  const handleAction = () => {
    if (balance < 10) {
      alert('Insufficient tokens!');
      return;
    }
    deductTokens(10, 'Action description');
    // Proceed with action
  };
}
```

## Conclusion

The x402 token economy creates a sustainable model where users must hold tokens to access premium OS features. This encourages engagement, rewards early adopters, and provides a foundation for future monetization and governance mechanisms.
