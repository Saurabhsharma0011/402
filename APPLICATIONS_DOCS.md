# x402os APPLICATION DOCUMENTATION
## Complete Documentation for All Applications

**Version:** 2.0  
**Last Updated:** October 28, 2025  
**OS:** x402os (HTTP 402: Payment Gateway Operating System)

---

## 📱 TABLE OF CONTENTS

1. [x402pay](#1-x402pay---instant-payments)
2. [x402agent](#2-x402agent---automation-agents)
3. [x402vault](#3-x402vault---asset-management)
4. [x402swap](#4-x402swap---token-swap)
5. [x402bridge](#5-x402bridge---cross-chain-bridge)
6. [x402robot](#6-x402robot---robot-builder)
7. [x402fetch](#7-x402fetch---data-fetching)
8. [x402scan](#8-x402scan---token-scanner)
9. [x402chart](#9-x402chart---live-charts)
10. [x402feed](#10-x402feed---news-feed)
11. [x402task](#11-x402task---task-automation)
12. [x402dao](#12-x402dao---governance)

---

## 1. x402pay - Instant Payments

### 💳 Overview
**Status:** ✅ Fully Operational  
**File:** `components/apps/XPayApp.tsx`  
**Icon:** 💳  
**Description:** Instant payment system for Solana blockchain with minimal fees

### 🎯 Core Features

#### 📤 Send Payments
- Transfer SOL, USDC, or USDT to any Solana address
- Quick amount buttons (0.1, 0.5, 1.0, 5.0)
- Real-time fee calculation
- Transaction confirmation before sending

#### 📥 Receive Payments
- Generate your wallet address
- QR code generation (planned)
- Share address easily
- View pending incoming transactions

#### 📜 Transaction History
- Complete transaction log
- Sent and received transactions
- Timestamps and amounts
- Fee tracking per transaction

### 💰 Fee Structure
```
Network Fee: ~0.000005 SOL (Solana network)
x402pay Fee: 0.001 USDC (platform fee)
```

### 🔧 Technical Details
- **Blockchain:** Solana
- **Wallet Integration:** Privy
- **RPC Provider:** Helius
- **Supported Tokens:** SOL, USDC, USDT

### 📊 Usage Flow
```
1. User selects token (SOL/USDC/USDT)
2. Enter recipient address
3. Enter or select amount
4. Review fees
5. Confirm transaction
6. Transaction executed on-chain
7. History updated
```

### 🔐 Security
- Connected wallet required
- Transaction signing through Privy
- No private key exposure
- Confirmation prompts for all transfers

---

## 2. x402agent - Automation Agents

### 🔮 Overview
**Status:** ✅ Fully Operational  
**File:** `components/apps/Agent402App.tsx`  
**Icon:** 🔮  
**Description:** Create custom automation agents with triggers and actions

### 🎯 Core Features

#### 🎨 Agent Creation
- **4-Step Wizard**:
  1. Basic Info (Name, Description, Category)
  2. Appearance (Custom image upload, Color theme)
  3. Triggers (When to activate)
  4. Actions (What to execute)

#### 📋 Categories (6 Types)
- **Automation** ⚙️ - General task automation
- **Trading** 💹 - Crypto trading bots
- **Analytics** 📊 - Data analysis
- **Communication** 💬 - Notifications & alerts
- **Security** 🔒 - Security monitoring
- **Custom** 🎨 - User-defined purpose

#### ⚡ Trigger Types (5 Types)

**1. Schedule ⏰**
```javascript
{
  type: 'time',
  config: {
    interval: 'Every hour' | 'Every day' | 'Custom'
  }
}
```

**2. Price Alert 💰**
```javascript
{
  type: 'price',
  config: {
    token: 'SOL',
    condition: 'Above' | 'Below' | 'Equals',
    price: 45.00
  }
}
```
- **CoinGecko Integration:** Real-time price data
- **Supported Tokens:** SOL, USDC, USDT, BTC, ETH, BONK, WIF, JTO, ORCA, RAY, JUP

**3. Blockchain Event ⛓️**
```javascript
{
  type: 'event',
  config: {
    event: 'transfer' | 'swap' | 'nft_mint'
  }
}
```

**4. Webhook 🔗**
```javascript
{
  type: 'webhook',
  config: {
    url: 'https://api.example.com/webhook'
  }
}
```

**5. Manual 👆**
```javascript
{
  type: 'manual',
  config: {}
}
```

#### 🎯 Action Types (6 Types)

**1. Notify 📬**
- Send notifications
- Discord webhooks
- Email alerts

**2. Token Swap 🔄**
- Automatic trading
- Jupiter integration
- Slippage control

**3. Send Payment 💸**
- Automated transfers
- Scheduled payments
- Conditional sending

**4. Log Data 📝**
- Record events
- Save to storage
- Export logs

**5. Webhook Call 🔗**
- HTTP requests
- API integration
- Custom endpoints

**6. Custom Code 💻**
- JavaScript execution
- Custom logic
- Advanced automation

### 💾 Data Storage
```javascript
// LocalStorage key
'x402agents'

// Agent structure
{
  id: string,
  name: string,
  description: string,
  icon: string (base64 image),
  color: string,
  category: string,
  triggers: Trigger[],
  actions: Action[],
  status: 'active' | 'paused' | 'draft',
  createdAt: string,
  lastRun?: string,
  runCount: number,
  lastPrice?: number
}
```

### 📊 Agent Status System
- **Draft** 📝 - Not yet activated
- **Active** ✅ - Running and monitoring
- **Paused** ⏸️ - Temporarily disabled

### 🎨 Appearance Options
- **Custom Image Upload:** PNG, JPG, GIF (Max 5MB)
- **8 Theme Colors:** Green, Blue, Purple, Pink, Orange, Yellow, Red, Cyan

### 🔔 Price Monitoring System
```javascript
// Real-time price checking
async function fetchTokenPrice(token: string): Promise<number | null>

// CoinGecko API endpoint
https://api.coingecko.com/api/v3/simple/price

// Token mapping
{
  'SOL': 'solana',
  'USDC': 'usd-coin',
  'BTC': 'bitcoin',
  // ... 11 tokens supported
}
```

### 📱 Usage Example: Trading Bot
```javascript
// Create a trading agent
Agent Name: "SOL Alert Bot"
Category: Trading
Trigger: Price Alert
  - Token: SOL
  - Condition: Below
  - Price: 45.00
Action: Notify
  - Discord webhook notification
  
// When activated
✅ Agent monitors SOL price every check
✅ Fetches real price from CoinGecko
✅ Compares: Current $42.35 < Target $45.00
✅ Condition MET → Sends Discord notification
```

---

## 3. x402vault - Asset Management

### 🔐 Overview
**Status:** ✅ Fully Operational  
**File:** `components/apps/XVaultApp.tsx`  
**Icon:** 🔐  
**Description:** Your personal asset vault and activity tracker

### 🎯 Core Features

#### 💰 Portfolio Overview
```javascript
{
  totalBalance: "$250.50",
  xpPoints: 1250,
  userLevel: 5,
  monthlySpent: "$12.50"
}
```

#### 📊 Asset Tracking
- **SOL** - Solana native token
- **USDC** - USD Coin stablecoin
- **BONK** - Meme token
- Real-time balance updates
- USD value conversion
- Percentage change tracking

#### 📜 Activity Feed
Tracks all app usage:
```javascript
{
  type: 'x402pay' | 'x402ai' | 'x402scan' | 'x402fetch',
  action: string,
  time: string,
  cost: string
}
```

#### ⭐ XP System
- **Points earned** per app usage
- **Level progression** (1-10)
- **Achievements** (planned)
- **Leaderboard** (planned)

### 💳 Wallet Information Display
- Connected wallet address
- Network status
- Last transaction
- Gas estimates

### 📈 Analytics Dashboard
```
📊 Total Balance: $250.50 (+8.5% this month)
⭐ XP Points: 1,250 (Level 5)
💸 Total Spent: $12.50 (This month)
```

### 🔧 Recent Activity Types
| App | Icon | Action | Fee |
|-----|------|--------|-----|
| x402pay | 💳 | Payments | 0.001 USDC |
| x402ai | 🤖 | AI Queries | 0.005 USDC |
| x402scan | 🔍 | Token Scans | 0.003 USDC |
| x402fetch | 🌐 | API Calls | 0.002 USDC |

---

## 4. x402swap - Token Swap

### 🔄 Overview
**Status:** ✅ Fully Operational  
**File:** `components/apps/XSwapApp.tsx`  
**Icon:** 🔄  
**Description:** Token swapping powered by Jupiter Aggregator

### 🎯 Core Features

#### 💱 Token Swapping
- **Best rates guaranteed** via Jupiter
- **Multiple token support**
- **Real-time quotes**
- **Slippage protection**

#### 💰 Balance Display
```javascript
// Real-time wallet balances
{
  solBalance: "2.5 SOL",
  fromTokenBalance: "100.00 USDC",
  refreshButton: true
}
```

#### 🔧 Swap Configuration
- **From Token:** Select source token
- **To Token:** Select destination token
- **Amount:** Manual entry or MAX button
- **Slippage:** 0.5% default (adjustable)

### 🔗 API Integration

#### Jupiter Aggregator
```javascript
// Quote endpoint
POST https://quote-api.jup.ag/v6/quote

// Swap endpoint
POST https://quote-api.jup.ag/v6/swap

// Parameters
{
  inputMint: string,
  outputMint: string,
  amount: number,
  slippageBps: number
}
```

#### Helius RPC
```javascript
// Transaction execution
RPC_URL: process.env.NEXT_PUBLIC_HELIUS_RPC

// Methods
- getConnection()
- sendTransaction()
- confirmTransaction()
```

### 💸 Fee Structure
```
Network Fee: ~0.000005 SOL
x402swap Fee: 0.1% of swap amount
Jupiter Fee: Variable (0-0.2%)
Total: ~0.2-0.3% typical
```

### 📊 Quote Information Display
```javascript
{
  inputAmount: "10.00 USDC",
  outputAmount: "0.205 SOL",
  priceImpact: "0.15%",
  minimumReceived: "0.204 SOL",
  route: ["USDC", "USDT", "SOL"],
  fee: "0.001 USDC"
}
```

### ⚠️ Balance Validation
```javascript
// Before swap
if (fromAmount > walletBalance) {
  alert('Insufficient balance')
  return
}

// Minimum amount check
if (fromAmount < 0.000001) {
  alert('Amount too small')
  return
}
```

### 🔄 Usage Flow
```
1. Connect wallet → Show balances
2. Select FROM token → Check balance
3. Select TO token → View rate
4. Enter amount → Or click MAX
5. Click "Get Quote" → Jupiter API call
6. Review quote → Check route & fees
7. Click "Execute Swap" → Sign transaction
8. Wait confirmation → Update balances
```

---

## 5. x402bridge - Cross-Chain Bridge

### 🌉 Overview
**Status:** ✅ Fully Operational  
**File:** `components/apps/XBridgeApp.tsx`  
**Icon:** 🌉  
**Description:** Bridge assets across multiple blockchains

### 🎯 Core Features

#### 🌐 Supported Chains (7)
| Chain | Symbol | Status |
|-------|--------|--------|
| Solana | SOL | ✅ Active |
| Ethereum | ETH | ✅ Active |
| Polygon | MATIC | ✅ Active |
| BSC | BNB | ✅ Active |
| Arbitrum | ARB | ✅ Active |
| Avalanche | AVAX | ✅ Active |
| Base | BASE | ✅ Active |

#### 🪙 Supported Tokens (5)
- **USDC** - Circle stablecoin
- **USDT** - Tether stablecoin
- **ETH** - Ethereum
- **SOL** - Solana
- **WBTC** - Wrapped Bitcoin

### 🔗 Bridge Providers
```javascript
{
  primary: 'Wormhole',
  secondary: 'AllBridge',
  fallback: 'Portal Bridge'
}
```

### 💰 Real Balance Display
```javascript
// Solana source balances
{
  solBalance: "2.5 SOL",
  selectedTokenBalance: "100.00 USDC",
  mintAddresses: {
    'USDC': 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    'USDT': 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    // ...
  }
}
```

### 💸 Fee Structure
```
Bridge Fee: 0.1-0.5% (varies by chain)
Network Fee (Source): ~0.000005 SOL
Network Fee (Dest): Variable by chain
x402bridge Fee: 0.005 USDC
```

### ⏱️ Estimated Transfer Times
| Route | Time | Confirmations |
|-------|------|---------------|
| Solana → Ethereum | 15-20 min | 32 blocks |
| Solana → Polygon | 10-15 min | 128 blocks |
| Solana → BSC | 5-10 min | 15 blocks |
| Solana → Arbitrum | 10-15 min | 32 blocks |
| Ethereum → Solana | 20-30 min | 64 blocks |

### 📊 Bridge Quote
```javascript
{
  amount: "10.00 USDC",
  fromChain: "Solana",
  toChain: "Ethereum",
  estimatedReceive: "9.95 USDC",
  bridgeFee: "0.05 USDC",
  networkFee: "~0.000005 SOL",
  x402bridgeFee: "0.005 USDC",
  estimatedTime: "15-20 minutes",
  route: "Wormhole"
}
```

### 🔄 Usage Flow
```
1. Select source chain (default: Solana)
2. Select destination chain
3. Choose token to bridge
4. Check source balance
5. Enter amount or MAX
6. Click "Get Bridge Quote"
7. Review fees and time estimate
8. Click "Execute Bridge"
9. Sign transaction
10. Wait for confirmations
11. Receive on destination chain
```

### ⚠️ Important Notes
```
⚠️ Always test with small amounts first
⚠️ Bridge transactions are irreversible
⚠️ Fees vary by network congestion
⚠️ Keep some native token for gas fees
⚠️ Double-check destination address
```

---

## 6. x402robot - Robot Builder

### 🤖 Overview
**Status:** ✅ Fully Operational  
**File:** `components/apps/XRobotApp.tsx`  
**Icon:** 🤖  
**Description:** Create custom AI robot assistants with unique personalities

### 🎯 Core Features

#### 🪄 4-Step Creation Wizard

**Step 1: Basic Info**
```javascript
{
  name: string (max 30 chars),
  personality: 'friendly' | 'professional' | 'creative' | 
               'analytical' | 'energetic' | 'calm'
}
```

**Step 2: Appearance**
```javascript
{
  image: File (PNG/JPG/GIF, Max 5MB),
  imagePreview: base64 string,
  themeColor: '#00ff41' | '#00d4ff' | '#b624ff' | 
              '#ff2e97' | '#ff6b2e' | '#ffd700'
}
```

**Step 3: Capabilities** (Select multiple)
- 📊 Data Analysis
- ⚙️ Task Automation
- 💬 Communication
- 🔬 Research
- 👁️ Monitoring
- 💹 Trading
- ✍️ Content Creation
- 🔒 Security

**Step 4: Tasks**
```javascript
{
  tasks: string[] // Add multiple tasks
  // Example: ["Analyze market data", "Send daily reports"]
}
```

### 🎭 Personalities (6 Types)

| Personality | Emoji | Description | Best For |
|-------------|-------|-------------|----------|
| Friendly | 😊 | Warm and approachable | Customer service |
| Professional | 💼 | Serious and efficient | Business tasks |
| Creative | 🎨 | Innovative and artistic | Content creation |
| Analytical | 🧮 | Logical and precise | Data analysis |
| Energetic | ⚡ | Dynamic and enthusiastic | Marketing |
| Calm | 🧘 | Peaceful and patient | Support roles |

### 🎨 Theme Colors (6 Options)
```javascript
colors = [
  { name: 'Green', value: '#00ff41' },
  { name: 'Blue', value: '#00d4ff' },
  { name: 'Purple', value: '#b624ff' },
  { name: 'Pink', value: '#ff2e97' },
  { name: 'Orange', value: '#ff6b2e' },
  { name: 'Yellow', value: '#ffd700' }
]
```

### 💾 Robot Data Structure
```javascript
interface Robot {
  id: string;                    // UUID
  name: string;                  // Robot name
  image: string;                 // base64 image data
  purpose: string;               // Robot description
  tasks: string[];              // Array of tasks
  personality: string;          // Personality type
  capabilities: string[];       // Selected capabilities
  color: string;                // Hex color
  createdAt: string;           // ISO timestamp
}

// Storage key
localStorage: 'x402robots'
```

### 📊 Robot Gallery View
```javascript
// Display format
{
  image: CircularAvatar (64x64),
  name: string,
  personality: PersonalityBadge,
  purpose: DescriptionBox,
  capabilities: IconArray,
  tasks: BulletList,
  actions: [ViewButton, DeleteButton]
}
```

### 🔧 Management Functions
```javascript
// Create robot
function saveRobot(): void

// View all robots
function RobotGallery(): React.Component

// Delete robot
function deleteRobot(id: string): void

// Edit robot (planned)
function editRobot(id: string): void
```

### 💡 Usage Examples

**Example 1: Trading Bot**
```javascript
{
  name: "CryptoTrader 3000",
  personality: "analytical",
  capabilities: ["trading", "data-analysis", "monitoring"],
  tasks: [
    "Monitor SOL price",
    "Execute trades when conditions met",
    "Send daily profit reports"
  ],
  color: "#00d4ff"
}
```

**Example 2: Content Bot**
```javascript
{
  name: "ContentCreator Pro",
  personality: "creative",
  capabilities: ["content", "communication"],
  tasks: [
    "Generate blog post ideas",
    "Write social media content",
    "Schedule posts"
  ],
  color: "#ff2e97"
}
```

**Example 3: Security Bot**
```javascript
{
  name: "SecurityGuard AI",
  personality: "professional",
  capabilities: ["security", "monitoring"],
  tasks: [
    "Monitor wallet activity",
    "Detect suspicious transactions",
    "Send security alerts"
  ],
  color: "#b624ff"
}
```

---

## 7. x402fetch - Data Fetching

### 🌐 Overview
**Status:** 🚧 Under Development  
**File:** `TBD`  
**Icon:** 🌐  
**Description:** API data fetching and web scraping service

### 🎯 Planned Features
- HTTP/HTTPS request handling
- GraphQL query support
- WebSocket connections
- REST API integration
- Rate limiting
- Response caching
- Error handling
- Authentication support

### 💰 Planned Fee
```
Base Fee: 0.002 USDC per request
Heavy requests: 0.005 USDC
Bulk requests: Discounted rates
```

---

## 8. x402scan - Token Scanner

### 🔍 Overview
**Status:** 🚧 Under Development  
**File:** `TBD`  
**Icon:** 🔍  
**Description:** Comprehensive token analysis and scanning tool

### 🎯 Planned Features
- Token metadata extraction
- Holder distribution analysis
- Liquidity pool checking
- Rug pull risk detection
- Contract verification
- Honeypot detection
- Social sentiment analysis

### 💰 Planned Fee
```
Basic Scan: 0.003 USDC
Deep Scan: 0.010 USDC
Continuous Monitoring: 0.05 USDC/day
```

---

## 9. x402chart - Live Charts

### 📊 Overview
**Status:** 🚧 Under Development  
**File:** `TBD`  
**Icon:** 📊  
**Description:** Real-time cryptocurrency price charts

### 🎯 Planned Features
- TradingView integration
- Multiple timeframes (1m to 1M)
- Technical indicators
- Drawing tools
- Custom watchlists
- Price alerts
- Multi-chart layout
- Export functionality

### 💰 Planned Fee
```
Basic Charts: Free
Advanced Indicators: 0.001 USDC per view
Premium Features: 1 USDC/month
```

---

## 10. x402feed - News Feed

### 📰 Overview
**Status:** 🚧 Under Development  
**File:** `TBD`  
**Icon:** 📰  
**Description:** Cryptocurrency news aggregator and analysis

### 🎯 Planned Features
- Multi-source aggregation
- Real-time updates
- Custom filters
- Sentiment analysis
- Bookmark favorites
- RSS feed support
- Push notifications

### 💰 Planned Fee
```
Basic Feed: Free
Premium Sources: 0.5 USDC/month
AI Summaries: 0.001 USDC per article
```

---

## 11. x402task - Task Automation

### ⚙️ Overview
**Status:** 🚧 Under Development  
**File:** `TBD`  
**Icon:** ⚙️  
**Description:** Advanced task automation and scheduling

### 🎯 Planned Features
- Cron job scheduler
- Visual workflow builder
- Conditional logic
- Multi-step automation
- Task history
- Error recovery
- Variable support
- API integration

### 💰 Planned Fee
```
Basic Tasks: 0.005 USDC per execution
Complex Workflows: 0.02 USDC per run
Scheduled Tasks: 0.1 USDC/month per task
```

---

## 12. x402dao - Governance

### 🏛️ Overview
**Status:** 🚧 Under Development  
**File:** `TBD`  
**Icon:** 🏛️  
**Description:** Decentralized autonomous organization governance

### 🎯 Planned Features
- Proposal creation
- Voting mechanism (token-weighted)
- Treasury management
- Member roles and permissions
- Governance analytics
- Proposal templates
- Execution automation
- Forum integration

### 💰 Planned Fee
```
Create Proposal: 0.1 USDC
Vote: Free (gas only)
Treasury Operations: 0.05% of amount
```

---

## 🔧 GLOBAL SYSTEM FEATURES

### 🎨 macOS-Style UI
- **Menu Bar:** Top system bar with time, status, user info
- **Dock:** Bottom dock with app icons and tooltips
- **Window Controls:** Red/Yellow/Green buttons (Close/Minimize/Maximize)
- **Rounded Corners:** Modern rounded window styling
- **Backdrop Blur:** Frosted glass effects
- **Animations:** Smooth transitions and hover effects

### 🔐 Security & Authentication
- **Privy Wallet Integration**
- **No private key storage**
- **Transaction signing**
- **Session management**
- **Secure localStorage**

### 💾 Data Persistence
```javascript
// LocalStorage keys
'x402agents'  // Agent automation data
'x402robots'  // Robot builder data
'userPrefs'   // User preferences (planned)
'taskHistory' // Task execution history (planned)
```

### 📊 Fee Summary Table

| Application | Base Fee | Notes |
|-------------|----------|-------|
| x402pay | 0.001 USDC | Per transaction |
| x402agent | Free | Pay per action executed |
| x402vault | Free | Tracking only |
| x402swap | 0.1% | Of swap amount |
| x402bridge | 0.005 USDC | Plus bridge fees |
| x402robot | Free | Creation & management |
| x402fetch | 0.002 USDC | Per API call (planned) |
| x402scan | 0.003 USDC | Per scan (planned) |
| x402chart | Free | Basic features (planned) |
| x402feed | Free | Basic feed (planned) |
| x402task | 0.005 USDC | Per execution (planned) |
| x402dao | 0.1 USDC | Per proposal (planned) |

---

## 🚀 QUICK START GUIDE

### For Developers
```bash
# Clone repository
git clone <repo-url>

# Install dependencies
cd osamabinladin
npm install

# Set environment variables
cp .env.example .env.local

# Add to .env.local
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
NEXT_PUBLIC_HELIUS_RPC=your_helius_rpc_url

# Run development server
npm run dev

# Open browser
http://localhost:3000
```

### For Users
```
1. Open x402os in browser
2. Click "Connect Wallet"
3. Select Solana wallet (Phantom, Solflare, etc.)
4. Approve connection
5. Desktop appears with all apps
6. Click any app icon to launch
7. Start using the features!
```

---

## 📱 APP CATEGORIES

### ✅ Production Ready (6 apps)
- x402pay
- x402agent  
- x402vault
- x402swap
- x402bridge
- x402robot

### 🚧 In Development (6 apps)
- x402fetch
- x402scan
- x402chart
- x402feed
- x402task
- x402dao

---

## 🔗 EXTERNAL INTEGRATIONS

### APIs Used
| Service | Purpose | Endpoint |
|---------|---------|----------|
| Jupiter | Token swaps | quote-api.jup.ag |
| CoinGecko | Price data | api.coingecko.com |
| Helius | RPC calls | mainnet.helius-rpc.com |
| Privy | Authentication | privy.io |
| Wormhole | Cross-chain | wormhole.com |

### Blockchain Networks
- Solana (Primary)
- Ethereum
- Polygon
- BSC
- Arbitrum
- Avalanche
- Base

---

## 📞 SUPPORT & RESOURCES

### Documentation
- **API Docs:** `/docs/api`
- **Developer Guide:** `/docs/developers`
- **User Manual:** `/docs/users`

### Community
- **Discord:** [Join Server](#)
- **Twitter:** [@x402os](#)
- **GitHub:** [Repository](#)

### Contact
- **Email:** support@x402os.com
- **Bug Reports:** GitHub Issues
- **Feature Requests:** Discord #feature-requests

---

## 📜 LICENSE & CREDITS

**Version:** 2.0  
**Built with:** Next.js, React, Tailwind CSS, Solana Web3.js  
**Last Updated:** October 28, 2025

---

*This documentation is maintained by the x402os development team. For updates, visit our GitHub repository.*
