import { NextRequest, NextResponse } from 'next/server';
import { airdropDevnetSOL } from '@/utils/x402Token';
import { checkRateLimit, getClientIdentifier, isValidSolanaAddress } from '@/lib/api-security';

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, amount = 1 } = await request.json();
    
    // Validate wallet address
    if (!walletAddress || !isValidSolanaAddress(walletAddress)) {
      return NextResponse.json(
        { error: 'Invalid wallet address' },
        { status: 400 }
      );
    }

    // Validate amount
    if (amount <= 0 || amount > 2) {
      return NextResponse.json(
        { error: 'Invalid SOL amount. Maximum 2 SOL per request.' },
        { status: 400 }
      );
    }

    // Rate limiting (stricter for SOL)
    const clientId = getClientIdentifier(request, walletAddress);
    const rateLimit = checkRateLimit(`sol_airdrop_${clientId}`);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }
    
    // Airdrop SOL on Devnet
    const signature = await airdropDevnetSOL(walletAddress, amount);
    
    return NextResponse.json({
      success: true,
      signature,
      amount,
      message: `Successfully airdropped ${amount} SOL`,
      rateLimit: {
        remaining: rateLimit.remaining
      }
    });
    
  } catch (error: any) {
    console.error('SOL Airdrop API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to airdrop SOL' },
      { status: 500 }
    );
  }
}
