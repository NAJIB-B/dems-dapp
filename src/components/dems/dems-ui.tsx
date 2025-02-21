'use client'

import { clusterApiUrl, Keypair, PublicKey } from '@solana/web3.js'
import { SetStateAction, useMemo, useState } from 'react'

import { useDemsProgram} from './dems-data-access'

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

export function CounterCreate() {
	const [name, setName] = useState("");
  const { initialize } = useDemsProgram()

  const handleChange = (e: { preventDefault: any; target: { value: SetStateAction<string> } }) => {
	e.preventDefault;

	setName(e.target.value)
   

  } 

  return (
	<>
		<label>name</label>
		<input type="text" value={name} onChange={handleChange} className='border border-red-200'/>
    <button
      className="btn btn-xs lg:btn-md btn-primary"
      onClick={() => initialize.mutateAsync(name)}
      disabled={initialize.isPending}
    >
      Create {initialize.isPending && '...'}
    </button>
	</>

  )
}

export function CounterList() {
  const { accounts, getProgramAccount, joinEstate } = useDemsProgram()

  if (getProgramAccount.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>
  }
  if (!getProgramAccount.data?.value) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>Program account not found. Make sure you have deployed the program and are on the correct cluster.</span>
      </div>
    )
  }
  return (
    <div className={'space-y-6'}>
      {accounts.isLoading ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : accounts.data?.length ? (
        <div className="grid md:grid-cols-2 gap-4">
          {accounts.data?.map((account, key) => (
			<div className='border border-red-100 rounded p-4' key={key}>
				<p>name: {account.account.name}</p>
				<p>vault balance: {account.account.vaultBalance.toNumber()}</p>
				<p>Number of residents: {account.account.noOfResidents}</p>
				<p>leader: {account.account.leader.toBase58()}</p>

				<button className='border border-red-200 p-5' onClick={()=> joinEstate.mutateAsync(account.publicKey)}>join</button>
				
			</div>
            // <CounterCard key={account.publicKey.toString()} account={account.publicKey} />
          ))}
        </div>
      ) : (
        <div className="text-center">
          <h2 className={'text-2xl'}>No accounts</h2>
          No accounts found. Create one above to get started.
        </div>
      )}
    </div>
  )
}

// function CounterCard({ account }: { account: PublicKey }) {
//   const { accountQuery, incrementMutation, setMutation, decrementMutation, closeMutation } = useCounterProgramAccount({
//     account,
//   })

//   const count = useMemo(() => accountQuery.data?.count ?? 0, [accountQuery.data?.count])
//   console.log(accountQuery.data)


//   return accountQuery.isLoading ? (
//     <span className="loading loading-spinner loading-lg"></span>
//   ) : (
//     <div className="card card-bordered border-base-300 border-4 text-neutral-content">
//       <div className="card-body items-center text-center">
//         <div className="space-y-6">
//           <h2 className="card-title justify-center text-3xl cursor-pointer" onClick={() => accountQuery.refetch()}>
//             {count}
//           </h2>
//           <div className="card-actions justify-around">
//             <button
//               className="btn btn-xs lg:btn-md btn-outline"
//               onClick={() => incrementMutation.mutateAsync()}
//               disabled={incrementMutation.isPending}
//             >
//               Increment
//             </button>
//             <button
//               className="btn btn-xs lg:btn-md btn-outline"
//               onClick={() => {
//                 const value = window.prompt('Set value to:', count.toString() ?? '0')
//                 if (!value || parseInt(value) === count || isNaN(parseInt(value))) {
//                   return
//                 }
//                 return setMutation.mutateAsync(parseInt(value))
//               }}
//               disabled={setMutation.isPending}
//             >
//               Set
//             </button>
//             <button
//               className="btn btn-xs lg:btn-md btn-outline"
//               onClick={() => decrementMutation.mutateAsync()}
//               disabled={decrementMutation.isPending}
//             >
//               Decrement
//             </button>
//           </div>
//           <div className="text-center space-y-4">
//             <p>
//               <ExplorerLink path={`account/${account}`} label={ellipsify(account.toString())} />
//             </p>
//             <button
//               className="btn btn-xs btn-secondary btn-outline"
//               onClick={() => {
//                 if (!window.confirm('Are you sure you want to close this account?')) {
//                   return
//                 }
//                 return closeMutation.mutateAsync()
//               }}
//               disabled={closeMutation.isPending}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
