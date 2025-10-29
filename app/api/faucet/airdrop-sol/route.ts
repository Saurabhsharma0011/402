import { NextRequest, NextResponse } from 'next/server';
import { airdropDevnetSOL } from '@/utils/x402Token';

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, amount = 1 } = await request.json();
    
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }
    
    // Airdrop SOL on Devnet
    const signature = await airdropDevnetSOL(walletAddress, amount);
    
    return NextResponse.json({
      success: true,
      signature,
      amount,
      message: `Successfully airdropped ${amount} SOL`
    });
    
  } catch (error: any) {
    console.error('SOL Airdrop API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to airdrop SOL' },
      { status: 500 }
    );
  }
}
