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

// LOCALSTORAGE-BASED TOKEN SYSTEM (NO BLOCKCHAIN)
// Get total tokens user has claimed
function getTotalClaimed(walletAddress: string): number {
  if (typeof window === 'undefined') return 0;
  const claimed = localStorage.getItem(`x402_claimed_${walletAddress}`);
  return claimed ? parseInt(claimed) : 0;
}

// Get total tokens user has spent
function getTotalSpent(walletAddress: string): number {
  if (typeof window === 'undefined') return 0;
  const spent = localStorage.getItem(`x402_spent_${walletAddress}`);
  return spent ? parseInt(spent) : 0;
}

// Add tokens when user claims from faucet
function addToClaimed(walletAddress: string, amount: number): void {
  if (typeof window === 'undefined') return;
  const currentClaimed = getTotalClaimed(walletAddress);
  const newClaimed = currentClaimed + amount;
  localStorage.setItem(`x402_claimed_${walletAddress}`, newClaimed.toString());
}

// Update total tokens spent
function addToSpent(walletAddress: string, amount: number): void {
  if (typeof window === 'undefined') return;
  const currentSpent = getTotalSpent(walletAddress);
  const newSpent = currentSpent + amount;
  localStorage.setItem(`x402_spent_${walletAddress}`, newSpent.toString());
}

// Get available balance (claimed - spent)
function getAvailableBalance(walletAddress: string): number {
  const claimed = getTotalClaimed(walletAddress);
  const spent = getTotalSpent(walletAddress);
  return Math.max(0, claimed - spent);
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

  // Fetch balance (x402 from localStorage, SOL from API)
  const fetchBalance = useCallback(async () => {
    if (!walletAddress) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Get x402 balance from localStorage
      const x402Balance = getAvailableBalance(walletAddress);
      
      // Get real SOL balance from API
      const response = await fetch(`/api/balance?wallet=${walletAddress}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch balance');
      }
      
      setBalance({
        x402: x402Balance,
        sol: data.solBalance || 0
      });
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching balance:', err);
    } finally {
      setLoading(false);
    }
  }, [walletAddress]);

  // Claim x402 tokens (localStorage only, no blockchain)
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
      
      // Add to claimed amount in localStorage
      addToClaimed(walletAddress, amount);
      
      // Update cooldown
      setCooldown(walletAddress);
      updateCooldown();
      
      // Refresh balance
      await fetchBalance();
      
      return data.success;
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

      // Removed fake API call - focusing on mainnet transactions

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
    claimX402,
    hasEnoughTokens,
    deductTokens
  };
}
