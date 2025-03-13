'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useWallet as paraWallet } from '@getpara/react-sdk'
import ParaModal from '../para/paraModal'

import { api } from '@/trpc/react'
import { useAnchorProvider } from "@/app/solanaProvider";


import { useDemsProgram } from './dems-data-access'
import { EstateList } from './dems-ui'
import { clusterApiUrl } from '@solana/web3.js';


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

  

export default function Estates() {
	const {publicKey} = useWallet()
	const para = paraWallet()





  const { programId } = useDemsProgram()


console.log("see para", para)
  return publicKey ? (

		<div>

        <p className="mb-6">
          <ExplorerLink path={`account/${programId}`} label={ellipsify(programId.toString())} />
        </p>


      <EstateList user={publicKey} />
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
