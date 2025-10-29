'use client';

import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { getConnection, getWalletBalance, getTokenBalance } from '@/utils/solana';

export default function XSwapApp() {
  const { user } = usePrivy();
  
  // Get Solana wallet address from user
  const walletAddress = user?.wallet?.address || null;
  const wallet = walletAddress ? { address: walletAddress } : null;

  const [fromToken, setFromToken] = useState('SOL');
  const [toToken, setToToken] = useState('USDC');
  const [amount, setAmount] = useState('');
  const [slippage, setSlippage] = useState('1');
  const [isLoading, setIsLoading] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [quoteData, setQuoteData] = useState<any>(null);
  const [txSignature, setTxSignature] = useState('');
  
  // Wallet balances
  const [solBalance, setSolBalance] = useState<number>(0);
  const [fromTokenBalance, setFromTokenBalance] = useState<number>(0);
  const [toTokenBalance, setToTokenBalance] = useState<number>(0);
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);

  const tokens = [
    { symbol: 'SOL', name: 'Solana', icon: '◎', price: 50.25, mint: 'So11111111111111111111111111111111111111112' },
    { symbol: 'USDC', name: 'USD Coin', icon: '💵', price: 1.00, mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' },
    { symbol: 'USDT', name: 'Tether', icon: '💰', price: 1.00, mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB' },
    { symbol: 'BONK', name: 'Bonk', icon: '🐕', price: 0.00001, mint: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263' },
    { symbol: 'WIF', name: 'dogwifhat', icon: '🐶', price: 2.15, mint: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm' },
    { symbol: 'JTO', name: 'Jito', icon: '🎯', price: 3.45, mint: 'jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL' },
  ];

  const popularPairs = [
    { from: 'SOL', to: 'USDC', label: 'SOL → USDC' },
    { from: 'USDC', to: 'SOL', label: 'USDC → SOL' },
    { from: 'SOL', to: 'BONK', label: 'SOL → BONK' },
    { from: 'BONK', to: 'SOL', label: 'BONK → SOL' },
  ];

  // Fetch wallet balances
  const fetchBalances = async () => {
    if (!wallet?.address) return;
    
    setIsLoadingBalances(true);
    try {
      // Get SOL balance
      const solBal = await getWalletBalance(wallet.address);
      setSolBalance(solBal);

      // Get from token balance
      const fromMint = tokens.find(t => t.symbol === fromToken)?.mint;
      if (fromToken === 'SOL') {
        setFromTokenBalance(solBal);
      } else if (fromMint) {
        const fromBal = await getTokenBalance(wallet.address, fromMint);
        setFromTokenBalance(fromBal);
      }

      // Get to token balance
      const toMint = tokens.find(t => t.symbol === toToken)?.mint;
      if (toToken === 'SOL') {
        setToTokenBalance(solBal);
      } else if (toMint) {
        const toBal = await getTokenBalance(wallet.address, toMint);
        setToTokenBalance(toBal);
      }
    } catch (error) {
      console.error('Error fetching balances:', error);
    } finally {
      setIsLoadingBalances(false);
    }
  };

  // Fetch balances on mount and when tokens change
  useEffect(() => {
    fetchBalances();
  }, [wallet?.address, fromToken, toToken]);

  const handleGetQuote = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    // Check if user has enough balance
    if (parseFloat(amount) > fromTokenBalance) {
      alert(`❌ Insufficient ${fromToken} balance!\n\nYou need: ${amount} ${fromToken}\nYou have: ${fromTokenBalance.toFixed(6)} ${fromToken}`);
      return;
    }
    
    setIsLoading(true);
    try {
      const fromMint = tokens.find(t => t.symbol === fromToken)?.mint;
      const toMint = tokens.find(t => t.symbol === toToken)?.mint;
      
      if (!fromMint || !toMint) {
        throw new Error('Invalid token selection');
      }

      // Convert amount to lamports (smallest unit)
      const decimals = fromToken === 'SOL' ? 9 : 6; // SOL has 9 decimals, most tokens have 6
      const amountInLamports = Math.floor(parseFloat(amount) * Math.pow(10, decimals));

      // Call Jupiter Quote API with proper CORS handling
      const quoteResponse = await fetch(
        `https://quote-api.jup.ag/v6/quote?inputMint=${fromMint}&outputMint=${toMint}&amount=${amountInLamports}&slippageBps=${Math.floor(parseFloat(slippage) * 100)}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!quoteResponse.ok) {
        const errorText = await quoteResponse.text();
        throw new Error(`Jupiter API error: ${errorText || quoteResponse.statusText}`);
      }

      const quote = await quoteResponse.json();
      
      // Convert output amount back to human-readable
      const toDecimals = toToken === 'SOL' ? 9 : 6;
      const outputAmount = (quote.outAmount / Math.pow(10, toDecimals)).toFixed(6);
      const inputAmount = (quote.inAmount / Math.pow(10, decimals)).toFixed(6);
      const minimumReceived = (quote.otherAmountThreshold / Math.pow(10, toDecimals)).toFixed(6);

      setQuoteData({
        inputAmount: inputAmount,
        outputAmount: outputAmount,
        priceImpact: `${(quote.priceImpactPct || 0).toFixed(2)}%`,
        minimumReceived: minimumReceived,
        fee: '0.0025 USDC',
        route: quote.routePlan ? quote.routePlan.map((r: any) => r.swapInfo?.label || 'Unknown').slice(0, 3) : [fromToken, toToken],
        quoteResponse: quote // Store full quote for swap
      });
    } catch (error) {
      console.error('Quote error:', error);
      alert('Failed to get quote. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwap = async () => {
    if (!quoteData?.quoteResponse || !wallet) {
      alert('Please connect your wallet and get a quote first');
      return;
    }

    setIsSwapping(true);
    try {
      // Get swap transaction from Jupiter
      const swapResponse = await fetch('https://quote-api.jup.ag/v6/swap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          quoteResponse: quoteData.quoteResponse,
          userPublicKey: wallet.address,
          wrapAndUnwrapSol: true,
          dynamicComputeUnitLimit: true,
          prioritizationFeeLamports: 'auto'
        })
      });

      if (!swapResponse.ok) {
        throw new Error('Failed to get swap transaction');
      }

      const { swapTransaction } = await swapResponse.json();
      
      // Deserialize the transaction
      const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
      const transaction = require('@solana/web3.js').VersionedTransaction.deserialize(swapTransactionBuf);

      // Note: Transaction signing requires embedded wallet or external wallet provider
      // For now, simulate the swap transaction (in production, use Privy's embedded wallet API)
      throw new Error('Transaction signing temporarily disabled. Connect wallet provider.');

      /* TODO: Implement proper Privy wallet signing
      // Sign transaction with user's wallet
      const signedTxBytes = await wallet.signTransaction(transaction);

      // Send transaction via Helius RPC
      const connection = getConnection();
      const signature = await connection.sendRawTransaction(signedTxBytes, {
        skipPreflight: false,
        maxRetries: 3
      });

      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(signature, 'confirmed');

      if (confirmation.value.err) {
        throw new Error('Transaction failed');
      }

      setTxSignature(signature);
      alert(`✅ Swap successful!\n\nTransaction: ${signature}\n\nView on Solscan: https://solscan.io/tx/${signature}`);
      */
      // Refresh balances after swap
      await fetchBalances();
      
      // Reset form
      setAmount('');
      setQuoteData(null);
    } catch (error: any) {
      console.error('Swap error:', error);
      alert(`Failed to execute swap: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSwapping(false);
    }
  };

  const swapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setQuoteData(null);
  };

  return (
    <div className="h-full flex flex-col overflow-auto p-6">
      <div className="max-w-2xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-mono font-bold text-green-400 mb-2">x402swap</h2>
          <p className="text-green-400/60 text-sm">Powered by Jupiter Aggregator • Best rates guaranteed</p>
        </div>

        {/* Wallet Balance Display */}
        {wallet && (
          <div className="bg-green-400/10 border-2 border-green-400/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-green-400 font-mono text-sm font-bold">💰 Your Wallet</div>
              <button
                onClick={fetchBalances}
                disabled={isLoadingBalances}
                className="text-green-400 text-xs font-mono hover:text-green-300 transition-colors"
              >
                {isLoadingBalances ? '⏳ Refreshing...' : '🔄 Refresh'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black border border-green-400/30 rounded p-3">
                <div className="text-green-400/60 text-xs font-mono mb-1">SOL Balance</div>
                <div className="text-green-400 font-mono text-lg font-bold">
                  {isLoadingBalances ? '...' : `◎ ${solBalance.toFixed(6)}`}
                </div>
              </div>
              <div className="bg-black border border-green-400/30 rounded p-3">
                <div className="text-green-400/60 text-xs font-mono mb-1">{fromToken} Balance</div>
                <div className="text-green-400 font-mono text-lg font-bold">
                  {isLoadingBalances ? '...' : `${fromTokenBalance.toFixed(6)}`}
                </div>
              </div>
            </div>
            <div className="text-green-400/60 text-xs font-mono mt-2 text-center">
              Connected: {wallet.address.slice(0, 4)}...{wallet.address.slice(-4)}
            </div>
          </div>
        )}

        {/* Popular Pairs */}
        <div>
          <div className="text-green-400/60 text-xs font-mono mb-2">Quick Swap:</div>
          <div className="flex flex-wrap gap-2">
            {popularPairs.map((pair) => (
              <button
                key={pair.label}
                onClick={() => {
                  setFromToken(pair.from);
                  setToToken(pair.to);
                  setQuoteData(null);
                }}
                className="bg-green-400/10 border border-green-400/30 rounded px-3 py-1 text-green-400 
                         hover:bg-green-400/20 transition-colors font-mono text-xs"
              >
                {pair.label}
              </button>
            ))}
          </div>
        </div>

        {/* Swap Card */}
        <div className="bg-black border-2 border-green-400/50 rounded-lg p-6 space-y-4">
          {/* From Token */}
          <div>
            <label className="block text-green-400 font-mono text-sm mb-2">From</label>
            <div className="bg-green-400/10 border-2 border-green-400/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <select
                  value={fromToken}
                  onChange={(e) => setFromToken(e.target.value)}
                  className="bg-black border border-green-400/50 rounded px-3 py-2 text-green-400 
                           font-mono text-sm focus:outline-none focus:border-green-400"
                >
                  {tokens.map((token) => (
                    <option key={token.symbol} value={token.symbol}>
                      {token.icon} {token.symbol}
                    </option>
                  ))}
                </select>
                <div className="text-green-400/60 text-xs font-mono">
                  Balance: {isLoadingBalances ? '...' : fromTokenBalance.toFixed(6)}
                </div>
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setQuoteData(null);
                }}
                placeholder="0.00"
                max={fromTokenBalance}
                className="w-full bg-transparent text-green-400 font-mono text-3xl font-bold 
                         focus:outline-none"
              />
              <div className="flex items-center justify-between">
                <div className="text-green-400/60 text-xs font-mono mt-2">
                  ≈ ${(parseFloat(amount || '0') * (tokens.find(t => t.symbol === fromToken)?.price || 0)).toFixed(2)}
                </div>
                <button
                  onClick={() => setAmount(fromTokenBalance.toString())}
                  className="text-green-400 text-xs font-mono hover:text-green-300 transition-colors mt-2"
                >
                  MAX
                </button>
              </div>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={swapTokens}
              className="bg-green-400/20 border-2 border-green-400/50 rounded-full p-3 
                       hover:bg-green-400/30 transition-all hover:rotate-180 duration-300"
            >
              <span className="text-2xl">🔄</span>
            </button>
          </div>

          {/* To Token */}
          <div>
            <label className="block text-green-400 font-mono text-sm mb-2">To (estimated)</label>
            <div className="bg-purple-500/10 border-2 border-purple-500/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <select
                  value={toToken}
                  onChange={(e) => setToToken(e.target.value)}
                  className="bg-black border border-purple-500/50 rounded px-3 py-2 text-purple-400 
                           font-mono text-sm focus:outline-none focus:border-purple-400"
                >
                  {tokens.map((token) => (
                    <option key={token.symbol} value={token.symbol}>
                      {token.icon} {token.symbol}
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-purple-400 font-mono text-3xl font-bold">
                {quoteData?.outputAmount || '0.00'}
              </div>
              <div className="text-purple-400/60 text-xs font-mono mt-2">
                ≈ ${(parseFloat(quoteData?.outputAmount || '0') * (tokens.find(t => t.symbol === toToken)?.price || 0)).toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Slippage Settings */}
        <div className="bg-green-400/5 border border-green-400/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-green-400 font-mono text-sm">Slippage Tolerance</span>
            <div className="flex gap-2">
              {['0.5', '1', '2'].map((value) => (
                <button
                  key={value}
                  onClick={() => setSlippage(value)}
                  className={`px-3 py-1 border rounded font-mono text-xs transition-all ${
                    slippage === value
                      ? 'bg-green-400 text-black border-green-400'
                      : 'bg-black text-green-400 border-green-400/30 hover:border-green-400/50'
                  }`}
                >
                  {value}%
                </button>
              ))}
              <input
                type="number"
                value={slippage}
                onChange={(e) => setSlippage(e.target.value)}
                className="w-16 bg-black border border-green-400/30 rounded px-2 py-1 text-green-400 
                         font-mono text-xs text-center focus:outline-none focus:border-green-400"
              />
            </div>
          </div>
        </div>

        {/* Quote Button */}
        {!quoteData && (
          <button
            onClick={handleGetQuote}
            disabled={!amount || parseFloat(amount) <= 0 || isLoading}
            className="w-full bg-green-400/20 hover:bg-green-400/30 border-2 border-green-400/50 
                     text-green-400 font-mono py-4 px-6 rounded font-bold text-lg transition-all 
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '⏳ Getting Best Rate...' : '📊 Get Quote'}
          </button>
        )}

        {/* Quote Details */}
        {quoteData && (
          <>
            <div className="bg-green-400/10 border-2 border-green-400/50 rounded-lg p-4 space-y-3">
              <div className="text-center text-green-400 font-mono font-bold mb-3">
                Best Route Found 🎯
              </div>
              <div className="flex justify-between text-sm font-mono">
                <span className="text-green-400/60">Rate:</span>
                <span className="text-green-400">1 {fromToken} ≈ {(parseFloat(quoteData.outputAmount) / parseFloat(quoteData.inputAmount)).toFixed(6)} {toToken}</span>
              </div>
              <div className="flex justify-between text-sm font-mono">
                <span className="text-green-400/60">Price Impact:</span>
                <span className="text-green-400">{quoteData.priceImpact}</span>
              </div>
              <div className="flex justify-between text-sm font-mono">
                <span className="text-green-400/60">Minimum Received:</span>
                <span className="text-green-400">{quoteData.minimumReceived} {toToken}</span>
              </div>
              <div className="flex justify-between text-sm font-mono">
                <span className="text-green-400/60">Network Fee:</span>
                <span className="text-green-400">~0.000005 SOL</span>
              </div>
              <div className="flex justify-between text-sm font-mono">
                <span className="text-green-400/60">x402swap Fee:</span>
                <span className="text-green-400">{quoteData.fee}</span>
              </div>
              <div className="border-t border-green-400/30 pt-3 mt-3">
                <div className="flex justify-between font-mono font-bold">
                  <span className="text-green-400">Route:</span>
                  <span className="text-green-400">{quoteData.route.join(' → ')}</span>
                </div>
              </div>
            </div>

            {/* Swap Button */}
            <button
              onClick={handleSwap}
              disabled={isSwapping}
              className="w-full bg-green-400 hover:bg-green-500 text-black font-mono py-4 px-6 rounded 
                       font-bold text-lg transition-all shadow-[0_0_20px_rgba(0,255,65,0.3)]
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSwapping ? '⏳ Swapping...' : `🚀 Swap ${fromToken} to ${toToken}`}
            </button>

            <button
              onClick={() => {
                setQuoteData(null);
                setTxSignature('');
              }}
              className="w-full bg-black border border-green-400/30 text-green-400 font-mono py-2 px-4 
                       rounded hover:bg-green-400/10 transition-colors"
            >
              ← Get New Quote
            </button>
          </>
        )}

        {/* Transaction Result */}
        {txSignature && (
          <div className="bg-green-400/10 border-2 border-green-400/50 rounded-lg p-4">
            <div className="text-green-400 font-mono text-sm mb-2">✅ Transaction Successful!</div>
            <a
              href={`https://solscan.io/tx/${txSignature}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 font-mono text-xs underline break-all hover:text-green-300"
            >
              View on Solscan: {txSignature.slice(0, 8)}...{txSignature.slice(-8)}
            </a>
          </div>
        )}

        {/* Info */}
        <div className="text-center text-green-400/60 text-xs font-mono">
          <p>Powered by Jupiter Aggregator API</p>
          <p className="mt-1">Best rates across all Solana DEXs • Fees paid by your connected wallet</p>
        </div>
      </div>
    </div>
  );
}
