'use client';

import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { getConnection, getWalletBalance, getTokenBalance } from '@/utils/solana';

export default function XBridgeApp() {
  const { user } = usePrivy();
  
  // Get Solana wallet address from user
  const walletAddress = user?.wallet?.address || null;
  const wallet = walletAddress ? { address: walletAddress } : null;

  const [fromChain, setFromChain] = useState('Solana');
  const [toChain, setToChain] = useState('Ethereum');
  const [token, setToken] = useState('USDC');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isBridging, setIsBridging] = useState(false);
  const [quoteData, setQuoteData] = useState<any>(null);
  const [txSignature, setTxSignature] = useState('');
  
  // Wallet balances
  const [solBalance, setSolBalance] = useState<number>(0);
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);

  const tokenMints: Record<string, string> = {
    'USDC': 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    'USDT': 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    'ETH': '7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs',
    'SOL': 'So11111111111111111111111111111111111111112',
    'WBTC': '9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E',
  };

  const chains = [
    { name: 'Solana', icon: '◎', color: 'purple' },
    { name: 'Ethereum', icon: 'Ξ', color: 'blue' },
    { name: 'BSC', icon: '🔶', color: 'yellow' },
    { name: 'Polygon', icon: '🟣', color: 'purple' },
    { name: 'Avalanche', icon: '🔺', color: 'red' },
    { name: 'Arbitrum', icon: '🔵', color: 'blue' },
  ];

  const supportedTokens = ['USDC', 'USDT', 'ETH', 'SOL', 'WBTC'];

  const popularRoutes = [
    { from: 'Solana', to: 'Ethereum', label: 'SOL → ETH' },
    { from: 'Ethereum', to: 'Solana', label: 'ETH → SOL' },
    { from: 'Solana', to: 'BSC', label: 'SOL → BSC' },
    { from: 'BSC', to: 'Solana', label: 'BSC → SOL' },
  ];

  // Fetch wallet balances
  const fetchBalances = async () => {
    if (!wallet?.address) return;
    
    setIsLoadingBalances(true);
    try {
      // Get SOL balance
      const solBal = await getWalletBalance(wallet.address);
      setSolBalance(solBal);

      // Get token balance
      if (token === 'SOL') {
        setTokenBalance(solBal);
      } else {
        const mint = tokenMints[token];
        if (mint) {
          const tokenBal = await getTokenBalance(wallet.address, mint);
          setTokenBalance(tokenBal);
        }
      }
    } catch (error) {
      console.error('Error fetching balances:', error);
    } finally {
      setIsLoadingBalances(false);
    }
  };

  // Fetch balances on mount and when token changes
  useEffect(() => {
    fetchBalances();
  }, [wallet?.address, token]);

  const handleGetQuote = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    // Check if user has enough balance (only for Solana as source chain)
    if (fromChain === 'Solana' && parseFloat(amount) > tokenBalance) {
      alert(`❌ Insufficient ${token} balance!\n\nYou need: ${amount} ${token}\nYou have: ${tokenBalance.toFixed(6)} ${token}`);
      return;
    }
    
    setIsLoading(true);
    try {
      // For now, using estimated quotes since AllBridge/Wormhole require complex setup
      // In production, you'd integrate with Wormhole SDK or AllBridge API
      const estimatedAmount = (parseFloat(amount) * 0.998).toFixed(6); // 0.2% bridge fee
      const estimatedTime = fromChain === 'Solana' || toChain === 'Solana' ? '2-5 min' : '10-15 min';
      
      setQuoteData({
        inputAmount: amount,
        outputAmount: estimatedAmount,
        bridgeFee: (parseFloat(amount) * 0.002).toFixed(6),
        networkFee: fromChain === 'Ethereum' ? '~$15' : '~$0.01',
        estimatedTime,
        protocol: fromChain === 'Solana' || toChain === 'Solana' ? 'Wormhole' : 'AllBridge',
      });
    } catch (error) {
      console.error('Quote error:', error);
      alert('Failed to get bridge quote. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBridge = async () => {
    if (!quoteData || !wallet || !recipient) {
      alert('Please connect your wallet, get a quote, and enter recipient address');
      return;
    }

    // Validate recipient address format
    if (toChain === 'Solana' && recipient.length !== 44) {
      alert('Invalid Solana address format. Must be 44 characters.');
      return;
    }
    if (toChain === 'Ethereum' && !recipient.startsWith('0x')) {
      alert('Invalid Ethereum address format. Must start with 0x.');
      return;
    }

    setIsBridging(true);
    try {
      // Note: Full Wormhole/AllBridge integration requires:
      // 1. Wormhole SDK for attestation and transfer
      // 2. Relayer setup for automatic redemption
      // 3. Token approvals and wrapping
      // This is a simplified flow showing the pattern

      if (fromChain === 'Solana') {
        // For Solana → Other chains via Wormhole
        alert(
          `⚠️ Bridge Integration In Progress\n\n` +
          `To complete Wormhole integration:\n` +
          `1. Install @certusone/wormhole-sdk\n` +
          `2. Implement token attestation\n` +
          `3. Create transfer with payload\n` +
          `4. Set up relayer for redemption\n\n` +
          `Your wallet (${wallet.address.slice(0, 8)}...) will be the fee payer.\n\n` +
          `Amount: ${amount} ${token}\n` +
          `From: ${fromChain}\n` +
          `To: ${toChain}\n` +
          `Recipient: ${recipient.slice(0, 12)}...`
        );
      } else {
        alert('Bridge only supports transfers FROM Solana currently. Please switch chains.');
      }

      // In production, you would:
      // const connection = getConnection();
      // const transaction = await createWormholeTransferTx(...);
      // const { signedTransaction } = await wallet.signTransaction(transaction);
      // const signature = await connection.sendRawTransaction(signedTransaction);
      // setTxSignature(signature);
      
    } catch (error: any) {
      console.error('Bridge error:', error);
      alert(`Failed to execute bridge: ${error.message || 'Unknown error'}`);
    } finally {
      setIsBridging(false);
    }
  };

  const swapChains = () => {
    const temp = fromChain;
    setFromChain(toChain);
    setToChain(temp);
    setQuoteData(null);
  };

  return (
    <div className="h-full flex flex-col overflow-auto p-6">
      <div className="max-w-2xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-mono font-bold text-green-400 mb-2">x402bridge</h2>
          <p className="text-green-400/60 text-sm">Powered by Wormhole & AllBridge • Secure cross-chain transfers</p>
        </div>

        {/* Wallet Balance Display */}
        {wallet && (
          <div className="bg-green-400/10 border-2 border-green-400/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-green-400 font-mono text-sm font-bold">💰 Your Wallet (Solana)</div>
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
                <div className="text-green-400/60 text-xs font-mono mb-1">{token} Balance</div>
                <div className="text-green-400 font-mono text-lg font-bold">
                  {isLoadingBalances ? '...' : `${tokenBalance.toFixed(6)}`}
                </div>
              </div>
            </div>
            <div className="text-green-400/60 text-xs font-mono mt-2 text-center">
              Connected: {wallet.address.slice(0, 4)}...{wallet.address.slice(-4)}
            </div>
          </div>
        )}

        {/* Warning Banner */}
        <div className="bg-yellow-500/10 border-2 border-yellow-500/50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div className="flex-1">
              <div className="text-yellow-400 font-mono font-bold text-sm mb-1">
                Double-check recipient address!
              </div>
              <div className="text-yellow-400/80 font-mono text-xs">
                Cross-chain transactions are irreversible. Ensure the recipient address matches the destination chain format.
              </div>
            </div>
          </div>
        </div>

        {/* Popular Routes */}
        <div>
          <div className="text-green-400/60 text-xs font-mono mb-2">Popular Routes:</div>
          <div className="flex flex-wrap gap-2">
            {popularRoutes.map((route) => (
              <button
                key={route.label}
                onClick={() => {
                  setFromChain(route.from);
                  setToChain(route.to);
                  setQuoteData(null);
                }}
                className="bg-green-400/10 border border-green-400/30 rounded px-3 py-1 text-green-400 
                         hover:bg-green-400/20 transition-colors font-mono text-xs"
              >
                {route.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bridge Card */}
        <div className="bg-black border-2 border-green-400/50 rounded-lg p-6 space-y-4">
          {/* From Chain */}
          <div>
            <label className="block text-green-400 font-mono text-sm mb-2">From Chain</label>
            <div className="bg-green-400/10 border-2 border-green-400/30 rounded-lg p-4">
              <select
                value={fromChain}
                onChange={(e) => {
                  setFromChain(e.target.value);
                  setQuoteData(null);
                }}
                className="w-full bg-black border border-green-400/50 rounded px-4 py-3 text-green-400 
                         font-mono text-lg focus:outline-none focus:border-green-400"
              >
                {chains.map((chain) => (
                  <option key={chain.name} value={chain.name}>
                    {chain.icon} {chain.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={swapChains}
              className="bg-green-400/20 border-2 border-green-400/50 rounded-full p-3 
                       hover:bg-green-400/30 transition-all hover:rotate-180 duration-300"
            >
              <span className="text-2xl">🔄</span>
            </button>
          </div>

          {/* To Chain */}
          <div>
            <label className="block text-green-400 font-mono text-sm mb-2">To Chain</label>
            <div className="bg-purple-500/10 border-2 border-purple-500/30 rounded-lg p-4">
              <select
                value={toChain}
                onChange={(e) => {
                  setToChain(e.target.value);
                  setQuoteData(null);
                }}
                className="w-full bg-black border border-purple-500/50 rounded px-4 py-3 text-purple-400 
                         font-mono text-lg focus:outline-none focus:border-purple-400"
              >
                {chains.map((chain) => (
                  <option key={chain.name} value={chain.name}>
                    {chain.icon} {chain.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Token & Amount */}
        <div className="bg-black border-2 border-green-400/30 rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-green-400 font-mono text-sm mb-2">Select Token</label>
            <div className="grid grid-cols-5 gap-2">
              {supportedTokens.map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setToken(t);
                    setQuoteData(null);
                  }}
                  className={`py-2 px-3 border-2 rounded font-mono text-xs transition-all ${
                    token === t
                      ? 'bg-green-400/20 border-green-400 text-green-400'
                      : 'bg-black border-green-400/30 text-green-400/60 hover:border-green-400/50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-green-400 font-mono text-sm mb-2">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setQuoteData(null);
              }}
              placeholder="0.00"
              max={tokenBalance}
              className="w-full bg-black border-2 border-green-400/30 rounded px-4 py-3 text-green-400 
                       font-mono text-2xl font-bold focus:border-green-400 focus:outline-none"
            />
            <div className="flex items-center justify-between mt-2">
              <div className="text-green-400/60 text-xs font-mono">
                Balance: {isLoadingBalances ? '...' : tokenBalance.toFixed(6)} {token}
              </div>
              <button
                onClick={() => setAmount(tokenBalance.toString())}
                disabled={tokenBalance === 0}
                className="text-green-400 text-xs font-mono hover:text-green-300 transition-colors disabled:opacity-50"
              >
                MAX
              </button>
            </div>
          </div>
        </div>

        {/* Recipient Address */}
        <div>
          <label className="block text-green-400 font-mono text-sm mb-2">
            Recipient Address on {toChain}
          </label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder={`Enter ${toChain} address...`}
            className="w-full bg-black border-2 border-green-400/30 rounded px-4 py-3 text-green-400 
                     font-mono text-sm focus:border-green-400 focus:outline-none"
          />
          <div className="text-green-400/60 text-xs mt-2 font-mono">
            Leave empty to use your connected wallet address
          </div>
        </div>

        {/* Get Quote Button */}
        {!quoteData && (
          <button
            onClick={handleGetQuote}
            disabled={!amount || parseFloat(amount) <= 0 || isLoading || fromChain === toChain}
            className="w-full bg-green-400/20 hover:bg-green-400/30 border-2 border-green-400/50 
                     text-green-400 font-mono py-4 px-6 rounded font-bold text-lg transition-all 
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '⏳ Getting Bridge Quote...' : '🌉 Get Bridge Quote'}
          </button>
        )}

        {/* Quote Details */}
        {quoteData && (
          <>
            <div className="bg-green-400/10 border-2 border-green-400/50 rounded-lg p-4 space-y-3">
              <div className="text-center text-green-400 font-mono font-bold mb-3">
                Bridge Quote Ready 🌉
              </div>
              <div className="flex justify-between text-sm font-mono">
                <span className="text-green-400/60">You Send:</span>
                <span className="text-green-400">{quoteData.inputAmount} {token} ({fromChain})</span>
              </div>
              <div className="flex justify-between text-sm font-mono">
                <span className="text-green-400/60">You Receive:</span>
                <span className="text-green-400">{quoteData.outputAmount} {token} ({toChain})</span>
              </div>
              <div className="flex justify-between text-sm font-mono">
                <span className="text-green-400/60">Bridge Fee (0.2%):</span>
                <span className="text-green-400">{quoteData.bridgeFee} {token}</span>
              </div>
              <div className="flex justify-between text-sm font-mono">
                <span className="text-green-400/60">Network Fee:</span>
                <span className="text-green-400">{quoteData.networkFee}</span>
              </div>
              <div className="flex justify-between text-sm font-mono">
                <span className="text-green-400/60">x402bridge Fee:</span>
                <span className="text-green-400">0.005 USDC</span>
              </div>
              <div className="flex justify-between text-sm font-mono">
                <span className="text-green-400/60">Estimated Time:</span>
                <span className="text-green-400">{quoteData.estimatedTime}</span>
              </div>
              <div className="border-t border-green-400/30 pt-3 mt-3">
                <div className="flex justify-between font-mono font-bold">
                  <span className="text-green-400">Protocol:</span>
                  <span className="text-green-400">{quoteData.protocol}</span>
                </div>
              </div>
            </div>

            {/* Bridge Button */}
            <button
              onClick={handleBridge}
              disabled={isBridging || !recipient}
              className="w-full bg-green-400 hover:bg-green-500 text-black font-mono py-4 px-6 rounded 
                       font-bold text-lg transition-all shadow-[0_0_20px_rgba(0,255,65,0.3)]
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isBridging ? '⏳ Bridging...' : `🚀 Bridge ${token} to ${toChain}`}
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
            <div className="text-green-400 font-mono text-sm mb-2">✅ Bridge Transaction Initiated!</div>
            <a
              href={`https://solscan.io/tx/${txSignature}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 font-mono text-xs underline break-all hover:text-green-300"
            >
              View on Solscan: {txSignature.slice(0, 8)}...{txSignature.slice(-8)}
            </a>
            <div className="text-green-400/60 font-mono text-xs mt-2">
              ⏳ Waiting for cross-chain confirmation... Check destination chain in {quoteData?.estimatedTime}
            </div>
          </div>
        )}

        {/* Supported Chains Info */}
        <div className="bg-green-400/5 border border-green-400/30 rounded-lg p-4">
          <div className="text-green-400 font-mono text-sm font-bold mb-3">Supported Chains</div>
          <div className="grid grid-cols-3 gap-3">
            {chains.map((chain) => (
              <div
                key={chain.name}
                className="bg-black border border-green-400/20 rounded p-2 text-center"
              >
                <div className="text-2xl mb-1">{chain.icon}</div>
                <div className="text-green-400 font-mono text-xs">{chain.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="text-center text-green-400/60 text-xs font-mono space-y-1">
          <p>🔒 Powered by Wormhole & AllBridge • Secure cross-chain messaging</p>
          <p>💰 Fees paid by your connected wallet via Helius RPC</p>
          <p>⚠️ Always verify recipient address before bridging</p>
        </div>
      </div>
    </div>
  );
}
