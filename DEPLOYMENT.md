# 🚀 SNOWBALL - Deployment Guide

## Pre-Launch Checklist

### 1. Before Token Launch

- [ ] Contract deployed and verified on Etherscan
- [ ] Uniswap V4 pool created
- [ ] Hook deployed and configured
- [ ] Initial liquidity added
- [ ] Liquidity locked (2 years)
- [ ] Update contract addresses in code

### 2. Get Contract Addresses

After deployment, you'll have:

```
Token Address: 0x...
Pool Address: 0x...
Hook Address: 0x...
```

### 3. Update Environment Variables

Edit `.env.local`:

```bash
# Core addresses
NEXT_PUBLIC_SNOWBALL_TOKEN=0xYourTokenAddress
NEXT_PUBLIC_UNISWAP_V4_POOL=0xYourPoolAddress  
NEXT_PUBLIC_HOOK_ADDRESS=0xYourHookAddress

# Will be available after first trades
NEXT_PUBLIC_PAIR_ADDRESS=0xYourDexScreenerPairAddress
```

### 4. Update Contract ABI

In `hooks/useSnowballContract.ts`, replace the ABI with your full contract ABI from Etherscan.

### 5. Test Locally

```bash
npm run dev
```

Test:
- ✅ Wallet connection
- ✅ Balance display
- ✅ Stats loading
- ✅ Charts rendering
- ✅ Claim function (if you have test tokens)

### 6. Build for Production

```bash
npm run build
```

Fix any errors before deploying.

## Launch Day Workflow

### Morning of Launch

1. **Deploy contracts** (if not done)
2. **Add liquidity** to Uniswap V4
3. **Get pair address** from first trade on DexScreener
4. **Update `.env.local`** with pair address
5. **Test again** locally
6. **Deploy to Vercel/hosting**

### Immediate Post-Launch

1. **Monitor DexScreener** - verify data is showing
2. **Test website** - all features working
3. **Check wallet connection** - users can connect
4. **Verify transactions** - buys/sells working
5. **Monitor stats** - updating every 30s

### First Hour

Watch for:
- Price updates ✅
- Volume tracking ✅
- Holder count ✅
- Burn mechanism ✅
- Redistribution ✅

## DexScreener Integration

### Finding Your Pair Address

1. Go to DexScreener.com
2. Search for your token address
3. Find the Uniswap V4 pair
4. Copy the pair address from URL:
   ```
   https://dexscreener.com/ethereum/0xYOUR_PAIR_ADDRESS
                                   ^^^^^^^^^^^^^^^^^^^
   ```

### Update in Code

Option 1: Environment variable (recommended)
```bash
NEXT_PUBLIC_PAIR_ADDRESS=0xYourPairAddress
```

Option 2: Hardcode (quick fix)
```typescript
// In hooks/useDexScreener.ts
const address = pairAddress || "0xYourPairAddress"
```

## Deployment Platforms

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in dashboard
# Deploy to production
vercel --prod
```

### Netlify

```bash
# Build command: npm run build
# Publish directory: .next

# Add env vars in dashboard
```

### Custom Server

```bash
npm run build
npm start

# Or use PM2
pm2 start npm --name "snowball" -- start
```

## Post-Deployment

### Monitor

- [ ] Check site loads
- [ ] Verify live data updating
- [ ] Test wallet connection
- [ ] Check all charts rendering
- [ ] Test on mobile
- [ ] Check different wallets (MetaMask, WalletConnect)

### Share

- [ ] Update socials with website link
- [ ] Post launch announcement
- [ ] Share in Telegram/Discord
- [ ] Pin website in channels

## Troubleshooting

### Data Not Loading

**Problem:** Stats showing "..." or not updating

**Solution:**
1. Verify `NEXT_PUBLIC_PAIR_ADDRESS` is correct
2. Check DexScreener has data for your pair
3. Check browser console for errors
4. Try refreshing page

### Wallet Won't Connect

**Problem:** Connect button not working

**Solution:**
1. Check network is correct (Ethereum mainnet)
2. Try different wallet
3. Clear browser cache
4. Check console for errors

### Contract Functions Failing

**Problem:** Claim button not working

**Solution:**
1. Verify contract address is correct
2. Check ABI matches deployed contract
3. Ensure user has gas
4. Check contract on Etherscan

## Emergency Procedures

### Site Down

1. Check hosting platform status
2. Check build logs
3. Rollback to previous deployment if needed
4. Post update to community

### Wrong Data Showing

1. Verify environment variables
2. Check DexScreener API
3. Clear cache and redeploy
4. Check for API rate limits

### Contract Issues

1. DO NOT PANIC
2. Contract is immutable - can't change
3. If critical, prepare migration plan
4. Communicate with community

## Maintenance

### Regular Updates

- Check dependencies monthly: `npm outdated`
- Update packages: `npm update`
- Test after updates
- Redeploy

### Adding Features

1. Develop on separate branch
2. Test thoroughly locally
3. Deploy to preview environment
4. Test on preview
5. Merge and deploy to production

---

## Quick Reference

### Environment Variables

```bash
NEXT_PUBLIC_PAIR_ADDRESS=         # DexScreener pair
NEXT_PUBLIC_SNOWBALL_TOKEN=       # Your token
NEXT_PUBLIC_UNISWAP_V4_POOL=      # Your pool
NEXT_PUBLIC_HOOK_ADDRESS=         # Your hook
```

### Important Files

```
.env.local                        # Config
hooks/useSnowballContract.ts      # Contract ABI
hooks/useDexScreener.ts          # API config
app/page.tsx                      # Main UI
```

### Support

- Check README.md
- Check browser console
- Check Vercel/Netlify logs
- Ask in Discord/Telegram

---

Good luck with your launch! 🚀❄️
