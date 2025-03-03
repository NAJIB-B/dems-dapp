"use client";

import { getDemsProgram, getDemsProgramId } from "../../utils/programDetails";
import { AnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Cluster, Keypair, PublicKey } from "@solana/web3.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import toast from "react-hot-toast";
import { SystemProgram } from "@solana/web3.js";

import { Connection, clusterApiUrl } from "@solana/web3.js";
import { api } from "@/trpc/react";
import { useAnchorProvider } from "@/app/solanaProvider";
import { BN } from "@coral-xyz/anchor";

import { DepositSOLParams, CreatePollParams, CastVoteParams } from "@/types";


export function ExplorerLink({
  path,
  label,
  className,
}: {
  path: string;
  label: string;
  className?: string;
}) {
  const cluster = clusterApiUrl("devnet");
  const getExplorerUrl = `https://explorer.solana.com/${path}${cluster}`;
  return (
    <a
      href={getExplorerUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className ? className : `link font-mono`}
    >
      {label}
    </a>
  );
}

export function useTransactionToast() {
  return (signature: string) => {
    toast.success(
      <div className={"text-center"}>
        <div className="text-lg">Transaction sent</div>
        <ExplorerLink
          path={`tx/${signature}`}
          label={"View Transaction"}
          className="btn btn-xs btn-primary"
        />
      </div>
    );
  };
}

