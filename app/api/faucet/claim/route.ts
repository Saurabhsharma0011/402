import { NextRequest, NextResponse } from 'next/server';
import { transferX402Tokens } from '@/utils/x402Token';

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, amount } = await request.json();
    
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }
    
    // Transfer tokens from faucet to user
    const signature = await transferX402Tokens(walletAddress, amount);
    
    return NextResponse.json({
      success: true,
      signature,
      amount,
      message: `Successfully transferred ${amount} x402 tokens`
    });
    
  } catch (error: any) {
    console.error('Faucet API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process faucet claim' },
      { status: 500 }
    );
  }
}
