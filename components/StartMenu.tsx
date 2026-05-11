'use client'

import { useState } from 'react'

interface StartMenuProps {
  isOpen: boolean
  onClose: () => void
  onOpenModal: (modal: 'docs' | 'howitworks' | 'tokenomics') => void
}

interface MenuItem {
  icon: string
  label: string
  action: () => void
  separator?: never
}

interface Separator {
  separator: true
  icon?: never
  label?: never
  action?: never
}

type MenuItemOrSeparator = MenuItem | Separator

export default function StartMenu({ isOpen, onClose, onOpenModal }: StartMenuProps) {
  if (!isOpen) return null

  const menuItems: MenuItemOrSeparator[] = [
    { icon: '📄', label: 'Documents', action: () => onOpenModal('docs') },
    { icon: '⚙️', label: 'How It Works', action: () => onOpenModal('howitworks') },
    { icon: '💰', label: 'Tokenomics', action: () => onOpenModal('tokenomics') },
    { separator: true },
    { icon: '🔗', label: 'Etherscan', action: () => window.open('https://etherscan.io/address/0x82E38D0D2f4F4f53509F1B884B084B585D33a32E', '_blank') },
    { icon: '✖️', label: 'X', action: () => window.open('https://twitter.com/sn0wb4Il', '_blank') },
    { icon: '💬', label: 'Telegram', action: () => window.open('https://t.me', '_blank') },
    { separator: true },
    { icon: '❌', label: 'Close', action: onClose },
  ]

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
          zIndex: 9999,
        }}
      />

      {/* Start Menu */}
      <div
        style={{
          position: 'fixed',
          bottom: '28px',
          left: '2px',
          width: '250px',
          zIndex: 10000,
        }}
        className="window"
      >
        <div className="title-bar">
          <div className="title-bar-text" style={{ fontSize: '11px' }}>
            ❄️ SNOWBALL Protocol
          </div>
        </div>

        <div className="window-body" style={{ padding: '3px' }}>
          {menuItems.map((item, index) => {
            if ('separator' in item && item.separator) {
              return (
                <div
                  key={index}
                  style={{
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, #808080, transparent)',
                    margin: '3px 0',
                  }}
                />
              )
            }
            
            return (
              <div
                key={index}
                onClick={() => {
                  item.action()
                  onClose()
                }}
                style={{
                  padding: '6px 10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '11px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#000080'
                  e.currentTarget.style.color = '#ffffff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = '#000000'
                }}
              >
                <span style={{ fontSize: '16px' }}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