export function useDemsProgram() {
  const connection = new Connection(clusterApiUrl("devnet"));
  const cluster = clusterApiUrl("devnet");
  const transactionToast = useTransactionToast();

  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getDemsProgramId(cluster as Cluster),
    [cluster]
  );
  const program = useMemo(
    () => getDemsProgram(provider, programId),
    [provider, programId]
  );
  const createEstate = api.dems.createEstate.useMutation();
  const createMember = api.dems.createMember.useMutation();

  const accounts = useQuery({
    queryKey: ["estates", "all", { cluster }],
    queryFn: () => program.account.estateState.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ["get-program-account", { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const initialize = useMutation({
    mutationKey: ["estates", "initialize", { cluster }],
    mutationFn: (estateName: string) => {
      const estatePda = PublicKey.findProgramAddressSync(
        [Buffer.from("estate"), Buffer.from(estateName)],
        program.programId
      )[0];

      const vaultPda = PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), estatePda.toBuffer()],
        program.programId
      )[0];

      const residentPda = PublicKey.findProgramAddressSync(
        [
          Buffer.from("resident"),
          estatePda.toBuffer(),
          provider.publicKey.toBuffer(),
        ],
        program.programId
      )[0];

      return program.methods
        .initialize(estateName)
        .accountsStrict({
          leader: provider.publicKey,
          estate: estatePda,
          vault: vaultPda,
          resident: residentPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
    },
    onSuccess: async (signature: string, name) => {
      const estatePda = PublicKey.findProgramAddressSync(
        [Buffer.from("estate"), Buffer.from(name)],
        program.programId
      )[0];

      transactionToast(signature);
      await createEstate.mutate({
        name: name,
        publicKey: estatePda.toBase58(),
        leader: provider.publicKey.toBase58(),
      });
      await createMember.mutate({
        estateId: estatePda.toBase58(),
        publicKey: provider.publicKey.toBase58(),
      });

      return accounts.refetch();
    },
    onError: () => toast.error("Failed to initialize account"),
  });

  const joinEstate = useMutation({
    mutationKey: ["estates", "initialize", { cluster }],
    mutationFn: (estate: PublicKey) => {
      const residentPda = PublicKey.findProgramAddressSync(
        [
          Buffer.from("resident"),
          estate.toBuffer(),
          provider.publicKey.toBuffer(),
        ],
        program.programId
      )[0];

      return program.methods
        .addResident()
        .accountsStrict({
          user: provider.publicKey,
          estate: estate,
          resident: residentPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
    },
    onSuccess: async (signature, estateId) => {
      transactionToast(signature);
      await createMember.mutate({
        estateId: estateId.toBase58(),
        publicKey: provider.publicKey.toBase58(),
      });
      return accounts.refetch();
    },
    onError: () => toast.error("Failed to join estate"),
  });

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
    joinEstate,
  };
}

export function useDemsProgramAccount({ account }: { account: PublicKey }) {
  const connection = new Connection(clusterApiUrl("devnet"));
  const cluster = clusterApiUrl("devnet");
  const transactionToast = useTransactionToast();

  const provider = useAnchorProvider();

  const { program, accounts } = useDemsProgram();
  const createPollDb = api.dems.createPoll.useMutation();
  const castAgreeVote = api.dems.agreeVote.useMutation();
  const castDisagreeVote = api.dems.disagreeVote.useMutation();
  const despositSolDb = api.dems.depositSol.useMutation()

  const accountQuery = useQuery({
    queryKey: ["estate", "fetch", { cluster, account }],
    queryFn: () => program.account.estateState.fetch(account),
  });

  const depositSol = useMutation({
    mutationKey: ["estate", { cluster, account }],
    mutationFn: ({ seed, amount, estatePda }: DepositSOLParams) => {
      const vaultPda = PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), estatePda.toBuffer()],
        program.programId
      )[0];

      const residentPda = PublicKey.findProgramAddressSync(
        [
          Buffer.from("resident"),
          estatePda.toBuffer(),
          provider.publicKey.toBuffer(),
        ],
        program.programId
      )[0];

	 

      const transactionPda = PublicKey.findProgramAddressSync(
        [
          Buffer.from("transaction"),
          estatePda.toBuffer(),
          provider.publicKey.toBuffer(),
          seed.toArrayLike(Buffer, "le", 8),
        ],
        program.programId
      )[0];

	  provider.connection.getBalance(provider.publicKey).then((balance) =>  console.log("my wallet balance", balance))


      return program.methods
        .makeDeposit(seed, amount)
        .accountsStrict({
          user: provider.publicKey,
          vault: vaultPda,
          estate: estatePda,
          resident: residentPda,
          transaction: transactionPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
    },
    onSuccess: async (signature, values) => {
      transactionToast(signature);

	  await despositSolDb.mutate({id: values.estatePda.toBase58(), amount: values.amount.toNumber()})

      return accountQuery.refetch();
    },
    onError: (err) => {
		 toast.error("Failed to deposit SOL")

		 console.log(err)
	}
  });

  const createPoll = useMutation({
    mutationKey: ["estate", "poll", { cluster, account }],
    mutationFn: ({ description, amount, estatePda }: CreatePollParams) => {
      const pollPda = PublicKey.findProgramAddressSync(
        [
          Buffer.from("poll"),
          estatePda.toBuffer(),
          provider.publicKey.toBuffer(),
          Buffer.from(description),
        ],
        program.programId
      )[0];
      return program.methods
        .createPoll(description, amount)
        .accountsStrict({
          user: provider.publicKey,
          estate: estatePda,
          poll: pollPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
    },
    onSuccess: async (signature, values) => {
      const pollPda = PublicKey.findProgramAddressSync(
        [
          Buffer.from("poll"),
          values.estatePda.toBuffer(),
          provider.publicKey.toBuffer(),
          Buffer.from(values.description),
        ],
        program.programId
      )[0];
      transactionToast(signature);

      await createPollDb.mutate({
        estateId: values.estatePda.toBase58(),
        question: values.description,
        creator: provider.publicKey.toBase58(),
        publicKey: pollPda.toBase58(),
		amount: values.amount.toNumber()
      });

      return accountQuery.refetch();
    },
    onError: (err) => {
		toast.error("Failed to create poll");
		console.log(err)
	},
  });

  const castAVote = useMutation({
    mutationKey: ["estate", "poll", { cluster, account }],
    mutationFn: ({
      seed,
      vote,
      estatePda,
      pollPda,
      pollCreator,
    }: CastVoteParams) => {
      const votePda = PublicKey.findProgramAddressSync(
        [
          Buffer.from("vote"),
          estatePda.toBuffer(),
          provider.publicKey.toBuffer(),
          pollPda.toBuffer(),
        ],
        program.programId
      )[0];

      const transactionPda = PublicKey.findProgramAddressSync(
        [
          Buffer.from("transaction"),
          estatePda.toBuffer(),
          provider.publicKey.toBuffer(),
          seed.toArrayLike(Buffer, "le", 8),
        ],
        program.programId
      )[0];

      const vaultPda = PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), estatePda.toBuffer()],
        program.programId
      )[0];

      return program.methods
        .vote(seed, vote)
        .accountsStrict({
          user: provider.publicKey,
          estate: estatePda,
          poll: pollPda,
          pollCreator,
          vote: votePda,
          transaction: transactionPda,
          vault: vaultPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
    },
    onSuccess: async (signature, values) => {
      transactionToast(signature);

	  if (values.vote) {
		await castAgreeVote.mutate({poll: values.pollPda.toBase58()})
	  } else {
		await castDisagreeVote.mutate({poll: values.pollPda.toBase58()})
	  }

      return accountQuery.refetch();
    },
    onError: () => toast.error("Failed to cast vote"),
  });

  return {
    accountQuery,
    depositSol,
    createPoll,
    castAVote,
  };
}
