'use client'

import { clusterApiUrl, Keypair, PublicKey } from '@solana/web3.js'
import { SetStateAction, useMemo, useState } from 'react'

import { useDemsProgram, useDemsProgramAccount} from './dems-data-access'
import { useAnchorProvider } from '@/app/solanaProvider'
import { api } from '@/trpc/react'
import Spinner from '../spinner'

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

export function EstateCreate() {
	const [name, setName] = useState("");
  const { initialize } = useDemsProgram()

  const handleChange = (e: { preventDefault: any; target: { value: SetStateAction<string> } }) => {
	e.preventDefault;

	setName(e.target.value)
   

  } 

  return (
	<>
	<div className="max-w-sm mx-auto bg-white rounded-2xl shadow-lg p-6 border border-gray-200 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">🏠 Create Estate</h2>

      <input
        type="text"
        placeholder="Estate Name"
        value={name}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
      />

      <button
        onClick={() => initialize.mutateAsync(name)}
		disabled={initialize.isPending}
        className="w-full mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
      >
        Create Estate {initialize.isPending && '...'}
      </button>
    </div>
		
	</>

  )
}

export function EstateList() {
	const {data, isLoading, isError } = api.dems.getAllEstate.useQuery()
	const provider = useAnchorProvider();
	const user = provider.publicKey;
	
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
        <div className="grid md:grid-cols-3 gap-4">
          {data?.map((account, key) => (
			<EstateCard key={key} account={account.id}></EstateCard>
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

function EstateCard({account}: {account: string}) {
	// const {accountQuery} = useDemsProgramAccount({account})
	const {joinEstate} = useDemsProgram()
	const {data, isLoading, isError} = api.dems.readEstate.useQuery({publicKey: account})
	const estateKey = new PublicKey(account);

 //const data = useMemo(() => accountQuery.data, [accountQuery.data])
	   return isLoading ? (
    <Spinner></Spinner>
   ) : (
		<div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
		  <h2 className="text-xl font-bold text-gray-800 mb-2">name: {data?.name}</h2>
	
		  <div className="text-gray-600">
			<p className="mb-1"><strong>Vault Balance:</strong> {data?.vaultBalance}</p>
			<p className="mb-1"><strong>Number of Residents:</strong> {data?.members.length}</p>
			<p className="mb-3">
			  <strong>Leader:</strong> 
			  <span className=" text-sm text-gray-500 break-all">
				{data?.leader}
			  </span>  
			</p>
			
		  </div>
	
		  <button 
		  onClick={()=> joinEstate.mutateAsync(estateKey)}
		  className="w-full mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300">
			join
		  </button>
		</div>
	  );
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
