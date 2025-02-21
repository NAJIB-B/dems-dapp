'use client'

import { getDemsProgram, getDemsProgramId } from '../../utils/programDetails'
import { AnchorWallet, useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { SystemProgram } from '@solana/web3.js'


import { Connection, clusterApiUrl } from "@solana/web3.js";





import { api } from '@/trpc/react'
import { validateHeaderValue } from 'http'
import { useAnchorProvider } from '@/app/solanaProvider'

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

export function useTransactionToast() {
	return (signature: string) => {
	  toast.success(
		<div className={'text-center'}>
		  <div className="text-lg">Transaction sent</div>
		  <ExplorerLink path={`tx/${signature}`} label={'View Transaction'} className="btn btn-xs btn-primary" />
		</div>,
	  )
	}
  }

  

export function useDemsProgram() {
	const connection = new Connection(clusterApiUrl("devnet"));
	const cluster = clusterApiUrl("devnet")
	const transactionToast = useTransactionToast()


  const provider = useAnchorProvider()
  const programId = useMemo(() => getDemsProgramId(cluster as Cluster), [cluster])
  const program = useMemo(() => getDemsProgram(provider, programId), [provider, programId])
//   const initializeCounter = api.counter.create.useMutation()

  

  const accounts = useQuery({
    queryKey: ['estates', 'all', { cluster }],
    queryFn: () => program.account.estateState.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

 

  const initialize = useMutation({
    mutationKey: ['estates', 'initialize', { cluster }],
    mutationFn: (estateName: string) => {
		const estatePda = PublicKey.findProgramAddressSync(
			[Buffer.from("estate"), Buffer.from(estateName)],
			program.programId
		  )[0];
		
		  const vaultPda= PublicKey.findProgramAddressSync(
			[Buffer.from("vault"), estatePda.toBuffer()],
			program.programId
		  )[0];
		
		  const residentPda= PublicKey.findProgramAddressSync(
			[
			  Buffer.from("resident"),
			  estatePda.toBuffer(),
			  provider.publicKey.toBuffer(),
			],
			program.programId
		  )[0];
		
		return program.methods.initialize(estateName).accountsStrict({
			leader:provider.publicKey,
			estate: estatePda,
			vault: vaultPda,
			resident: residentPda,
			systemProgram: SystemProgram.programId
			
		}).rpc()
	
	},
    onSuccess: async (signature: string) => {
      transactionToast(signature)
	//   await initializeCounter.mutate({publicKey: keypair.publicKey.toBase58()})
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

// export function useCounterProgramAccount({ account }: { account: PublicKey }) {
// 	const cluster = clusterApiUrl("devnet")
//   const transactionToast = useTransactionToast()
//   const { program, accounts } = useCounterProgram()
//   const incrementCounter = api.counter.increment.useMutation()
//   const decrementCounter = api.counter.decrement.useMutation()
//   const deleteCounter = api.counter.delete.useMutation()
//   const setCounter = api.counter.set.useMutation()
//   const closeCounter = api.counter.delete.useMutation()

//   const accountQuery = useQuery({
//     queryKey: ['counter', 'fetch', { cluster, account }],
//     queryFn: () => program.account.counter.fetch(account),
//   })

//   const closeMutation = useMutation({
//     mutationKey: ['counter', 'close', { cluster, account }],
//     mutationFn: () => program.methods.close().accounts({ counter: account }).rpc(),
//     onSuccess: async(tx) => {
//       transactionToast(tx)
// 	  await closeCounter.mutate({publicKey: account.toBase58()})
//       return accounts.refetch()
//     },
//   })

//   const decrementMutation = useMutation({
//     mutationKey: ['counter', 'decrement', { cluster, account }],
//     mutationFn: () => program.methods.decrement().accounts({ counter: account }).rpc(),
//     onSuccess: async(tx) => {
//       transactionToast(tx)
// 	  await decrementCounter.mutate({publicKey: account.toBase58()})
//       return accountQuery.refetch()
//     },
//   })

//   const incrementMutation = useMutation({
//     mutationKey: ['counter', 'increment', { cluster, account }],
//     mutationFn: () => program.methods.increment().accounts({ counter: account }).rpc(),
//     onSuccess: async(tx) => {
//       transactionToast(tx)
// 	  await incrementCounter.mutate({publicKey: account.toBase58()})
//       return accountQuery.refetch()
//     },
// 	onError: (err) => {
// 		console.log(err)
// 	}
//   })

//   const setMutation = useMutation({
//     mutationKey: ['counter', 'set', { cluster, account }],
//     mutationFn: (value: number) => program.methods.set(value).accounts({ counter: account }).rpc(),
//     onSuccess: async (tx, count) => {
//       transactionToast(tx)
// 	  await setCounter.mutate({count: count, publicKey: account.toBase58()})
//       return accountQuery.refetch()
//     },
//   })

//   return {
//     accountQuery,
//     closeMutation,
//     decrementMutation,
//     incrementMutation,
//     setMutation,
//   }
// }
