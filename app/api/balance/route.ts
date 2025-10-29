import { NextRequest, NextResponse } from 'next/server';
import { getSolBalance } from '@/utils/x402Token';
import { checkRateLimit, getClientIdentifier, isValidSolanaAddress } from '@/lib/api-security';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const walletAddress = searchParams.get('wallet');
    
    // Validate wallet address
    if (!walletAddress || !isValidSolanaAddress(walletAddress)) {
      return NextResponse.json(
        { error: 'Invalid wallet address' },
        { status: 400 }
      );
    }

    // Rate limiting (lenient for balance checks)
    const clientId = getClientIdentifier(request, walletAddress);
    const rateLimit = checkRateLimit(`balance_${clientId}`);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment.' },
        { status: 429 }
      );
    }
    
    // Get real SOL balance from mainnet (x402 tokens tracked in localStorage)
    const solBalance = await getSolBalance(walletAddress);
    
    return NextResponse.json({
      success: true,
      solBalance,
      wallet: walletAddress,
      rateLimit: {
        remaining: rateLimit.remaining
      }
    });
    
  } catch (error: any) {
    console.error('Balance API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch balance' },
      { status: 500 }
    );
  }
}
