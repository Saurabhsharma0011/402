import { useState, useCallback, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { checkCooldown, setCooldown, formatTimeRemaining } from '@/utils/x402Token';

interface TokenBalance {
  x402: number;
  sol: number;
}

interface CooldownInfo {
  canClaim: boolean;
  remainingTime: number;
  formattedTime: string;
}

// Get total tokens spent by user (stored in localStorage)
function getTotalSpent(walletAddress: string): number {
  if (typeof window === 'undefined') return 0;
  const spent = localStorage.getItem(`x402_spent_${walletAddress}`);
  return spent ? parseInt(spent) : 0;
}

// Update total tokens spent
function addToSpent(walletAddress: string, amount: number): void {
  if (typeof window === 'undefined') return;
  const currentSpent = getTotalSpent(walletAddress);
  const newSpent = currentSpent + amount;
  localStorage.setItem(`x402_spent_${walletAddress}`, newSpent.toString());
}

export function useX402Token() {
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address;
  
  const [balance, setBalance] = useState<TokenBalance>({ x402: 0, sol: 0 });
  const [cooldown, setCooldownInfo] = useState<CooldownInfo>({
    canClaim: true,
    remainingTime: 0,
    formattedTime: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check cooldown status
  const updateCooldown = useCallback(() => {
    if (!walletAddress) return;
    
    const cooldownStatus = checkCooldown(walletAddress);
    setCooldownInfo({
      canClaim: cooldownStatus.canClaim,
      remainingTime: cooldownStatus.remainingTime,
      formattedTime: cooldownStatus.remainingTime > 0 
        ? formatTimeRemaining(cooldownStatus.remainingTime)
        : ''
    });
  }, [walletAddress]);

  // Fetch balance from API
  const fetchBalance = useCallback(async () => {
    if (!walletAddress) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/balance?wallet=${walletAddress}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch balance');
      }
      
      // Get on-chain balance and subtract total spent
      const totalSpent = getTotalSpent(walletAddress);
      const availableBalance = Math.max(0, data.x402Balance - totalSpent);
      
      setBalance({
        x402: availableBalance,
        sol: data.solBalance
      });
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching balance:', err);
    } finally {
      setLoading(false);
    }
  }, [walletAddress]);

  // Claim SOL airdrop
  const claimSOL = useCallback(async () => {
    if (!walletAddress) {
      setError('Wallet not connected');
      return null;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/faucet/airdrop-sol', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress, amount: 1 })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to claim SOL');
      }
      
      // Update cooldown
      setCooldown(walletAddress);
      updateCooldown();
      
      // Refresh balance
      await fetchBalance();
      
      return data.signature;
    } catch (err: any) {
      setError(err.message);
      console.error('Error claiming SOL:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [walletAddress, fetchBalance, updateCooldown]);

  // Claim x402 tokens
  const claimX402 = useCallback(async (amount: number) => {
    if (!walletAddress) {
      setError('Wallet not connected');
      return null;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/faucet/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress, amount })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to claim tokens');
      }
      
      // Update cooldown
      setCooldown(walletAddress);
      updateCooldown();
      
      // Refresh balance
      await fetchBalance();
      
      return data.signature;
    } catch (err: any) {
      setError(err.message);
      console.error('Error claiming tokens:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [walletAddress, fetchBalance, updateCooldown]);

  // Check if user has enough tokens
  const hasEnoughTokens = useCallback((requiredAmount: number): boolean => {
    return balance.x402 >= requiredAmount;
  }, [balance.x402]);

  // Deduct tokens for app usage
  const deductTokens = useCallback(async (amount: number): Promise<boolean> => {
    if (!walletAddress) {
      setError('Wallet not connected');
      return false;
    }

    if (!hasEnoughTokens(amount)) {
      setError('Insufficient tokens');
      return false;
    }

    try {
      // Add to spent amount in localStorage
      addToSpent(walletAddress, amount);
      
      // Update displayed balance immediately
      setBalance(prev => ({
        ...prev,
        x402: Math.max(0, prev.x402 - amount)
      }));

      // Call API to log the deduction
      await fetch('/api/tokens/deduct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress, amount })
      });

      return true;
    } catch (err: any) {
      setError(err.message);
      console.error('Error deducting tokens:', err);
      return false;
    }
  }, [walletAddress, hasEnoughTokens]);

  // Initial fetch on mount and wallet change
  useEffect(() => {
    if (walletAddress) {
      fetchBalance();
      updateCooldown();
    }
  }, [walletAddress, fetchBalance, updateCooldown]);

  // Update cooldown timer every second
  useEffect(() => {
    if (!cooldown.canClaim && cooldown.remainingTime > 0) {
      const interval = setInterval(() => {
        updateCooldown();
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [cooldown.canClaim, cooldown.remainingTime, updateCooldown]);

  return {
    balance,
    cooldown,
    loading,
    error,
    walletAddress,
    fetchBalance,
    claimSOL,
    claimX402,
    hasEnoughTokens,
    deductTokens
  };
}
