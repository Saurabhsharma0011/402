import { Connection, PublicKey, Keypair, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createTransferInstruction, getAccount } from '@solana/spl-token';

// Constants
const TOKEN_MINT = new PublicKey(process.env.NEXT_PUBLIC_X402_TOKEN_MINT!);
const FAUCET_AMOUNT = parseInt(process.env.NEXT_PUBLIC_X402_FAUCET_AMOUNT || '10000');
const APP_FEE = parseInt(process.env.NEXT_PUBLIC_X402_APP_FEE || '4000');
const TOKEN_DECIMALS = 9; // Standard SPL token decimals

// Get connection
export function getConnection(): Connection {
  const rpcUrl = process.env.NEXT_PUBLIC_HELIUS_RPC_URL || process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com';
  return new Connection(rpcUrl, 'confirmed');
}

// Get faucet wallet from private key
export function getFaucetWallet(): Keypair {
  const privateKeyString = process.env.X402_FAUCET_PRIVATE_KEY;
  if (!privateKeyString) {
    throw new Error('X402_FAUCET_PRIVATE_KEY not found in environment variables');
  }
  
  const privateKeyArray = JSON.parse(privateKeyString);
  return Keypair.fromSecretKey(Uint8Array.from(privateKeyArray));
}

// Get user's x402 token balance
export async function getX402Balance(walletAddress: string): Promise<number> {
  try {
    const connection = getConnection();
    const userPublicKey = new PublicKey(walletAddress);
    
    // Get associated token account
    const tokenAccount = await getAssociatedTokenAddress(
      TOKEN_MINT,
      userPublicKey
    );
    
    // Check if account exists first
    const accountInfo = await connection.getAccountInfo(tokenAccount);
    if (!accountInfo) {
      // Token account doesn't exist yet, return 0
      return 0;
    }
    
    // Get token account details
    const tokenAccountInfo = await getAccount(connection, tokenAccount);
    
    // Return balance (convert from lamports)
    return Number(tokenAccountInfo.amount) / Math.pow(10, TOKEN_DECIMALS);
  } catch (error) {
    console.error('Error getting x402 balance:', error);
    return 0; // Return 0 if token account doesn't exist
  }
}

// Check SOL balance
export async function getSolBalance(walletAddress: string): Promise<number> {
  try {
    const connection = getConnection();
    const publicKey = new PublicKey(walletAddress);
    const balance = await connection.getBalance(publicKey);
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error('Error getting SOL balance:', error);
    return 0;
  }
}

// Airdrop Devnet SOL
export async function airdropDevnetSOL(walletAddress: string, amount: number = 1): Promise<string> {
  try {
    const connection = getConnection();
    const publicKey = new PublicKey(walletAddress);
    
    // Request airdrop
    const signature = await connection.requestAirdrop(
      publicKey,
      amount * LAMPORTS_PER_SOL
    );
    
    // Confirm transaction
    await connection.confirmTransaction(signature, 'confirmed');
    
    return signature;
  } catch (error: any) {
    console.error('Error airdropping SOL:', error);
    throw new Error(error.message || 'Failed to airdrop SOL');
  }
}

// Transfer x402 tokens from faucet to user
export async function transferX402Tokens(
  recipientAddress: string,
  amount: number
): Promise<string> {
  try {
    const connection = getConnection();
    const faucetWallet = getFaucetWallet();
    const recipientPublicKey = new PublicKey(recipientAddress);
    
    // Check faucet wallet SOL balance
    const faucetSolBalance = await connection.getBalance(faucetWallet.publicKey);
    console.log('Faucet SOL balance:', faucetSolBalance / 1e9, 'SOL');
    
    if (faucetSolBalance < 0.01 * 1e9) { // Less than 0.01 SOL
      throw new Error('Faucet wallet has insufficient SOL for transaction fees. Please fund the faucet wallet.');
    }
    
    // Get associated token accounts
    const faucetTokenAccount = await getAssociatedTokenAddress(
      TOKEN_MINT,
      faucetWallet.publicKey
    );
    
    const recipientTokenAccount = await getAssociatedTokenAddress(
      TOKEN_MINT,
      recipientPublicKey
    );
    
    // Get recent blockhash
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
    
    // Create transaction
    const transaction = new Transaction({
      feePayer: faucetWallet.publicKey,
      blockhash,
      lastValidBlockHeight,
    });
    
    // Check if recipient token account exists, if not create it
    const recipientAccountInfo = await connection.getAccountInfo(recipientTokenAccount);
    if (!recipientAccountInfo) {
      console.log('Creating associated token account for recipient...');
      // Account doesn't exist, add instruction to create it
      transaction.add(
        createAssociatedTokenAccountInstruction(
          faucetWallet.publicKey, // payer
          recipientTokenAccount,
          recipientPublicKey,
          TOKEN_MINT
        )
      );
    }
    
    // Add transfer instruction
    const transferAmount = amount * Math.pow(10, TOKEN_DECIMALS);
    console.log('Transferring', amount, 'tokens (', transferAmount, 'raw units)');
    
    transaction.add(
      createTransferInstruction(
        faucetTokenAccount,
        recipientTokenAccount,
        faucetWallet.publicKey,
        transferAmount
      )
    );
    
    // Sign transaction
    transaction.sign(faucetWallet);
    
    // Send and confirm transaction
    console.log('Sending transaction...');
    const signature = await connection.sendRawTransaction(transaction.serialize(), {
      skipPreflight: false,
      preflightCommitment: 'confirmed'
    });
    
    console.log('Transaction sent:', signature);
    console.log('Confirming transaction...');
    
    await connection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight
    }, 'confirmed');
    
    console.log('Transaction confirmed!');
    return signature;
  } catch (error: any) {
    console.error('Error transferring x402 tokens:', error);
    throw new Error(error.message || 'Failed to transfer tokens');
  }
}

// Check cooldown for faucet claims
export function checkCooldown(walletAddress: string): { canClaim: boolean; remainingTime: number } {
  const cooldownKey = `x402_cooldown_${walletAddress}`;
  const lastClaimTime = localStorage.getItem(cooldownKey);
  
  if (!lastClaimTime) {
    return { canClaim: true, remainingTime: 0 };
  }
  
  const cooldownMinutes = parseInt(process.env.NEXT_PUBLIC_X402_COOLDOWN_MINUTES || '30');
  const cooldownMs = cooldownMinutes * 60 * 1000;
  const timeSinceClaim = Date.now() - parseInt(lastClaimTime);
  
  if (timeSinceClaim >= cooldownMs) {
    return { canClaim: true, remainingTime: 0 };
  }
  
  const remainingTime = cooldownMs - timeSinceClaim;
  return { canClaim: false, remainingTime };
}

// Set cooldown after claim
export function setCooldown(walletAddress: string): void {
  const cooldownKey = `x402_cooldown_${walletAddress}`;
  localStorage.setItem(cooldownKey, Date.now().toString());
}

// Format time remaining
export function formatTimeRemaining(milliseconds: number): string {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
}

// Constants export
export const X402_CONFIG = {
  TOKEN_MINT: TOKEN_MINT.toString(),
  FAUCET_AMOUNT,
  APP_FEE,
  TOKEN_DECIMALS,
};
