import { NextRequest, NextResponse } from 'next/server';
import { getX402Balance } from '@/utils/x402Token';

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, amount } = await request.json();
    
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Check user's current balance
    const currentBalance = await getX402Balance(walletAddress);
    
    if (currentBalance < amount) {
      return NextResponse.json(
        { error: 'Insufficient token balance' },
        { status: 400 }
      );
    }

    // Log the deduction (in a real app, you'd store this in a database)
    console.log(`User ${walletAddress} used app - ${amount} tokens deducted`);
    console.log(`Previous balance: ${currentBalance}, New balance: ${currentBalance - amount}`);
    
    // Note: Actual on-chain token deduction would require the user to sign a transaction
    // For now, we track usage and the balance check serves as validation
    // In production, you'd either:
    // 1. Store deductions in database and display "available balance"
    // 2. Have user sign a transaction to send tokens to fee wallet
    // 3. Implement a burn mechanism
    
    return NextResponse.json({
      success: true,
      message: `${amount} tokens deducted for app usage`,
      walletAddress,
      amount,
      previousBalance: currentBalance,
      newBalance: currentBalance - amount
    });
    
  } catch (error: any) {
    console.error('Token deduction error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to deduct tokens' },
      { status: 500 }
    );
  }
}
