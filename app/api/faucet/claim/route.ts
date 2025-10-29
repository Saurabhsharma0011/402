import { NextRequest, NextResponse } from 'next/server';
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

    // Validate amount
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
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
    
    // No blockchain transfer - tokens are tracked in localStorage on client side
    console.log(`[FAUCET] ${walletAddress} claimed ${amount} x402 tokens (localStorage)`);
    
    return NextResponse.json({
      success: true,
      amount,
      message: `Successfully claimed ${amount} x402 tokens`,
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
