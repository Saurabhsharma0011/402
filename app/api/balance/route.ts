import { NextRequest, NextResponse } from 'next/server';
import { getX402Balance, getSolBalance } from '@/utils/x402Token';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const walletAddress = searchParams.get('wallet');
    
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }
    
    // Get both SOL and token balances
    const [x402Balance, solBalance] = await Promise.all([
      getX402Balance(walletAddress),
      getSolBalance(walletAddress)
    ]);
    
    return NextResponse.json({
      success: true,
      x402Balance,
      solBalance,
      wallet: walletAddress
    });
    
  } catch (error: any) {
    console.error('Balance API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch balance' },
      { status: 500 }
    );
  }
}
