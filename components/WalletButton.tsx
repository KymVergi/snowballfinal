'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useState } from 'react'

export default function WalletButton() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const [showModal, setShowModal] = useState(false)

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (isConnected && address) {
    return (
      <button 
        className="btn95" 
        onClick={() => disconnect()}
        style={{ 
          padding: '6px 12px',
          fontWeight: 'bold',
          background: 'linear-gradient(180deg, #00ff00, #00aa00)',
          color: '#000000'
        }}
      >
        🟢 {formatAddress(address)}
      </button>
    )
  }

  return (
    <>
      <button 
        className="btn95" 
        onClick={() => setShowModal(true)}
        style={{ 
          padding: '6px 16px',
          fontWeight: 'bold',
          background: 'linear-gradient(180deg, #ff00ff, #cc00cc)',
          color: '#ffffff'
        }}
      >
        ⚡ CONNECT WALLET
      </button>

      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10001
        }}>
          <div className="window" style={{ width: '400px' }}>
            <div className="title-bar">
              <div className="title-bar-text">🔗 Connect Wallet</div>
              <div className="title-bar-controls">
                <button onClick={() => setShowModal(false)}>×</button>
              </div>
            </div>
            
            <div className="window-body" style={{ padding: '20px' }}>
              <p style={{ marginBottom: '15px', fontSize: '11px' }}>
                Select a wallet to connect:
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {connectors.map((connector) => (
                  <button
                    key={connector.id}
                    className="btn95"
                    onClick={() => {
                      connect({ connector })
                      setShowModal(false)
                    }}
                    style={{ 
                      padding: '10px',
                      textAlign: 'left',
                      width: '100%'
                    }}
                  >
                    <span style={{ fontSize: '20px', marginRight: '10px' }}>🦊</span>
                    {connector.name}
                  </button>
                ))}
              </div>

              <div style={{ 
                marginTop: '20px', 
                padding: '10px', 
                background: '#ffffff',
                border: '2px inset #808080',
                fontSize: '10px',
                fontFamily: 'Courier New'
              }}>
                ⚠️ Make sure you're on the correct network (Ethereum Mainnet)
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
