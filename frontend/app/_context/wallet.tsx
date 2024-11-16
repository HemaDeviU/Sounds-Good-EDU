"use client";

import { ReactNode } from 'react'
import { config } from '../_config/wallet'
import {
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { State, WagmiProvider } from 'wagmi'
import { createPublicClient, http } from 'viem'
import { mainnet, sepolia } from 'viem/chains'

// Setup queryClient
const queryClient = new QueryClient()

 
export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http()
})

export function WalletProvider({
  children,
}: {
  children: ReactNode
}) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}