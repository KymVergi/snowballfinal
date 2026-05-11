'use client'

import { useEffect, useRef, useState } from 'react'

export default function InteractiveSnowball() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [snowballSize, setSnowballSize] = useState(30)
  const [rotation, setRotation] = useState(0)
  const [events, setEvents] = useState<Array<{ id: number; type: 'buy' | 'sell'; x: number; y: number; timestamp: number }>>([])
  const [eventCounter, setEventCounter] = useState(0)
  const animationFrameRef = useRef<number>()

  // Rotate snowball continuously - speed increases with size
  useEffect(() => {
    const animate = () => {
      // Speed based on size: bigger snowball = faster rotation
      const baseSpeed = 2
      const sizeMultiplier = snowballSize / 30 // 30 is base size
      const rotationSpeed = baseSpeed * sizeMultiplier
      
      setRotation(prev => (prev + rotationSpeed) % 360)
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [snowballSize])

  // Simulate buy/sell events
  useEffect(() => {
    const interval = setInterval(() => {
      const isBuy = Math.random() > 0.4 // 60% buy, 40% sell
      const newEvent = {
        id: Date.now(),
        type: isBuy ? 'buy' as const : 'sell' as const,
        x: Math.random() * 400 + 50,
        y: Math.random() * 200 + 50,
        timestamp: Date.now(),
      }
      
      setEvents(prev => [...prev, newEvent])
      
      // Grow snowball on buy, shrink slightly on sell
      if (isBuy) {
        setSnowballSize(prev => Math.min(prev + 3, 80))
      } else {
        setSnowballSize(prev => Math.max(prev - 1, 20))
      }
      
      // Remove old events after 2 seconds
      setTimeout(() => {
        setEvents(prev => prev.filter(e => e.id !== newEvent.id))
      }, 2000)
      
      setEventCounter(prev => prev + 1)
    }, 1500) // Event every 1.5 seconds

    return () => clearInterval(interval)
  }, [])

  // Draw snowball with rotation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = '#c0c0c0'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw border (Windows 95 inset style)
    ctx.strokeStyle = '#808080'
    ctx.lineWidth = 2
    ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2)
    
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 1
    ctx.strokeRect(0, 0, canvas.width - 1, canvas.height - 1)

    // Center position
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // Draw shadow
    ctx.beginPath()
    ctx.ellipse(centerX + 3, centerY + 3, snowballSize, snowballSize * 0.3, 0, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
    ctx.fill()

    // Save context for rotation
    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate((rotation * Math.PI) / 180)

    // Draw snowball base (black circle with gradient)
    ctx.beginPath()
    ctx.arc(0, 0, snowballSize, 0, Math.PI * 2)
    
    const gradient = ctx.createRadialGradient(
      -snowballSize / 3, 
      -snowballSize / 3, 
      0, 
      0, 
      0, 
      snowballSize
    )
    gradient.addColorStop(0, '#555555')
    gradient.addColorStop(0.5, '#222222')
    gradient.addColorStop(1, '#000000')
    
    ctx.fillStyle = gradient
    ctx.fill()

    // Add rotation markers (dots that spin with the snowball)
    const numDots = 8
    for (let i = 0; i < numDots; i++) {
      const angle = (i / numDots) * Math.PI * 2
      const dotRadius = snowballSize * 0.7
      const dotX = Math.cos(angle) * dotRadius
      const dotY = Math.sin(angle) * dotRadius
      
      ctx.beginPath()
      ctx.arc(dotX, dotY, snowballSize * 0.08, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(100, 100, 100, 0.6)'
      ctx.fill()
    }

    // Add white highlight that stays in place (not rotating)
    ctx.restore() // Restore to remove rotation
    ctx.beginPath()
    ctx.arc(centerX - snowballSize / 3, centerY - snowballSize / 3, snowballSize / 4, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
    ctx.fill()

    // Draw size indicator
    ctx.fillStyle = '#000000'
    ctx.font = 'bold 11px "MS Sans Serif"'
    ctx.textAlign = 'center'
    ctx.fillText(`Size: ${snowballSize.toFixed(0)}`, centerX, canvas.height - 10)

    // Draw speed indicator
    const speed = ((snowballSize / 30) * 100).toFixed(0)
    ctx.fillStyle = '#000080'
    ctx.font = '9px "MS Sans Serif"'
    ctx.fillText(`Speed: ${speed}%`, centerX, canvas.height - 25)

  }, [snowballSize, rotation])

  return (
    <div style={{ position: 'relative', width: '500px', height: '300px' }}>
      {/* Canvas for snowball */}
      <canvas
        ref={canvasRef}
        width={500}
        height={300}
        style={{
          display: 'block',
          imageRendering: 'pixelated',
        }}
      />

      {/* Buy/Sell event notifications */}
      {events.map(event => (
        <div
          key={event.id}
          style={{
            position: 'absolute',
            left: `${event.x}px`,
            top: `${event.y}px`,
            animation: 'floatUp 2s ease-out forwards',
            pointerEvents: 'none',
          }}
        >
          <div
            className="window"
            style={{
              padding: '4px 8px',
              fontSize: '10px',
              fontWeight: 'bold',
              minWidth: '60px',
              textAlign: 'center',
              background: event.type === 'buy' ? '#00ff00' : '#ff0000',
              color: '#000000',
              border: '2px solid #000000',
              boxShadow: '2px 2px 0px rgba(0,0,0,0.5)',
            }}
          >
            {event.type === 'buy' ? '↑ BUY' : '↓ SELL'}
            <div style={{ fontSize: '8px', marginTop: '2px' }}>
              {event.type === 'buy' ? '+GROW' : '-MELT'}
            </div>
          </div>
        </div>
      ))}

      {/* Info panel */}
      <div
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '10px',
          background: '#ffffff',
          border: '2px inset #808080',
          padding: '8px',
          fontSize: '10px',
          fontFamily: 'Courier New',
          maxWidth: '180px',
        }}
      >
        <b>LIVE SIMULATION</b><br />
        Events: {eventCounter}<br />
        Current Size: {snowballSize.toFixed(0)}<br />
        Rotation: {rotation.toFixed(0)}°<br />
        <span style={{ color: '#008000' }}>■ BUY = Grow + Speed↑</span><br />
        <span style={{ color: '#ff0000' }}>■ SELL = Shrink + Speed↓</span>
      </div>

      {/* Instructions */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: '#ffff00',
          border: '2px solid #000000',
          padding: '6px',
          fontSize: '9px',
          fontFamily: 'MS Sans Serif',
          maxWidth: '140px',
          fontWeight: 'bold',
        }}
      >
        🌀 IT'S ROLLING!<br />
        <span style={{ fontWeight: 'normal', fontSize: '8px' }}>
          Watch it spin faster as it grows! Each buy increases size AND speed.
        </span>
      </div>

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes floatUp {
          0% {
            opacity: 1;
            transform: translateY(0px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-50px) scale(0.8);
          }
        }
      `}</style>
    </div>
  )
}