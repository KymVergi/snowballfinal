'use client'

import { useEffect, useState } from 'react'
import BondingCurveChart from '@/components/BondingCurveChart'
import PriceChart from '@/components/PriceChart'
import StatsDisplay from '@/components/StatsDisplay'
import WalletButton from '@/components/WalletButton'
import StartMenu from '@/components/StartMenu'
import DocumentationModal from '@/components/DocumentationModal'
import InteractiveSnowball from '@/components/InteractiveSnowball'
import CustomV4Swap from '@/components/Customv4Swap'
import { useDexScreener, usePriceHistory } from '@/hooks/useDexScreener'
import { useSnowballContract } from '@/hooks/useSnowballContract'
import { useAccount } from 'wagmi'

type ModalType = 'docs' | 'howitworks' | 'tokenomics'

export default function Home() {
  const [currentTime, setCurrentTime] = useState('')
  const [startMenuOpen, setStartMenuOpen] = useState(false)
  const [activeModal, setActiveModal] = useState<ModalType | null>(null)
  const [mounted, setMounted] = useState(false)
  const { pair } = useDexScreener()
  const { chartData } = usePriceHistory()
  const { balance, snowAccumulated, claimSnow, isClaimPending } = useSnowballContract()
  const { address, isConnected } = useAccount()

  // Fix hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  // Update clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }))
    }
    updateClock()
    const interval = setInterval(updateClock, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {/* Snowflakes */}
      {[10, 25, 40, 55, 70, 85].map((left, i) => (
        <div
          key={i}
          className="snowflake95"
          style={{
            left: `${left}%`,
            animationDuration: `${8 + i * 2}s`,
            animationDelay: `${i * 0.5}s`
          }}
        >
          ❄
        </div>
      ))}

      {/* Cyber Grid */}
      <div className="cyber-grid" />

      <div style={{ paddingBottom: '40px' }}>
        {/* Main Window */}
        <div className="window" style={{ 
          width: '95%', 
          maxWidth: '1400px', 
          margin: '20px auto' 
        }}>
          <div className="title-bar">
            <div className="title-bar-text">
              ❄️ SNOWBALL.EXE - Protocol Active [v1.0]
            </div>
            <div className="title-bar-controls">
              <button>_</button>
              <button>□</button>
              <button>×</button>
            </div>
          </div>

          <div className="window-body" style={{ padding: 0 }}>
            {/* Neon Header */}
            <div className="neon-bar" style={{ fontSize: '14px', letterSpacing: '2px' }}>
              ■■■ VIDEO_FEED://SNOWBALL/DO_NOT_PAUSE ■■■
            </div>

            {/* Main Content */}
            <div style={{ padding: '15px', background: '#c0c0c0' }}>
              
              {/* Video Feed Section */}
              <div className="video-feed" style={{ 
                marginBottom: '15px', 
                height: '180px', 
                position: 'relative' 
              }}>
                <div className="scanline" />
                <div style={{ padding: '10px' }}>
                  <span className="blink" style={{ color: '#ff0000' }}>● REC</span> LIVE_FEED_ACTIVE
                  <br />
                  <div style={{ 
                    textAlign: 'center', 
                    marginTop: '40px',
                    fontSize: '24px',
                    color: '#00ffff'
                  }}>
                    ❄️ SNOWBALL PROTOCOL ❄️
                  </div>
                  <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    <span style={{ color: '#ffff00' }}>ROLL WITH US. GROW WITH EVERYONE.</span>
                    <br />
                    <span style={{ color: '#00ff00', fontSize: '9px' }}>
                      » IMMUTABLE • NO TEAM • MATH-DRIVEN • DEFLATIONARY «
                    </span>
                  </div>
                </div>
              </div>

              {/* Wallet Connection Bar */}
              <div style={{ 
                marginBottom: '15px', 
                padding: '10px',
                background: '#ffffff',
                border: '2px inset #808080',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ fontSize: '11px', fontFamily: 'Courier New' }}>
                  {!mounted ? (
                    <>
                      <b style={{ color: '#808080' }}>● LOADING...</b>
                      <br />
                      Checking wallet connection
                    </>
                  ) : isConnected ? (
                    <>
                      <b style={{ color: '#008000' }}>● CONNECTED</b>
                      <br />
                      Balance: {parseFloat(balance).toLocaleString()} SNOW
                      <br />
                      Accumulated: +{parseFloat(snowAccumulated).toLocaleString()} SNOW
                    </>
                  ) : (
                    <>
                      <b style={{ color: '#ff0000' }}>○ NOT CONNECTED</b>
                      <br />
                      Connect wallet to see your snowball
                    </>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  {isConnected && parseFloat(snowAccumulated) > 0 && (
                    <button 
                      className="btn95"
                      onClick={claimSnow}
                      disabled={isClaimPending}
                      style={{ padding: '8px 16px', fontWeight: 'bold' }}
                    >
                      {isClaimPending ? '⏳ Claiming...' : '❄️ CLAIM SNOW'}
                    </button>
                  )}
                  <WalletButton />
                </div>
              </div>

              {/* Stats Section */}
              <StatsDisplay />

              {/* Charts Grid */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '15px', 
                marginBottom: '15px' 
              }}>
                
                {/* Bonding Curve */}
                <div className="window">
                  <div className="title-bar">
                    <div className="title-bar-text">📈 BONDING_CURVE.EXE</div>
                  </div>
                  <div className="window-body" style={{ padding: '10px' }}>
                    <BondingCurveChart 
                      currentSupply={25000000}
                      maxSupply={50000000}
                      currentPrice={parseFloat(pair?.priceUsd || '0.05')}
                    />
                  </div>
                  <div className="status-bar">
                    <div className="status-bar-field">Type: Exponential</div>
                    <div className="status-bar-field">Mode: ACCUMULATE</div>
                  </div>
                </div>

                {/* Price Chart */}
                <div className="window">
                  <div className="title-bar">
                    <div className="title-bar-text">📊 PRICE_HISTORY.EXE</div>
                  </div>
                  <div className="window-body" style={{ padding: '10px' }}>
                    <PriceChart data={chartData} />
                  </div>
                  <div className="status-bar">
                    <div className="status-bar-field">Timeframe: 24h</div>
                    <div className="status-bar-field">
                      Change: {pair?.priceChange?.h24 ? `${pair.priceChange.h24.toFixed(2)}%` : '...'}
                    </div>
                  </div>
                </div>

              </div>

              {/* Mechanism Explanation */}
              <div className="window" style={{ marginBottom: '15px' }}>
                <div className="title-bar">
                  <div className="title-bar-text">⚙️ MECHANISM.TXT</div>
                </div>
                <div className="window-body" style={{ 
                  fontFamily: 'Courier New', 
                  fontSize: '10px',
                  maxHeight: '250px',
                  overflowY: 'auto'
                }}>
                  <pre style={{ margin: 0, lineHeight: 1.4 }}>{`
╔════════════════════════════════════════════════════════════╗
║            SNOWBALL ACCUMULATION ENGINE v1.0               ║
╚════════════════════════════════════════════════════════════╝

[1] VOLUME SNOWFALL ❄️
    └─ Every $100k in trading volume
       └─ Distributes 0.1% to all holders
       └─ Your share = (your_balance / total_supply)
    
    Example:
    - Pool does $500k volume in 24h
    - You hold 1% of supply
    - You earn: 500k × 0.001 × 0.01 = 5 SNOW/day

[2] TIME MULTIPLIER ⏰
    Your yield MULTIPLIES over time:
    
    ├─ 0-7 days:    1.0x ⚪
    ├─ 8-30 days:   1.2x ⛄
    ├─ 31-90 days:  1.5x 🏔️
    ├─ 91-180 days: 2.0x 🌨️
    └─ 180+ days:   3.0x ❄️❄️
    
    The longer you HOLD = The FASTER you GROW

[3] COMPOUND ROLLING 🔄
    Your accumulated snow generates MORE snow
    
    Formula: balance × (1 + daily_rate)^days
    
    Result: EXPONENTIAL GROWTH 📈

═══════════════════════════════════════════════════════════
FEE STRUCTURE:
═══════════════════════════════════════════════════════════

BUY FEE:  2%
  ├─ 1% → Snow Reserve (future rewards)
  └─ 1% → Liquidity Depth (price floor)

SELL FEE: 5%
  ├─ 3% → Buyback & BURN 🔥
  ├─ 1% → Instant redistribution to holders
  └─ 1% → Snow Reserve

═══════════════════════════════════════════════════════════
RESULT: 
Your snowball grows automatically while others trade.
Every exit strengthens those who stay.
═══════════════════════════════════════════════════════════
                  `}</pre>
                </div>
              </div>

              {/* Tier System */}
              <div className="fieldset95">
                <legend className="legend95">🏔️ AVALANCHE TIER SYSTEM</legend>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(4, 1fr)', 
                  gap: '10px' 
                }}>
                  {[
                    { name: '❄️ SNOWFLAKE', range: '0-1K SNOW', yield: '1.0x', color: '#4682B4', desc: 'Entry Tier' },
                    { name: '⛄ SNOWMAN', range: '1K-10K SNOW', yield: '1.2x', color: '#5F9EA0', desc: 'Fee: -0.5%' },
                    { name: '🏔️ AVALANCHE', range: '10K-100K SNOW', yield: '1.5x', color: '#4169E1', desc: 'Fee: -1% + Priority' },
                    { name: '🌨️ BLIZZARD', range: '100K+ SNOW', yield: '2.0x', color: '#0000CD', desc: 'Fee: -2% + Premium Unlocks' },
                  ].map((tier, i) => (
                    <div key={i} className="window" style={{ margin: 0 }}>
                      <div className="title-bar" style={{ 
                        background: `linear-gradient(90deg, ${tier.color}, ${tier.color}dd)` 
                      }}>
                        <div className="title-bar-text" style={{ fontSize: '9px' }}>
                          {tier.name}
                        </div>
                      </div>
                      <div className="window-body" style={{ 
                        padding: '8px', 
                        fontSize: '10px', 
                        textAlign: 'center' 
                      }}>
                        <b>{tier.range}</b><br />
                        Yield: {tier.yield}<br />
                        <span style={{ color: '#808080' }}>{tier.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom Neon Bar */}
            <div className="neon-bar" style={{ fontSize: '12px' }}>
              ■■■ DON'T JUST HODL • LET IT ROLL • GROW WITH EVERYONE ■■■
            </div>
          </div>

          {/* Window Status Bar */}
          <div className="status-bar">
            <div className="status-bar-field">Ready</div>
            <div className="status-bar-field">Protocol: Active</div>
            <div className="status-bar-field">Network: Ethereum</div>
            <div className="status-bar-field" style={{ marginLeft: 'auto' }}>
              <span className="blink">⚡</span> System OK
            </div>
          </div>
        </div>

        {/* README Window */}
        <div className="window" style={{ 
          width: '95%', 
          maxWidth: '1400px', 
          margin: '20px auto' 
        }}>
          <div className="title-bar">
            <div className="title-bar-text">📄 README.TXT - Protocol Information</div>
            <div className="title-bar-controls">
              <button>_</button>
              <button>□</button>
              <button>×</button>
            </div>
          </div>
          <div className="window-body" style={{ padding: '15px' }}>
            
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: '1fr 500px',
              gap: '15px',
              alignItems: 'start'
            }}>
              
              {/* Left: Text content */}
              <div style={{ 
                fontFamily: 'Courier New', 
                fontSize: '11px', 
                lineHeight: 1.6,
                background: '#ffffff',
                padding: '15px',
                border: '2px inset #808080',
                height: '300px',
                overflowY: 'auto'
              }}>
                <pre style={{ margin: 0 }}>{`
╔═══════════════════════════════════════════════════════╗
║            SNOWBALL PROTOCOL v1.0                     ║
║            README.TXT - SYSTEM OVERVIEW               ║
╚═══════════════════════════════════════════════════════╝

[WHAT IS SNOWBALL?]

A deflationary experiment in accumulation mechanics. 
Your tokens grow automatically as others trade. Like 
rolling a snowball down a hill - it picks up more 
snow with every rotation.

[KEY FEATURES]

✓ IMMUTABLE - No admin keys, no pause, no upgrade
✓ MATH-DRIVEN - Pure algorithm, no human intervention  
✓ DEFLATIONARY - Every sell burns supply permanently
✓ REDISTRIBUTIVE - Seller fees strengthen holders
✓ TIME-REWARDING - Long-term holders get exponential
                   multipliers

[TOKENOMICS]

Total Supply:      50,000,000 SNOW (fixed, deflationary)
Initial Liquidity: 40% → Uniswap V4 Pool
Fair Launch:       30% → Public sale
Snow Reserve:      15% → Locked rewards pool
Team:              10% → 2 year linear vest
Marketing:         5%  → Partnerships

[SECURITY]

✓ Contract verified on Etherscan
✓ Liquidity locked for 2 years
✓ Open source code
✓ No proxy patterns, no upgradeability
✓ Audited by [TBD]

[WARNINGS]

⚠ This is an EXPERIMENT
⚠ High volatility expected
⚠ Only invest what you can afford to lose
⚠ Not financial advice
⚠ DYOR (Do Your Own Research)

═══════════════════════════════════════════════════════
Built on Uniswap V4 • Powered by Math • Secured by Code
═══════════════════════════════════════════════════════
                `}</pre>
              </div>

              {/* Right: Interactive Snowball */}
              <div style={{
                background: '#ffff00',
                border: '3px solid #000000',
                padding: '10px',
                boxShadow: '4px 4px 0px rgba(0,0,0,0.3)',
              }}>
                <div style={{
                  background: '#000080',
                  color: '#ffffff',
                  padding: '4px 8px',
                  marginBottom: '10px',
                  fontWeight: 'bold',
                  fontSize: '11px',
                  textAlign: 'center',
                }}>
                  ⚡ LIVE SNOWBALL SIMULATION ⚡
                </div>
                <InteractiveSnowball />
                <div style={{
                  marginTop: '10px',
                  fontSize: '9px',
                  textAlign: 'center',
                  fontFamily: 'MS Sans Serif',
                  fontWeight: 'bold',
                }}>
                  This is how YOUR snowball grows!
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* BUY SNOWBALL Window with Uniswap Widget */}
        <div className="window" style={{ 
          width: '95%', 
          maxWidth: '520px', 
          margin: '20px auto' 
        }}>
          <div className="title-bar">
            <div className="title-bar-text">💰 BUY SNOWBALL - Uniswap V4 Hook</div>
            <div className="title-bar-controls">
              <button>_</button>
              <button>□</button>
              <button>×</button>
            </div>
          </div>
          <div className="window-body" style={{ padding: '15px' }}>
            
            <div style={{
              marginBottom: '15px',
              padding: '10px',
              background: '#ffff00',
              border: '2px solid #000000',
              fontSize: '10px',
              fontFamily: 'MS Sans Serif',
              fontWeight: 'bold',
            }}>
              ⚠️ WARNING: Connect your wallet first! Swap ETH → SNOW directly through Uniswap.
            </div>

            <CustomV4Swap />

            <div style={{
              marginTop: '15px',
              padding: '8px',
              background: '#ffffff',
              border: '2px inset #808080',
              fontSize: '10px',
              fontFamily: 'Courier New',
            }}>
              <b>HOW IT WORKS:</b><br />
              1. Connect wallet above<br />
              2. Enter ETH amount to swap<br />
              3. Review the rate (2% buy fee included)<br />
              4. Click "Swap" and confirm in wallet<br />
              5. Your SNOW appears in your wallet! ❄️
            </div>

          </div>
          <div className="status-bar">
            <div className="status-bar-field">Powered by Uniswap V4</div>
            <div className="status-bar-field">Custom Hook</div>
          </div>
        </div>
      </div>

      {/* Taskbar */}
      <div className="taskbar">
        <div 
          className="start-btn"
          onClick={() => setStartMenuOpen(!startMenuOpen)}
        >
          <span style={{ fontSize: '14px' }}>❄️</span>
          <span>Start</span>
        </div>
        <div style={{ flex: 1 }} />
        <div className="clock95">{currentTime}</div>
      </div>

      {/* Start Menu */}
      <StartMenu
        isOpen={startMenuOpen}
        onClose={() => setStartMenuOpen(false)}
        onOpenModal={(type) => {
          setActiveModal(type)
          setStartMenuOpen(false)
        }}
      />

      {/* Documentation Modals */}
      <DocumentationModal
        isOpen={activeModal === 'docs'}
        onClose={() => setActiveModal(null)}
        type="docs"
      />
      <DocumentationModal
        isOpen={activeModal === 'howitworks'}
        onClose={() => setActiveModal(null)}
        type="howitworks"
      />
      <DocumentationModal
        isOpen={activeModal === 'tokenomics'}
        onClose={() => setActiveModal(null)}
        type="tokenomics"
      />

      {/* Debug Panel - Remove in production */}
    </>
  )
}