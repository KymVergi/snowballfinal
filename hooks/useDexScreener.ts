'use client'

import useSWR from 'swr'
import axios from 'axios'

interface DexScreenerPair {
  chainId: string
  dexId: string
  url: string
  pairAddress: string
  baseToken: {
    address: string
    name: string
    symbol: string
  }
  quoteToken: {
    address: string
    name: string
    symbol: string
  }
  priceNative: string
  priceUsd: string
  volume: {
    h24: number
    h6: number
    h1: number
  }
  priceChange: {
    h24: number
    h6: number
    h1: number
  }
  liquidity: {
    usd: number
    base: number
    quote: number
  }
  fdv: number
  marketCap: number
  txns: {
    h24: {
      buys: number
      sells: number
    }
    h6: {
      buys: number
      sells: number
    }
    h1: {
      buys: number
      sells: number
    }
  }
}

interface DexScreenerResponse {
  schemaVersion: string
  pairs: DexScreenerPair[]
}

const fetcher = async (url: string) => {
  const res = await axios.get(url)
  return res.data
}

export function useDexScreener(pairAddress?: string) {
  const address = pairAddress || process.env.NEXT_PUBLIC_PAIR_ADDRESS

  const { data, error, isLoading, mutate } = useSWR<DexScreenerResponse>(
    address ? `https://api.dexscreener.com/latest/dex/pairs/ethereum/${address}` : null,
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
      dedupingInterval: 10000,
    }
  )

  const pair = data?.pairs?.[0]

  return {
    pair,
    isLoading,
    error,
    refresh: mutate,
  }
}

// Hook para obtener el historial de precios (chartData)
export function usePriceHistory(pairAddress?: string) {
  // DexScreener no tiene endpoint público para históricos
  // Aquí puedes integrar con The Graph o tu propio backend
  // Por ahora retornamos mock data
  
  const mockData = generateMockPriceHistory()

  return {
    chartData: mockData,
    isLoading: false,
  }
}

function generateMockPriceHistory() {
  const data = []
  const now = Date.now()
  const oneHour = 60 * 60 * 1000
  
  let price = 0.045
  
  // Generar 24 horas de datos
  for (let i = 24; i >= 0; i--) {
    const timestamp = now - (i * oneHour)
    
    // Random walk con tendencia alcista
    price = price * (1 + (Math.random() - 0.4) * 0.05)
    price = Math.max(0.03, Math.min(0.08, price)) // Limites
    
    data.push({
      timestamp,
      time: new Date(timestamp).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      price: parseFloat(price.toFixed(6)),
      volume: Math.random() * 50000 + 10000,
    })
  }
  
  return data
}
