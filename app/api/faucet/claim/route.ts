import { NextRequest, NextResponse } from 'next/server';
import { transferX402Tokens } from '@/utils/x402Token';
import { checkRateLimit, getClientIdentifier, isValidSolanaAddress } from '@/lib/api-security';

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, amount } = await request.json();
    
    // Validate wallet address
    if (!walletAddress || !isValidSolanaAddress(walletAddress)) {
      return NextResponse.json(
        { error: 'Invalid wallet address' },
        { status: 400 }
      );
    }

    // Rate limiting
    const clientId = getClientIdentifier(request, walletAddress);
    const rateLimit = checkRateLimit(`faucet_${clientId}`);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }
    
    // Transfer tokens from faucet to user
    const signature = await transferX402Tokens(walletAddress, amount);
    
    return NextResponse.json({
      success: true,
      signature,
      amount,
      message: `Successfully transferred ${amount} x402 tokens`,
      rateLimit: {
        remaining: rateLimit.remaining
      }
    });
    
  } catch (error: any) {
    console.error('Faucet API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process faucet claim' },
      { status: 500 }
    );
  }
}
