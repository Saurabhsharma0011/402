import { Connection, Transaction, VersionedTransaction, PublicKey } from '@solana/web3.js';

/**
 * Get Helius RPC Connection
 */
export function getConnection(): Connection {
  const rpcUrl = process.env.NEXT_PUBLIC_HELIUS_RPC_URL || process.env.NEXT_PUBLIC_SOLANA_RPC_URL;
  return new Connection(rpcUrl!, 'confirmed');
}

/**
 * Send and confirm transaction using user's wallet
 * @param transaction - The transaction to send
 * @param wallet - The user's wallet from Privy (with signTransaction method)
 * @returns Transaction signature
 */
export async function sendTransaction(
  transaction: Transaction | VersionedTransaction,
  wallet: any
): Promise<string> {
  try {
    const connection = getConnection();

    // Sign transaction with user's wallet
    const signedTx = await wallet.signTransaction(transaction);

    // Send transaction
    const signature = await connection.sendRawTransaction(signedTx.serialize(), {
      skipPreflight: false,
      maxRetries: 3,
    });

    // Confirm transaction
    const confirmation = await connection.confirmTransaction(signature, 'confirmed');

    if (confirmation.value.err) {
      throw new Error('Transaction failed: ' + JSON.stringify(confirmation.value.err));
    }

    return signature;
  } catch (error) {
    console.error('Transaction error:', error);
    throw error;
  }
}

/**
 * Get wallet SOL balance
 */
export async function getWalletBalance(walletAddress: string): Promise<number> {
  try {
    const connection = getConnection();
    const publicKey = new PublicKey(walletAddress);
    const balance = await connection.getBalance(publicKey);
    return balance / 1e9; // Convert lamports to SOL
  } catch (error) {
    console.error('Error fetching balance:', error);
    return 0;
  }
}

/**
 * Get token balance for a specific mint
 */
export async function getTokenBalance(
  walletAddress: string,
  tokenMintAddress: string
): Promise<number> {
  try {
    const connection = getConnection();
    const publicKey = new PublicKey(walletAddress);
    const mintPublicKey = new PublicKey(tokenMintAddress);
    const response = await connection.getParsedTokenAccountsByOwner(publicKey, {
      mint: mintPublicKey,
    });

    if (response.value.length === 0) return 0;

    const balance = response.value[0]?.account.data.parsed.info.tokenAmount.uiAmount || 0;
    return balance;
  } catch (error) {
    console.error('Error fetching token balance:', error);
    return 0;
  }
}

/**
 * Get transaction status
 */
export async function getTransactionStatus(signature: string): Promise<'confirmed' | 'failed' | 'pending'> {
  try {
    const connection = getConnection();
    const status = await connection.getSignatureStatus(signature);

    if (!status.value) return 'pending';
    if (status.value.err) return 'failed';
    if (status.value.confirmationStatus === 'confirmed' || status.value.confirmationStatus === 'finalized') {
      return 'confirmed';
    }

    return 'pending';
  } catch (error) {
    console.error('Error checking transaction status:', error);
    return 'failed';
  }
}

/**
 * Format wallet address for display
 */
export function formatAddress(address: string | undefined, length: number = 4): string {
  if (!address) return '';
  return `${address.slice(0, length)}...${address.slice(-length)}`;
}

/**
 * Validate Solana address
 */
export function isValidSolanaAddress(address: string): boolean {
  try {
    return address.length >= 32 && address.length <= 44;
  } catch {
    return false;
  }
}
