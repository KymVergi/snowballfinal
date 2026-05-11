'use client'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'docs' | 'howitworks' | 'tokenomics'
}

export default function DocumentationModal({ isOpen, onClose, type }: ModalProps) {
  if (!isOpen) return null

  const getContent = () => {
    switch (type) {
      case 'docs':
        return {
          title: '📄 SNOWBALL_DOCS.TXT',
          content: `
╔═══════════════════════════════════════════════════════════════════╗
║                    SNOWBALL PROTOCOL DOCUMENTATION                ║
║                         Technical Specification                   ║
╚═══════════════════════════════════════════════════════════════════╝

[ABSTRACT]

SNOWBALL implements a novel accumulation mechanism on Ethereum using 
Uniswap V4 hooks, combining bonding curve mechanics with deflationary 
tokenomics and time-weighted yield distribution.

[MATHEMATICAL FOUNDATION]

1. BONDING CURVE PRICING
   
   The token price follows an exponential bonding curve:
   
   P(s) = k × s^n
   
   Where:
   - P(s) = Price as a function of supply
   - s = Current supply / Maximum supply (normalized)
   - k = Scaling constant
   - n = Curve exponent (n = 2.5 for exponential growth)
   
   Example:
   At 50% supply (25M tokens): P(0.5) = k × 0.5^2.5 ≈ 0.177k
   At 100% supply (50M tokens): P(1.0) = k × 1.0^2.5 = k

2. RESERVE BACKING
   
   Total ETH Reserve (R):
   R = ∫[0 to s] P(x)dx = k × [s^(n+1) / (n+1)]
   
   For n=2.5:
   R = k × s^3.5 / 3.5

3. TIME-WEIGHTED YIELD
   
   Yield multiplier M(t):
   
   M(t) = {
     1.0,  if 0 ≤ t < 7
     1.2,  if 7 ≤ t < 30
     1.5,  if 30 ≤ t < 90
     2.0,  if 90 ≤ t < 180
     3.0,  if t ≥ 180
   }
   
   Where t = days held

4. COMPOUND ACCUMULATION
   
   User balance after time t:
   
   B(t) = B₀ × (1 + r × M(t))^t
   
   Where:
   - B₀ = Initial balance
   - r = Daily yield rate = V / (S × 100)
   - V = 24h trading volume
   - S = Total supply
   - M(t) = Time multiplier

[PROTOCOL INVARIANTS]

1. Supply Conservation:
   Σ(burns) + Σ(balances) + reserve ≤ 50,000,000

2. Reserve Monotonicity:
   R(t+1) ≥ R(t) for all t (reserves never decrease)

3. Deflation Property:
   dS/dt ≤ 0 (supply is non-increasing)

[SECURITY PROPERTIES]

✓ No admin keys (immutable)
✓ No upgrade mechanism
✓ No pause functionality
✓ Deterministic execution
✓ Verifiable on-chain

═══════════════════════════════════════════════════════════════════
Contract: [TBD]
Audit: [TBD]
License: MIT
═══════════════════════════════════════════════════════════════════
          `
        }

      case 'howitworks':
        return {
          title: '⚙️ HOW_IT_WORKS.TXT',
          content: `
╔═══════════════════════════════════════════════════════════════════╗
║                      MECHANISM DEEP DIVE                          ║
║                   Mathematical Implementation                     ║
╚═══════════════════════════════════════════════════════════════════╝

[1] VOLUME-BASED DISTRIBUTION

The protocol distributes a fraction of trading volume to holders:

Distribution Rate (δ):
δ = V₂₄ × 0.001

Where V₂₄ is 24-hour volume in USD.

User Share (σᵢ):
σᵢ = (Bᵢ × M(tᵢ)) / Σⱼ(Bⱼ × M(tⱼ))

Where:
- Bᵢ = User i's balance
- M(tᵢ) = User i's time multiplier
- Σⱼ = Sum over all holders j

User's Reward (Rᵢ):
Rᵢ = δ × σᵢ

Example Calculation:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Pool Volume: V₂₄ = $1,000,000
Distribution: δ = 1,000,000 × 0.001 = 1,000 SNOW

User A: Balance = 10,000 SNOW, held 100 days → M(t) = 2.0
User B: Balance = 5,000 SNOW, held 10 days → M(t) = 1.2

Weighted balances:
  A: 10,000 × 2.0 = 20,000
  B: 5,000 × 1.2 = 6,000
  Total: 26,000

Shares:
  σₐ = 20,000 / 26,000 = 76.9%
  σᵦ = 6,000 / 26,000 = 23.1%

Rewards:
  Rₐ = 1,000 × 0.769 = 769 SNOW
  Rᵦ = 1,000 × 0.231 = 231 SNOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[2] BURN MECHANISM

On each sell transaction:

Burn Amount (B):
B = sell_amount × 0.03

This burn is executed via buyback:
1. 3% of ETH → Market buy SNOW
2. Bought SNOW → 0x0000...dead

Effect on supply:
dS/dt = -B × (txn_frequency)

[3] COMPOUND GROWTH

Over time period T days:

Final Balance:
B(T) = B₀ × ∏ᵗ⁼¹ᵀ (1 + rₜ × M(t))

Approximation for constant r and M:
B(T) ≈ B₀ × (1 + r × M)ᵀ

Annual Percentage Yield (APY):
APY = (1 + r × M)³⁶⁵ - 1

Example with realistic numbers:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Initial: B₀ = 10,000 SNOW
Daily rate: r = 0.0002 (0.02%)
Time held: 180 days → M = 2.0
Effective daily: r × M = 0.0004 (0.04%)

After 180 days:
B(180) = 10,000 × (1.0004)¹⁸⁰
B(180) = 10,000 × 1.0739
B(180) = 10,739 SNOW

Gain: 739 SNOW (7.39%)
APY ≈ (1.0004)³⁶⁵ - 1 = 15.7%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[4] FEE STRUCTURE

Buy Transaction:
  Amount paid: A
  Tokens received: A × 0.98 / P(s)
  Fee allocation:
    → 1% to Reserve: 0.01A
    → 1% to Liquidity: 0.01A

Sell Transaction:
  Tokens sold: T
  ETH received: T × P(s) × 0.95
  Fee allocation:
    → 3% Buyback & Burn: 0.03 × T × P(s)
    → 1% Redistribution: 0.01 × T × P(s)
    → 1% to Reserve: 0.01 × T × P(s)

Net Effect:
- Buyers: 2% entry cost
- Sellers: 5% exit cost + strengthen remaining holders
- Asymmetry encourages holding

═══════════════════════════════════════════════════════════════════
          `
        }

      case 'tokenomics':
        return {
          title: '💰 TOKENOMICS.TXT',
          content: `
╔═══════════════════════════════════════════════════════════════════╗
║                     TOKENOMICS SPECIFICATION                      ║
║                    Supply & Distribution Model                    ║
╚═══════════════════════════════════════════════════════════════════╝

[SUPPLY PARAMETERS]

Total Maximum Supply: S_max = 50,000,000 SNOW
Decimals: 18
Symbol: SNOW
Network: Ethereum (ERC-20)

[INITIAL DISTRIBUTION]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Allocation          | Tokens        | %     | Vesting
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Uniswap V4 Pool     | 20,000,000    | 40%   | Locked 2 years
Fair Launch Sale    | 15,000,000    | 30%   | Immediate
Snow Reserve        | 7,500,000     | 15%   | Locked (protocol)
Team & Development  | 5,000,000     | 10%   | 2 year linear
Marketing & Partnerships | 2,500,000| 5%    | 6 month linear
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL               | 50,000,000    | 100%  |
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[DEFLATIONARY DYNAMICS]

Circulating Supply Over Time:
S(t) = S_max - ∫[0 to t] B(τ)dτ

Where B(τ) is burn rate at time τ.

Expected burn rate:
E[B] = daily_volume × sell_ratio × 0.03 × avg_price

Assumptions:
- Daily volume: $1M
- Sell ratio: 50%
- Avg price: $0.05

Daily burn:
B_daily = 1,000,000 × 0.5 × 0.03 / 0.05
B_daily = 300,000 SNOW/day

Projected supply after 1 year (conservative):
S(365) = 50,000,000 - (300,000 × 365 × 0.5)
S(365) ≈ 45,250,000 SNOW

50% factor accounts for variable volume.

[RESERVE ACCUMULATION]

Reserve Growth Rate:
dR/dt = (buy_volume × 0.01) + (sell_volume × 0.01)

At equilibrium (buy = sell):
dR/dt = 0.02 × daily_volume

Example:
Daily volume: $1M
Daily reserve growth: $20,000

After 1 year:
R(365) = 20,000 × 365 = $7,300,000

Reserve backing per token:
r(t) = R(t) / S(t)

At year 1:
r(365) = 7,300,000 / 45,250,000 ≈ $0.161 per token

[TIER ECONOMICS]

Tier thresholds and multipliers:

T₁ (SNOWFLAKE): [0, 1K) → M = 1.0
T₂ (SNOWMAN): [1K, 10K) → M = 1.2  (+20%)
T₃ (AVALANCHE): [10K, 100K) → M = 1.5  (+50%)
T₄ (BLIZZARD): [100K+) → M = 2.0  (+100%)

Yield advantage of T₄ vs T₁:
Advantage = M₄/M₁ - 1 = 2.0/1.0 - 1 = 100%

Capital efficiency (APY per $ invested):
Given constant daily rate r = 0.0002:

T₁: APY = (1.0002)³⁶⁵ - 1 ≈ 7.5%
T₂: APY = (1.00024)³⁶⁵ - 1 ≈ 9.1%
T₃: APY = (1.0003)³⁶⁵ - 1 ≈ 11.6%
T₄: APY = (1.0004)³⁶⁵ - 1 ≈ 15.7%

[PRICE FLOOR MECHANICS]

Theoretical price floor:
P_floor = R / S

This floor increases over time as:
1. R grows (from fees)
2. S decreases (from burns)

Rate of floor appreciation:
dP_floor/dt = (1/S)(dR/dt) - (R/S²)(dS/dt)

Since dS/dt < 0 (deflationary), both terms are positive.

Expected floor growth (annual):
Given R growth: +$7.3M
Given S decrease: -4.75M tokens

ΔP_floor ≈ (+7.3M / 45M) - (-4.75M × 0.15 / 45M²)
ΔP_floor ≈ +16.2% + 0.26% ≈ +16.5%

[LONG-TERM PROJECTIONS]

Year 3 estimates (conservative):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Metric              | Value         | Change
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Circulating Supply  | 35M SNOW      | -30%
Total Reserve       | $25M          | +250%
Price Floor         | $0.71         | +1320%
Market Cap          | $50M-100M     | Variable
Avg Holder APY      | 20%-40%       | Tier-dependent
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Note: Projections assume sustained trading activity and no black 
swan events. Actual results will vary with market conditions.

═══════════════════════════════════════════════════════════════════
Disclaimer: This is a mathematical model. Crypto markets are highly
volatile. All projections are hypothetical. DYOR. Not financial advice.
═══════════════════════════════════════════════════════════════════
          `
        }
    }
  }

  const { title, content } = getContent()

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 10001,
        }}
      />

      {/* Modal Window */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '800px',
          maxHeight: '85vh',
          zIndex: 10002,
        }}
        className="window"
      >
        <div className="title-bar">
          <div className="title-bar-text">{title}</div>
          <div className="title-bar-controls">
            <button onClick={onClose}>×</button>
          </div>
        </div>

        <div className="window-body" style={{ 
          padding: '15px',
          maxHeight: 'calc(85vh - 60px)',
          overflowY: 'auto',
        }}>
          <div style={{
            fontFamily: 'Courier New',
            fontSize: '11px',
            lineHeight: '1.5',
            whiteSpace: 'pre-wrap',
            background: '#ffffff',
            padding: '15px',
            border: '2px inset #808080',
          }}>
            {content}
          </div>

          <div style={{ 
            marginTop: '15px', 
            textAlign: 'center' 
          }}>
            <button 
              className="btn95" 
              onClick={onClose}
              style={{ padding: '6px 30px', fontWeight: 'bold' }}
            >
              Close
            </button>
          </div>
        </div>

        <div className="status-bar">
          <div className="status-bar-field">
            {type === 'docs' && 'Technical Documentation'}
            {type === 'howitworks' && 'Mechanism Explanation'}
            {type === 'tokenomics' && 'Economic Model'}
          </div>
          <div className="status-bar-field" style={{ marginLeft: 'auto' }}>
            Read Only
          </div>
        </div>
      </div>
    </>
  )
}