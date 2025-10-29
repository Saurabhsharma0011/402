/**
 * Script to check faucet wallet balance and request SOL airdrop if needed
 * Run this script to ensure the faucet wallet has enough SOL for transactions
 */

import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token';

// Load environment variables
const privateKeyArray = JSON.parse(process.env.X402_FAUCET_PRIVATE_KEY || '[]');
const privateKey = Uint8Array.from(privateKeyArray);
const faucetWallet = Keypair.fromSecretKey(privateKey);

const TOKEN_MINT = new PublicKey(process.env.NEXT_PUBLIC_X402_TOKEN_MINT || '');
const RPC_URL = 'https://api.devnet.solana.com';

async function checkFaucetWallet() {
  const connection = new Connection(RPC_URL, 'confirmed');
  
  console.log('🔍 Checking Faucet Wallet Status...\n');
  console.log('📍 Faucet Wallet Address:', faucetWallet.publicKey.toBase58());
  console.log('🪙 Token Mint:', TOKEN_MINT.toBase58());
  console.log('');
  
  // Check SOL balance
  const solBalance = await connection.getBalance(faucetWallet.publicKey);
  const solBalanceFormatted = solBalance / LAMPORTS_PER_SOL;
  
  console.log('💰 SOL Balance:', solBalanceFormatted, 'SOL');
  
  if (solBalance < 0.1 * LAMPORTS_PER_SOL) {
    console.log('⚠️  Low SOL balance! Requesting airdrop...\n');
    
    try {
      const airdropSignature = await connection.requestAirdrop(
        faucetWallet.publicKey,
        2 * LAMPORTS_PER_SOL // Request 2 SOL
      );
      
      console.log('📤 Airdrop requested. Signature:', airdropSignature);
      console.log('⏳ Waiting for confirmation...');
      
      await connection.confirmTransaction(airdropSignature, 'confirmed');
      
      const newBalance = await connection.getBalance(faucetWallet.publicKey);
      console.log('✅ Airdrop confirmed! New balance:', newBalance / LAMPORTS_PER_SOL, 'SOL\n');
    } catch (error) {
      console.error('❌ Airdrop failed:', error);
      console.log('💡 Try manually funding the wallet with Devnet SOL from https://faucet.solana.com\n');
    }
  } else {
    console.log('✅ SOL balance is sufficient\n');
  }
  
  // Check token balance
  try {
    const tokenAccount = await getAssociatedTokenAddress(
      TOKEN_MINT,
      faucetWallet.publicKey
    );
    
    console.log('🔗 Token Account:', tokenAccount.toBase58());
    
    const accountInfo = await connection.getAccountInfo(tokenAccount);
    
    if (!accountInfo) {
      console.log('❌ Token account does not exist!');
      console.log('💡 Please ensure tokens are minted to this wallet first.\n');
    } else {
      const tokenAccountInfo = await getAccount(connection, tokenAccount);
      const tokenBalance = Number(tokenAccountInfo.amount) / Math.pow(10, 9);
      
      console.log('🪙 x402 Token Balance:', tokenBalance.toLocaleString(), 'tokens');
      
      if (tokenBalance < 10000) {
        console.log('⚠️  Low token balance! Please mint more tokens to continue operating the faucet.\n');
      } else {
        console.log('✅ Token balance is sufficient\n');
      }
    }
  } catch (error) {
    console.error('❌ Error checking token balance:', error);
  }
  
  console.log('✨ Faucet wallet check complete!');
  console.log('\n📝 Summary:');
  console.log('   - Address:', faucetWallet.publicKey.toBase58());
  console.log('   - SOL Balance:', solBalanceFormatted, 'SOL');
  console.log('   - Ready to distribute tokens:', solBalance >= 0.1 * LAMPORTS_PER_SOL ? '✅' : '❌');
}

// Run the check
checkFaucetWallet().catch(console.error);
