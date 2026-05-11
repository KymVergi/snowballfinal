'use client'

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther } from 'viem'

// ABI simplificado - agregar el completo después del deployment
const SNOWBALL_ABI = [
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'snowAccumulated',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'snowReserve',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalBurned',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'claimAccumulatedSnow',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

const SNOWBALL_ADDRESS = process.env.NEXT_PUBLIC_SNOWBALL_TOKEN as `0x${string}` | undefined

export function useSnowballContract() {
  const { address } = useAccount()

  // Total Supply
  const { data: totalSupply } = useReadContract({
    address: SNOWBALL_ADDRESS,
    abi: SNOWBALL_ABI,
    functionName: 'totalSupply',
  })

  // User Balance
  const { data: balance } = useReadContract({
    address: SNOWBALL_ADDRESS,
    abi: SNOWBALL_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  // Snow Accumulated
  const { data: snowAccumulated } = useReadContract({
    address: SNOWBALL_ADDRESS,
    abi: SNOWBALL_ABI,
    functionName: 'snowAccumulated',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  // Snow Reserve
  const { data: snowReserve } = useReadContract({
    address: SNOWBALL_ADDRESS,
    abi: SNOWBALL_ABI,
    functionName: 'snowReserve',
  })

  // Total Burned
  const { data: totalBurned } = useReadContract({
    address: SNOWBALL_ADDRESS,
    abi: SNOWBALL_ABI,
    functionName: 'totalBurned',
  })

  // Claim function
  const { 
    writeContract: claim, 
    data: claimHash,
    isPending: isClaimPending 
  } = useWriteContract()

  const { isSuccess: isClaimSuccess } = useWaitForTransactionReceipt({
    hash: claimHash,
  })

  const claimSnow = () => {
    if (!SNOWBALL_ADDRESS) return
    
    claim({
      address: SNOWBALL_ADDRESS,
      abi: SNOWBALL_ABI,
      functionName: 'claimAccumulatedSnow',
    })
  }

  return {
    totalSupply: totalSupply ? formatEther(totalSupply) : '0',
    balance: balance ? formatEther(balance) : '0',
    snowAccumulated: snowAccumulated ? formatEther(snowAccumulated) : '0',
    snowReserve: snowReserve ? formatEther(snowReserve) : '0',
    totalBurned: totalBurned ? formatEther(totalBurned) : '0',
    claimSnow,
    isClaimPending,
    isClaimSuccess,
  }
}
