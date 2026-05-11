'use client'

import { useEffect, useRef } from 'react'

interface BondingCurveChartProps {
  currentSupply?: number
  maxSupply?: number
  currentPrice?: number
}

export default function BondingCurveChart({ 
  currentSupply = 25000000, 
  maxSupply = 50000000,
  currentPrice = 0.05
}: BondingCurveChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = '#00ff00'
    ctx.lineWidth = 0.5
    
    // Vertical lines
    for (let i = 0; i < canvas.width; i += 40) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvas.height)
      ctx.stroke()
    }
    
    // Horizontal lines
    for (let i = 0; i < canvas.height; i += 23) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(canvas.width, i)
      ctx.stroke()
    }

    // Draw bonding curve (exponential)
    ctx.strokeStyle = '#00ffff'
    ctx.lineWidth = 3
    ctx.beginPath()
    
    for (let x = 0; x < canvas.width; x++) {
      const supplyPercent = x / canvas.width
      
      // Exponential bonding curve formula: price = k * supply^n
      // donde n > 1 para que sea exponencial
      const price = Math.pow(supplyPercent, 2.5) * (canvas.height * 0.9)
      const y = canvas.height - price
      
      if (x === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.stroke()

    // Draw current position
    const currentX = (currentSupply / maxSupply) * canvas.width
    const currentPriceNormalized = Math.pow(currentSupply / maxSupply, 2.5)
    const currentY = canvas.height - (currentPriceNormalized * canvas.height * 0.9)

    // Current position dot
    ctx.fillStyle = '#ff00ff'
    ctx.beginPath()
    ctx.arc(currentX, currentY, 5, 0, Math.PI * 2)
    ctx.fill()

    // Current position label
    ctx.fillStyle = '#ffff00'
    ctx.font = 'bold 11px "Courier New"'
    ctx.fillText('YOU ARE HERE', currentX + 10, currentY)

    // Draw axes labels
    ctx.fillStyle = '#00ff00'
    ctx.font = '10px "Courier New"'
    ctx.fillText('PRICE', 10, 20)
    ctx.fillText('SUPPLY →', canvas.width - 80, canvas.height - 10)

    // Draw price markers
    ctx.fillStyle = '#00ffff'
    ctx.font = '9px "Courier New"'
    const maxPrice = 0.10
    for (let i = 0; i <= 5; i++) {
      const price = (maxPrice / 5) * i
      const y = canvas.height - (i / 5) * canvas.height * 0.9
      ctx.fillText(`$${price.toFixed(3)}`, 5, y)
    }

    // Draw supply markers
    for (let i = 0; i <= 5; i++) {
      const supply = (maxSupply / 5) * i
      const x = (i / 5) * canvas.width
      ctx.fillText(`${(supply / 1000000).toFixed(0)}M`, x, canvas.height - 2)
    }

  }, [currentSupply, maxSupply, currentPrice])

  return (
    <div className="graph-container" style={{ height: '280px' }}>
      <canvas 
        ref={canvasRef} 
        width={480} 
        height={260}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}
