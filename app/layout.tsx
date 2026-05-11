import type { Metadata } from 'next'
import { Web3Provider } from '@/lib/web3-provider'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'SNOWBALL Protocol - Roll with us. Grow with everyone.',
  description: 'A deflationary experiment in accumulation mechanics. Built on Uniswap V4.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  )
}