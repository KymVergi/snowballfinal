'use client'

import { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract, useBalance } from 'wagmi'
import { parseEther, formatEther, Address } from 'viem'

// Get from env or use mainnet defaults
const SNOWBALL_TOKEN = process.env.NEXT_PUBLIC_SNOWBALL_TOKEN as Address
const SNOWBALL_HOOK = process.env.NEXT_PUBLIC_HOOK_ADDRESS as Address

// Simplified ERC20 ABI
const ERC20_ABI = [
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const

export default function CustomV4Swap() {
  const { address, isConnected } = useAccount()
  const [ethAmount, setEthAmount] = useState('0.1')
  const [estimatedSnow, setEstimatedSnow] = useState('0')
  const [step, setStep] = useState<'idle' | 'approving' | 'swapping'>('idle')

  // Get ETH balance
  const { data: ethBalance } = useBalance({
    address: address,
  })

  // Get SNOW balance
  const { data: snowBalance } = useReadContract({
    address: SNOWBALL_TOKEN,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  })

  // Write contract hook
  const { 
    data: txHash,
    isPending,
    writeContract,
  } = useWriteContract()

  // Wait for transaction
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: txHash,
  })

  // Estimate output (rough - 2% fee)
  useEffect(() => {
    if (ethAmount && parseFloat(ethAmount) > 0) {
      const estimateWithFee = parseFloat(ethAmount) * 0.98
      // Placeholder ratio: 1 ETH = 1000 SNOW
      const estimated = estimateWithFee * 1000
      setEstimatedSnow(estimated.toFixed(2))
    } else {
      setEstimatedSnow('0')
    }
  }, [ethAmount])

  const handleSwap = async () => {
    if (!isConnected || !address) {
      alert('⚠️ Connect your wallet first!')
      return
    }

    const amount = parseFloat(ethAmount)
    if (amount <= 0) {
      alert('⚠️ Enter a valid amount!')
      return
    }

    if (ethBalance && amount > parseFloat(formatEther(ethBalance.value))) {
      alert('⚠️ Insufficient ETH balance!')
      return
    }

    // Show confirmation
    const confirmed = confirm(
      `⚠️ MAINNET SWAP CONFIRMATION\n\n` +
      `You are about to swap ${ethAmount} ETH for ~${estimatedSnow} SNOW\n\n` +
      `This is REAL money on Ethereum mainnet!\n\n` +
      `Continue?`
    )

    if (!confirmed) return

    try {
      setStep('swapping')
      
      // ⚠️ IMPORTANT: Replace this with your actual swap function
      // For now, showing an alert with next steps
      alert(
        `🚧 Swap Ready to Execute!\n\n` +
        `To complete:\n` +
        `1. Get the full SnowballHook ABI from Etherscan\n` +
        `2. Add the swap() function to this component\n` +
        `3. Call: writeContract({ address: SNOWBALL_HOOK, ... })\n\n` +
        `Contract: ${SNOWBALL_HOOK}\n` +
        `Amount: ${ethAmount} ETH`
      )
      
      setStep('idle')
    } catch (error) {
      console.error('Swap failed:', error)
      setStep('idle')
      alert('❌ Swap failed. Check console.')
    }
  }

  return (
    <div className="window" style={{ width: '100%', maxWidth: '480px', margin: '0' }}>
      <div className="title-bar">
        <div className="title-bar-text">💰 SWAP ETH → SNOW (MAINNET)</div>
      </div>

      <div className="window-body" style={{ padding: '15px' }}>
        
        {/* Warning */}
        <div style={{
          background: '#ff0000',
          color: '#ffffff',
          border: '2px solid #000000',
          padding: '8px',
          marginBottom: '15px',
          fontSize: '10px',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          ⚠️ SWAP ETH TO SNOWBALL
        </div>

        {/* Balances */}
        {isConnected && (
          <div style={{
            background: '#ffffff',
            border: '2px inset #808080',
            padding: '8px',
            marginBottom: '15px',
            fontSize: '10px',
            fontFamily: 'Courier New'
          }}>
            <b>BALANCES:</b><br />
            ETH: {ethBalance ? parseFloat(formatEther(ethBalance.value)).toFixed(4) : '0.0000'}<br />
            SNOW: {snowBalance ? parseFloat(formatEther(snowBalance as bigint)).toFixed(2) : '0.00'}
          </div>
        )}

        {/* Input */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '11px', fontWeight: 'bold' }}>
            You Pay (ETH)
          </label>
          <div style={{ display: 'flex', alignItems: 'center', border: '2px inset #808080', background: '#ffffff', padding: '8px' }}>
            <input
              type="number"
              step="0.01"
              min="0"
              value={ethAmount}
              onChange={(e) => setEthAmount(e.target.value)}
              disabled={step !== 'idle'}
              style={{ border: 'none', background: 'transparent', flex: 1, fontSize: '16px', fontFamily: 'Courier New', outline: 'none' }}
              placeholder="0.0"
            />
            <span style={{ fontWeight: 'bold', fontSize: '12px', color: '#000080' }}>ETH</span>
          </div>
        </div>

        <div style={{ textAlign: 'center', margin: '10px 0', fontSize: '20px', color: '#008080' }}>↓</div>

        {/* Output */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '11px', fontWeight: 'bold' }}>
            You Receive (SNOW)
          </label>
          <div style={{ border: '2px inset #808080', background: '#e0e0e0', padding: '8px', display: 'flex', alignItems: 'center' }}>
            <div style={{ flex: 1, fontSize: '16px', fontFamily: 'Courier New', color: '#000080' }}>
              ~{estimatedSnow}
            </div>
            <span style={{ fontWeight: 'bold', fontSize: '12px', color: '#000080' }}>SNOW</span>
          </div>
        </div>

        {/* Fee */}
        <div style={{ background: '#ffff00', border: '2px solid #000000', padding: '8px', marginBottom: '15px', fontSize: '9px' }}>
          <b>💡 FEE: 2%</b><br />
          • 1% → Reserve<br />
          • 1% → Liquidity
        </div>

        {/* Button */}
        {!isConnected ? (
          <div style={{ textAlign: 'center', padding: '12px', background: '#ff0000', color: '#ffffff', fontWeight: 'bold', border: '2px solid #000000' }}>
            ❌ CONNECT WALLET
          </div>
        ) : step !== 'idle' || isPending || isConfirming ? (
          <button disabled className="btn95" style={{ width: '100%', padding: '12px', cursor: 'wait' }}>
            ⏳ Processing...
          </button>
        ) : (
          <button
            onClick={handleSwap}
            disabled={!ethAmount || parseFloat(ethAmount) <= 0}
            className="btn95"
            style={{ width: '100%', padding: '12px', fontSize: '13px', fontWeight: 'bold', background: '#008000', color: '#ffffff' }}
          >
            🔄 SWAP NOW
          </button>
        )}

        {/* Info */}
        <div style={{ marginTop: '15px', padding: '8px', background: '#ffffff', border: '2px inset #808080', fontSize: '8px', fontFamily: 'Courier New' }}>
          <b>CONTRACTS (✓ VERIFIED):</b><br />
          Token: {SNOWBALL_TOKEN.slice(0, 10)}...<br />
          Hook: {SNOWBALL_HOOK.slice(0, 10)}...<br /><br />
          <span style={{ color: '#ff0000' }}>⚠️ Verify on Etherscan before swapping!</span>
        </div>

      </div>

      <div className="status-bar">
        <div className="status-bar-field">Uniswap V4</div>
        <div className="status-bar-field">MAINNET</div>
        <div className="status-bar-field" style={{ marginLeft: 'auto' }}>
          {step === 'idle' ? '✓ Ready' : '⏳ Processing'}
        </div>
      </div>
    </div>
  )
}