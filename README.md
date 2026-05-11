# ❄️ SNOWBALL PROTOCOL - DApp

A retro Windows 95/98 styled Web3 application for the Snowball Protocol. Built with Next.js 14, wagmi, and DexScreener API integration.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Configure Environment

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Then edit `.env.local` and add your configuration:

```env
# After token launch, add your pair address here
NEXT_PUBLIC_PAIR_ADDRESS=0xYourPairAddressHere

# After contract deployment
NEXT_PUBLIC_SNOWBALL_TOKEN=0xYourTokenAddressHere
NEXT_PUBLIC_UNISWAP_V4_POOL=0xYourPoolAddressHere
NEXT_PUBLIC_HOOK_ADDRESS=0xYourHookAddressHere

# Optional: Add your RPC for better performance
NEXT_PUBLIC_ETHEREUM_RPC=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📦 Features

### ✅ Implemented

- **Windows 95/98 Retro UI** - Full nostalgic aesthetic
- **Web3 Wallet Connection** - Connect with MetaMask, WalletConnect
- **Live DexScreener Integration** - Real-time price, volume, liquidity data
- **Contract Integration** - Read balance, accumulated snow, claim functions
- **Interactive Charts**:
  - Bonding Curve Chart (Canvas-based, shows current position)
  - Price History Chart (Recharts, 24h timeline)
- **Live Stats Display** - Auto-updating every 30 seconds
- **Tier System Display** - Visual representation of all tiers
- **Responsive Design** - Works on desktop (optimized for desktop)

### 🎨 Styling

- **NO TAILWIND** - Pure CSS with retro Windows 95 aesthetic
- Vaporwave/Cyberpunk accents (neon colors, scanlines, glitch effects)
- Animated snowflakes
- Cyber grid background
- Video feed style sections

### 📊 Data Flow

```
DexScreener API (30s refresh)
    ↓
useDexScreener hook
    ↓
Components (StatsDisplay, Charts)
    ↓
Auto-update UI
```

```
Smart Contract (wagmi)
    ↓
useSnowballContract hook
    ↓
Read: balance, accumulated, reserve
    ↓
Write: claim function
```

## 🔧 Configuration

### After Token Launch

1. Get your Uniswap V4 pair address from DexScreener
2. Update `NEXT_PUBLIC_PAIR_ADDRESS` in `.env.local`
3. App will automatically fetch live data

### After Contract Deployment

1. Add contract addresses to `.env.local`:
   - `NEXT_PUBLIC_SNOWBALL_TOKEN`
   - `NEXT_PUBLIC_UNISWAP_V4_POOL`
   - `NEXT_PUBLIC_HOOK_ADDRESS`

2. Update ABI in `hooks/useSnowballContract.ts` with your full contract ABI

## 📁 Project Structure

```
snowball-dapp/
├── app/
│   ├── layout.tsx          # Root layout with Web3Provider
│   └── page.tsx            # Main page component
├── components/
│   ├── BondingCurveChart.tsx    # Canvas bonding curve
│   ├── PriceChart.tsx           # Recharts price history
│   ├── StatsDisplay.tsx         # Live stats table
│   └── WalletButton.tsx         # Connect wallet modal
├── hooks/
│   ├── useDexScreener.ts        # DexScreener API hook
│   └── useSnowballContract.ts   # Smart contract hook
├── lib/
│   └── web3-provider.tsx        # Wagmi configuration
├── styles/
│   └── globals.css              # Windows 95 retro styles
├── .env.example                 # Environment template
├── next.config.js
├── package.json
└── tsconfig.json
```

## 🎮 Development Tips

### Testing Without Contract

The app works without contract addresses set. It will:
- Show mock data for charts
- Display "Not Connected" state
- Allow testing DexScreener integration only

### Adding Contract Functions

1. Add function to ABI in `hooks/useSnowballContract.ts`
2. Add read/write hook using wagmi
3. Use in components

Example:
```typescript
const { data: myValue } = useReadContract({
  address: SNOWBALL_ADDRESS,
  abi: SNOWBALL_ABI,
  functionName: 'myFunction',
})
```

### Customizing Charts

**Bonding Curve:**
- Edit `components/BondingCurveChart.tsx`
- Modify the exponential formula: `Math.pow(supplyPercent, 2.5)`
- Change colors, grid, labels

**Price Chart:**
- Edit `components/PriceChart.tsx`
- Customize recharts configuration
- Add volume bars, indicators, etc.

## 🚢 Deployment

### Vercel (Recommended)

```bash
npm run build
vercel --prod
```

Add environment variables in Vercel dashboard.

### Other Platforms

```bash
npm run build
npm start
```

## 📝 TODO / Future Enhancements

- [ ] Add buy/sell interface
- [ ] Add calculator component
- [ ] Integrate The Graph for historical data
- [ ] Add sound effects (Windows 95 sounds)
- [ ] Mobile responsive improvements
- [ ] Add more charts (volume, holders over time)
- [ ] Leaderboard component
- [ ] NFT achievement display
- [ ] Governance interface

## 🐛 Troubleshooting

**"Module not found" errors:**
```bash
npm install
```

**Wallet not connecting:**
- Check network (should be Ethereum mainnet)
- Try different wallet
- Check browser console for errors

**DexScreener not loading:**
- Verify `NEXT_PUBLIC_PAIR_ADDRESS` is correct
- Check API is not rate limited
- Check browser console

**Charts not rendering:**
- Check canvas support in browser
- Verify data is loading correctly
- Check browser console

## 📜 License

MIT

## 🔗 Links

- [DexScreener API Docs](https://docs.dexscreener.com/)
- [wagmi Docs](https://wagmi.sh/)
- [Next.js Docs](https://nextjs.org/docs)
- [Recharts Docs](https://recharts.org/)

---

Built with ❄️ by the Snowball community
