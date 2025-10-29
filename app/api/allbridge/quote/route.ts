import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sourceChainId = searchParams.get('sourceChainId');
    const destinationChainId = searchParams.get('destinationChainId');
    const tokenAddress = searchParams.get('tokenAddress');
    const amount = searchParams.get('amount');

    if (!sourceChainId || !destinationChainId || !tokenAddress || !amount) {
      return NextResponse.json(
        { error: 'Missing required parameters: sourceChainId, destinationChainId, tokenAddress, amount' },
        { status: 400 }
      );
    }

    // Calculate bridge quote
    const amountNum = parseFloat(amount);
    const bridgeFee = amountNum * 0.003; // 0.3% Allbridge fee
    const outputAmount = amountNum - bridgeFee;

    // Estimate time based on chains
    let estimatedTime = '5-10 minutes';
    if (sourceChainId === 'SOL' || destinationChainId === 'SOL') {
      estimatedTime = '2-5 minutes'; // Solana is faster
    }

    // Estimate gas fee
    let networkFee = '~$0.01';
    if (sourceChainId === 'ETH' || destinationChainId === 'ETH') {
      networkFee = '~$15-30';
    } else if (['ARB', 'OPT', 'BAS'].includes(sourceChainId)) {
      networkFee = '~$0.50-2';
    }

    const quote = {
      sourceChainId,
      destinationChainId,
      tokenAddress,
      inputAmount: amount,
      outputAmount: outputAmount.toFixed(6),
      bridgeFee: bridgeFee.toFixed(6),
      networkFee,
      platformFee: '0.001',
      estimatedTime,
      protocol: 'Allbridge',
      route: {
        steps: [
          `Lock ${amount} on ${sourceChainId}`,
          'Verify cross-chain message',
          `Mint ${outputAmount.toFixed(6)} on ${destinationChainId}`,
        ]
      }
    };

    return NextResponse.json({ 
      success: true, 
      quote 
    });
  } catch (error: any) {
    console.error('Error getting bridge quote:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get bridge quote' },
      { status: 500 }
    );
  }
}
