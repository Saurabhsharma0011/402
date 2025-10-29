import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Return supported chains from Allbridge
    const chains = [
      { 
        id: 'SOL', 
        name: 'Solana', 
        icon: '◎', 
        color: 'purple',
        rpcUrl: process.env.SOL_NODE_URL || 'https://api.mainnet-beta.solana.com'
      },
      { 
        id: 'ETH', 
        name: 'Ethereum', 
        icon: 'Ξ', 
        color: 'blue',
        rpcUrl: process.env.ETH_NODE_URL || 'https://ethereum-rpc.publicnode.com'
      },
      { 
        id: 'BSC', 
        name: 'BNB Chain', 
        icon: '🔶', 
        color: 'yellow',
        rpcUrl: process.env.BSC_NODE_URL || 'https://bsc-rpc.publicnode.com'
      },
      { 
        id: 'POL', 
        name: 'Polygon', 
        icon: '🟣', 
        color: 'purple',
        rpcUrl: process.env.POL_NODE_URL || 'https://polygon-bor-rpc.publicnode.com'
      },
      { 
        id: 'AVA', 
        name: 'Avalanche', 
        icon: '🔺', 
        color: 'red',
        rpcUrl: process.env.AVA_NODE_URL || 'https://avalanche-c-chain-rpc.publicnode.com'
      },
      { 
        id: 'ARB', 
        name: 'Arbitrum', 
        icon: '🔵', 
        color: 'blue',
        rpcUrl: process.env.ARB_NODE_URL || 'https://arbitrum-one-rpc.publicnode.com'
      },
      { 
        id: 'OPT', 
        name: 'Optimism', 
        icon: '🔴', 
        color: 'red',
        rpcUrl: process.env.OPT_NODE_URL || 'https://optimism-rpc.publicnode.com'
      },
      { 
        id: 'BAS', 
        name: 'Base', 
        icon: '🔷', 
        color: 'blue',
        rpcUrl: process.env.BAS_NODE_URL || 'https://base-rpc.publicnode.com'
      },
      { 
        id: 'CEL', 
        name: 'Celo', 
        icon: '💚', 
        color: 'green',
        rpcUrl: process.env.CEL_NODE_URL || 'https://rpc.ankr.com/celo'
      },
      { 
        id: 'SNC', 
        name: 'Sonic', 
        icon: '💙', 
        color: 'blue',
        rpcUrl: process.env.SNC_NODE_URL || 'https://rpc.soniclabs.com'
      },
      { 
        id: 'SUI', 
        name: 'Sui', 
        icon: '🌊', 
        color: 'blue',
        rpcUrl: process.env.SUI_NODE_URL || 'https://sui-rpc.publicnode.com'
      },
      { 
        id: 'STLR', 
        name: 'Stellar', 
        icon: '⭐', 
        color: 'purple',
        rpcUrl: process.env.STLR_NODE_URL || 'https://horizon.stellar.org'
      },
    ];

    return NextResponse.json({ 
      success: true, 
      chains 
    });
  } catch (error: any) {
    console.error('Error fetching chains:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch chains' },
      { status: 500 }
    );
  }
}
