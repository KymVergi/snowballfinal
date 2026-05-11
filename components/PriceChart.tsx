'use client'

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

interface PriceChartProps {
  data: Array<{
    timestamp: number
    time: string
    price: number
    volume: number
  }>
}

export default function PriceChart({ data }: PriceChartProps) {
  return (
    <div className="graph-container" style={{ height: '280px', padding: '15px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00ffff" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#00ffff" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          <XAxis 
            dataKey="time" 
            stroke="#00ff00"
            tick={{ fill: '#00ff00', fontSize: 9, fontFamily: 'Courier New' }}
            tickLine={{ stroke: '#00ff00' }}
          />
          
          <YAxis 
            stroke="#00ff00"
            tick={{ fill: '#00ff00', fontSize: 9, fontFamily: 'Courier New' }}
            tickLine={{ stroke: '#00ff00' }}
            tickFormatter={(value) => `$${value.toFixed(4)}`}
          />
          
          <Tooltip 
            contentStyle={{
              backgroundColor: '#000000',
              border: '2px solid #00ff00',
              borderRadius: '0',
              fontFamily: 'Courier New',
              fontSize: '10px',
              color: '#00ffff'
            }}
            labelStyle={{ color: '#00ff00' }}
            formatter={(value: any) => [`$${value.toFixed(6)}`, 'Price']}
          />
          
          <Area
            type="monotone"
            dataKey="price"
            stroke="#00ffff"
            strokeWidth={2}
            fill="url(#priceGradient)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
