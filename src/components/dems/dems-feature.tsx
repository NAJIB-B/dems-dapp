'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import ParaModal from '../para/paraModal'
import para from '@/client/para'
import { useAccount } from '@getpara/react-sdk'

import { useDemsProgram } from './dems-data-access'
import { CounterCreate, CounterList } from './dems-ui'
import { clusterApiUrl } from '@solana/web3.js';
import { useEffect, useState } from 'react'

export function ellipsify(str = '', len = 4) {
	if (str.length > 30) {
	  return str.substring(0, len) + '..' + str.substring(str.length - len, str.length)
	}
	return str
  }

export function ExplorerLink({ path, label, className }: { path: string; label: string; className?: string }) {
	const cluster = clusterApiUrl("devnet")
	const  getExplorerUrl  = `https://explorer.solana.com/${path}${cluster}`
	return (
	  <a
		href={getExplorerUrl}
		target="_blank"
		rel="noopener noreferrer"
		className={className ? className : `link font-mono`}
	  >
		{label}
	  </a>
	)
  }

  

export default function CounterFeature() {
	const { data: account } = useAccount();
	const {publicKey} = useWallet()



  const { programId } = useDemsProgram()



  return publicKey ? (
    <div>

        <p className="mb-6">
          <ExplorerLink path={`account/${programId}`} label={ellipsify(programId.toString())} />
        </p>
        <CounterCreate />

      <CounterList />
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <ParaModal />
        </div>
      </div>
    </div>
  )
}
