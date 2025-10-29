import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const inputMint = searchParams.get('inputMint');
    const outputMint = searchParams.get('outputMint');
    const amount = searchParams.get('amount');
    const slippageBps = searchParams.get('slippageBps');

    if (!inputMint || !outputMint || !amount || !slippageBps) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Call Jupiter Quote API v1
    const quoteUrl = `https://api.jup.ag/swap/v1/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}`;
    
    const response = await fetch(quoteUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Jupiter API error: ${errorText || response.statusText}` },
        { status: response.status }
      );
    }

    const quote = await response.json();
    return NextResponse.json(quote);
    
  } catch (error: any) {
    console.error('Jupiter Quote API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get quote from Jupiter' },
      { status: 500 }
    );
  }
}
