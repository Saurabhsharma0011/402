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
    const rateLimit = checkRateLimit(`deduct_${clientId}`);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many app interactions. Please wait a moment.' },
        { status: 429 }
      );
    }

    // Log the deduction (tokens are tracked in localStorage on client side)
    console.log(`[DEDUCT] User ${walletAddress} used app - ${amount} tokens deducted (localStorage)`);
    
    return NextResponse.json({
      success: true,
      message: `${amount} tokens deducted for app usage`,
      walletAddress,
      amount,
      rateLimit: {
        remaining: rateLimit.remaining
      }
    });
    
  } catch (error: any) {
    console.error('Token deduction error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to deduct tokens' },
      { status: 500 }
    );
  }
}
