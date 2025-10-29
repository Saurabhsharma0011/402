import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quoteResponse, userPublicKey, wrapAndUnwrapSol, dynamicComputeUnitLimit, prioritizationFeeLamports } = body;

    if (!quoteResponse || !userPublicKey) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Call Jupiter Swap API v1
    const swapUrl = 'https://lite-api.jup.ag/swap/v1/swap';
    
    const response = await fetch(swapUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        quoteResponse,
        userPublicKey,
        wrapAndUnwrapSol: wrapAndUnwrapSol ?? true,
        dynamicComputeUnitLimit: dynamicComputeUnitLimit ?? true,
        prioritizationFeeLamports: prioritizationFeeLamports ?? 'auto'
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error || 'Failed to get swap transaction from Jupiter' },
        { status: response.status }
      );
    }

    const swapData = await response.json();
    return NextResponse.json(swapData);
    
  } catch (error: any) {
    console.error('Jupiter Swap API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get swap transaction from Jupiter' },
      { status: 500 }
    );
  }
}
